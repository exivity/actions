import { debug, getInput, info, setFailed, warning } from '@actions/core'
import { getOctokit } from '@actions/github'
import { EmitterWebhookEvent } from '@octokit/webhooks'
import { EmitterWebhookEventName } from '@octokit/webhooks/dist-types/types'
import * as gitSourceProvider from 'checkout/src/git-source-provider'
import * as inputHelper from 'checkout/src/input-helper'
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
import { isBotReviewRequested } from './checks'
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

const skipBranches = ['master', 'main']

function detectIssueKey(input: string) {
  const match = input.match(/([A-Z0-9]{1,10}-\d+)/)

  return match !== null && match.length > 0 ? match[0] : undefined
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

    info(`Received '${eventName}' event`)

    if (!supportedEvents.includes(eventName)) {
      throw new Error(`Event name "${eventName}" not supported`)
    }

    // We need to copy ref and sha to correct commit if we received a
    // workflow_run event, because it uses default branch head commit by default
    // https://docs.github.com/en/actions/reference/events-that-trigger-workflows#workflow_run
    if (isEvent(eventName, 'workflow_run', eventData)) {
      ref = eventData['workflow_run']['head_branch']
      sha = eventData['workflow_run']['head_commit']['id']
    }

    // Skip accepting commits on release branches
    if (skipBranches.includes(ref)) {
      warning(`Skipping: release branch "${ref}" is ignored`)
      return
    }

    const pr = await getPR(octokit, component, ref)
    const pull_request = pr ? `${pr.number}` : undefined
    const issue = detectIssueKey(ref)

    // Some debug output
    info(`Ref: ${ref}`)
    info(`Sha: ${sha}`)
    info(pr ? `Pull request: #${pull_request}` : 'No pull request detected')
    info(issue ? `Issue key: ${issue}` : 'No issue detected')

    // Debug
    debug(JSON.stringify({ eventData, ref, sha, pr }, undefined, 2))

    if (pull_request && !isBotReviewRequested(pr)) {
      warning('Skipping: exivity-bot not requested for review')
      return
    }

    if (eventName === 'pull_request') {
      // We need to check if required workflow has finished
      const sourceSettings = inputHelper.getInputs()
      await gitSourceProvider.getSource(sourceSettings)

      // >>>????

      if (true) {
        warning('Skipping: workflow_run.workflows constraint is not satisfied')
        return
      }
    }

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
  } catch (error) {
    setFailed(error.message)
  }
}

run()
