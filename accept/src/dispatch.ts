import { info } from '@actions/core'
import { getOctokit } from '@actions/github'

type DispatchParams = {
  octokit: ReturnType<typeof getOctokit>
  scaffoldWorkflowId: number
  scaffoldBranch: string
  component?: string
  sha?: string
  pull_request?: number
  issue?: string
  dryRun?: boolean
}

export async function dispatch({
  octokit,
  scaffoldWorkflowId,
  scaffoldBranch,
  component,
  sha,
  pull_request,
  issue,
  dryRun = false,
}: DispatchParams) {
  const inputs = {
    ...(component ? { custom_component_name: component } : {}),
    ...(sha ? { custom_component_sha: sha } : {}),
    ...(issue ? { issue } : {}),
    ...(pull_request ? { pull_request: pull_request.toString(10) } : {}),
    dry_run: dryRun ? '1' : '0',
  }

  info(`Trigger scaffold build on "${scaffoldBranch}" branch`)
  info(`Inputs: ${JSON.stringify(inputs)}`)

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
