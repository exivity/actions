import { getInput, setFailed } from '@actions/core'
import { exec } from '@actions/exec'
import { platform } from 'os'
import path from 'path'
import { startDocker } from '../../lib'

const image = 'exivity/postgres'
const defaultVersion = '12.3'

type MODE = 'docker' | 'host'

async function run() {
  try {
    // Input
    const mode = getInput('mode') || 'docker'

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
        const script =
          platform() === 'win32'
            ? 'start-postgres-windows.sh'
            : 'start-postgres-linux.sh'
        await exec(`bash ${script}`, undefined, {
          cwd: path.resolve(__dirname, '..'),
        })
        break
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
