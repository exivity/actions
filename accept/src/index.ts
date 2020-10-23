import { getInput, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'

// id for build.yaml, obtain with GET https://api.github.com/repos/exivity/scaffold/actions/workflows
const workflowId = 514379

async function run() {
  try {
    // Determine default branch
    const ref = process.env['GITHUB_REF']
    let defaultBranch: string
    switch (ref) {
      case 'refs/heads/master':
        // Skip accepting master commits
        return

      case 'refs/heads/develop':
        defaultBranch = 'develop'
        break

      default:
        defaultBranch = 'custom'
        break
    }

    // Input
    const branch = getInput('scaffold-branch') || defaultBranch
    const ghToken = getInput('gh-token') || process.env['GITHUB_TOKEN']

    // Assertions
    if (!ghToken) {
      throw new Error('A required argument is missing')
    }

    const [owner, component] = process.env['GITHUB_REPOSITORY'].split('/')

    // Create workflow-dispatch event
    // See https://docs.github.com/en/free-pro-team@latest/rest/reference/actions#create-a-workflow-dispatch-event
    const octokit = getOctokit(ghToken)

    await octokit.request(
      'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
      {
        owner: 'exivity',
        repo: 'scaffold',
        workflow_id: workflowId,
        ref: branch,
        inputs: {
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
