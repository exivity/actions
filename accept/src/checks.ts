import { info } from '@actions/core'
import { getOctokit } from '@actions/github'
import { Endpoints } from '@octokit/types'
import { existsSync } from 'checkout/src/fs-helper'
import * as gitSourceProvider from 'checkout/src/git-source-provider'
import * as inputHelper from 'checkout/src/input-helper'
import { readFileSync } from 'fs'
import yaml from 'js-yaml'
import { join } from 'path'
import {
  getEventData,
  getWorkflowName,
  getWorkspacePath,
} from '../../lib/github'

// The id of user exivity-bot
export const EXIVITY_BOT = 53756225

export async function isWorkflowDependencyDone(
  octokit: ReturnType<typeof getOctokit>,
  token: string,
  sha: string,
  repo: string
) {
  info('Checking out repository to get workflow contents...')

  // Need to 'fake' the token, it defaults to ${{ github.token }}
  // see https://github.com/actions/checkout/blob/main/action.yml
  process.env['INPUT_TOKEN'] = token
  const sourceSettings = inputHelper.getInputs()
  await gitSourceProvider.getSource(sourceSettings)

  const workflowName = getWorkflowName()
  const workspacePath = getWorkspacePath()
  const workflowPath = join(
    workspacePath,
    '.github',
    'workflows',
    `${workflowName}.yml`
  )

  if (!existsSync(workflowPath)) {
    throw new Error(`Workflow file not found at "${workflowPath}"`)
  }

  info(`Workflow file found at "${workflowPath}"`)

  const workflow = yaml.load(readFileSync(workflowPath, 'utf8')) as {
    on?: {
      workflow_run?: {
        workflows?: string[]
      }
    }
  }
  const needsWorkflows = workflow.on?.workflow_run?.workflows || []

  info(
    `on.workflow_run.workflows resolves to "${JSON.stringify(needsWorkflows)}"`
  )

  if (needsWorkflows.length !== 1) {
    throw new Error('Workflow dependencies must have length 1')
  }

  const needsWorkflow = needsWorkflows[0]

  if (!(await isCheckDone(octokit, sha, repo, needsWorkflow))) {
    info(`Workflow "${needsWorkflow}" has not completed`)
    return false
  }

  info(`Workflow "${needsWorkflow}" has completed`)
  return true
}

// Checks if all check runs connected to this ref have completed successfully
export async function isCheckDone(
  octokit: ReturnType<typeof getOctokit>,
  ref: string,
  repo: string,
  checkName: string
): Promise<boolean> {
  const checkResult = await octokit.checks.listForRef({
    owner: 'exivity',
    repo,
    ref,
    check_name: checkName,
  })

  if (checkResult.data.check_runs.length === 0) {
    info('No check runs found')
    return false
  }

  return checkResult.data.check_runs.every(
    (check) => check.status === 'completed' && check.conclusion === 'success'
  )
}

export async function getCheckName() {
  const eventData = (await getEventData()) as {
    check_run?: { name: string }
  }

  return eventData.check_run?.name
}

// Checks if the branch that had the event triggering this action is ready for
// scaffold to run or that we need to wait for a next event.
export function isBotReviewRequested(
  pr: Endpoints['GET /repos/{owner}/{repo}/pulls']['response']['data'][number]
) {
  return (
    pr.requested_reviewers?.some((reviewer) => reviewer?.id === EXIVITY_BOT) ??
    false
  )
}
