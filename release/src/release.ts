import { getOctokit } from '@actions/github'

import { readLockfile } from './common/files'
import { getJiraClient } from './common/jiraClient'
import { tagAllRepositories } from './common/gitUpdates'
import {
  getChangelogItemsSlugs,
  transitionIssuesAndUpdateFixVersion,
} from './common/issueTransitioning'

export async function release({
  octokit,
  lockfilePath,
  jiraClient,
  repositoriesJsonPath,
  dryRun,
}: {
  octokit: ReturnType<typeof getOctokit>
  lockfilePath: string
  jiraClient: ReturnType<typeof getJiraClient>
  repositoriesJsonPath: string
  dryRun: boolean
}) {
  // All jira issues from prev release to upcoming release
  // (we need to do this before updating tag in next step)
  const jiraIssueIds = await getChangelogItemsSlugs(
    octokit,
    jiraClient,
    repositoriesJsonPath
  )

  const lockfile = await readLockfile(lockfilePath)

  await tagAllRepositories(dryRun, lockfile, octokit)

  // Transition jira issues
  await transitionIssuesAndUpdateFixVersion(
    dryRun,
    jiraIssueIds,
    lockfile.version,
    jiraClient
  )
}
