import { getInput, info, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'

// id for build.yaml, obtain with GET https://api.github.com/repos/exivity/scaffold/actions/workflows
const workflowId = 514379

function detectIssueKey(input: string) {
  const match = input.match(/([A-Z0-9]{1,10}-\d+)/)

  return match !== null && match.length > 0 ? match[0] : undefined
}

async function run() {
  try {
    // Determine default branch
    const ref = process.env['GITHUB_REF']
    let defaultBranch: string
    switch (ref) {
      case 'refs/heads/master':
        // Skip accepting commits on master
        return

      default:
        defaultBranch = 'develop'
        break
    }

    // Input
    const branch = getInput('scaffold-branch') || defaultBranch
    const ghToken = getInput('gh-token') || process.env['GITHUB_TOKEN']

    // Assertions
    if (!ghToken) {
      throw new Error('A required argument is missing')
    }

    // Detect issue key in branch name
    const issue = detectIssueKey(ref)

    // Create workflow-dispatch event
    // See https://docs.github.com/en/free-pro-team@latest/rest/reference/actions#create-a-workflow-dispatch-event
    const octokit = getOctokit(ghToken)
    const [owner, component] = process.env['GITHUB_REPOSITORY'].split('/')

    info(
      `Calling GitHub API to trigger new scaffold build (branch: "${branch}")`
    )

    await octokit.request(
      'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
      {
        owner: 'exivity',
        repo: 'scaffold',
        workflow_id: workflowId,
        ref: branch,
        inputs: {
          issue,
          custom_component_name: component,
          custom_component_sha: process.env['GITHUB_SHA'],
        },
      }
    )
  } catch (error) {
    setFailed(error.message)
  }
}

run()
