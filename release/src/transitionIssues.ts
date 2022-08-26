import { getOctokit } from '@actions/github'
import { readLockfile } from './common/files'
import { getJiraClient } from './common/jiraClient'
import {
  getChangelogItemsSlugs,
  transitionIssuesAndUpdateFixVersion,
} from './common/issueTransitioning'

const issueRegex = /^EXVT-\d+$/g

export async function transitionIssues({
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
  const jiraIssueIds = (
    await getChangelogItemsSlugs(octokit, jiraClient, repositoriesJsonPath)
  )
    .filter((issue, index, arr) => arr.findIndex((i) => issue === i) === index)
    .map((issue) => issue.trim())
    .filter((issue) => typeof issue === 'string' && issueRegex.test(issue))

  const lockfile = await readLockfile(lockfilePath)

  // Transition jira issues
  await transitionIssuesAndUpdateFixVersion(
    dryRun,
    jiraIssueIds,
    lockfile.version,
    jiraClient
  )
}
