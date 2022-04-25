import { getInput, setFailed, warning } from '@actions/core'
import { table } from '../../lib/core'
import { getRepository } from '../../lib/github'
import { getLabels, getTags, getTagsFQN } from '../../lib/image'
import { dockerRetag, dockerLogin, dockerPush } from '../../lib/dockerCli'

async function run() {
  // Inputs
  const component = getInput('component') || getRepository().component
  const registry = getInput('registry')
  const user = getInput('user')
  const password = getInput('password')

  // Get all relevant metadata for the image
  const repository = `${registry}/exivity/${component}`
  const newTag = getInput('newTag')
  const oldTag = getInput('oldTag')

  await dockerLogin({
    registry,
    user,
    password,
  })

  // always retag to dockerhub, so registry is set
  await dockerRetag(
    `exivity/${component}`,
    oldTag,
    newTag,
  )

  await dockerPush(repository)
}

run().catch(setFailed)
