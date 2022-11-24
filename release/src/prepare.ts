import { info } from 'console'
import { isEmpty, chain, prop } from 'ramda'
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

const issuesProp = <T>({ issues }: { issues: T }) => issues
const jiraIssueKeysProp = <T>({ jiraIssueKeys }: { jiraIssueKeys: T }) =>
  jiraIssueKeys

export async function prepare() {
  await switchToReleaseBranch()

  const repositories = await getRepositories()

  const issuesPerRepo = await Promise.all(repositories.map(getRepoJiraIssues))
  const issues = issuesPerRepo.flatMap(issuesProp)

  if (isEmpty(issues)) {
    info(`No features or fixes to release`)
    return
  }

  logIssues(issues)

  const upcomingVersion = inferVersionFromJiraIssues(
    await getLatestVersion(),
    issues
  )

  await writeIssueFile(issuesPerRepo.flatMap(jiraIssueKeysProp))

  await writeLockFile(upcomingVersion)

  await writeChangelog(upcomingVersion, issues)

  const title = `chore: release ${upcomingVersion}`

  await commitAndPush(title)

  await updatePr(title, issues)
}
