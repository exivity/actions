import * as yaml from 'yaml'
import * as fs from 'fs'

import { RepoData, FileData } from '.'
import { formatRepoList } from '../utils'

function getOSUsed(file: FileData): string[] {
  if (!file.content) {
    return []
  }

  const data = yaml.parse(file.content)
  let osTypes = new Set<string>()

  if (data && data.jobs) {
    for (const job of Object.values<any>(data.jobs)) {
      // Extract OS types from runs-on
      if (job['runs-on']) {
        if (Array.isArray(job['runs-on'])) {
          job['runs-on'].forEach((os: string) => {
            if (!os.includes('matrix')) {
              osTypes.add(os)
            }
          })
        } else {
          if (
            typeof job['runs-on'] === 'string' &&
            !job['runs-on'].includes('matrix')
          ) {
            osTypes.add(job['runs-on'])
          }
        }
      }

      // Extract OS types from strategy matrix
      if (
        job['strategy'] &&
        job['strategy']['matrix'] &&
        job['strategy']['matrix']['os']
      ) {
        if (Array.isArray(job.strategy.matrix['os'])) {
          job.strategy.matrix['os'].forEach((os: string) => {
            osTypes.add(os)
          })
        } else {
          if (typeof job.strategy.matrix['os'] === 'string') {
            osTypes.add(job.strategy.matrix['os'])
          }
        }
      }
    }
  }

  return Array.from(osTypes)
}

export async function operatingSystemsReport(repos: RepoData[]) {
  let reportContent = `# Operating Systems Report\n\n`

  const osUsed = new Map<string, RepoData[]>()

  for (const repo of repos) {
    const osTypes = (repo.workflowFiles ?? []).flatMap((file) =>
      getOSUsed(file),
    )
    for (const os of osTypes) {
      if (!osUsed.has(os)) {
        osUsed.set(os, [])
      }
      osUsed.get(os)!.push(repo)
    }
  }

  for (const [os, repos] of osUsed) {
    reportContent += formatRepoList(os, repos, true)
  }

  await fs.promises.writeFile('operating-systems.md', reportContent)
  console.log(`Operating systems report generated`)
}
