import { getInput, setFailed, warning } from '@actions/core'
import { getRepository } from '../../lib/github'
import {
  Image,
  dockerRetag,
  dockerLogin,
  dockerPush,
  dockerPull,
} from '../../lib/dockerCli'

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

  const devImage = { registry, name: `exivity/${component}`, tag: oldTag }
  const releaseImage = {
    registry: `docker.io`,
    name: `exivity/${component}`,
    tag: newTag,
  }

  await dockerPull(devImage)

  await dockerRetag(devImage, releaseImage)

  await dockerPush(releaseImage)
}

run().catch(setFailed)
