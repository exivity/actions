import { getIssuesFromIssueFile } from './common/writeIssueFile'

export async function updateJiraIssues() {
  const issues = await getIssuesFromIssueFile()
}
