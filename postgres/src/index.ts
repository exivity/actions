import { getInput, setFailed } from '@actions/core'
import { startDocker, startPostgres } from '../../lib'

const image = 'exivity/postgres'
const defaultVersion = '12.3'

async function run() {
  try {
    // Input
    const mode = getInput('mode') || 'host'

    if (mode !== 'docker' && mode !== 'host') {
      throw new Error(`Mode must be 'docker' or 'host'`)
    }

    switch (mode) {
      case 'docker':
        await startDocker({
          image,
          defaultVersion,
          ports: [5432],
        })
        break

      case 'host':
        await startPostgres()
        break
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
