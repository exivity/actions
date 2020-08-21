import { getInput, setFailed } from '@actions/core'
import { startDex } from '../../lib/dex'

async function run() {
  try {
    // Input
    const cmd = getInput('cmd')

    // Assertions
    if (!cmd) {
      throw new Error('A required argument is missing')
    }

    await startDex({ cmd })
  } catch (error) {
    setFailed(error.message)
  }
}

run()
