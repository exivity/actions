import { getOctoKitClient } from '../../release/src/common/inputs'

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

export async function getWorkflowFiles(repoName: string) {
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

export async function getFileContent(
  owner: string,
  repo: string,
  filePath: string,
) {
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

// Add a helper function to limit concurrency
export async function runWithConcurrencyLimit<T>(
  limit: number,
  tasks: (() => Promise<T>)[],
): Promise<T[]> {
  const results: T[] = []
  let index = 0

  async function worker() {
    while (index < tasks.length) {
      const currentIndex = index++
      results[currentIndex] = await tasks[currentIndex]()
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, worker)
  await Promise.all(workers)
  return results
}
