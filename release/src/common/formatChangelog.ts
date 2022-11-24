import { isEmpty } from 'ramda'
import { features, fixes } from './formatPrChangelog'
import { JiraIssue } from '../jira/getRepoJiraIssues'

export function formatPublicChangelog(version: string, issues: JiraIssue[]) {
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
