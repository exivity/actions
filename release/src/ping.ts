import { getOctokit } from '@actions/github'
import { info } from 'console'
import { dispatchWorkflow } from '../../lib/github'

const prepareWorkflowId = 'prepare-on-demand.yml'

export async function ping({
  octokit,
  dryRun,
  releaserRepo,
}: {
  octokit: ReturnType<typeof getOctokit>
  dryRun: boolean
  releaserRepo: string
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
    repo: releaserRepo,
    ref: 'main',
    workflow_id: prepareWorkflowId,
  })
}
