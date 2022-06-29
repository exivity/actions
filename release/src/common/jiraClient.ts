import { Version2Client } from 'jira.js'

export function getJiraClient(username: string, token: string) {
  return new Version2Client({
    host: 'https://exivity.atlassian.net',
    authentication: {
      basic: {
        username,
        password: token,
      },
    },
    newErrorHandling: true,
  })
}
