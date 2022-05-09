import { getInput, setFailed } from '@actions/core'
import {
  dockerAddTag,
  dockerLogin,
  dockerPush,
  dockerPull,
} from '../../lib/dockerCli'
import { getOwnerInput, getRepoInput } from '../../lib/github'

async function run() {
  // Source Inputs
  const sourceRegistry = getInput('source-registry')
  const sourceNamespace = getOwnerInput('namespace')
  const sourceName = getRepoInput('name')
  const sourceTag = getInput('source-tag')
  const sourceUser = getInput('source-user')
  const sourcePassword = getInput('source-password')

  // Target Inputs
  const targetRegistry = getInput('target-registry')
  const targetNamespace = getOwnerInput('namespace')
  const targetName = getRepoInput('name')
  const targetTag = getInput('target-tag')
  const targetUser = getInput('target-user')
  const targetPassword = getInput('target-password')

  // Login to source registry
  await dockerLogin({
    registry: sourceRegistry,
    user: sourceUser,
    password: sourcePassword,
  })

  // Login to target registry
  await dockerLogin({
    registry: targetRegistry,
    user: targetUser,
    password: targetPassword,
  })

  const sourceImage = {
    registry: sourceRegistry,
    namespace: sourceNamespace,
    name: sourceName,
    tag: sourceTag,
  }

  const targetImage = {
    registry: targetRegistry,
    namespace: targetNamespace,
    name: targetName,
    tag: targetTag,
  }

  await dockerPull(sourceImage)

  await dockerAddTag(sourceImage, targetImage)

  await dockerPush(targetImage)
}

run().catch(setFailed)
