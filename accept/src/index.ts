import {
  endGroup,
  getInput,
  info,
  setFailed,
  startGroup,
  warning,
} from '@actions/core'
import { getOctokit } from '@actions/github'
import { EmitterWebhookEvent } from '@octokit/webhooks'
import { EmitterWebhookEventName } from '@octokit/webhooks/dist-types/types'
import { getBooleanInput } from '../../lib/core'
import {
  getEventData,
  getEventName,
  getPR,
  getRef,
  getRepository,
  getSha,
  getToken,
} from '../../lib/github'
import {
  includesBotRequest,
  isBotReviewRequested,
  isWorkflowDependencyDone,
} from './checks'
import { dispatch } from './dispatch'

type EventData<
  T extends EmitterWebhookEventName
> = EmitterWebhookEvent<T>['payload']

type PossibleEventNames = typeof supportedEvents[number]

type PossibleEventData = EventData<PossibleEventNames>

const supportedEvents = ['push', 'pull_request', 'workflow_run'] as const

// id for exivity/scaffold/.github/workflows/build.yaml
// obtain with GET https://api.github.com/repos/exivity/scaffold/actions/workflows
const scaffoldWorkflowId = 514379

const defaultScaffoldBranch = 'develop'

const releaseBranches = ['master', 'main']
const developBranches = ['develop']

function detectIssueKey(input: string) {
  const match = input.match(/([A-Z0-9]{1,10}-\d+)/)

  return match !== null && match.length > 0 ? match[0] : undefined
}

function table(key: string, value: string) {
  info(`${key.padEnd(15)}: ${value}`)
}

function isEvent<T extends PossibleEventNames>(
  input: PossibleEventNames,
  compare: T,
  eventData: PossibleEventData
): eventData is EventData<T> {
  return input === compare
}

async function run() {
  try {
    const ghToken = getToken()
    const octokit = getOctokit(ghToken)
    let ref = getRef()
    let sha = getSha()
    const { component } = getRepository()
    const eventName = getEventName<PossibleEventNames>()
    const eventData = await getEventData<PossibleEventData>()
    const scaffoldBranch = getInput('scaffold-branch') || defaultScaffoldBranch
    const dryRun = getBooleanInput('dry-run', false)

    table('Event', eventName)

    if (!supportedEvents.includes(eventName)) {
      throw new Error(`Event name "${eventName}" not supported`)
    }

    if (isEvent(eventName, 'workflow_run', eventData)) {
      if (eventData['action'] !== 'completed') {
        warning(
          'Skipping: only the "workflow_run.completed" event is supported'
        )
        return
      }

      // We need to copy ref and sha to correct commit if we received a
      // workflow_run event, because it uses default branch head commit by default
      // https://docs.github.com/en/actions/reference/events-that-trigger-workflows#workflow_run
      ref = eventData['workflow_run']['head_branch']
      sha = eventData['workflow_run']['head_commit']['id']
    }

    if (isEvent(eventName, 'pull_request', eventData)) {
      if (eventData['action'] !== 'review_requested') {
        warning(
          'Skipping: only the "pull_request.review_requested" event is supported'
        )
        return
      }

      // Skip accepting commits on PR without exivity-bot review request
      if (!includesBotRequest(eventData)) {
        warning('Skipping: exivity-bot not requested for review')
        return
      }

      // We need to copy sha to correct commit if we received a pull_request
      // event, because it uses PR merge branch instead of PR branch
      // https://docs.github.com/en/actions/reference/events-that-trigger-workflows#pull_request
      sha = eventData['pull_request']['head']['sha']
    }

    // Skip accepting commits on release branches
    if (releaseBranches.includes(ref)) {
      warning(`Skipping: release branch "${ref}" is ignored`)
      return
    }

    const pr = await getPR(octokit, component, ref)
    const pull_request = pr ? `${pr.number}` : undefined
    const issue = detectIssueKey(ref)

    // Print parameters
    table('Ref', ref)
    table('Sha', sha)
    table('Pull request', pull_request || 'None')
    table('Jira issue', issue || 'None')

    // Debug
    startGroup('Debug')
    info(JSON.stringify({ eventData, ref, sha, pr }, undefined, 2))
    endGroup()

    // Skip accepting commits on non-develop branches without PR
    if (!developBranches.includes(ref) && !pull_request) {
      warning('Skipping: non-develop branch without pull request')
      return
    }

    if (eventName === 'pull_request') {
      // We need to check if required workflow has finished
      info('Checking if workflow constraint is satisfied...')

      if (!(await isWorkflowDependencyDone(octokit, ghToken, sha, component))) {
        warning(`Skipping: workflow constraint not satisfied`)
        return
      }
    }

    if (isEvent(eventName, 'workflow_run', eventData)) {
      // We need to check if conclusion was successful
      if (eventData['workflow_run']['conclusion'] !== 'success') {
        warning(`Skipping: workflow constraint not satisfied`)
        return
      }

      // Skip accepting commits on PR without exivity-bot review request
      if (!isBotReviewRequested(pr)) {
        warning('Skipping: exivity-bot not requested for review')
        return
      }
    }

    // If we're on a development branch, scrub component and sha from dispatch
    if (developBranches.includes(ref)) {
      info('On a development branch, dispatching plain run')
      await dispatch({
        octokit,
        scaffoldWorkflowId,
        scaffoldBranch: defaultScaffoldBranch,
        dryRun,
      })
    } else {
      await dispatch({
        octokit,
        scaffoldWorkflowId,
        scaffoldBranch,
        component,
        sha,
        pull_request,
        issue,
        dryRun,
      })
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
