import { info } from 'console'
import { isEmpty } from 'ramda'
import { getRepoJiraIssues } from './jira/getRepoJiraIssues'
import {
  commitAndPush,
  switchToReleaseBranch,
  updatePr,
} from './common/gitActions'
import { inferVersionFromJiraIssues } from './common/inferVersionFromJiraIssues'
import { getLockFile, getReleaseRepositories } from './common/inputs'
import { logIssues } from './common/utils'
import { writeChangelog } from './common/writeChangelog'
import { writeIssueFile } from './common/writeIssueFile'
import { writeLockFile } from './common/writeLockFile'

const issuesProp = <T>({ issues }: { issues: T }) => issues
const jiraIssueKeysProp = <T>({ jiraIssueKeys }: { jiraIssueKeys: T }) =>
  jiraIssueKeys

export async function prepare() {
  await switchToReleaseBranch()

  const repositories = await getReleaseRepositories()

  const issuesPerRepo = await Promise.all(repositories.map(getRepoJiraIssues))
  const issues = issuesPerRepo.flatMap(issuesProp)

  if (isEmpty(issues)) {
    info(`No features or fixes to release`)
    return
  }

  logIssues(issues)

  const currentVersion = (await getLockFile()).version
  const upcomingVersion = inferVersionFromJiraIssues(currentVersion, issues)

  await writeIssueFile(issuesPerRepo.flatMap(jiraIssueKeysProp))

  await writeLockFile(upcomingVersion)

  await writeChangelog(upcomingVersion, issues)

  const title = `chore: release ${upcomingVersion}`

  await commitAndPush(title)

  await updatePr(title, issues)
}
