import { getInput, info, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import {
  getPR,
  getRef,
  getRepository,
  getToken,
  review,
} from '../../lib/github'

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
  const targetRepo = getInput('component') || component
  const event = getInput('event')
  const branch = getInput('branch') || default_branch
  const body = getInput('body')

  // Assertions
  if (!isValidEvent(event)) {
    throw new Error('The event input is missing or invalid')
  }

  // Initialize GH client
  const octokit = getOctokit(ghToken)

  // Get PR number to use
  const pull_number = isNaN(pull_request)
    ? (await getPR(octokit, targetRepo, branch))?.number
    : pull_request

  if (!pull_number) {
    info('No pull request to review, skipping action')
    return
  }

  info(`Calling GitHub API to ${event} PR ${pull_number} of repo ${targetRepo}`)

  // Post a review to the GitHub API
  await review(octokit, targetRepo, pull_number, event, body)
}

run().catch(setFailed)
