import { getInput, info, warning } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getPR, getShaFromBranch } from '../../lib/github'
import { detectIssueKey } from './detectIssueKey'
import { checkIfReady } from './checks'

// id of exivity bot
export const EXIVITY_BOT = 53756225

export async function runBotReview(workflowId: number, ghToken: string) {
  // Determine default branch
  const branch =
    process.env['GITHUB_HEAD_REF'] || process.env['GITHUB_REF'].slice(11)
  const defaultScaffoldBranch = 'develop'

  // Skip accepting commits on master
  if (branch === 'master') {
    info('Skipping scaffold build for master branch builds.')
    return
  }

  // Inputs
  const scaffoldBranch = getInput('scaffold-branch') || defaultScaffoldBranch

  // Initialize GH client
  const octokit = getOctokit(ghToken)
  const component = process.env['GITHUB_REPOSITORY'].split('/')[1]

  // Check if we should skip this
  if (!(await checkIfReady())) {
    info(
      'Skipping scaffold build because not all requirements for running it have been met'
    )
    return
  }

  // Get sha of the most recent commit
  const sha = await getShaFromBranch({
    ghToken,
    component,
    branch,
  })

  // Get PR
  const pull_request = await getPR(octokit, component, branch)

  // No PR found, skip
  if (
    !pull_request?.requested_reviewers?.some(
      (reviewer: any) => reviewer.id == EXIVITY_BOT
    )
  ) {
    warning(
      `Skipping scaffold build, because exivity-bot hasn't been called upon to review ${
        pull_request.number ? `#${pull_request.number}` : 'a PR'
      } in branch "${branch}".`
    )
    return
  }

  // Detect issue key in branch name
  const issue = detectIssueKey(branch)
  if (issue) {
    info(`Detected issue key ${issue}.`)
  }

  info(`Calling GitHub API to trigger scaffold@${scaffoldBranch} build.`)

  // Create workflow-dispatch event
  // See https://docs.github.com/en/free-pro-team@latest/rest/reference/actions#create-a-workflow-dispatch-event
  await octokit.request(
    'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
    {
      owner: 'exivity',
      repo: 'scaffold',
      workflow_id: workflowId,
      ref: scaffoldBranch,
      inputs: {
        issue,
        custom_component_name: component,
        custom_component_sha: sha,
        pull_request: `${pull_request.number}`,
      },
    }
  )
}
