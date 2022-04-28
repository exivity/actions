import { getInput, setFailed, warning } from '@actions/core'
import {
  dockerAddTag,
  dockerLogin,
  dockerPush,
  dockerPull,
} from '../../lib/dockerCli'
import { getOwnerInput, getRepoInput } from '../../lib/github'

async function run() {
  // Inputs
  const namespace = getOwnerInput('namespace')
  const name = getRepoInput('name')
  const registry = getInput('registry')
  const user = getInput('user')
  const password = getInput('password')

  // Get all relevant metadata for the image
  const repository = `${registry}/namespace/${name}`
  const newTag = getInput('newTag')
  const oldTag = getInput('oldTag')

  await dockerLogin({
    registry,
    user,
    password,
  })

  // login to dockerhub too
  if (process.env['DOCKER_HUB_USER'] && process.env['DOCKER_HUB_TOKEN']) {
    const dockerVars = {
      registry: 'docker.io',
      user: process.env['DOCKER_HUB_USER'],
      password: process.env['DOCKER_HUB_TOKEN'],
    }
    await dockerLogin(dockerVars)
  } else {
    throw new Error(`No valid credentials set in ENV for docker.io login`)
  }

  const devImage = { registry, namespace, name, tag: oldTag }

  // hardcoded because of our usecase
  const releaseImage = {
    registry: `docker.io`,
    namespace,
    name,
    tag: newTag,
  }

  await dockerPull(devImage)

  await dockerAddTag(devImage, releaseImage)

  await dockerPush(releaseImage)
}

run().catch(setFailed)
