import { getInput, setFailed, warning } from '@actions/core'
import { getRepository } from '../../lib/github'
import { getLabels, branchToTag } from '../../lib/image'
import { dockerBuild, dockerLogin, dockerPush } from '../../lib/dockerCli'
import { writeExivityMetadataFile } from './metadataFile'

async function run() {
  // Inputs
  const component = getInput('component') || getRepository().component
  const dockerfile = getInput('dockerfile')
  const registry = getInput('registry')
  const user = getInput('user')
  const password = getInput('password')

  // Get all relevant metadata for the image
  const labels = getLabels(component)
  const tag = branchToTag()

  await writeExivityMetadataFile(component)

  await dockerLogin({
    registry,
    user,
    password,
  })

  const buildImage = { registry, name: `exivity/${component}`, tag }

  await dockerBuild({
    dockerfile,
    labels,
    image: buildImage,
  })

  await dockerPush(buildImage)
}

run().catch(setFailed)
