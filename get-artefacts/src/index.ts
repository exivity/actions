import { getInput, setFailed } from '@actions/core'
import { platform } from 'os'
import { downloadS3object, getShaFromBranch } from '../../lib'

async function run() {
  try {
    // Input
    const component = getInput('component', { required: true })
    let sha = getInput('sha')
    let branch = getInput('branch') || 'develop'
    const path = getInput('path', { required: true })
    const awsKeyId =
      getInput('aws-access-key-id') || process.env['AWS_ACCESS_KEY_ID']
    const awsSecretKey =
      getInput('aws-secret-access-key') || process.env['AWS_SECRET_ACCESS_KEY']
    const ghToken = getInput('gh-token') || process.env['GH_TOKEN']
    const os = platform() === 'win32' ? 'windows' : 'linux'

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
      suffix: os,
      path,
    })
  } catch (error) {
    setFailed(error.message)
  }
}

run()
