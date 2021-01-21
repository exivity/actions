import { getOctokit } from '@actions/github'
import { getEventData } from '../../lib/event'
import { EXIVITY_BOT } from './botReview'

interface IDObject {
  id: number
}

// Checks if all check runs connected to this ref have completed successfully
export async function isCheckDone(
  octokit: ReturnType<typeof getOctokit>,
  ref: string,
  repo: string,
  toCheck: string
): Promise<boolean> {
  const checkResult = await octokit.checks.listForRef({
    owner: 'exivity',
    repo,
    ref,
    check_name: toCheck,
  })

  return checkResult.data.check_runs?.every(
    (check) => check.status === 'completed' && check.conclusion === 'success'
  )
}

// Checks if the branch that had the event triggering this action is ready for scaffold to run,
// or that we need to wait for a next event.
export async function checkIfReady(): Promise<boolean> {
  const event = process.env['GITHUB_EVENT_NAME']

  const eventData = await getEventData()

  if (
    event === 'check_run' &&
    eventData.check_run?.check_suite.pull_requests.requested_reviewers.some(
      (reviewer: IDObject) => reviewer.id === EXIVITY_BOT
    )
  ) {
    return true
  }

  if (event === 'pull_request') {
    let reviewers = eventData.requested_reviewer

    if (!Array.isArray(reviewers)) {
      reviewers = [reviewers]
    }

    if (reviewers.some((reviewer: IDObject) => reviewer.id === EXIVITY_BOT)) {
      return true
    }
  }

  return false
}
