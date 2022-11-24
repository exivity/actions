import { updateIssuesStatusAndFixVersion } from './jira/jiraActions'

export async function updateJiraIssues() {
  updateIssuesStatusAndFixVersion()
}
