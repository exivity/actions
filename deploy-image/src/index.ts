import { debug, getInput, info, setFailed, warning } from '@actions/core'
import { exec } from '@actions/exec'
import { getOctokit } from '@actions/github'
import { promises as fs } from 'fs'
import { getBooleanInput } from '../../lib/core'
import {
  getEventData,
  getEventName,
  getRepository,
  getToken,
  isEvent,
} from '../../lib/github'
import {
  getComponentVersion,
  getDeployType,
  getImageLabels,
  getImagePrefixAndTags,
  GHCR,
} from './metadata'

const METADATA_FILENAME = 'metadata.json'

async function run() {
  const { component: defaultComponent } = getRepository()
  const component = getInput('component') || defaultComponent
  const dockerUser = getInput('docker-hub-user', { required: true })
  const dockerPassword = getInput('docker-hub-password', { required: true })
  const ghcrUser = getInput('ghcr-user', { required: true })
  const ghcrPassword = getInput('ghcr-password', { required: true })
  const dryRun = getBooleanInput('dry-run', false)
  const dockerfile = getInput('dockerfile') || './Dockerfile'
  const eventName = getEventName(['push', 'delete'])
  const eventData = await getEventData<typeof eventName>()

  const type = getDeployType()
  const { prefix, tags } = await getImagePrefixAndTags()
  info(`Image deploy type: ${type}`)
  info(`Image prefix: ${prefix ?? 'none'}`)
  info(`Image name: exivity/${component}`)
  info(`Image tags: ${tags.join(',')}`)

  // This is hard to test so we allow emulating this event with an env var
  if (
    isEvent(eventName, 'delete', eventData) ||
    !!process.env['EMULATE_DELETE']
  ) {
    if (type !== 'branch') {
      info(`Not deleting image deploy type "${type}"`)
      return
    }

    const ghToken = getToken()
    const octokit = getOctokit(ghToken)

    const versions =
      await octokit.rest.packages.getAllPackageVersionsForPackageOwnedByOrg({
        org: 'exivity',
        package_type: 'container',
        package_name: component,
      })

    // Look for versions with the same tags as the ones we'll delete
    for (const version of versions.data) {
      const tagOverlap = tags.filter((tag) =>
        version.metadata?.docker?.tag?.includes(tag)
      )

      if (tagOverlap.length > 0) {
        info(`Tag `)
        await octokit.rest.packages.deletePackageVersionForOrg({
          org: 'exivity',
          package_type: 'container',
          package_name: `exivity/${component}`,
          package_version_id: version.id,
        })
      }
    }

    // @todo
    setFailed('To be implemented')

    return
  }

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
          GHCR_USER: ghcrUser,
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
  const buildCmd = `docker build -f ${dockerfile} --tag ${component} ${labelOptions} .`
  info(`Building image`)
  await exec(buildCmd)

  info(`Tagging and pushing image`)
  for (const tag of tags) {
    const name = `${prefix}exivity/${component}:${tag}`
    await exec(`docker image tag ${component} ${name}`)

    const pushCmd = `docker push ${name}`
    if (!dryRun) {
      await exec(pushCmd)
    } else {
      debug(pushCmd)
      info('dry-run set, would have executed push command')
    }
  }
}

run().catch(setFailed)
