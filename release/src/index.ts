import { getInput, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getToken } from '../../lib/github'
import { ping } from './ping'
import { prepare } from './prepare'
import { release } from './release'

const ModePing = 'ping'
const ModePrepare = 'prepare'
const ModeRelease = 'release'

async function run() {
  // Inputs
  const mode = getInput('mode')
  const ghToken = getToken()

  // Libs
  const octokit = getOctokit(ghToken)

  switch (mode) {
    case ModePing:
      await ping(octokit)
      break

    case ModePrepare:
      await prepare(octokit)
      break

    case ModeRelease:
      await release(octokit)
      break

    default:
      throw new Error(`Unknown mode "${mode}"`)
  }
}

run().catch(setFailed)
