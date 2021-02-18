import { getInput, setFailed } from '@actions/core'
import { exec } from '@actions/exec'
import { getOctokit } from '@actions/github'
import { promises as fsPromises } from 'fs'
import { join as pathJoin } from 'path'
import { getBooleanInput } from '../../lib/core'
import { getShaFromRef, getToken } from '../../lib/github'
import { downloadS3object } from '../../lib/s3'

async function unzipAll(path: string) {
  for (const file of await fsPromises.readdir(path)) {
    if (file.endsWith('.zip')) {
      await exec('7z', ['x', pathJoin(path, file), `-o${path}`])
    } else if ((await fsPromises.lstat(pathJoin(path, file))).isDirectory()) {
      unzipAll(pathJoin(path, file))
    }
  }
}

async function run() {
  try {
    // Input
    const component = getInput('component', { required: true })
    let sha = getInput('sha')
    const branch =
      getInput('branch') ||
      (process.env.GITHUB_REF === 'refs/heads/master' ? 'master' : 'develop')
    const usePlatformPrefix = getBooleanInput('use-platform-prefix', false)
    const prefix = getInput('prefix') || undefined
    const path = getInput('path') || `../${component}/build`
    const autoUnzip = getBooleanInput('auto-unzip', true)
    const awsKeyId =
      getInput('aws-access-key-id') || process.env['AWS_ACCESS_KEY_ID']
    const awsSecretKey =
      getInput('aws-secret-access-key') || process.env['AWS_SECRET_ACCESS_KEY']
    const ghToken = getToken()

    // Assertions
    if (!awsKeyId || !awsSecretKey) {
      throw new Error('A required AWS input is missing')
    }

    // If we have no sha and a branch, let's find the sha
    if (!sha) {
      sha = await getShaFromRef({
        octokit: getOctokit(ghToken),
        component,
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
  } catch (error) {
    setFailed(error.message)
  }
}

run()
