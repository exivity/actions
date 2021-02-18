import { info } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getSha } from '../../lib/github'

type DispatchParams = {
  octokit: ReturnType<typeof getOctokit>
  scaffoldWorkflowId: number
  scaffoldBranch: string
  dryRun?: boolean
  issue?: string
  component: string
  sha?: string
  pull_request?: string
}

export async function dispatch({
  octokit,
  scaffoldWorkflowId,
  scaffoldBranch,
  dryRun = false,
  issue,
  component,
  sha,
  pull_request,
}: DispatchParams) {
  const dry_run = dryRun ? '1' : '0'
  const custom_component_name = component
  const custom_component_sha = sha || getSha()

  const inputs = {
    dry_run,
    custom_component_name,
    custom_component_sha,
    ...(issue ? { issue } : {}),
    ...(pull_request ? { pull_request } : {}),
  }

  info(`Calling GitHub API to trigger scaffold@${scaffoldBranch} build.`)
  info(`Inputs: ${JSON.stringify(inputs)}.`)

  // Create workflow-dispatch event
  // See https://docs.github.com/en/free-pro-team@latest/rest/reference/actions#create-a-workflow-dispatch-event
  await octokit.request(
    'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
    {
      owner: 'exivity',
      repo: 'scaffold',
      workflow_id: scaffoldWorkflowId,
      ref: scaffoldBranch,
      inputs,
    }
  )
}
