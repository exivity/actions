import { getOctokit } from '@actions/github'

// id for exivity/exivity/.github/workflows/prepare.yaml
// obtain with GET https://api.github.com/repos/exivity/exivity/actions/workflows
const prepareWorkflowId = 25900217

export function ping(octokit: ReturnType<typeof getOctokit>) {
  // Inputs
}
