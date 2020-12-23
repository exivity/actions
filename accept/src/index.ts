import { getInput, setFailed } from '@actions/core'
import { runAlways } from './always'
import { runBotReview } from './botReview'
import { runPr } from './pr'

const defaultMode = 'pr'

// id for build.yaml, obtain with GET https://api.github.com/repos/exivity/scaffold/actions/workflows
const workflowId = 514379

async function run() {
  try {
    const mode = getInput('mode') || defaultMode

    switch (mode) {
      case 'bot-review':
        await runBotReview(workflowId)
        break
      case 'pr':
        await runPr(workflowId)
        break
      case 'always':
        await runAlways(workflowId)
        break
      default:
        throw new Error('Invalid mode')
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
