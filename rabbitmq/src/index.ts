import { setFailed } from '@actions/core'
import { startDocker } from '../../lib/docker'

const image = 'exivity/rabbitmq'
const defaultVersion = '3.8.6'

async function run() {
  await startDocker({
    image,
    defaultVersion,
    ports: [4369, 5671, 5672, 15672],
  })
}

run().catch(setFailed)
