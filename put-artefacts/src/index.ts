import { getInput, setFailed } from '@actions/core'
import { uploadS3object } from '../../lib/s3'

async function run() {
  try {
    // Input
    const usePlatformPrefix = !!(getInput('use-platform-prefix') || false)
    const prefix = getInput('prefix') || undefined
    const path = getInput('path') || 'build'
    const awsKeyId =
      getInput('aws-access-key-id') || process.env['AWS_ACCESS_KEY_ID']
    const awsSecretKey =
      getInput('aws-secret-access-key') || process.env['AWS_SECRET_ACCESS_KEY']

    // From environment
    const sha = process.env['GITHUB_SHA']
    const [_, component] = process.env['GITHUB_REPOSITORY'].split('/')

    // Assertions
    if (!awsKeyId || !awsSecretKey) {
      throw new Error('A required argument is missing')
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
