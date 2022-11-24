import { getInput, setFailed } from '@actions/core'
import { logAvailableRequests } from './common/utils'

import { ping } from './ping'
import { prepare } from './prepare'
import { release } from './release'
import { updateJiraIssues } from './updateJiraIssues'

const runModes = {
  ping,
  prepare,
  release,
  ['update-jira-issues']: updateJiraIssues,
}

async function run() {
  const mode = getInput('mode')

  if (!runModes[mode]) throw new Error(`Unknown mode "${mode}"`)

  logAvailableRequests()

  return runModes[mode]()
}

run().catch(setFailed)
