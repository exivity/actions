import { getInput, setFailed } from '@actions/core'
import { exec } from '@actions/exec'
import path from 'path'

async function run() {
  try {
    // Input
    const tag = getInput('tag') || 'latest'
    const args = getInput('args')

    // Assertions
    if (!args) {
      throw new Error('A required argument is missing')
    }

    // Execute docker-start script
    await exec(`bash docker-start.sh ${args}`, undefined, {
      cwd: path.resolve(__dirname, '..'),
      env: {
        TAG: tag,
      },
    })
  } catch (error) {
    setFailed(error.message)
  }
}

run()
