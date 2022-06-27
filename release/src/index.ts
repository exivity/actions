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

async function run() {
  // Input
  const mode = getInput('mode')
  const lockfilePath = getInput('lockfile')
  const changelogPath = getInput('changelog')
  const repositoriesJsonPath = getInput('repositories')
  const prTemplatePath = getInput('pr-template')
  const upcomingReleaseBranch = getInput('upcoming-release-branch')
  const releaseBranch = getInput('release-branch')
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
      await prepare({
        octokit,
        lockfilePath,
        changelogPath,
        repositoriesJsonPath,
        prTemplatePath,
        upcomingReleaseBranch,
        releaseBranch,
        dryRun,
      })
      break

    case ModeRelease:
      // Act
      await release({ octokit, lockfilePath, repositoriesJsonPath, dryRun })
      break

    default:
      throw new Error(`Unknown mode "${mode}"`)
  }
}

run().catch(setFailed)
