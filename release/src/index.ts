import { getInput, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getBooleanInput, getJSONInput } from '../../lib/core'
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
  const repositories = getJSONInput<string[]>('repositories')
  const dryRun = getBooleanInput('dry-run', false)
  const ghToken = getToken()

  // Libs
  const octokit = getOctokit(ghToken)

  // Assertions

  switch (mode) {
    case ModePing:
      await ping({ octokit, dryRun })
      break

    case ModePrepare:
      if (typeof repositories === 'undefined') {
        throw new Error('repositories is required when mode is prepare')
      }
      await prepare({ octokit, repositories, dryRun })
      break

    case ModeRelease:
      if (typeof repositories === 'undefined') {
        throw new Error('repositories is required when mode is prepare')
      }
      await release({ octokit, dryRun })
      break

    default:
      throw new Error(`Unknown mode "${mode}"`)
  }
}

run().catch(setFailed)
