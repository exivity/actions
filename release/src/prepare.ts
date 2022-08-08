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
} from './changelog'

interface Prepare {
  octokit: ReturnType<typeof getOctokit>
  jiraClient: ReturnType<typeof getJiraClient>
  lockfilePath: string
  changelogPath: string
  repositoriesJsonPath: string
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
  repositoriesJsonPath,
  prTemplatePath,
  upcomingReleaseBranch,
  releaseBranch,
  dryRun,
}: Prepare) {
  await switchToReleaseBranch(dryRun, releaseBranch, upcomingReleaseBranch)

  const repositories = await getRepositories(repositoriesJsonPath)
  const changelogItems = await getChangelogItems(
    octokit,
    jiraClient,
    repositories
  )
  const flatChangelog = sortChangelogItems(flatten(changelogItems))

  if (isEmpty(flatChangelog)) {
    info(`Nothing to release`)
    return
  }

  logChangelogItems(flatChangelog)

  const upcomingVersion = inferVersionFromChangelog(
    await getLatestVersion(),
    flatChangelog
  )

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
    upcomingVersion,
    title,
    prTemplatePath,
    upcomingReleaseBranch,
    releaseBranch,
    flatChangelog,
    octokit
  )
}
