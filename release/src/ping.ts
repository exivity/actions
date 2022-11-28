import { info } from 'console'
import { dispatchWorkflow, getRepository } from '../../lib/github'
import { isDryRun, getReleaseRepo, getOctoKitClient } from './common/inputs'

const prepareWorkflowId = 'prepare-on-demand.yml'

export async function ping() {
  const repo = getReleaseRepo()
  const ctx = getRepository()

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
    inputs: {
      'pinged-by': ctx.repo,
    },
  })
}
