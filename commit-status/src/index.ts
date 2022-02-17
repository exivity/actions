import { getInput, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getRepository, getSha, getToken, writeStatus } from '../../lib/github'

const validStates = ['error', 'failure', 'pending', 'success'] as const

function isValidState(state: string): state is typeof validStates[number] {
  return validStates.includes(state as any)
}

async function run() {
  // inputs
  const ghToken = getToken()
  const repo = getInput('component') || getRepository().component
  const sha = getInput('sha') || (await getSha())
  const state = getInput('state') || 'success'
  const context = getInput('context', { required: true })
  const target_url = getInput('target_url')
  const description = getInput('description')

  // Assertions
  if (!isValidState(state)) {
    throw new Error('The state input is missing or invalid')
  }

  // Initialize GH client
  const octokit = getOctokit(ghToken)

  // Post a review to the GitHub API
  await writeStatus(octokit, repo, sha, state, context, description, target_url)
}

run().catch(setFailed)
