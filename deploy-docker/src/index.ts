import { getInput, info, setFailed, warning } from '@actions/core'
import { exec } from '@actions/exec'
import { promises as fs } from 'fs'
import { getBooleanInput } from '../../lib/core'
import {
  getEventData,
  getEventName,
  getRepository,
  isEvent,
} from '../../lib/github'
import {
  getComponentVersion,
  getImageLabels,
  getImagePrefixAndTags,
} from './metadata'

const GHCR = 'ghcr.io/'

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
  const eventData = await getEventData(eventName)

  if (isEvent(eventName, 'delete', eventData)) {
    // @todo
    setFailed('To be implemented')

    return
  }

  const { prefix, tags } = await getImagePrefixAndTags()
  info(`Image prefix will be: ${prefix ?? 'none'}`)
  info(`Image name will be: exivity/${component}`)
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
  const cmd = `docker build -f ${dockerfile} --tag ${component} ${labelOptions} .`
  info(`Building image`)
  await exec(cmd)

  info(`Tagging image`)
  for (const tag of tags) {
    await exec(
      `docker image tag ${component} ${prefix}exivity/${component}:${tag}`
    )
  }

  if (!dryRun) {
    info('Pushing to registry')
    await exec(`docker push --all-tags ${prefix}exivity/${component}`)
  }
}

run().catch(setFailed)
