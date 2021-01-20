import { getInput, setFailed } from '@actions/core'
import { runAlways } from './always'
import { runBotReview } from './botReview'
import { runPr } from './pr'

const defaultMode = 'auto'

// id for build.yaml, obtain with GET https://api.github.com/repos/exivity/scaffold/actions/workflows
const workflowId = 514379

function autoMode(): string {
  switch (process.env['GITHUB_EVENT_NAME']) {
    case 'push':
      return 'always'
    case 'check_run':
    case 'pull_request':
      return 'bot-review'
    default:
      return 'pr'
  }
}

async function run() {
  try {
    let mode = getInput('mode') || defaultMode

    if (mode === 'auto') {
      mode = autoMode()
    }

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
