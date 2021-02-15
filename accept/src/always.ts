import { RunParams } from '.'
import { dispatch } from './dispatch'

export async function runAlways({
  octokit,
  component,
  scaffoldBranch,
  scaffoldWorkflowId,
  issue,
}: RunParams) {
  await dispatch({
    octokit,
    scaffoldWorkflowId,
    scaffoldBranch,
    issue,
    component,
  })
}
