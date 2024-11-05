import { info, setFailed } from '@actions/core'
import { main } from './inspect-workflows'

async function run() {
  info('Inspecting workflows')

  main()
}

run().catch(setFailed)
