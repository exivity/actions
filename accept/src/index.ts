import { getInput, info, setFailed, warning } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getBooleanInput } from '../../lib/core'
import {
  getEventData,
  getEventName,
  getPR,
  getRef,
  getRepository,
  getToken,
} from '../../lib/github'
import { runAlways } from './always'
import { runBotReview } from './botReview'
import { getCheckName, isCheckDone } from './checks'
import { detectIssueKey } from './detectIssueKey'
import { runPr } from './pr'

export type RunParams = {
  octokit: ReturnType<typeof getOctokit>
  scaffoldWorkflowId: number
  scaffoldBranch: string
  dryRun: boolean
  ref: string
  component: string
  issue?: string
}

const defaultMode = 'auto'

// id for exivity/scaffold/.github/workflows/build.yaml
// obtain with GET https://api.github.com/repos/exivity/scaffold/actions/workflows
const scaffoldWorkflowId = 514379

const defaultScaffoldBranch = 'develop'

async function run() {
  try {
    let mode = getInput('mode') || defaultMode
    const needsCheck = getInput('needs-check')
    const ghToken = getToken()
    const octokit = getOctokit(ghToken)
    const ref = getRef()
    const { component } = getRepository()
    const eventName = getEventName()
    const scaffoldBranch = getInput('scaffold-branch') || defaultScaffoldBranch
    const dryRun = getBooleanInput('dry-run', false)

    // Skip accepting commits on master
    if (ref === 'master') {
      warning('Skipping: master branch is ignored')
      return
    }

    // Check check
    if (needsCheck) {
      if (!(await isCheckDone(octokit, ref, component, needsCheck))) {
        warning('Skipping: needs-check constraint is not satisfied')
        return
      }
    }

    // Detect issue key in branch name
    const issue = detectIssueKey(ref)
    if (issue) {
      info(`Detected issue key: ${issue}`)
    }

    // Auto mode decision tree
    if (mode === 'auto') {
      switch (eventName) {
        case 'push':
          info(`Running in 'always' mode (push event)`)
          mode = 'always'
          break

        case 'check_run':
        case 'status':
          // debug
          const eventData = await getEventData()
          console.log(JSON.stringify(eventData, undefined, 2))

          if (!needsCheck) {
            warning(`Skipping: check_run trigger requires needs-check input`)
            return
          }

          if (needsCheck !== (await getCheckName())) {
            warning(
              `Skipping: check_run only triggers when check name matches needs-check input`
            )
            return
          }

          if (await getPR(octokit, component, ref)) {
            info(
              `Running in 'bot-review' mode (${eventName} event and PR found)`
            )
            mode = 'bot-review'
          } else {
            info(
              `Running in 'always' mode (${eventName} event and no PR found)`
            )
            mode = 'always'
          }
          break

        case 'pull_request':
          info(`Running in 'bot-review' mode (pull_request event)`)
          mode = 'bot-review'
          break

        default:
          info(`Running in 'pr' mode (other event)`)
          mode = 'pr'
      }
    }

    const params: RunParams = {
      octokit,
      scaffoldWorkflowId,
      scaffoldBranch,
      dryRun,
      component,
      ref,
      issue,
    }

    switch (mode) {
      case 'bot-review':
        await runBotReview(params)
        break
      case 'pr':
        await runPr(params)
        break
      case 'always':
        await runAlways(params)
        break
      default:
        throw new Error('Invalid mode')
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
