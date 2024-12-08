import * as yaml from 'yaml'
import * as fs from 'fs'

import { RepoData, FileData } from '.'
import { formatRepoList } from '../utils'

function getActionsUsed(repo: string, file: FileData): string[] {
  if (!file.content) {
    return []
  }

  let data
  try {
    data = yaml.parse(file.content)
  } catch {
    console.error(`Error parsing ${file.path} as yaml in repo ${repo}`)
    return []
  }
  let actionsUsed = new Set<string>()

  if (data && data.jobs) {
    for (const job of Object.values<any>(data.jobs)) {
      // Extract actions
      if (Array.isArray(job.steps)) {
        for (const step of job.steps) {
          if (step.uses) {
            actionsUsed.add(step.uses)
          }
        }
      }
    }
  }

  return Array.from(actionsUsed)
}

export async function externalActionsReport(repos: RepoData[]) {
  let reportContent = `# External Actions Report - ${new Date().toISOString()}\n\n`

  const actionsUsed = new Map<string, RepoData[]>()

  for (const repo of repos) {
    const actions = (repo.workflowFiles ?? []).flatMap((file) =>
      getActionsUsed(repo.name, file),
    )
    for (const action of actions) {
      if (action.startsWith('exivity/') || action.startsWith('./')) continue

      if (!actionsUsed.has(action)) {
        actionsUsed.set(action, [])
      }

      if (!actionsUsed.get(action)!.includes(repo)) {
        actionsUsed.get(action)!.push(repo)
      }
    }
  }

  for (const [action, repos] of actionsUsed) {
    reportContent += formatRepoList(action, repos, true)
  }

  await fs.promises.writeFile('external-actions.md', reportContent)
  console.log(`External actions report generated`)
}

export async function exivityActionsReport(repos: RepoData[]) {
  let reportContent = `# Exivity Actions Report - ${new Date().toISOString()}\n\n`

  const actionsUsed = new Map<string, RepoData[]>()

  for (const repo of repos) {
    const actions = (repo.workflowFiles ?? []).flatMap((file) =>
      getActionsUsed(repo.name, file),
    )
    for (const action of actions) {
      if (!action.startsWith('exivity/') && !action.startsWith('./')) continue

      if (!actionsUsed.has(action)) {
        actionsUsed.set(action, [])
      }

      if (!actionsUsed.get(action)!.includes(repo)) {
        actionsUsed.get(action)!.push(repo)
      }
    }
  }

  for (const [action, repos] of actionsUsed) {
    reportContent += formatRepoList(action, repos, true)
  }

  await fs.promises.writeFile('exivity-actions.md', reportContent)
  console.log(`Exivity actions report generated`)
}
