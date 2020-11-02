import { debug, getInput, setFailed } from '@actions/core'
import { exec } from '@actions/exec'
import { resolve } from 'path'
import { uploadS3object } from '../../lib/s3'

async function zipAll(path: string, component: string) {
  const filename = `${component}.tar.gz`
  const cwd = resolve(process.env['GITHUB_WORKSPACE'], path)

  await exec('tar', ['-zcv', '-C', cwd, '-f', filename, '.'])

  return filename
}

async function run() {
  try {
    // Input
    const usePlatformPrefix = !!(getInput('use-platform-prefix') || false)
    const prefix = getInput('prefix') || undefined
    let path = getInput('path') || 'build'
    const zip = !!(getInput('zip') || false)
    const awsKeyId =
      getInput('aws-access-key-id') || process.env['AWS_ACCESS_KEY_ID']
    const awsSecretKey =
      getInput('aws-secret-access-key') || process.env['AWS_SECRET_ACCESS_KEY']

    debug(`zip is ${JSON.stringify(zip)}`)

    // From environment
    const sha = process.env['GITHUB_SHA']
    const [_, component] = process.env['GITHUB_REPOSITORY'].split('/')

    // Assertions
    if (!awsKeyId || !awsSecretKey) {
      throw new Error('A required argument is missing')
    }

    if (zip) {
      // This will actually create a tarball instead of a zip archive 🤷‍♂️
      path = await zipAll(path, component)
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
  } catch (error) {
    setFailed(error.message)
  }
}

run()
