import { info } from 'console'
import { isEmpty } from 'ramda'
import { getLatestVersion } from '../../lib/git'
import { getRepoJiraIssues } from './common/getRepoJiraIssues'
import {
  commitAndPush,
  switchToReleaseBranch,
  updatePr,
} from './common/gitActions'
import { inferVersionFromJiraIssues } from './common/inferVersionFromJiraIssues'
import { getRepositories } from './common/inputs'
import { logIssues } from './common/utils'
import { writeChangelog } from './common/writeChangelog'
import { writeIssueFile } from './common/writeIssueFile'
import { writeLockFile } from './common/writeLockFile'

export async function prepare() {
  await switchToReleaseBranch()

  const repositories = await getRepositories()

  const issuesPerRepo = await Promise.all(repositories.map(getRepoJiraIssues))
  const issues = issuesPerRepo.flatMap(({ issues }) => issues)

  if (isEmpty(issues)) {
    info(`No features or fixes to release`)
    return
  }

  logIssues(issues)

  const upcomingVersion = inferVersionFromJiraIssues(
    await getLatestVersion(),
    issues
  )

  await writeIssueFile(
    issuesPerRepo.flatMap(({ jiraIssueKeys }) => jiraIssueKeys)
  )

  await writeLockFile(upcomingVersion)

  await writeChangelog(upcomingVersion, issues)

  const title = `chore: release ${upcomingVersion}`

  await commitAndPush(title)

  await updatePr(title, issues)
}
