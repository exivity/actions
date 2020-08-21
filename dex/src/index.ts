import { getInput, setFailed } from '@actions/core'
import { startDexBinary, startDexDocker } from '../../lib/dex'

async function run() {
  try {
    // Input
    const cmd = getInput('cmd')
    const mode = getInput('mode') || 'binary'

    // Assertions
    if (!cmd) {
      throw new Error('A required argument is missing')
    }

    if (mode !== 'docker' && mode !== 'binary') {
      throw new Error(`Mode must be 'docker' or 'binary'`)
    }

    switch (mode) {
      case 'docker':
        await startDexDocker({ cmd })
        break

      case 'binary':
        await startDexBinary({ cmd })
        break
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
