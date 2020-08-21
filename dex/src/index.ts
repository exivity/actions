import { getInput, setFailed } from '@actions/core'
import { startDexDocker } from '../../lib/dex'

async function run() {
  try {
    // Input
    const cmd = getInput('cmd')

    // Assertions
    if (!cmd) {
      throw new Error('A required argument is missing')
    }

    await startDexDocker({ cmd })
  } catch (error) {
    setFailed(error.message)
  }
}

run()
