import { getOctokit } from '@actions/github'
import { info } from '@actions/core'
import { flatten, isEmpty } from 'ramda'

import { getLatestVersion } from '../../lib/git'
import type { getJiraClient } from './common/jiraClient'
import { getRepositories } from './common/files'
import { writeLockFile } from './common/lockfile'
import {
  switchToReleaseBranch,
  commitAndPush,
  updateMissingReleaseNotesWarningStatus,
  updatePr,
} from './common/gitUpdates'
import {
  getChangelogItems,
  inferVersionFromChangelog,
  sortChangelogItems,
  writeChangelog,
  logChangelogItems,
  removeIssuesFromReleaseTestRepo,
} from './changelog'

interface Prepare {
  octokit: ReturnType<typeof getOctokit>
  jiraClient: ReturnType<typeof getJiraClient>
  lockfilePath: string
  changelogPath: string
  repositories: string[]
  prTemplatePath: string
  upcomingReleaseBranch: string
  releaseBranch: string
  dryRun: boolean
}

export async function prepare({
  octokit,
  jiraClient,
  lockfilePath,
  changelogPath,
  repositories,
  prTemplatePath,
  upcomingReleaseBranch,
  releaseBranch,
  dryRun,
}: Prepare) {
  await switchToReleaseBranch(dryRun, releaseBranch, upcomingReleaseBranch)

  const changelogItems = await getChangelogItems(
    octokit,
    jiraClient,
    repositories
  )

  let flatChangelog = sortChangelogItems(flatten(changelogItems))

  if (isEmpty(flatChangelog)) {
    info(`No features or fixes to release`)
    return
  }

  const upcomingVersion = inferVersionFromChangelog(
    await getLatestVersion(),
    flatChangelog
  )

  // We can use release-test repo to trigger partiicular version bump and release
  // but we might come up with something better and remove this
  flatChangelog = removeIssuesFromReleaseTestRepo(flatChangelog)

  logChangelogItems(flatChangelog)

  await writeLockFile(
    dryRun,
    octokit,
    upcomingVersion,
    repositories,
    lockfilePath
  )

  await writeChangelog(changelogPath, flatChangelog, upcomingVersion, dryRun)

  const title = `chore: release ${upcomingVersion}`

  await commitAndPush(dryRun, title, upcomingReleaseBranch)

  await updateMissingReleaseNotesWarningStatus(dryRun, flatChangelog, octokit)

  await updatePr(
    dryRun,
    title,
    prTemplatePath,
    upcomingReleaseBranch,
    releaseBranch,
    flatChangelog,
    octokit
  )
}
