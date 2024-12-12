import { getInput, info } from '@actions/core'

import { getRepos, getRepo, getFiles } from '../github-api'
import { getUpdatedPrLinks, savePrLinks } from '../pr-links'
import { updateRepoWorkflows } from './workflows'

export async function updateRepositories(isTest: boolean) {
  const searchPattern = getInput('search-pattern')
  const replacePattern = getInput('replace-pattern')
  const fileRegexInput = getInput('file-regex')
  const repoList = getInput('repo-list').split(',')

  if (!searchPattern || !replacePattern) {
    throw new Error(
      'Both search-pattern and replace-pattern inputs must be provided in update mode',
    )
  }

  let fileRegex: RegExp | undefined
  if (fileRegexInput) {
    try {
      fileRegex = new RegExp(fileRegexInput)
    } catch (error) {
      throw new Error(`Invalid file-regex input: ${error}`)
    }
  }

  info(`Replacing "${searchPattern}" with "${replacePattern}" in workflows`)

  let repos
  if (repoList.length > 0) {
    repos = await Promise.all(repoList.map(getRepo))
  } else {
    repos = await getRepos(isTest)
  }

  const prLinks: string[] = await getUpdatedPrLinks()

  await Promise.all(
    repos.map(async (repo) => {
      try {
        const repoName = repo.name
        info(`Processing repository: ${repoName}`)

        let workflowFiles = await getFiles(repoName, '.github/workflows')

        if (fileRegex) {
          workflowFiles = workflowFiles.filter((file) =>
            fileRegex.test(file.name),
          )
        }

        const prLink = await updateRepoWorkflows(
          repo,
          workflowFiles,
          searchPattern,
          replacePattern,
        )
        if (prLink) {
          prLinks.push(`- [${repoName}](${prLink})`)
        }
      } catch (error) {
        info(`Error processing repository ${repo.name}: ${error}`)
      }
    }),
  )

  await savePrLinks(prLinks)
}
