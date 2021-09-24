import { getInput, info, setFailed, warning } from '@actions/core'
import { exec, getExecOutput } from '@actions/exec'
import { promises as fs } from 'fs'
import semver from 'semver'
import { getBooleanInput } from '../../lib/core'
import { getRef, getRepository, getSha, getTag } from '../../lib/github'

const GHCR = 'ghcr.io/'

const METADATA_FILENAME = 'metadata.json'

const RELEASE_BRANCHES = ['main', 'master']
const PREVIEW_BRANCHES = [] as string[]
const CANARY_BRANCHES = ['develop']

const RELEASE_TAG = 'latest'
const PREVIEW_TAG = 'next'
const CANARY_TAG = 'canary'

function getTagData() {
  const repoTag = getTag()

  return { repoTag, semverTag: semver.valid(repoTag) }
}

async function getImagePrefixAndTags() {
  const { repoTag, semverTag } = getTagData()

  if (semverTag) {
    const major = semver.major.toString()
    const majorMinor = `${semver.major}.${semver.minor}`

    // Figure out if there are any commits on top of tag
    // First, find SHA of commit which has the tag
    const repoShaOfTagCommit = (
      await getExecOutput(`git rev-list -n 1 tags/${repoTag}`)
    ).stdout.trim()

    // Now, find number of commits between commit and HEAD
    const commitsSinceTagCommit = (
      await getExecOutput(`git rev-list --count ${repoShaOfTagCommit}..HEAD`)
    ).stdout.trim()

    // Add all tags if repo tag is latest in series, to prevent overriding more
    // recent tags
    if (Number(commitsSinceTagCommit) === 0) {
      return { prefix: null, tags: [semverTag, majorMinor, major, RELEASE_TAG] }
    }

    return { prefix: null, tags: [semverTag] }
  }

  const repoRef = getRef()

  if (RELEASE_BRANCHES.includes(repoRef)) {
    // Only release latest tag with version
    return { prefix: null, tags: [] }
  }

  if (PREVIEW_BRANCHES.includes(repoRef)) {
    // No preview tags at this point
    return { prefix: null, tags: [] }
  }

  if (CANARY_BRANCHES.includes(repoRef)) {
    // Release develop branches as canary tag
    return { prefix: GHCR, tags: [CANARY_TAG] }
  }

  // Image tags should comform with [\w][\w.-]{0,127}
  return {
    prefix: GHCR,
    tags: [repoRef.replace(/[^\w\w.-]/g, '-').substr(0, 127)],
  }
}

function getImageLabels({
  component,
  version,
}: {
  component: string
  version: string
}) {
  return {
    'org.opencontainers.image.vendor': 'Exivity',
    'org.opencontainers.image.title': component,
    'org.opencontainers.image.url': 'https://exivity.com',
    'org.opencontainers.image.documentation': 'https://docs.exivity.com',
    'org.opencontainers.image.source': `https://github.com/${process.env['GITHUB_REPOSITORY']}`,
    'org.opencontainers.image.version': version,
    'org.opencontainers.image.created': new Date().toISOString(),
    'org.opencontainers.image.revision': getSha(),
  }
}

function getComponentVersion() {
  const { semverTag } = getTagData()

  return (semverTag ?? process.env['GITHUB_SHA']) || 'unknown'
}

async function run() {
  const { component: defaultComponent } = getRepository()
  const component = getInput('component') || defaultComponent
  const dockerUser = getInput('docker-hub-user', { required: true })
  const dockerPassword = getInput('docker-hub-password', { required: true })
  const ghcrUser = getInput('ghcr-user', { required: true })
  const ghcrPassword = getInput('ghcr-password', { required: true })
  const dryRun = getBooleanInput('dry-run', false)
  const dockerfile = getInput('dockerfile') || './Dockerfile'

  const { prefix, tags } = await getImagePrefixAndTags()
  info(`Image prefix will be: ${prefix ?? 'none'}`)
  info(`Image tags will be: ${tags.join(',')}`)

  if (tags.length === 0) {
    warning('No tags set, skipping deploy docker action')
    return
  }

  const labels = getImageLabels({ component, version: tags[0] })
  info(`Image labels will be:\n${JSON.stringify(labels, undefined, 2)}`)

  const componentVersion = getComponentVersion()
  info(`Component version will be: ${componentVersion}`)

  const metadata = {
    component,
    version: componentVersion,
    created: new Date().toISOString(),
  }
  info(
    `Writing metadata to ${METADATA_FILENAME}:\n${JSON.stringify(
      metadata,
      undefined,
      2
    )}`
  )
  await fs.writeFile(
    './' + METADATA_FILENAME,
    JSON.stringify(metadata, undefined, 2)
  )

  if (prefix === GHCR) {
    info('Logging in to GitHub Packages')
    await exec(
      'bash -c "echo $GHCR_PASSWORD | docker login ghcr.io -u $GHCR_USER --password-stdin"',
      undefined,
      {
        env: {
          ...process.env,
          GHCR_PASSWORD: ghcrPassword,
          GHCR_USER: dockerUser,
        },
      }
    )
  } else {
    info('Logging in to Docker Hub')
    await exec(
      'bash -c "echo $DOCKER_HUB_PASSWORD | docker login -u $DOCKER_HUB_USER --password-stdin"',
      undefined,
      {
        env: {
          ...process.env,
          DOCKER_HUB_PASSWORD: dockerPassword,
          DOCKER_HUB_USER: dockerUser,
        },
      }
    )
  }

  const labelOptions = Object.entries(labels)
    .map(([key, value]) => `--label "${key}=${value}"`)
    .join(' ')
  const cmd = `docker build -f ${dockerfile} --tag ${component} ${labelOptions} .`
  info(`Building image`)
  await exec(cmd)

  info(`Tagging image`)
  for (const tag of tags) {
    await exec(
      `docker image tag ${component} ${prefix}exivity/${component}:${tag}`
    )
  }

  if (dryRun) {
    return
  }

  info('Pushing to registry')
  await exec(`docker push --all-tags ${prefix}exivity/${component}`)
}

run().catch(setFailed)
