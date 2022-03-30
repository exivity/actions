import { getInput, setFailed, warning } from '@actions/core'
import { table } from '../../lib/core'
import { getRepository } from '../../lib/github'
import { getLabels, getTags, getTagsFQN } from '../../lib/image'
import { dockerBuild, dockerLogin, dockerPush } from './dockerCli'
import { writeExivityMetadataFile } from './metadataFile'

async function run() {
  // Inputs
  const component = getInput('component') || getRepository().component
  const dockerfile = getInput('dockerfile') || './Dockerfile'
  const registry = getInput('registry')
  const user = getInput('user')
  const password = getInput('password')

  // Get all relevant metadata for the image
  const repository = `${registry}/exivity/${component}`
  const tags = getTags()
  const tagsFQN = getTagsFQN({ repository, tags })
  const labels = getLabels(component)

  if (tags.length === 0) {
    warning('No tags set, skipping build-push-image action')
    return
  }

  table('Repository', repository)
  table('Tags', tags.join(', '))
  table('Labels', JSON.stringify(labels, undefined, 2))

  await writeExivityMetadataFile(component)

  await dockerLogin({
    registry,
    user,
    password,
  })

  await dockerBuild({
    dockerfile,
    labels,
    tagsFQN,
  })

  await dockerPush(repository)
}

run().catch(setFailed)
