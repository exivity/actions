import { getInput, setFailed } from '@actions/core'

import { getOctoKitClient } from '../../release/src/common/inputs'

async function run() {
  try {
    const repos = getInput('repos').split(',')
    const eventType = getInput('event_type')

    const octokit = getOctoKitClient()

    for (const repo of repos) {
      const repoName = repo.trim()

      await octokit.rest.repos
        .createDispatchEvent({
          owner: 'exivity',
          repo: repoName,
          event_type: eventType,
        })
        .catch((error) => {
          setFailed(error.message)
        })

      console.log(`Triggered ${eventType} in ${repo}`)
    }
  } catch (error) {
    setFailed('Action failed to execute')
  }
}

run()
