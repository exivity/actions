import { getInput, info, warning } from '@actions/core'
import { getOctokit } from '@actions/github'
import { detectIssueKey } from './detectIssueKey'

async function hasPR(
  octokit: ReturnType<typeof getOctokit>,
  branch: string,
  repo: string,
  owner: string
): Promise<boolean> {
  const { data: pulls } = await octokit.pulls.list({
    owner,
    repo,
    head: `exivity:${branch}`,
  })

  return pulls.some((p: any) => !p.draft)
}

export async function runPr(workflowId: number) {
  // Determine default branch
  const ref = process.env['GITHUB_REF']
  const branch = ref.slice(11)
  const defaultScaffoldBranch = 'develop'

  // Skip accepting commits on master
  if (branch === 'master') {
    info('Skipping scaffold build for master branch builds.')
    return
  }

  // Inputs
  const scaffoldBranch = getInput('scaffold-branch') || defaultScaffoldBranch
  const ghToken = getInput('gh-token') || process.env['GITHUB_TOKEN']

  // Assertions
  if (!ghToken) {
    throw new Error('A required argument is missing')
  }

  // Detect issue key in branch name
  const issue = detectIssueKey(ref)
  if (issue) {
    info(`Detected issue key ${issue}.`)
  }

  // Initialize GH client
  const octokit = getOctokit(ghToken)
  const [owner, component] = process.env['GITHUB_REPOSITORY'].split('/')

  // No PR found, skip
  if (!(await hasPR(octokit, branch, component, owner))) {
    warning(
      `Skipping scaffold build, because there is no non-draft PR associated with the current branch "${branch}".`
    )
    return
  }

  info(`Calling GitHub API to trigger scaffold@${scaffoldBranch} build.`)

  // Create workflow-dispatch event
  // See https://docs.github.com/en/free-pro-team@latest/rest/reference/actions#create-a-workflow-dispatch-event
  await octokit.request(
    'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
    {
      owner: 'exivity',
      repo: 'scaffold',
      workflow_id: workflowId,
      ref: scaffoldBranch,
      inputs: {
        issue,
        custom_component_name: component,
        custom_component_sha: process.env['GITHUB_SHA'],
      },
    }
  )
}
