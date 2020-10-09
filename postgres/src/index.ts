import { getInput, setFailed } from '@actions/core'
import { startDocker } from '../../lib/docker'
import { defaultVersion, image, startPostgres } from '../../lib/postgres'

async function run() {
  try {
    // Input
    const mode = getInput('mode') || 'host'
    const password = getInput('password') || 'postgres'

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
        await startPostgres(password)
        break
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
