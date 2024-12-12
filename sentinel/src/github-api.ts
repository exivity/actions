import PQueue from 'p-queue'

import { getOctoKitClient } from '../../release/src/common/inputs'

export interface FileData {
  name: string
  path: string
  content?: string
}

export interface RepoData {
  name: string
  html_url: string
  default_branch?: string
  topics: string[]
  workflowFiles?: FileData[]
  rootFiles?: FileData[]
  githubFiles?: FileData[]
  codeownersFile?: FileData
}

const contentQueue = new PQueue({ concurrency: 90 })
const vulnerabilityAlertsQueue = new PQueue({ concurrency: 90 })
const refQueue = new PQueue({ concurrency: 90 })
const pullsQueue = new PQueue({ concurrency: 90 })

export async function getRepos(isTest: boolean): Promise<RepoData[]> {
  if (isTest) {
    return [
      {
        name: 'hermes',
        html_url: 'https://github.com/exivity/hermes',
        topics: ['api', 'codeless'],
        default_branch: 'main',
      },
      {
        name: 'transformer',
        html_url: 'https://github.com/exivity/transformer',
        topics: ['go', 'back-end', 'elt', 'codeless'],
      },
      {
        name: 'sentinel',
        html_url: 'https://github.com/exivity/sentinel',
        topics: ['no-language', 'dev-ops'],
        default_branch: 'main',
      },
    ]
  }

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

export async function getFiles(repoName: string, path: string) {
  const octokit = getOctoKitClient()
  try {
    const response = await contentQueue.add(() =>
      octokit.rest.repos.getContent({
        owner: 'exivity',
        repo: repoName,
        path,
      }),
    )!

    if (Array.isArray(response!.data)) {
      return response!.data.filter((item) => item.type === 'file')
    }
  } catch {
    // Repository might not have files at the given path
  }
  return []
}

export async function getFileContent(
  owner: string,
  repo: string,
  filePath: string,
) {
  const octokit = getOctoKitClient()

  const response = await contentQueue.add(() =>
    octokit.rest.repos.getContent({
      owner,
      repo,
      path: filePath,
    }),
  )

  if ('content' in response!.data) {
    return Buffer.from(response!.data.content, 'base64').toString('utf8')
  }
  return null
}

export async function createOrUpdateFileContents(
  repo: string,
  path: string,
  content: string,
  message: string,
  sha: string,
  branch: string,
) {
  const octokit = getOctoKitClient()

  await contentQueue.add(() =>
    octokit.rest.repos.createOrUpdateFileContents({
      owner: 'exivity',
      repo,
      path,
      message,
      content,
      sha,
      branch,
    }),
  )
}

export async function hasDependabotAlerts(
  owner: string,
  repo: string,
): Promise<boolean> {
  const octokit = getOctoKitClient()

  try {
    await vulnerabilityAlertsQueue.add(() =>
      octokit.rest.repos.checkVulnerabilityAlerts({
        owner,
        repo,
      }),
    )
    return true
  } catch {
    return false
  }
}

export async function getRef(repo: string, branch: string) {
  const octokit = getOctoKitClient()

  const { data: refData } = (await refQueue.add(() =>
    octokit.rest.git.getRef({
      owner: 'exivity',
      repo,
      ref: `heads/${branch}`,
    }),
  ))!

  return refData
}

export async function createRef(repo: string, branch: string, sha: string) {
  const octokit = getOctoKitClient()

  await refQueue.add(() =>
    octokit.rest.git.createRef({
      owner: 'exivity',
      repo,
      ref: `refs/heads/${branch}`,
      sha,
    }),
  )
}

export async function deleteRef(repo: string, branch: string) {
  const octokit = getOctoKitClient()

  await refQueue.add(() =>
    octokit.rest.git.deleteRef({
      owner: 'exivity',
      repo,
      ref: `heads/${branch}`,
    }),
  )
}

export async function createPR(
  repo: string,
  title: string,
  head: string,
  base: string,
  body: string,
) {
  const octokit = getOctoKitClient()

  const { data: prData } = (await pullsQueue.add(() =>
    octokit.rest.pulls.create({
      owner: 'exivity',
      repo,
      title,
      head,
      base,
      body,
    }),
  ))!

  return prData
}
