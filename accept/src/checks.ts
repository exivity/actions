import { getOctokit } from '@actions/github'
import { getEventData } from '../../lib/github'
import { EXIVITY_BOT } from './botReview'

interface IDObject {
  id: number
}

// Checks if all check runs connected to this ref have completed successfully
export async function isCheckDone(
  octokit: ReturnType<typeof getOctokit>,
  ref: string,
  repo: string,
  checkName: string
): Promise<boolean> {
  const checkResult = await octokit.checks.listForRef({
    owner: 'exivity',
    repo,
    ref,
    check_name: checkName,
  })

  return checkResult.data.check_runs?.every(
    (check) => check.status === 'completed' && check.conclusion === 'success'
  )
}

export async function getCheckName() {
  const eventData = (await getEventData()) as {
    check_run?: { name: string }
  }

  return eventData.check_run?.name
}

// Checks if the branch that had the event triggering this action is ready for scaffold to run,
// or that we need to wait for a next event.
export async function isBotReviewRequested(): Promise<boolean> {
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
