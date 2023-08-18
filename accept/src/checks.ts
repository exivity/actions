import { info } from '@actions/core'
import { getOctokit } from '@actions/github'
import { existsSync } from 'checkout/src/fs-helper'
import * as gitSourceProvider from 'checkout/src/git-source-provider'
import * as inputHelper from 'checkout/src/input-helper'
import { readFileSync } from 'fs'
import yaml from 'js-yaml'
import { join } from 'path'
import { getWorkflowName, getWorkspacePath } from '../../lib/github'

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
  const sourceSettings = await inputHelper.getInputs()
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

  const checks = await getChecks(octokit, sha, repo)
  const satisfied = checks.every((check) => {
    const { name, status, conclusion } = check
    if (
      needsWorkflows.some((workflowName) =>
        workflowNameMatchesCheckName(workflowName, name)
      )
    ) {
      if (status === 'completed' && conclusion === 'success') {
        info(`Check "${name}" is required and completed successfully`)
        return true
      } else {
        info(`Check "${name}" is required but not completed successfully`)
        return false
      }
    } else {
      info(`Check "${name}" is not required`)
      return true
    }
  })

  if (!satisfied) {
    info(`Some workflow constraints are not satisfied`)
    return false
  }

  const allPresent = needsWorkflows.every((workflow) => {
    return checks.some(({ name }) =>
      workflowNameMatchesCheckName(workflow, name)
    )
  })

  if (!allPresent) {
    info(`Unable to find some workflow constraints in available checks`)
    return false
  }

  info(`Workflow constraints satisfied`)
  return true
}

function workflowNameMatchesCheckName(workflowName: string, checkName: string) {
  // Direct hit
  if (workflowName === checkName) {
    return true
  }

  // checkName matches regex `${workflowName} (.+)`
  return new RegExp(`^${workflowName} (.+)$`).test(checkName)
}

// Fetch all checks for ref
export async function getChecks(
  octokit: ReturnType<typeof getOctokit>,
  ref: string,
  repo: string
) {
  return (
    await octokit.rest.checks.listForRef({
      owner: 'exivity',
      repo,
      ref,
    })
  ).data.check_runs
}
