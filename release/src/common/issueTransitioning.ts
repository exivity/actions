import { info, warning } from '@actions/core'
import { getOctokit } from '@actions/github'

import { getJiraClient, transitionToReleased, getVersion } from './jiraClient'
import { getRepositories } from './files'
import { getChangelogItems, getChangelogSlugs } from '../changelog'

export async function getChangelogItemsSlugs(
  octokit: ReturnType<typeof getOctokit>,
  jiraClient: ReturnType<typeof getJiraClient>,
  repositoriesJsonPath: string
) {
  const repositories = await getRepositories(repositoriesJsonPath)
  const changelogItems = await getChangelogItems(
    octokit,
    jiraClient,
    repositories
  )

  return getChangelogSlugs(changelogItems)
}

export async function updateIssueReleaseVersion(
  dryRun: boolean,
  version: string,
  jiraIssueIds: string[],
  jiraClient: ReturnType<typeof getJiraClient>
) {
  if (dryRun) {
    info(`Dry run, not setting release version of tickets`)
  } else {
    info(`Setting release version of:`)
    info(
      `${
        jiraIssueIds.length > 0 ? 'found no tickets' : jiraIssueIds.join('\n')
      }`
    )

    for (const issueIdOrKey of jiraIssueIds) {
      await jiraClient.issues.editIssue({
        issueIdOrKey,
        fields: {
          fixVersions: [
            { id: await getVersion(dryRun, jiraClient, version, issueIdOrKey) },
          ],
        },
      })
      info(`Set release version of ${issueIdOrKey} to ${version}`)
    }
  }
}

export async function transitionIssuesAndUpdateFixVersion(
  dryRun: boolean,
  jiraIssueIds: string[],
  upcomingVersion: string,
  jiraClient: ReturnType<typeof getJiraClient>
) {
  if (dryRun) {
    info(`Dry run, not transitioning tickets`)
  } else {
    info(`Transitioning ticket status of:`)
    info(
      `${
        jiraIssueIds.length > 0 ? jiraIssueIds.join('\n') : 'found no tickets'
      }`
    )

    await Promise.all(
      jiraIssueIds.map((issueIdOrKey) => {
        return transitionToReleased(issueIdOrKey, jiraClient)
      })
    ).then(() => {
      jiraIssueIds.forEach((issueIdOrKey) => {
        info(`Transitioned issue ${issueIdOrKey} to released`)
      })
    })
  }

  // Update fixVersion of all issues
  try {
    await updateIssueReleaseVersion(
      dryRun,
      upcomingVersion,
      jiraIssueIds,
      jiraClient
    )
  } catch (e) {
    warning(
      `Got error while trying to update release version of tickets: ${JSON.stringify(
        e
      )}`
    )
  }
}
