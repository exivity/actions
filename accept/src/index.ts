import { getInput, info, setFailed, warning } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getPR } from '../../lib/github'
import { runAlways } from './always'
import { runBotReview } from './botReview'
import { isCheckDone } from './checks'
import { detectIssueKey } from './detectIssueKey'
import { runPr } from './pr'

export type RunParams = {
  octokit: ReturnType<typeof getOctokit>
  scaffoldWorkflowId: number
  scaffoldBranch: string
  ref: string
  component: string
  issue: string
}

const defaultMode = 'auto'

// id for exivity/scaffold/.github/workflows/build.yaml
// obtain with GET https://api.github.com/repos/exivity/scaffold/actions/workflows
const scaffoldWorkflowId = 514379

const defaultScaffoldBranch = 'develop'

async function run() {
  try {
    let mode = getInput('mode') || defaultMode
    const needsCheck = getInput('needs-check')
    const ghToken = getInput('gh-token') || process.env['GITHUB_TOKEN']
    const octokit = getOctokit(ghToken)
    const ref =
      process.env['GITHUB_HEAD_REF'] || process.env['GITHUB_REF'].slice(11)
    const component = process.env['GITHUB_REPOSITORY'].split('/')[1]
    const eventName = process.env['GITHUB_EVENT_NAME']

    // Assertions
    if (!ghToken) {
      throw new Error('The GitHub token is missing')
    }

    // Skip accepting commits on master
    if (ref === 'master') {
      warning('Skipping: master branch is ignored')
      return
    }
    const scaffoldBranch = getInput('scaffold-branch') || defaultScaffoldBranch

    // Check check
    if (needsCheck) {
      if (!(await isCheckDone(octokit, ref, component, needsCheck))) {
        warning('Skipping: needs-check constraint is not satisfied')
        return
      }
    }

    // Detect issue key in branch name
    const issue = detectIssueKey(ref)
    if (issue) {
      info(`Detected issue key ${issue}.`)
    }

    // Auto mode decision tree
    if (mode === 'auto') {
      switch (eventName) {
        case 'push':
          mode = 'always'
          break

        case 'check_run':
          if (!needsCheck) {
            warning('Skipping: check_run trigger requires needs-check input')
            return ''
          }
          mode = (await getPR(octokit, component, ref))
            ? 'bot-review'
            : 'always'
          break

        case 'pull_request':
          mode = 'bot-review'
          break

        default:
          mode = 'pr'
      }
    }

    const params: RunParams = {
      octokit,
      scaffoldWorkflowId,
      scaffoldBranch,
      component,
      ref,
      issue,
    }

    switch (mode) {
      case 'bot-review':
        await runBotReview(params)
        break
      case 'pr':
        await runPr(params)
        break
      case 'always':
        await runAlways(params)
        break
      default:
        throw new Error('Invalid mode')
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
