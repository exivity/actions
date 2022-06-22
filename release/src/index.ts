import { getInput, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getBooleanInput } from '../../lib/core'
import { getToken } from '../../lib/github'
import { ping } from './ping'
import { prepare } from './prepare'
import { release } from './release'

const ModePing = 'ping'
const ModePrepare = 'prepare'
const ModeRelease = 'release'

export type Repositories = {
  [repository: string]: {
    releaseBranch?: string
  }
}

export const DEFAULT_REPOSITORY_RELEASE_BRANCH = 'main'

async function run() {
  // Input
  const mode = getInput('mode')
  const repositoriesJsonPath = getInput('repositories')
  const prTemplatePath = getInput('pr-template')
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
      // Act
      await prepare({ octokit, repositoriesJsonPath, prTemplatePath, dryRun })
      break

    case ModeRelease:
      // Act
      await release({ octokit, dryRun })
      break

    default:
      throw new Error(`Unknown mode "${mode}"`)
  }
}

run().catch(setFailed)
