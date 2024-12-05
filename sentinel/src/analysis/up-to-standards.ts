import * as fs from 'fs'

import { formatRepoList } from '../utils'
import { RepoData, setFileDataContent } from '.'
import { hasDependabotAlerts } from '../github-api'

async function checkCodeowners(
  repos: RepoData[],
  reportContent: string,
  adheringRepos: RepoData[],
): Promise<[string, RepoData[]]> {
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

  const withoutCodeownersEmail = repos
    .filter((repo) => !!repo.codeownersFile)
    .filter((repo) => !!repo.codeownersFile!.content)
    .filter(
      (repo) =>
        !repo
          .codeownersFile!.content!.split('\n')
          .some((line) => line.match(/[\w\-\.]+@([\w-]+\.)+[\w-]{2,}/)),
    )
  reportContent += formatRepoList(
    'CODEOWNERS File does not have Email',
    withoutCodeownersEmail,
  )

  return [
    reportContent,
    adheringRepos.filter(
      (repo) =>
        !withoutCodeowners.includes(repo) &&
        !withoutCodeownersEmail.includes(repo),
    ),
  ]
}

async function checkDependabot(
  repos: RepoData[],
  reportContent: string,
  adheringRepos: RepoData[],
): Promise<[string, RepoData[]]> {
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

  return [
    reportContent,
    adheringRepos.filter((repo) => !withoutDependabot.includes(repo)),
  ]
}

async function checkTopics(
  repos: RepoData[],
  reportContent: string,
  adheringRepos: RepoData[],
): Promise<[string, RepoData[]]> {
  const languageTopics = [
    'typescript',
    'javascript',
    'php',
    'golang',
    'go',
    'rust',
    'python',
    'c',
    'cpp',
    'sql',
    'pulumi',
    'kubernetes',
    'css',
    'no-language',
  ]

  const withoutLanguageTopics = repos.filter(
    (repo) =>
      !repo.topics
        .map((topic) => topic.toLowerCase().replace('-', ''))
        .some((topic) => languageTopics.includes(topic)),
  )
  reportContent += formatRepoList(
    'Has No Language Topics',
    withoutLanguageTopics,
  )

  // const teamTopics = ['api', 'frontend', 'backend', 'devops']

  // const withoutTeamTopics = repos.filter(
  //   (repo) =>
  //     !repo.topics
  //       .map((topic) => topic.toLowerCase().replace('-', ''))
  //       .some((topic) => teamTopics.includes(topic)),
  // )
  // reportContent += formatRepoList('Has No Team Topics', withoutTeamTopics)

  return [
    reportContent,
    adheringRepos.filter(
      (repo) => !withoutLanguageTopics.includes(repo),
      // && !withoutTeamTopics.includes(repo),
    ),
  ]
}

export async function standardsAdherenceReport(repos: RepoData[]) {
  let reportContent = `# Standards Adherence Report - ${new Date().toISOString()}\n\n`
  let adheringRepos = repos

  ;[reportContent, adheringRepos] = await checkCodeowners(
    repos,
    reportContent,
    adheringRepos,
  )
  ;[reportContent, adheringRepos] = await checkDependabot(
    repos,
    reportContent,
    adheringRepos,
  )
  ;[reportContent, adheringRepos] = await checkTopics(
    repos,
    reportContent,
    adheringRepos,
  )

  reportContent += formatRepoList('Adheres To Standards', adheringRepos)

  await fs.promises.writeFile('standards-adherence.md', reportContent)
  console.log(`Operating systems report generated`)
}
