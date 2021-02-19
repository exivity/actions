import { getOctokit } from '@actions/github'
import { Endpoints } from '@octokit/types'
import { getEventData } from '../../lib/github'

// id of exivity bot
export const EXIVITY_BOT = 53756225

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

// Checks if the branch that had the event triggering this action is ready for
// scaffold to run or that we need to wait for a next event.
export function isBotReviewRequested(
  pr: Endpoints['GET /repos/{owner}/{repo}/pulls']['response']['data'][number]
) {
  return (
    pr.requested_reviewers?.some((reviewer) => reviewer?.id === EXIVITY_BOT) ??
    false
  )
}
