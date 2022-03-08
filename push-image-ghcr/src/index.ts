import { getInput, info, setFailed, warning } from '@actions/core'
import { exec } from '@actions/exec'
import { context} from '@actions/github'
import {
  getRepository,
  getToken,
} from '../../lib/github'
import {
  setComponentVersion,
  setLabels,
  setTags,
} from './metadata'

const METADATA_FILENAME = 'metadata.json'

async function run() {
  const { component: defaultComponent } = getRepository()
  const component = getInput('component') || defaultComponent
  const ghcrUser = getInput('ghcr-user') || context.actor
  const ghcrPassword = getInput('ghcr-password') || getToken()
  const dockerfile = getInput('dockerfile') || './Dockerfile'
  const private_key = process.env.PRIVATE_KEY
  const tags = await setTags()
  info(`Image name: exivity/${component}`)
  info(`Image tags: ${tags.join(', ')}`)

  // Set all relevant labels for the image
  if (tags.length === 0) {
    warning('No tags set, skipping deploy docker action')
    return
  }
  const labels = setLabels({ component, version: tags[0] })

  // concat list of labels
  const labelOptions = Object.entries(labels)
    .map(([key, value]) => `--label "${key}=${value}"`)
    .join(' ')
  info(`Image labels will be:\n${JSON.stringify(labelOptions, undefined, 2)}`)

  // concat list of tags
  const tagOptions =
    tags.map((tag: string) => `--tag "ghcr.io/exivity/${component}":"${tag}"`)
    .join(' ')
  info(`Image tags will be:\n${JSON.stringify(tagOptions, undefined, 2)}`)

  const componentVersion = setComponentVersion()
  info(`Component version will be: ${componentVersion}`)

  // All built images get pushed to GHCR
  info('Logging in to GHCR')
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

  // Build the image
  info('Building image')
  const buildCmd = `docker build -f ${dockerfile} ${tagOptions} ${labelOptions} .`
  await exec(buildCmd)

  info(`Pushing image`)
  await exec(`docker push ghcr.io/exivity/${component} --all-tags`)
}

run().catch(setFailed)
