import * as fs from 'fs'

import { formatRepoList } from '../utils'
import { RepoData } from '.'
import { hasDependabotAlerts } from '../github-api'

export async function standardsAdherenceReport(repos: RepoData[]) {
  let reportContent = `# Standards Adherence Report - ${new Date().toISOString()}\n\n`

  const withoutCodeowners = repos.filter((repo) => !repo.codeownersFile)
  formatRepoList('Has No CODEOWNERS File', withoutCodeowners)

  const withoutDependabot: RepoData[] = []
  for (const repo of repos) {
    if (
      !(await hasDependabotAlerts('exivity', repo.name)) ||
      !repo.githubFiles?.some((file) => file.name === 'dependabot.yml')
    ) {
      withoutDependabot.push(repo)
    }
  }
  formatRepoList('Has No Dependabot Alerts', withoutDependabot)

  formatRepoList(
    'Adheres To Standards',
    repos.filter(
      (repo) =>
        !withoutDependabot.includes(repo) && !withoutCodeowners.includes(repo),
    ),
  )

  await fs.promises.writeFile('standards-adherence.md', reportContent)
  console.log(`Operating systems report generated`)
}
