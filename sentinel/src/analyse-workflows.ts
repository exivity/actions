import * as yaml from 'yaml'
import * as fs from 'fs'
import * as path from 'path'
import { getOctoKitClient } from '../../release/src/common/inputs'
import { getInput } from '@actions/core'
import {
  getFileContent,
  getRepos,
  getWorkflowFiles,
  runWithConcurrencyLimit,
} from './utils'

interface WorkflowData {
  osTypes: Set<string>
  actionsUsed: Set<string>
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

export async function analyseWorkflows() {
  console.log('Starting analysis...')
  const repos = await getRepos()
  console.log(`Found ${repos.length} repositories.`)

  const osUsageMap = new Map<string, Set<string>>()
  const actionUsageMap = new Map<string, Set<string>>()

  // Create tasks for repositories
  const repoTasks = repos.map((repo) => async () => {
    const repoName = repo.name
    console.log(`Analyzing repository: ${repoName}`)

    const workflowFiles = await getWorkflowFiles(repoName)

    // Create tasks for workflow files
    const fileTasks = workflowFiles.map((file) => async () => {
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
    })

    // Limit concurrency for workflow files
    await runWithConcurrencyLimit(90, fileTasks)
  })

  // Limit concurrency for repositories
  await runWithConcurrencyLimit(90, repoTasks)

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

  // Update report with PR links, removing links to closed PRs
  const prLinks = await getUpdatedPrLinks()

  if (prLinks.length > 0) {
    reportContent += `## Open Pull Requests\n\n`
    prLinks.forEach((link) => {
      reportContent += `${link}\n`
    })
    reportContent += `\n`
  }

  // Write the report to the specified file
  await fs.promises.writeFile(reportPath, reportContent)

  console.log(`Report generated at ${reportPath}`)
}

// Helper function to check PR statuses and update links
async function getUpdatedPrLinks() {
  const octokit = getOctoKitClient()
  const reportFilePath = getInput('report-file')
  const reportPath = path.join(process.cwd(), reportFilePath)
  const prLinks: string[] = []

  if (fs.existsSync(reportPath)) {
    const reportContent = await fs.promises.readFile(reportPath, 'utf8')
    const linkRegex = /^- \[.*\]\((.*)\)$/gm
    let match
    while ((match = linkRegex.exec(reportContent)) !== null) {
      const prUrl = match[1]
      const prMatch = prUrl.match(
        /https:\/\/github\.com\/exivity\/([^/]+)\/pull\/(\d+)/,
      )
      if (prMatch) {
        const repoName = prMatch[1]
        const prNumber = parseInt(prMatch[2], 10)
        const { data: prData } = await octokit.rest.pulls.get({
          owner: 'exivity',
          repo: repoName,
          pull_number: prNumber,
        })
        if (prData.state === 'open') {
          prLinks.push(`- [${repoName}](${prUrl})`)
        }
      }
    }
  }

  return prLinks
}
