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
  // Input
  const mode = getInput('mode')
  const repositories = getJSONInput<string[]>('repositories')
  const dryRun = getBooleanInput('dry-run', false)
  const ghToken = getToken()

  // Init deps
  const octokit = getOctokit(ghToken)

  switch (mode) {
    case ModePing:
      // Act
      await ping({ octokit, dryRun })
      break

    case ModePrepare:
      // Assert
      if (typeof repositories === 'undefined') {
        throw new Error('repositories is required when mode is prepare')
      }

      // Act
      await prepare({ octokit, repositories, dryRun })
      break

    case ModeRelease:
      // Assert
      if (typeof repositories === 'undefined') {
        throw new Error('repositories is required when mode is release')
      }

      // Act
      await release({ octokit, dryRun })
      break

    default:
      throw new Error(`Unknown mode "${mode}"`)
  }
}

run().catch(setFailed)
