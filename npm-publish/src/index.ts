import { getInput, setFailed } from '@actions/core'
import { exec } from '@actions/exec'

async function run() {
  const token = getInput('token')

  try {
    // Set the token in an environment variable just for this run
    process.env.NPM_TOKEN = token

    // Use this token for npm commands by referencing it in a command or config
    await exec('npm', [
      'config',
      'set',
      '//registry.npmjs.org/:_authToken',
      '${NPM_TOKEN}',
    ])

    // Execute npm publish
    await exec('npm', ['publish', '--access', 'public'])
  } catch (error) {
    setFailed(`Action failed with error: ${error}`)
  } finally {
    // Ensure environment variable is cleared after use
    delete process.env.NPM_TOKEN
  }
}

run()
