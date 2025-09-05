import { getInput, setFailed, getBooleanInput } from '@actions/core'
import { table } from '../../lib/core'
import {
  dockerAddTag,
  dockerCopyMultiArch,
  dockerLogin,
  dockerPull,
  dockerPush,
  dockerInspectManifest,
  getImageFQN,
} from '../../lib/dockerCli'
import { getOwnerInput, getRepoInput } from '../../lib/github'

async function run() {
  // Source Inputs
  const sourceRegistry = getInput('source-registry')
  const sourceNamespace = getOwnerInput('source-namespace')
  const sourceName = getRepoInput('source-name')
  const sourceTag = getInput('source-tag')
  const sourceUser = getInput('source-user')
  const sourcePassword = getInput('source-password')

  // Target Inputs
  const targetRegistry = getInput('target-registry')
  const targetNamespace = getOwnerInput('target-namespace')
  const targetName = getRepoInput('target-name')
  const targetTag = getInput('target-tag')
  const targetUser = getInput('target-user')
  const targetPassword = getInput('target-password')

  // Configuration inputs
  const useMultiArch = getBooleanInput('multi-arch')
  const preserveAttestations = getBooleanInput('preserve-attestations')

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

  table('Source Image', getImageFQN(sourceImage))
  table('Target Image', getImageFQN(targetImage))
  table('Multi-arch Mode', useMultiArch.toString())
  table('Preserve Attestations', preserveAttestations.toString())

  // Login to source registry if credentials provided
  if (sourceUser && sourcePassword) {
    await dockerLogin({
      registry: sourceRegistry,
      user: sourceUser,
      password: sourcePassword,
    })
  }

  // Login to target registry if credentials provided
  if (targetUser && targetPassword) {
    await dockerLogin({
      registry: targetRegistry,
      user: targetUser,
      password: targetPassword,
    })
  }

  // Inspect source image to verify it exists and show manifest info
  try {
    await dockerInspectManifest(sourceImage)
  } catch (error) {
    throw new Error(
      `Failed to inspect source image ${getImageFQN(sourceImage)}: ${error}`,
    )
  }

  if (useMultiArch) {
    // Use cosign (preferred) or buildx imagetools for proper multi-arch support
    await dockerCopyMultiArch(sourceImage, targetImage, preserveAttestations)
  } else {
    // Fallback to traditional docker commands for backwards compatibility
    await dockerPull(sourceImage)
    await dockerAddTag(sourceImage, targetImage)
    await dockerPush(targetImage)
  }

  table(
    'Success',
    `Image copied from ${getImageFQN(sourceImage)} to ${getImageFQN(targetImage)}`,
  )
}

run().catch(setFailed)
