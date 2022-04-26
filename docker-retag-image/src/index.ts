import { getInput, setFailed, warning } from '@actions/core'
import { getRepository } from '../../lib/github'
import {
  dockerAddTag,
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

  // login to dockerhub too
  if (process.env['DOCKER_HUB_USER'] && process.env['VIRUSTOTAL_API_KEY']) {
    const dockerVars = {
      registry: 'docker.io',
      user: process.env['DOCKER_HUB_USER'],
      password: process.env['VIRUSTOTAL_API_KEY'],
    }
    await dockerLogin(dockerVars)
  } else {
    throw new Error(`No valid credentials set in ENV for docker.io login`)
  }

  const devImage = { registry, name: `exivity/${component}`, tag: oldTag }

  // hardcoded because of our usecase
  const releaseImage = {
    registry: `docker.io`,
    name: `exivity/${component}`,
    tag: newTag,
  }

  await dockerPull(devImage)

  await dockerAddTag(devImage, releaseImage)

  await dockerPush(releaseImage)
}

run().catch(setFailed)
