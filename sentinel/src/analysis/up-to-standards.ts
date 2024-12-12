import * as fs from 'fs'
import * as yaml from 'yaml'

import { formatRepoList } from '../utils'
import { setFileDataContent } from '.'
import { hasDependabotAlerts, RepoData } from '../github-api'

async function getCodeownersTable() {
  const content = await fs.promises.readFile('codeowners-emails.yaml', 'utf8')
  return yaml.parse(content)
}

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

  const codeownerRegex = /^\* (@[\w\-\.]+|[\w\-\.]+@([\w-]+\.)+[\w-]{2,})$/
  const codeownersTable = getCodeownersTable()

  const withoutCodeownersEmail = repos
    .filter((repo) => !!repo.codeownersFile)
    .filter((repo) => {
      const matched = (
        repo.codeownersFile?.content?.split('\n')[0] ?? ''
      ).match(codeownerRegex)
      if (!matched) return true

      const user = matched[1]
      if (!user.startsWith('@')) return false

      return !(user.substring(1) in codeownersTable)
    })
  reportContent += formatRepoList(
    'CODEOWNERS File does not have Email or User on First Line',
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
    if ((repo.topics ?? []).includes('no-language')) continue

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
      !(repo.topics ?? []).some((topic) => languageTopics.includes(topic)),
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
