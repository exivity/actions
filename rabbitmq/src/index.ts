import { getInput, setFailed } from '@actions/core'
import { exec } from '@actions/exec'
import path from 'path'

const DEFAULT_VERSION = '3.8.6'

async function run() {
  try {
    // Input
    const version = getInput('version') || DEFAULT_VERSION

    // Set Docker image name
    let image: string
    switch (process.platform) {
      case 'linux':
        image = 'rabbitmq'
        break
      case 'win32':
        image = 'exivity/rabbitmq'
        break
    }

    // Execute start-docker bash script
    await exec('bash start-docker.sh', undefined, {
      cwd: path.resolve(__dirname, '..'),
      env: {
        DOCKER_IMAGE: `${image}:${version}`,
      },
    })
  } catch (error) {
    setFailed(error.message)
  }
}

run()
