import { info } from 'console'
import { dispatchWorkflow } from '../../lib/github'
import { isDryRun, getReleaseRepo, getOctoKitClient } from './common/inputs'

const prepareWorkflowId = 'prepare-on-demand.yml'

export async function ping() {
  const repo = getReleaseRepo()

  if (isDryRun()) {
    info(
      `Would have dispatched workflow ${prepareWorkflowId} of exivity/${repo}#main`
    )
    return
  }

  return dispatchWorkflow({
    octokit: getOctoKitClient(),
    owner: 'exivity',
    repo,
    ref: 'main',
    workflow_id: prepareWorkflowId,
  })
}
