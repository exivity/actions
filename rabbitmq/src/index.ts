import { setFailed } from '@actions/core'
import { startDocker } from '../../lib'

const image = 'exivity/rabbitmq'
const defaultVersion = '3.8.6'

async function run() {
  try {
    await startDocker({
      image,
      defaultVersion,
    })
  } catch (error) {
    setFailed(error.message)
  }
}

run()
