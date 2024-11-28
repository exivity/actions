import {
  getFileContent,
  getRepos,
  getFiles,
  runWithConcurrencyLimit,
} from '../utils'

import { exivityActionsReport, externalActionsReport } from './actions'
import { operatingSystemsReport } from './operating-systems'
import { standardsAdherenceReport } from './up-to-standards'

export interface FileData {
  name: string
  path: string
  content?: string
}

export interface RepoData {
  name: string
  url: string
  workflowFiles?: FileData[]
  rootFiles?: FileData[]
  githubFiles?: FileData[]
  codeownersFile?: FileData
}

export async function analyseRepositories() {
  console.log('Starting analysis...')
  const repos = (await getRepos()).map(
    (repo) => ({ name: repo.name, url: repo.html_url }) as RepoData,
  )
  console.log(`Found ${repos.length} repositories.`)

  const rootTasks = repos.map((repo) => async () => {
    await retrieveRootFiles(repo)
  })
  const workflowTasks = repos.map((repo) => async () => {
    await retrieveWorkflowFiles(repo)
  })
  const githubFileTasks = repos.map((repo) => async () => {
    await retrieveGithubFiles(repo)
  })

  await runWithConcurrencyLimit(40, rootTasks)
  await runWithConcurrencyLimit(40, workflowTasks)
  await runWithConcurrencyLimit(40, githubFileTasks)

  for (const repo of repos) {
    for (const file of repo.rootFiles || []) {
      if (file.name === 'CODEOWNERS') {
        repo.codeownersFile = file
        break
      }
    }
  }

  await operatingSystemsReport(repos)

  await externalActionsReport(repos)

  await exivityActionsReport(repos)

  await standardsAdherenceReport(repos)

  console.log('Analysis complete.')
}

async function getFileContents(repo: string, files: FileData[]) {
  const fileTasks = files.map((file) => async () => {
    try {
      const content = await getFileContent('exivity', repo, file.path)
      if (content) {
        file.content = content
      }
    } catch (error) {
      console.error(`Error analyzing ${repo}/${file.path}: ${error}`)
    }
  })

  await runWithConcurrencyLimit(40, fileTasks)
  return files
}

async function retrieveWorkflowFiles(repo: RepoData) {
  const workflowFileInfos = (
    await getFiles(repo.name, '.github/workflows')
  ).map((file) => ({ name: file.name, path: file.path }) as FileData)

  repo.workflowFiles = await getFileContents(repo.name, workflowFileInfos)
}

async function retrieveRootFiles(repo: RepoData) {
  const rootFileInfos = (await getFiles(repo.name, '')).map(
    (file) => ({ name: file.name, path: file.path }) as FileData,
  )

  repo.rootFiles = await getFileContents(repo.name, rootFileInfos)
}

async function retrieveGithubFiles(repo: RepoData) {
  const githubFileInfos = (await getFiles(repo.name, '.github')).map(
    (file) => ({ name: file.name, path: file.path }) as FileData,
  )

  repo.rootFiles = await getFileContents(repo.name, githubFileInfos)
}
