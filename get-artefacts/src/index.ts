import { getInput, setFailed } from '@actions/core'
import { promises as fsPromises } from 'fs'
import { join as pathJoin } from 'path'
import { exec } from '@actions/exec'
import { downloadS3object, getShaFromBranch } from '../../lib'

async function unzipAll(path: string) {
  for (const file of await fsPromises.readdir(path)) {
    if (file.endsWith('.zip')) {
      await exec('7z', ['x',  pathJoin(path, file), '-o', path])
    } else if (
      (await fsPromises.lstat(pathJoin(path, file))).isDirectory()
    ) {
      unzipAll(pathJoin(path, file))
    }
  }
}

async function run() {
  try {
    // Input
    const component = getInput('component', { required: true })
    let sha = getInput('sha')
    const branch = getInput('branch') || 'develop'
    const usePlatformPrefix = !!getInput('use-platform-prefix') || false
    const prefix = getInput('prefix') || undefined
    const path = getInput('path') || `../${component}/build`
    const awsKeyId =
      getInput('aws-access-key-id') || process.env['AWS_ACCESS_KEY_ID']
    const awsSecretKey =
      getInput('aws-secret-access-key') || process.env['AWS_SECRET_ACCESS_KEY']
    const ghToken = getInput('gh-token') || process.env['GITHUB_TOKEN']
    const unzip = !getInput('no-unzipping')

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

    if (unzip) {
      	await unzipAll(path)
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
