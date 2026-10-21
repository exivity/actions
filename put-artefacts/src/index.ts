import { getInput, info, setFailed } from '@actions/core'
import { exec } from '@actions/exec'
import { resolve } from 'path'
import { getBooleanInput } from '../../lib/core'
import { getRepository, getSha, getWorkspacePath } from '../../lib/github'
import { getAWSCredentials, hasS3objects, uploadS3object } from '../../lib/s3'
import { preserveTagArtifacts } from './preserve.js'

async function zipAll(path: string, component: string) {
  const filename = `${component}.tar.gz`
  const cwd = resolve(getWorkspacePath(), path)

  await exec('tar', ['-zcv', '-C', cwd, '-f', filename, '.'])

  return filename
}

async function run() {
  // Input
  const component = getInput('component') || getRepository().repo
  const sha = getInput('sha') || getSha()
  const usePlatformPrefix = getBooleanInput('use-platform-prefix', false)
  const prefix = getInput('prefix') || undefined
  let path = getInput('path') || 'build'
  const zip = getBooleanInput('zip', false)

  const [awsKeyId, awsSecretKey] = getAWSCredentials()

  const options = {
    component,
    sha,
    usePlatformPrefix,
    prefix,
    path,
    awsKeyId,
    awsSecretKey,
  }
  if (
    await preserveTagArtifacts(process.env.GITHUB_REF, () =>
      hasS3objects(options),
    )
  ) {
    info(
      `Preserving existing artifacts for ${component}@${sha}; release-tag builds do not upload rebuilt files.`,
    )
    return
  }

  if (zip) {
    // This will actually create a tarball instead of a zip archive 🤷‍♂️
    path = await zipAll(path, prefix || component)
  }

  await uploadS3object({
    component,
    sha,
    usePlatformPrefix,
    prefix,
    path,
    awsKeyId,
    awsSecretKey,
  })
}

run().catch(setFailed)
