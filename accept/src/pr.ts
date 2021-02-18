import { warning } from '@actions/core'
import { getOctokit } from '@actions/github'
import { RunParams } from '.'
import { dispatch } from './dispatch'

async function hasPR(
  octokit: ReturnType<typeof getOctokit>,
  branch: string,
  repo: string
): Promise<boolean> {
  const { data: pulls } = await octokit.pulls.list({
    owner: 'exivity',
    repo,
    head: `exivity:${branch}`,
  })

  return pulls.some((p: any) => !p.draft)
}

export async function runPr({
  octokit,
  component,
  ref,
  scaffoldBranch,
  scaffoldWorkflowId,
  dryRun,
  issue,
}: RunParams) {
  // No PR found, skip
  if (!(await hasPR(octokit, ref, component))) {
    warning(`Skipping: no non-draft PR for branch "${ref}"`)
    return
  }

  await dispatch({
    octokit,
    scaffoldWorkflowId,
    scaffoldBranch,
    dryRun,
    issue,
    component,
  })
}
