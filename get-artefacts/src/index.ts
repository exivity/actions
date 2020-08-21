import { getInput, setFailed } from '@actions/core'
import { getShaFromBranch } from '../../lib/github'
import { downloadS3object } from '../../lib/s3'

async function run() {
  try {
    // Input
    const component = getInput('component', { required: true })
    let sha = getInput('sha')
    const branch =
      getInput('branch') || process.env.GITHUB_REF === 'refs/heads/master'
        ? 'master'
        : 'develop'
    const usePlatformPrefix = !!getInput('use-platform-prefix') || false
    const prefix = getInput('prefix') || undefined
    const path = getInput('path') || `../${component}/build`
    const awsKeyId =
      getInput('aws-access-key-id') || process.env['AWS_ACCESS_KEY_ID']
    const awsSecretKey =
      getInput('aws-secret-access-key') || process.env['AWS_SECRET_ACCESS_KEY']
    const ghToken = getInput('gh-token') || process.env['GITHUB_TOKEN']

    // Assertions
    if (!awsKeyId || !awsSecretKey || !ghToken) {
      throw new Error('A required argument is missing')
    }

    // If we have no sha and a branch, let's find the sha
    if (!sha) {
      sha = await getShaFromBranch({
        ghToken,
        component,
        branch,
      })
    }

    await downloadS3object({
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
