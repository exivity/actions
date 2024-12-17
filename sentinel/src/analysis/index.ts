import {
  getFileContent,
  getRepos,
  getFiles,
  FileData,
  RepoData,
} from '../github-api'

import {
  actionsStandardsAdherence,
  exivityActionsReport,
  externalActionsReport,
} from './actions'
import { operatingSystemsReport } from './operating-systems'
import { standardsAdherenceReport } from './up-to-standards'

export async function analyseRepositories(isTest: boolean) {
  console.log('Starting analysis...')
  const repos = await getRepos(isTest)
  console.log(`Found ${repos.length} repositories.`)

  await Promise.all(
    repos.map(async (repo) => {
      console.log(`Analyzing ${repo.name}...`)
      await retrieveRootFiles(repo)
      await retrieveWorkflowFiles(repo)
      await retrieveGithubFiles(repo)
      console.log(`Finished retrieval of ${repo.name}`)
    }),
  )

  await operatingSystemsReport(repos)

  await externalActionsReport(repos)

  await exivityActionsReport(repos)

  await actionsStandardsAdherence(repos)

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

  repo.workflowFiles = await Promise.all(
    files.map((file) => setFileDataContent(repo.name, file)),
  )
}

async function retrieveRootFiles(repo: RepoData) {
  repo.rootFiles = (await getFiles(repo.name, '')).map(
    (file) => ({ name: file.name, path: file.path }) as FileData,
  )
}

async function retrieveGithubFiles(repo: RepoData) {
  repo.githubFiles = (await getFiles(repo.name, '.github')).map(
    (file) => ({ name: file.name, path: file.path }) as FileData,
  )
}
