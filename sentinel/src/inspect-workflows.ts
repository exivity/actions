import * as yaml from 'yaml'
import * as fs from 'fs'
import * as path from 'path'
import { getOctoKitClient } from '../../release/src/common/inputs'
import { getInput } from '@actions/core'

interface WorkflowData {
  osTypes: Set<string>
  actionsUsed: Set<string>
}

async function getRepos() {
  const octokit = getOctoKitClient()

  const repos: any[] = []
  for await (const response of octokit.paginate.iterator(
    octokit.rest.repos.listForOrg,
    {
      org: 'exivity',
      type: 'all',
      per_page: 100,
    },
  )) {
    response.data.forEach((item) => repos.push(item))
  }
  return repos
}

async function getWorkflowFiles(repoName: string) {
  const octokit = getOctoKitClient()
  try {
    const response = await octokit.rest.repos.getContent({
      owner: 'exivity',
      repo: repoName,
      path: '.github/workflows',
    })

    if (Array.isArray(response.data)) {
      return response.data.filter((item) => item.type === 'file')
    }
  } catch {
    // Repository might not have a workflows directory
  }
  return []
}

async function getFileContent(owner: string, repo: string, filePath: string) {
  const octokit = getOctoKitClient()

  const response = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: filePath,
  })

  if ('content' in response.data) {
    return Buffer.from(response.data.content, 'base64').toString('utf8')
  }
  return null
}

function extractData(yamlContent: string): WorkflowData {
  const data = yaml.parse(yamlContent)
  const osTypes = new Set<string>()
  const actionsUsed = new Set<string>()

  if (data && data.jobs) {
    for (const job of Object.values<any>(data.jobs)) {
      // Extract OS types
      if (job['runs-on']) {
        if (Array.isArray(job['runs-on'])) {
          job['runs-on'].forEach((os: string) => osTypes.add(os))
        } else {
          osTypes.add(job['runs-on'])
        }
      }

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

  return { osTypes: osTypes, actionsUsed }
}

export async function main() {
  console.log('Starting analysis...')
  const repos = await getRepos()
  console.log(`Found ${repos.length} repositories.`)

  const osUsageMap = new Map<string, Set<string>>()
  const actionUsageMap = new Map<string, Set<string>>()

  for (const repo of repos) {
    const repoName = repo.name
    console.log(`Analyzing repository: ${repoName}`)

    const workflowFiles = await getWorkflowFiles(repoName)

    for (const file of workflowFiles) {
      try {
        const content = await getFileContent('exivity', repoName, file.path)
        if (content) {
          const { osTypes, actionsUsed } = extractData(content)

          // Map OS types to repositories
          for (const os of osTypes) {
            if (!osUsageMap.has(os)) {
              osUsageMap.set(os, new Set())
            }
            osUsageMap.get(os)!.add(repoName)
          }

          // Map actions to repositories
          for (const action of actionsUsed) {
            if (!actionUsageMap.has(action)) {
              actionUsageMap.set(action, new Set())
            }
            actionUsageMap.get(action)!.add(repoName)
          }
        }
      } catch (error) {
        console.error(`Error analyzing ${repoName}/${file.path}: ${error}`)
      }
    }
  }

  // Get the report file path from input or use default
  const reportFilePath = getInput('report-file')
  const reportPath = path.join(process.cwd(), reportFilePath)

  let reportContent = `# Workflow Analysis Report - ${new Date().toISOString()}\n\n`

  // OS Usage Section
  reportContent += `## Operating Systems Used\n\n`
  for (const [os, repos] of osUsageMap.entries()) {
    reportContent += `### ${os}\n\n`

    const repoList = Array.from(repos)
    if (repoList.length > 3) {
      reportContent += `<details><summary>Show ${repoList.length} repositories</summary>\n\n`
      repoList.forEach((repoName) => {
        reportContent += `- ${repoName}\n`
      })
      reportContent += `\n</details>\n\n`
    } else {
      repoList.forEach((repoName) => {
        reportContent += `- ${repoName}\n`
      })
      reportContent += `\n`
    }
  }

  // Actions Usage Section
  reportContent += `## Actions Used\n\n`
  for (const [action, repos] of actionUsageMap.entries()) {
    reportContent += `### ${action}\n\n`

    const repoList = Array.from(repos)
    if (repoList.length > 3) {
      reportContent += `<details><summary>Show ${repoList.length} repositories</summary>\n\n`
      repoList.forEach((repoName) => {
        reportContent += `- ${repoName}\n`
      })
      reportContent += `\n</details>\n\n`
    } else {
      repoList.forEach((repoName) => {
        reportContent += `- ${repoName}\n`
      })
      reportContent += `\n`
    }
  }

  // Write the report to the specified file
  await fs.promises.writeFile(reportPath, reportContent)

  console.log(`Report generated at ${reportPath}`)
}
