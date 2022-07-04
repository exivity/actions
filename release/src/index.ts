import { getInput, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getBooleanInput } from '../../lib/core'
import { getToken } from '../../lib/github'
import { getJiraClient } from './common/jiraClient'
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
  const jiraUsername = getInput('jira-username')
  const jiraToken = getInput('jira-token')

  // Init deps
  const octokit = getOctokit(ghToken)
  const jiraClient =
    jiraUsername && jiraToken ? getJiraClient(jiraUsername, jiraToken) : null

  switch (mode) {
    case ModePing:
      // Act
      await ping({ octokit, dryRun })
      break

    case ModePrepare:
      // Assert
      if (!jiraClient) {
        throw new Error(
          'jira-username and jira-token inputs are required in prepare mode'
        )
      }

      // Act
      await prepare({
        octokit,
        jiraClient,
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
      // Assert
      if (!jiraClient) {
        throw new Error(
          'jira-username and jira-token inputs are required in release mode'
        )
      }

      // Act
      await release({
        octokit,
        lockfilePath,
        dryRun,
      })
      break

    default:
      throw new Error(`Unknown mode "${mode}"`)
  }
}

run().catch(setFailed)
