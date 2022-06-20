import { getInput, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import { isObject } from '../../lib/core'
import {
  dispatchWorkflow,
  getOwnerInput,
  getRef,
  getRepoInput,
  getToken,
} from '../../lib/github'

function isValidInputs(inputs: unknown): inputs is { [key: string]: string } {
  if (!isObject(inputs)) {
    return false
  }

  for (const entry of Object.entries(inputs)) {
    if (typeof entry[0] !== 'string') {
      return false
    }

    if (typeof entry[1] !== 'string') {
      return false
    }
  }

  return true
}

async function run() {
  // Inputs
  const ghToken = getToken()
  const owner = getOwnerInput()
  const repo = getRepoInput()
  const ref = getInput('ref') || getRef()
  const workflow_id = getInput('workflow', { required: true })
  let inputs = getInput('inputs') || undefined

  // Assertions
  if (typeof inputs !== 'undefined') {
    inputs = JSON.parse(inputs)

    if (!isValidInputs(inputs))
      throw new Error(
        'inputs input must be an object of type `Record<string, string>` encoded as JSON string'
      )
  }

  // Initialize GH client
  const octokit = getOctokit(ghToken)

  // Dispatch workflow
  await dispatchWorkflow({
    octokit,
    owner,
    repo,
    ref,
    workflow_id,
    inputs,
  })
}

run().catch(setFailed)
