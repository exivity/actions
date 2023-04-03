import { getInput, info, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import {
  getOwnerInput,
  getPrFromRef,
  getRef,
  getRepoInput,
  getToken,
  review,
} from '../../lib/github'

const validEvents = ['APPROVE', 'COMMENT', 'REQUEST_CHANGES'] as const

function isValidEvent(event: string): event is (typeof validEvents)[number] {
  return validEvents.includes(event as any)
}

async function run() {
  // inputs
  const ghToken = getToken()
  const pull_request = parseInt(getInput('pull'), 10)
  const owner = getOwnerInput()
  const repo = getRepoInput()
  const event = getInput('event')
  const ref = getInput('branch') || getRef()
  const body = getInput('body')

  // Assertions
  if (!isValidEvent(event)) {
    throw new Error('The event input is missing or invalid')
  }

  // Initialize GH client
  const octokit = getOctokit(ghToken)

  // Get PR number to use
  const pull_number = isNaN(pull_request)
    ? (await getPrFromRef({ octokit, owner, repo, ref }))?.number
    : pull_request

  if (!pull_number) {
    info('[review] Skipping, no pull request to review')
    return
  }

  // Post a review to the GitHub API
  await review({ octokit, owner, repo, pull_number, event, body })
}

run().catch(setFailed)
