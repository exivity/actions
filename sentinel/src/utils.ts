import { info } from '@actions/core'
import { createRef, getRef } from './github-api'
import { RepoData } from './repo-data'

export function formatRepoList(
  title: string,
  repos: RepoData[],
  subTitle?: boolean,
): string {
  let result = ''

  if (subTitle) {
    result += `### ${title}\n\n`
  } else {
    result += `## ${title}\n\n`
  }

  if (repos.length === 0) {
    result += 'No repositories found\n'
  } else if (repos.length > 3) {
    result += `<details><summary>Show ${repos.length} repositories</summary>\n\n`
    for (const { name, html_url } of repos) {
      result += `- [${name}](${html_url})\n`
    }
    result += `\n</details>\n\n`
  } else {
    for (const { name, html_url } of repos) {
      result += `- [${name}](${html_url})\n`
    }
    result += `\n`
  }

  return result
}

export async function createBranch(repoData: RepoData, branchName: string) {
  if (!repoData.default_branch) {
    info(
      `Error processing repository ${repoData.name}: repository does not have a default branch`,
    )
    return null
  }

  // Create a new branch from default branch
  const refData = await getRef(
    repoData.name,
    `heads/${repoData.default_branch}`,
  )

  await createRef(repoData.name, `refs/heads/${branchName}`, refData.object.sha)
}
