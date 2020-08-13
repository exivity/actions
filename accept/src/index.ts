import { getInput, setFailed } from '@actions/core'
import { exec } from '@actions/exec'
import path from 'path'

async function run() {
  try {
    // Determine default branch
    const ref = process.env['GITHUB_REF']
    let defaultBranch: string
    switch (ref) {
      case 'refs/heads/master':
        // Skip accepting master commits
        return

      case 'refs/heads/develop':
        defaultBranch = 'develop'
        break

      default:
        defaultBranch = 'custom'
        break
    }

    // Input
    const branch = getInput('scaffold-branch') || defaultBranch
    const token = getInput('appveyor-token') || process.env['APPVEYOR_TOKEN']

    // Assertions
    if (!token) {
      throw new Error('A required argument is missing')
    }

    // Execute trigger-appveyor script
    await exec('bash trigger-appveyor.sh', undefined, {
      cwd: path.resolve(__dirname, '..'),
      env: {
        BRANCH: branch,
        APPVEYOR_TOKEN: token,
      },
    })
  } catch (error) {
    setFailed(error.message)
  }
}

run()
