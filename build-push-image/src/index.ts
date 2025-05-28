import { getInput, setFailed, getBooleanInput } from '@actions/core'
import { table } from '../../lib/core'
import {
  dockerBuild,
  dockerLogin,
  dockerPush,
  getImageFQN,
} from '../../lib/dockerCli'
import { getOwnerInput, getRepoInput } from '../../lib/github'
import { branchToTag, getLabels } from '../../lib/image'
import { writeMetadataFile } from './metadataFile'

async function run() {
  // Inputs
  const namespace = getOwnerInput('namespace')
  const name = getRepoInput('name')
  const dockerfile = getInput('dockerfile')
  const context = getInput('context')
  const registry = getInput('registry')
  const user = getInput('user')
  const password = getInput('password')
  const useSSH = getBooleanInput('useSSH')
  const secrets = getInput('secrets')
  const target = getInput('target')
  const onlyBuild = getBooleanInput('only-build') // New option to skip push
  const platforms = getInput('platforms') // Get platforms input

  // Get all relevant metadata for the image
  const labels = getLabels(name)
  const tag = branchToTag()
  const image = { registry, namespace, name, tag }

  table('Repository', getImageFQN(image))
  table('Tag', tag)
  table('Labels', JSON.stringify(labels, undefined, 2))

  await writeMetadataFile(name)

  // Perform login only if we're also going to push
  await dockerLogin({
    registry,
    user,
    password,
  })

  // Build the Docker image
  const { pushed } = await dockerBuild({
    dockerfile,
    context,
    labels,
    image,
    imageName: '',
    useSSH,
    secrets,
    target,
    platforms,
  })

  // Push the image unless it was already pushed by buildx (multi-platform)
  // or only-build is set
  if (!pushed && !onlyBuild) {
    await dockerPush(image)
  } else if (onlyBuild) {
    table('Info', 'Skipping docker push (only-build mode)')
  } else if (pushed) {
    table('Info', 'Image already pushed by buildx (multi-platform build)')
  }
}

run().catch(setFailed)
