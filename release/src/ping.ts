import { getOctokit } from '@actions/github'
import { dispatchWorkflow } from '../../lib/github'

// id for exivity/exivity/.github/workflows/prepare.yaml
// obtain with GET https://api.github.com/repos/exivity/exivity/actions/workflows
const prepareWorkflowId = 25900217

const defaultExivityRepoBranch = 'main'

export async function ping(octokit: ReturnType<typeof getOctokit>) {
  return dispatchWorkflow({
    octokit,
    owner: 'exivity',
    repo: 'exivity',
    ref: defaultExivityRepoBranch,
    workflow_id: prepareWorkflowId,
  })
}
