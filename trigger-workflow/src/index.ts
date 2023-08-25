import { getInput, setFailed } from '@actions/core'

import { dispatchWorkflow } from '../../lib/github'
import { getOctoKitClient } from '../../release/src/common/inputs'

async function run() {
  try {
    const repo = getInput('repo')
    return dispatchWorkflow({
      octokit: getOctoKitClient(),
      owner: 'exivity',
      repo,
      ref: 'main',
      workflow_id: 'build.yml',
    })
  } catch (error) {
    setFailed(`Couldn't dispatch build workflow`)
  }
}

run()
