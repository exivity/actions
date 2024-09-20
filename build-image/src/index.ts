import { getInput, setFailed, getBooleanInput } from '@actions/core'
import { table } from '../../lib/core'
import { dockerBuild, dockerLogin, getImageFQN } from '../../lib/dockerCli'
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
  const buildArgs = getInput('buildArgs')

  // Get all relevant metadata for the image
  const labels = getLabels(name)
  const tag = branchToTag()
  const image = { registry, namespace, name, tag }

  table('Repository', getImageFQN(image))
  table('Tag', tag)
  table('Labels', JSON.stringify(labels, undefined, 2))

  await writeMetadataFile(name)
  await dockerLogin({
    registry,
    user,
    password,
  })

  await dockerBuild({
    dockerfile,
    context,
    labels,
    image,
    useSSH,
    secrets,
    buildArgs,
  })
}

run().catch(setFailed)
