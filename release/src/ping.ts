import { getOctokit } from '@actions/github'
import { info } from 'console'
import { dispatchWorkflow } from '../../lib/github'

const prepareWorkflowId = 'prepare.yml'

const defaultExivityRepoBranch = 'main'

export async function ping({
  octokit,
  dryRun,
}: {
  octokit: ReturnType<typeof getOctokit>
  dryRun: boolean
}) {
  if (dryRun) {
    info(
      `Would have dispatched workflow ${prepareWorkflowId} of exivity/exivity#main`
    )
    return
  }

  return dispatchWorkflow({
    octokit,
    owner: 'exivity',
    repo: 'exivity',
    ref: defaultExivityRepoBranch,
    workflow_id: prepareWorkflowId,
  })
}
