import { getOctokit } from '@actions/github'
import { info } from 'console'
import { pipe, map, andThen, reject, propEq } from 'ramda'

import { JiraClient, runPlugins } from '../changelogPlugins'

import { createChangelogItem } from './changelogItem'
import { getRepoCommits } from './getRepoCommits'

type Octokit = ReturnType<typeof getOctokit>

export async function getChangelogItems(
  octokit: Octokit,
  jiraClient: JiraClient,
  repositories: string[]
) {
  const items = repositories.map(
    pipe(
      getRepoCommits(octokit),
      andThen(map(createChangelogItem)),
      andThen(async (changelog) => {
        // This step might change type so we filter chores out after
        return await runPlugins({ octokit, jiraClient, changelog })
      }),
      andThen(reject(propEq('type', 'chore')))
    )
  )

  return Promise.all(items)
}
