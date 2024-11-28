import * as fs from 'fs'

import { formatRepoList } from '../utils'
import { RepoData, setFileDataContent } from '.'
import { hasDependabotAlerts } from '../github-api'

export async function standardsAdherenceReport(repos: RepoData[]) {
  let reportContent = `# Standards Adherence Report - ${new Date().toISOString()}\n\n`

  for (const repo of repos) {
    for (const file of repo.rootFiles || []) {
      if (file.name === 'CODEOWNERS') {
        await setFileDataContent(repo.name, file)
        repo.codeownersFile = file
        break
      }
    }
  }

  const withoutCodeowners = repos.filter((repo) => !repo.codeownersFile)
  reportContent += formatRepoList('Has No CODEOWNERS File', withoutCodeowners)

  const withoutDependabot: RepoData[] = []
  for (const repo of repos) {
    if (
      !(await hasDependabotAlerts('exivity', repo.name)) ||
      !repo.githubFiles?.some((file) => file.name === 'dependabot.yml')
    ) {
      withoutDependabot.push(repo)
    }
  }
  reportContent += formatRepoList('Has No Dependabot Alerts', withoutDependabot)

  reportContent += formatRepoList(
    'Adheres To Standards',
    repos.filter(
      (repo) =>
        !withoutDependabot.includes(repo) && !withoutCodeowners.includes(repo),
    ),
  )

  await fs.promises.writeFile('standards-adherence.md', reportContent)
  console.log(`Operating systems report generated`)
}
