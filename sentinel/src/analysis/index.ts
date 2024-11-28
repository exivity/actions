import { getFileContent, getRepos, getFiles } from '../github-api'

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

  for (const repo of repos) {
    console.log(`Analyzing ${repo.name}...`)
    await retrieveRootFiles(repo)
    await retrieveWorkflowFiles(repo)
    await retrieveGithubFiles(repo)
  }

  await operatingSystemsReport(repos)

  await externalActionsReport(repos)

  await exivityActionsReport(repos)

  await standardsAdherenceReport(repos)

  console.log('Analysis complete.')
}

export async function setFileDataContent(
  repo: string,
  file: FileData,
): Promise<FileData> {
  if (!file.content) {
    try {
      const content = await getFileContent('exivity', repo, file.path)
      if (content) {
        file.content = content
      }
    } catch (error) {
      console.error(`Error analyzing ${repo}/${file.path}: ${error}`)
      file.content = ''
    }
  }

  return file
}

async function retrieveWorkflowFiles(repo: RepoData) {
  const files = (await getFiles(repo.name, '.github/workflows')).map(
    (file) => ({ name: file.name, path: file.path }) as FileData,
  )

  return await Promise.all(
    files.map((file) => setFileDataContent(repo.name, file)),
  )
}

async function retrieveRootFiles(repo: RepoData) {
  return (await getFiles(repo.name, '')).map(
    (file) => ({ name: file.name, path: file.path }) as FileData,
  )
}

async function retrieveGithubFiles(repo: RepoData) {
  return (await getFiles(repo.name, '.github')).map(
    (file) => ({ name: file.name, path: file.path }) as FileData,
  )
}
