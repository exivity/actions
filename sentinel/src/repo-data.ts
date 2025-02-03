import { getFiles, getFileContent } from './github-api'

export interface FileData {
  name: string
  path: string
  sha: string
  content?: string
}

export interface RepoData {
  name: string
  html_url: string
  default_branch?: string
  topics?: string[]
  workflowFiles?: FileData[]
  rootFiles?: FileData[]
  githubFiles?: FileData[]
  codeownersFile?: FileData
}

export async function retrieveWorkflowFiles(repo: RepoData) {
  const files = await getFiles(repo.name, '.github/workflows')

  repo.workflowFiles = await Promise.all(
    files.map((file) => setFileDataContent(repo.name, file)),
  )
}

export async function retrieveRootFiles(repo: RepoData) {
  repo.rootFiles = await getFiles(repo.name, '')
}

export async function retrieveGithubFiles(repo: RepoData) {
  repo.githubFiles = await getFiles(repo.name, '.github')
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
