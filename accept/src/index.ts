import { getInput, setFailed, info } from '@actions/core'
import { getOctokit } from '@actions/github'
import { runAlways } from './always'
import { runBotReview } from './botReview'
import { runPr } from './pr'
import { getPR } from '../../lib/github'
import { isCheckDone } from './checks'

const defaultMode = 'pr'

// id for build.yaml, obtain with GET https://api.github.com/repos/exivity/scaffold/actions/workflows
const workflowId = 514379

// Returns the mode decided on based the event trigger and state of the checks.
async function autoMode(
  ghToken: string,
  ref: string,
  repo: string,
  needs_check: string
): Promise<string> {
  const octokit = getOctokit(ghToken)

  if (needs_check) {
    if (!(await isCheckDone(octokit, ref, repo, needs_check))) {
      return ''
    }
  }

  switch (process.env['GITHUB_EVENT_NAME']) {
    case 'push':
      return 'always'
    case 'check_run':
      const pr = await getPR(octokit, repo, ref)
      return needs_check ? (pr ? 'bot-review' : 'always') : ''
    case 'pull_request':
      return 'bot-review'
    default:
      return 'pr'
  }
}

async function run() {
  try {
    let mode = getInput('mode') || defaultMode
    const needs_check = getInput('needs_check')
    const ghToken = getInput('gh-token') || process.env['GITHUB_TOKEN']

    // Assertions
    if (!ghToken) {
      throw new Error('The GitHub token is missing')
    }

    if (mode === 'auto') {
      const ref =
        process.env['GITHUB_HEAD_REF'] || process.env['GITHUB_REF'].slice(11)
      const repo = process.env['GITHUB_REPOSITORY'].split('/')[1]

      mode = await autoMode(ghToken, ref, repo, needs_check)

      if (mode === '') {
        info(
          'Skipping build because not all requirements for running it under the current mode have been met'
        )
        return
      }
    }

    switch (mode) {
      case 'bot-review':
        await runBotReview(workflowId, ghToken)
        break
      case 'pr':
        await runPr(workflowId)
        break
      case 'always':
        await runAlways(workflowId)
        break
      default:
        throw new Error('Invalid mode')
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
