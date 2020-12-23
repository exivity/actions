import { getInput, info, setFailed, warning } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getPR, getShaFromBranch } from '../../lib/github'

// id for build.yaml, obtain with GET https://api.github.com/repos/exivity/scaffold/actions/workflows
const workflowId = 514379

// id of exivity bot
const EXIVITY_BOT = 53756225

function detectIssueKey(input: string) {
  const match = input.match(/([A-Z0-9]{1,10}-\d+)/)

  return match !== null && match.length > 0 ? match[0] : undefined
}

async function run() {
  try {
    // Determine default branch
    const branch =
      process.env['GITHUB_HEAD_REF'] || process.env['GITHUB_REF'].slice(11)
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
    const issue = detectIssueKey(branch)
    if (issue) {
      info(`Detected issue key ${issue}.`)
    }

    // Initialize GH client
    const octokit = getOctokit(ghToken)
    const [owner, component] = process.env['GITHUB_REPOSITORY'].split('/')

    console.log(`Got branch ${branch}`)
    console.log(`Got GITHUB_SHA ${process.env.GITHUB_SHA}`)
    console.log(
      `Got SHA from branch ` +
        (await getShaFromBranch({
          ghToken,
          component,
          branch,
        }))
    )

    // Get PR
    const pull_request = await getPR(octokit, component, branch)

    // No PR found, skip
    if (
      !pull_request.requested_reviewers?.some(
        (reviewer: any) => reviewer.id == EXIVITY_BOT
      )
    ) {
      warning(
        `Skipping scaffold build, because exivity-bot hasn't been called upon to review ${
          pull_request.number ? `#${pull_request.number}` : 'a PR'
        } in branch "${branch}".`
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
          pull_request: `${pull_request.number}`,
        },
      }
    )
  } catch (error) {
    setFailed(error.message)
  }
}

run()
