import { getInput, info } from '@actions/core'

import { getRepos, getFiles } from '../github-api'
import { getUpdatedPrLinks, savePrLinks } from '../pr-links'
import { updateRepoWorkflows } from './workflows'

export async function updateRepositories(isTest: boolean) {
  const searchPattern = getInput('search-pattern')
  const replacePattern = getInput('replace-pattern')

  if (!searchPattern || !replacePattern) {
    throw new Error(
      'Both search-pattern and replace-pattern inputs must be provided in update mode',
    )
  }

  info(`Replacing "${searchPattern}" with "${replacePattern}" in workflows`)

  const repos = await getRepos(isTest)
  const prLinks: string[] = await getUpdatedPrLinks()

  await Promise.all(
    repos.map(async (repo) => {
      try {
        const repoName = repo.name
        info(`Processing repository: ${repoName}`)

        const workflowFiles = await getFiles(repoName, '.github/workflows')

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
