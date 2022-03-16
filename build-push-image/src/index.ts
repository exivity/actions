import { getInput, setFailed, warning } from '@actions/core'
import { table } from '../../lib/core'
import { getRepository } from '../../lib/github'
import { dockerBuild, dockerLogin, dockerPush } from './dockerCli'
import { getLabels, getTags, getTagsFQN } from './imageProperties'
import { writeExivityMetadataFile } from './metadataFile'

async function run() {
  const gitRepository = getRepository()

  // Inputs
  const component = getInput('component') || gitRepository.component
  const dockerfile = getInput('dockerfile') || './Dockerfile'
  const registry = getInput('registry')
  const user = getInput('user')
  const password = getInput('password')

  // Get all relevant metadata for the image
  const imageRepository = `${registry}/exivity/${component}`
  const tags = getTags()
  const tagsFQN = getTagsFQN({ repository: imageRepository, tags })
  const labels = getLabels({ repository: gitRepository })

  if (tags.length === 0) {
    warning('No tags set, skipping build-push-image action')
    return
  }

  table('Repository', imageRepository)
  table('Tags', tags.join(', '))
  table('Labels', JSON.stringify(labels, undefined, 2))

  await writeExivityMetadataFile(gitRepository)

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

  await dockerPush({ repository: imageRepository })
}

run().catch(setFailed)
