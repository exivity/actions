import { getInput, info, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getPR, getRef, getRepository, getToken } from '../../lib/github'

const validEvents = ['APPROVE', 'COMMENT', 'REQUEST_CHANGES'] as const

function isValidEvent(event: string): event is typeof validEvents[number] {
  return validEvents.includes(event as any)
}

async function run() {
  // defaults
  const { owner, component } = getRepository()
  const default_branch = getRef()

  // inputs
  const ghToken = getToken()
  const pull_request = parseInt(getInput('pull'), 10)
  const repo = getInput('component') || component
  const event = getInput('event')
  const branch = getInput('branch') || default_branch
  const customBody = getInput('body')

  // Assertions
  if (!isValidEvent(event)) {
    throw new Error('The event input is missing or invalid')
  }

  // Initialize GH client
  const octokit = getOctokit(ghToken)

  // Get PR number to use
  const pull_number = isNaN(pull_request)
    ? (await getPR(octokit, repo, branch))?.number
    : pull_request

  if (!pull_number) {
    info('No pull request to review, skipping action')
    return
  }

  info(`Calling GitHub API to ${event} PR ${pull_number} of repo ${repo}`)

  const body = `${customBody}${customBody ? '\n\n---\n\n' : ''}\
_Automated review from [**${process.env['GITHUB_WORKFLOW']}** \
workflow in **${process.env['GITHUB_REPOSITORY']}**]\
(https://github.com/${process.env['GITHUB_REPOSITORY']}/actions/runs/${
    process.env['GITHUB_RUN_ID']
  })_`

  // Post a review to the GitHub API
  await octokit.request(
    'POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews',
    {
      owner,
      repo,
      pull_number,
      event,
      body,
    }
  )
}

run().catch(setFailed)
