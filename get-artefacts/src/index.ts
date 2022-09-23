import { getInput, setFailed } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { getBooleanInput, unzipAll } from '../../lib/core'
import { getShaFromRef, getToken, STANDARD_BRANCH } from '../../lib/github'
import { downloadS3object, getAWSCredentials } from '../../lib/s3'

async function run() {
  // Input
  const component = getInput('component', { required: true })
  let sha = getInput('sha')
  const branch = getInput('branch') || STANDARD_BRANCH
  const usePlatformPrefix = getBooleanInput('use-platform-prefix', false)
  const prefix = getInput('prefix') || undefined
  const path = getInput('path') || `../${component}/build`
  const autoUnzip = getBooleanInput('auto-unzip', true)
  const ghToken = getToken()

  const [awsKeyId, awsSecretKey] = getAWSCredentials()

  // If we have no sha and a branch, let's find the sha
  if (!sha) {
    sha = await getShaFromRef({
      octokit: getOctokit(ghToken),
      owner: 'exivity',
      repo: component,
      ref: branch,
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

  if (autoUnzip) {
    await unzipAll(path)
  }
}

run().catch(setFailed)
