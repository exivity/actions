import { getInput, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getBooleanInput } from '../../lib/core'
import { getToken } from '../../lib/github'
import { getJiraClient } from './common/jiraClient'
import { ping } from './ping'
import { prepare } from './prepare'
import { release } from './release'
import { transitionIssues } from './transitionIssues'

enum Mode {
  Ping = 'ping',
  Prepare = 'prepare',
  Release = 'release',
  TransitionIssues = 'transition-issues',
}

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
    case Mode.Ping:
      // Triggers workflow in the exivity repo
      await ping({ octokit, dryRun })
      break

    case Mode.Prepare:
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

    case Mode.Release:
      // Act
      await release({
        octokit,
        lockfilePath,
        dryRun,
      })
      break

    case Mode.TransitionIssues:
      // Assert
      if (!jiraClient) {
        throw new Error(
          'jira-username and jira-token inputs are required in transition-issues mode'
        )
      }

      await transitionIssues({
        octokit,
        lockfilePath,
        jiraClient,
        repositoriesJsonPath,
        dryRun,
      })
      break

    default:
      throw new Error(`Unknown mode "${mode}"`)
  }
}

run().catch(setFailed)
