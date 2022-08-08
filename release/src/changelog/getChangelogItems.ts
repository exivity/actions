import { getOctokit } from '@actions/github'
import { info } from 'console'
import { pipe, map, andThen, reject, propEq } from 'ramda'

import { JiraClient, runPlugins } from '../changelogPlugins'

import { createChangelogItem } from './changelogItem'
import { getRepoCommits } from './getRepoCommits'

type Octokit = ReturnType<typeof getOctokit>

export function getChangelogItems(
  octokit: Octokit,
  jiraClient: JiraClient,
  repositories: string[]
) {
  const items = repositories.map(
    pipe(
      getRepoCommits(octokit),
      andThen((changelog) => {
        info(JSON.stringify(changelog, null, 2))
        return changelog
      }),
      andThen(map(createChangelogItem)),
      andThen((changelog) => {
        // This step might change type so we filter chores out after
        return runPlugins({ octokit, jiraClient, changelog })
      }),
      andThen(reject(propEq('type', 'chore')))
    )
  )

  info(JSON.stringify(items, null, 2))

  return Promise.all(items)
}
