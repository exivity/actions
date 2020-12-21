import { getInput, info, setFailed, warning } from '@actions/core'
import { getOctokit } from '@actions/github'

import { getPR } from '../../lib/github'

async function run() {
  try {
    // defaults
    const [owner, component] = process.env['GITHUB_REPOSITORY'].split('/')
    const branch =
      process.env['GITHUB_HEAD_REF'] || process.env['GITHUB_REF'].slice(11)

    // inputs
    const ghToken = getInput('gh-token') || process.env['GITHUB_TOKEN']
    const pull_request = parseInt(getInput('pull'), 10)
    const repo = getInput('repo') || component
    const event = getInput('event')

    // Assertions
    if (
      !ghToken ||
      !['APPROVE', 'COMMENT', 'REQUEST_CHANGES'].includes(event)
    ) {
      throw new Error('A required argument is missing')
    }

    // Initialize GH client
    const octokit = getOctokit(ghToken)

    const pull_number = isNaN(pull_request)
      ? (await getPR(octokit, owner, repo, branch))?.number
      : pull_request

    // get PR number to use
    if (!pull_number) {
      warning('No pull request to review, skipping action')
      return
    }

    info(`Calling GitHub API to approve PR ${pull_number} of repo ${repo}`)

    // call GH API
    await octokit.request(
      'POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews',
      {
        owner,
        repo,
        pull_number,
        event: event as any,
        body: getInput('body'),
      }
    )
  } catch (err) {
    setFailed(err.message)
  }
}

run()
