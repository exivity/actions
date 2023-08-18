import { info } from 'console'
import { writeFile, readFile } from 'fs/promises'

import { isDryRun } from './inputs'

export async function writeIssueFile(jiraIssueKeys: string[]) {
  if (isDryRun()) {
    info(`Dry run, not writing release jira keys.`)
  } else {
    await writeFile('releaseJiraKeys.md', jiraIssueKeys.join('\n'))

    info(`Written jira keys to: releaseJiraKeys.md`)
  }
}

export async function getIssuesFromIssueFile() {
  if (isDryRun()) {
    info(`Dry run, not reading release jira keys.`)
    return []
  } else {
    try {
      const content = await readFile('releaseJiraKeys.md', 'utf8')
      return content.split('\n')
    } catch (err) {
      throw new Error(
        `Couldn\'t read releaseJiraKeys.md: ${JSON.stringify(err)}`
      )
    }
  }
}
