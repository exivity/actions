import * as fs from 'fs'
import * as path from 'path'
import { getOctoKitClient } from '../../release/src/common/inputs'
import { getInput, info } from '@actions/core'

import {
  getFileContent,
  getRepos,
  getFiles,
  runWithConcurrencyLimit,
} from './utils'
import { savePrLinks } from './pr-links'

async function updateRepoWorkflows(
  repoName: string,
  workflowFiles: any[],
  searchPattern: string,
  replacePattern: string,
) {
  const octokit = getOctoKitClient()
  const branchName = 'chore/dev-ops-maintenance'
  const commitMessage = 'chore(devOps): automated maintenance'

  // Get default branch
  const { data: repoData } = await octokit.rest.repos.get({
    owner: 'exivity',
    repo: repoName,
  })
  const defaultBranch = repoData.default_branch

  // Create a new branch from default branch
  const { data: refData } = await octokit.rest.git.getRef({
    owner: 'exivity',
    repo: repoName,
    ref: `heads/${defaultBranch}`,
  })

  await octokit.rest.git.createRef({
    owner: 'exivity',
    repo: repoName,
    ref: `refs/heads/${branchName}`,
    sha: refData.object.sha,
  })

  let filesChanged = 0

  // Create tasks for workflow files
  const fileTasks = workflowFiles.map((file) => async () => {
    const content = await getFileContent('exivity', repoName, file.path)
    if (content && content.includes(searchPattern)) {
      const updatedContent = content.replace(
        new RegExp(searchPattern, 'g'),
        replacePattern,
      )
      if (updatedContent !== content) {
        const encodedContent = Buffer.from(updatedContent).toString('base64')
        await octokit.rest.repos.createOrUpdateFileContents({
          owner: 'exivity',
          repo: repoName,
          path: file.path,
          message: commitMessage,
          content: encodedContent,
          sha: file.sha,
          branch: branchName,
        })
        filesChanged++
      }
    }
  })

  // Limit concurrency for workflow files
  await runWithConcurrencyLimit(90, fileTasks)

  if (filesChanged > 0) {
    // Create a pull request
    const { data: prData } = await octokit.rest.pulls.create({
      owner: 'exivity',
      repo: repoName,
      title: 'chore(devOps): automated maintenance',
      head: branchName,
      base: defaultBranch,
      body: `This PR replaces occurrences of "${searchPattern}" with "${replacePattern}" in workflow files.`,
    })
    return prData.html_url
  } else {
    // Delete branch if no changes were made
    await octokit.rest.git.deleteRef({
      owner: 'exivity',
      repo: repoName,
      ref: `heads/${branchName}`,
    })
    return null
  }
}

export async function updateWorkflows() {
  const searchPattern = getInput('search-pattern')
  const replacePattern = getInput('replace-pattern')

  if (!searchPattern || !replacePattern) {
    throw new Error(
      'Both search-pattern and replace-pattern inputs must be provided in update mode',
    )
  }

  info(`Replacing "${searchPattern}" with "${replacePattern}" in workflows`)

  const repos = await getRepos()
  const prLinks: string[] = []

  // Create tasks for repositories
  const repoTasks = repos.map((repo) => async () => {
    try {
      const repoName = repo.name
      info(`Processing repository: ${repoName}`)

      const workflowFiles = await getFiles(repoName, '.github/workflows')

      const prLink = await updateRepoWorkflows(
        repoName,
        workflowFiles,
        searchPattern,
        replacePattern,
      )
      if (prLink) {
        prLinks.push(`- [${repoName}](${prLink})`)
      }
    } catch (error) {
      info(`Error processing repository ${repo.name}: ${error}`)
    }
  })

  // Limit concurrency for repositories
  await runWithConcurrencyLimit(90, repoTasks)

  // Update the report file with PR links
  const reportFilePath = getInput('report-file')
  const reportPath = path.join(process.cwd(), reportFilePath)

  let reportContent = ''
  if (fs.existsSync(reportPath)) {
    reportContent = await fs.promises.readFile(reportPath, 'utf8')
  } else {
    reportContent = `# Workflow Report - ${new Date().toISOString()}\n\n`
  }

  await fs.promises.writeFile(reportPath, reportContent)
  info(`Report updated at ${reportPath}`)

  await savePrLinks(prLinks)
}
