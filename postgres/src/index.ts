import { setFailed } from '@actions/core'
import { startDocker } from '../../lib'

const image = 'exivity/postgres'
const defaultVersion = '12.3'

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
