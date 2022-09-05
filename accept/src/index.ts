import {
  endGroup,
  getInput,
  getMultilineInput,
  info,
  setFailed,
  startGroup,
  warning,
} from '@actions/core'
import { getOctokit } from '@actions/github'
import minimatch from 'minimatch'
import { getBooleanInput, table } from '../../lib/core'
import {
  getCommit,
  getEventData,
  getEventName,
  getPrFromRef,
  getRef,
  getRepository,
  getSha,
  getToken,
  isDevelopBranch,
  isEvent,
  isReleaseBranch,
  review,
  writeStatus,
} from '../../lib/github'
import { isWorkflowDependencyDone } from './checks'
import { dispatch } from './dispatch'

const supportedEvents = ['push', 'pull_request', 'workflow_run'] as const

// id for exivity/scaffold/.github/workflows/build.yaml
// obtain with GET https://api.github.com/repos/exivity/scaffold/actions/workflows
const scaffoldWorkflowId = 514379

const defaultScaffoldBranch = 'develop'

function detectIssueKey(input: string) {
  const match = input.match(/([A-Z0-9]{1,10}-\d+)/)

  return match !== null && match.length > 0 ? match[0] : undefined
}

async function run() {
  const ghToken = getToken()
  const octokit = getOctokit(ghToken)
  let ref = getRef()
  let sha = getSha()
  const component = getRepository().repo
  const eventName = getEventName(supportedEvents)
  const eventData = getEventData(eventName)
  const scaffoldBranch = getInput('scaffold-branch') || defaultScaffoldBranch
  const filter = getMultilineInput('filter')
  const dryRun = getBooleanInput('dry-run', false)

  table('Event', eventName)

  if (isEvent(eventName, 'workflow_run', eventData)) {
    if (eventData['action'] !== 'completed') {
      warning(
        '[accept] Skipping: only the "workflow_run.completed" event is supported'
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
    // We need to copy sha to correct commit if we received a pull_request
    // event, because it uses PR merge branch instead of PR branch
    // https://docs.github.com/en/actions/reference/events-that-trigger-workflows#pull_request
    ref = eventData['pull_request']['head']['ref']
    sha = eventData['pull_request']['head']['sha']
  }

  const pr = await getPrFromRef({
    octokit,
    owner: 'exivity',
    repo: component,
    ref,
  })
  const pull_request = pr ? pr.number : undefined
  const issue = detectIssueKey(ref)
  const shortSha = sha.substring(0, 7)

  // Print parameters
  table('Ref', `${ref} https://github.com/exivity/${component}/tree/${ref}`)
  table(
    'Sha',
    `${shortSha} https://github.com/exivity/${component}/commit/${sha}`
  )
  table(
    'Pull request',
    pull_request
      ? `${pull_request} https://github.com/exivity/${component}/pull/${pull_request}`
      : 'None'
  )
  table(
    'Jira issue',
    issue ? `${issue} https://exivity.atlassian.net/browse/${issue}` : 'None'
  )

  // Debug
  startGroup('Debug')
  info(JSON.stringify({ eventData, pr }, undefined, 2))
  endGroup()

  // If this is a PR and the filter input is set, obtain commit details and bail
  // if no files match
  if (pull_request && filter.length > 0) {
    const commit = await getCommit({
      octokit,
      owner: 'exivity',
      repo: component,
      ref,
    })
    const someFilesMatch = (commit.files || []).some((file) =>
      filter.some((item) =>
        minimatch(file.filename || file.previous_filename || 'unknown', item)
      )
    )

    if (!someFilesMatch) {
      warning(`[accept] Skipping: no modified files match the filter option`)

      // Auto approve by submitting PR and writing commit status
      await review({
        octokit,
        owner: 'exivity',
        repo: component,
        pull_number: pull_request,
        event: 'APPROVE',
        body: 'Automatically approved because no modified files in this commit match the `filter` parameter of this action.',
      })
      await writeStatus({
        octokit,
        owner: 'exivity',
        repo: component,
        sha,
        state: 'success',
        context: 'scaffold',
        description: 'Acceptance tests skipped',
      })
      return
    }
  }

  if (eventName === 'pull_request') {
    // We need to check if required workflow has finished
    info('Checking if workflow constraint is satisfied...')

    if (!(await isWorkflowDependencyDone(octokit, ghToken, sha, component))) {
      warning(`[accept] Skipping: workflow constraint not satisfied`)
      return
    }
  }

  if (isEvent(eventName, 'workflow_run', eventData)) {
    // We need to check if conclusion was successful
    if (eventData['workflow_run']['conclusion'] !== 'success') {
      warning(`[accept] Skipping: workflow constraint not satisfied`)
      return
    }
  }

  // If we're on a development branch, scrub component and sha from dispatch
  if (isDevelopBranch(ref) || isReleaseBranch(ref)) {
    info(`On a ${ref} branch, dispatching plain run`)
    await dispatch({
      octokit,
      scaffoldWorkflowId,
      scaffoldBranch,
      dryRun,
    })
  } else {
    info(`On a ${ref} branch, dispatching component run`)
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
}

run().catch(setFailed)
