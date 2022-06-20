import { getOctokit } from '@actions/github'
import { dispatchWorkflow } from '../../lib/github'

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

  await dispatchWorkflow({
    octokit,
    owner: 'exivity',
    repo: 'scaffold',
    workflow_id: scaffoldWorkflowId,
    ref: scaffoldBranch,
    inputs,
  })
}
