import { getInput, info, setFailed } from '@actions/core'
import { exec } from '@actions/exec'
import github from '@actions/github'
import os from 'os'
import { join } from 'path'

const S3_BUCKET = 'exivity'
const S3_PREFIX = 'build'
const S3_REGION = 'eu-central-1'

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
    const platform = os.platform() === 'win32' ? 'windows' : 'linux'

    // Assertions
    if (!awsKeyId || !awsSecretKey || !ghToken) {
      throw new Error('A required argument is missing')
    }

    // If we have no sha and a branch, let's find the sha
    if (!sha) {
      const octokit = github.getOctokit(ghToken)
      sha = (
        await octokit.repos.getBranch({
          owner: 'exivity',
          repo: component,
          branch,
        })
      ).data.commit.sha
      info(`Resolved ${branch} to ${sha}`)
    }

    const src = `s3://${S3_BUCKET}/${S3_PREFIX}/${component}/${sha}/${platform}`
    const dest = join(
      process.env['GITHUB_WORKSPACE'],
      component,
      component,
      path
    )
    const cmd = `aws s3 cp "${src}" "${dest}" --recursive`
    info(`About to execute ${cmd}`)

    // Execute aws cli command
    await exec(cmd)
  } catch (error) {
    setFailed(error.message)
  }
}

run()
