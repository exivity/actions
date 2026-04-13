import { getInput, setFailed } from '@actions/core'
import { exec } from '@actions/exec'
import { resolve } from 'path'
import { getBooleanInput } from '../../lib/core'
import { getRepository, getSha, getWorkspacePath } from '../../lib/github'
import { getAWSCredentials, uploadS3object } from '../../lib/s3'

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
