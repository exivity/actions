import { RepoData } from './github-api'

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
