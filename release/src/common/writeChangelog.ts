import { writeFile } from 'fs/promises'
import { info } from '@actions/core'

import { JiraIssue } from '../jira/getRepoJiraIssues'
import { getChangeLog, getChangeLogPath, isDryRun } from './inputs'
import { formatPublicChangelog } from './formatChangelog'

export async function writeChangelog(
  upcomingVersion: string,
  issues: JiraIssue[]
) {
  const changelogPath = getChangeLogPath()

  const currentPublicChangelogContents = await getChangeLog()

  const publicChangelogContents = formatPublicChangelog(upcomingVersion, issues)

  if (isDryRun()) {
    info(`Dry run, not writing changelog`)
  } else {
    await writeFile(
      changelogPath,
      currentPublicChangelogContents.replace(
        '# Changelog\n\n',
        `# Changelog\n\n${publicChangelogContents}\n\n`
      )
    )

    info(`Written changelog to: ${changelogPath}`)
  }
}
