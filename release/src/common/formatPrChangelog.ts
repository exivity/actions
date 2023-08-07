import { isEmpty } from 'ramda'

import { JiraIssue } from '../jira/getRepoJiraIssues'

export const features = (issues: JiraIssue[]) =>
  issues.filter(
    (issue) => issue.type === 'feat' && issueNeedsReleaseNotes(issue),
  )
export const fixes = (issues: JiraIssue[]) =>
  issues.filter(
    (issue) => issue.type === 'fix' && issueNeedsReleaseNotes(issue),
  )

const issueDoesntNeedReleaseNotes = (issue: JiraIssue) =>
  issue.noReleaseNotesNeeded
export const issueNeedsReleaseNotes = (issue: JiraIssue) =>
  !issue.noReleaseNotesNeeded

export const noReleaseNotesNeeded = (issues: JiraIssue[]) =>
  issues.filter(issueDoesntNeedReleaseNotes)

export function formatPrChangelog(issues: JiraIssue[]) {
  return [
    ...buildChangelogSection('New features', features(issues)),
    '',
    ...buildChangelogSection('Bug fixes', fixes(issues)),
    '',
    ...buildChangelogSection(
      'No release notes needed',
      noReleaseNotesNeeded(issues),
    ),
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
        `  ${issue.description.split('\n').join('\n  ')}`,
        '',
        '  <details>',
        '    <summary>Show details</summary>',
        '',
        `    - Commit: ${issue.commit}`,
        `    - Issue: ${issue.issue}`,
        `    - Pull request: ${issue.pullRequest}`,
        `    - Milestone: ${issue.milestone}`,
        '  </details>',
        '',
      ].join('\n'),
    ),
  ]
}
