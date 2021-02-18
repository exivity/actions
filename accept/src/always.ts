import { RunParams } from '.'
import { dispatch } from './dispatch'

export async function runAlways({
  octokit,
  component,
  scaffoldBranch,
  scaffoldWorkflowId,
  dryRun,
  issue,
}: RunParams) {
  await dispatch({
    octokit,
    scaffoldWorkflowId,
    scaffoldBranch,
    dryRun,
    issue,
    component,
  })
}
