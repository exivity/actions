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
  const usePlatformPrefix = getBooleanInput('use-platform-prefix', false)
  const prefix = getInput('prefix') || undefined
  let path = getInput('path') || 'build'
  const zip = getBooleanInput('zip', false)

  // From environment
  const sha = getSha()
  const { repo } = getRepository()

  const [awsKeyId, awsSecretKey] = getAWSCredentials()

  if (zip) {
    // This will actually create a tarball instead of a zip archive 🤷‍♂️
    path = await zipAll(path, repo)
  }

  await uploadS3object({
    component: repo,
    sha,
    usePlatformPrefix,
    prefix,
    path,
    awsKeyId,
    awsSecretKey,
  })
}

run().catch(setFailed)
