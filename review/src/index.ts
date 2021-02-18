import { getInput, info, setFailed, warning } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getPR, getRef, getRepository, getToken } from '../../lib/github'

async function run() {
  try {
    // defaults
    const { owner, component } = getRepository()
    const default_branch = getRef()

    // inputs
    const ghToken = getToken()
    const pull_request = parseInt(getInput('pull'), 10)
    const repo = getInput('component') || component
    const event = getInput('event')
    const branch = getInput('branch') || default_branch

    // Assertions
    if (!['APPROVE', 'COMMENT', 'REQUEST_CHANGES'].includes(event)) {
      throw new Error('The event input is missing or invalid')
    }

    // Initialize GH client
    const octokit = getOctokit(ghToken)

    const pull_number = isNaN(pull_request)
      ? (await getPR(octokit, repo, branch))?.number
      : pull_request

    // get PR number to use
    if (!pull_number) {
      warning('No pull request to review, skipping action')
      return
    }

    info(`Calling GitHub API to ${event} PR ${pull_number} of repo ${repo}`)

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
