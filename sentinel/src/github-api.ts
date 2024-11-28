import PQueue from 'p-queue'

import { getOctoKitClient } from '../../release/src/common/inputs'

const contentQueue = new PQueue({ concurrency: 90 })
const vulnerabilityAlertsQueue = new PQueue({ concurrency: 90 })

export async function getRepos() {
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
