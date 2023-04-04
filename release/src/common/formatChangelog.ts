import { isEmpty } from 'ramda'
import { features, fixes } from './formatPrChangelog'
import { JiraIssue } from '../jira/getRepoJiraIssues'
import { debug } from './inputs'

export function formatPublicChangelog(version: string, issues: JiraIssue[]) {
  debug(`issues: ${JSON.stringify(issues, null, 2)}`)
  debug(`features: ${JSON.stringify(features(issues), null, 2)}`)
  debug(`fixes: ${JSON.stringify(fixes(issues), null, 2)}`)

  return [
    `## ${version}`,
    '',
    ...buildChangelogSection('New features', features(issues)),
    '',
    ...buildChangelogSection('Bug fixes', fixes(issues)),
    '',
    '',
  ].join('\n')
}

function buildChangelogSection(header: string, issues: JiraIssue[]) {
  if (isEmpty(issues)) return []

  return [
    `### ${header}`,
    '',
    ...issues.map((issue) =>
      [
        `- **${issue.title}**`,
        '',
        `  ${issue.description.split('\n').join('\n  ')}`,
        '',
        '<!--',
        `    - Commit: ${issue.commit}`,
        `    - Issue: ${issue.issue}`,
        `    - Pull request: ${issue.pullRequest}`,
        `    - Milestone: ${issue.milestone}`,
        '-->',
        '',
      ].join('\n')
    ),
  ]
}
