import { warning } from '@actions/core'
import { RunParams } from '.'
import { getPR, getShaFromRef } from '../../lib/github'
import { isBotReviewRequested } from './checks'
import { dispatch } from './dispatch'

// id of exivity bot
export const EXIVITY_BOT = 53756225

export async function runBotReview({
  octokit,
  component,
  ref,
  scaffoldBranch,
  scaffoldWorkflowId,
  issue,
}: RunParams) {
  // Check if we should skip this
  if (!(await isBotReviewRequested())) {
    warning('Skipping: exivity-bot not requested for review')
    return
  }

  // Get sha of the most recent commit
  const sha = await getShaFromRef({
    octokit,
    component,
    ref,
  })

  // Get PR
  const pull_request = await getPR(octokit, component, ref)

  await dispatch({
    octokit,
    scaffoldWorkflowId,
    scaffoldBranch,
    issue,
    component,
    sha,
    pull_request: `${pull_request.number}`,
  })
}
