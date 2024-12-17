import * as yaml from 'yaml'
import * as fs from 'fs'

import { formatRepoList } from '../utils'
import { FileData, RepoData } from '../github-api'

function getActionFile(repo: string, file: FileData): any {
  if (!file.content) {
    return null
  }

  let data
  try {
    data = yaml.parse(file.content)
  } catch {
    console.error(`Error parsing ${file.path} as yaml in repo ${repo}`)
    return null
  }

  return data
}

function getActionsUsed(repo: string, file: FileData): string[] {
  const data = getActionFile(repo, file)
  if (!data) {
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

export async function actionsStandardsAdherence(repos: RepoData[]) {
  let reportContent = `# Actions Standards Adherence - ${new Date().toISOString()}\n\n`

  const standardsFailed = new Map<string, RepoData[]>()
  const equalsRegex = /matrix\.os *==/g

  for (const repo of repos) {
    for (const data of (repo.workflowFiles ?? []).map((file) =>
      getActionFile(repo.name, file),
    )) {
      if (!data || !data.jobs) {
        continue
      }

      for (const job of Object.values<any>(data.jobs)) {
        if (Array.isArray(job.steps)) {
          for (const step of job.steps) {
            if (!step.if || typeof step.if !== 'string') {
              continue
            }

            const standard =
              'Matrix OS should be checked with startsWith, not =='
            if (equalsRegex.test(step.if)) {
              if (!standardsFailed.has(standard)) {
                standardsFailed.set(standard, [])
              }

              if (!standardsFailed.get(standard)!.includes(repo)) {
                standardsFailed.get(standard)!.push(repo)
              }
            }
          }
        }
      }
    }
  }

  for (const [standard, repos] of standardsFailed) {
    reportContent += formatRepoList(standard, repos, true)
  }

  await fs.promises.writeFile('exivity-actions.md', reportContent)
  console.log(`Exivity actions standards report generated`)
}
