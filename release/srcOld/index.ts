import { getInput, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getBooleanInput } from '../../lib/core'
import { getToken } from '../../lib/github'
import { getJiraClient } from './common/jiraClient'
import { getRepositories } from './common/files'
import { ping } from './ping'
import { prepare } from './prepare'
import { release } from './release'
import { info } from 'console'

type RateLimitResponse = {
  resources: {
    core: {
      limit: number
      remaining: number
      reset: number
      used: number
    }
  }
}

enum Mode {
  Ping = 'ping',
  Prepare = 'prepare',
  Release = 'release',
}

async function run() {
  // Input
  const releaserRepo = getInput('releaser-repo')
  const mode = getInput('mode')
  const lockfilePath = getInput('lockfile')
  const changelogPath = getInput('changelog')
  const prTemplatePath = getInput('pr-template')
  const upcomingReleaseBranch = getInput('upcoming-release-branch')
  const releaseBranch = getInput('release-branch')
  const dryRun = getBooleanInput('dry-run', false)
  const ghToken = getToken()
  const jiraUsername = getInput('jira-username')
  const jiraToken = getInput('jira-token')

  // Init deps
  const jiraClient =
    jiraUsername && jiraToken ? getJiraClient(jiraUsername, jiraToken) : null

  const octokit = getOctokit(ghToken)
  const core = (await octokit.request('GET /rate_limit', {})).data.resources
    .core

  info(
    `Remaining github API calls: ${
      core.remaining
    }. Rate limit will reset at ${new Date(core.reset * 1000).toISOString()}.`
  )

  switch (mode) {
    case Mode.Ping:
      // Triggers workflow in the exivity repo
      await ping({ octokit, releaserRepo, dryRun })
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
        repositories: await getRepositories(lockfilePath),
        prTemplatePath,
        upcomingReleaseBranch,
        releaserRepo,
        releaseBranch,
        dryRun,
      })
      break

    case Mode.Release:
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
        jiraClient,
        repositories: await getRepositories(lockfilePath),
        dryRun,
      })
      break

    default:
      throw new Error(`Unknown mode "${mode}"`)
  }
}

run().catch(setFailed)
