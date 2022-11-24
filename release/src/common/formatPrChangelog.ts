import { both, filter, isEmpty, propEq } from 'ramda'

import { JiraIssue } from '../jira/getRepoJiraIssues'

export const features = filter(
  both<(issue: JiraIssue) => boolean>(
    propEq('type', 'feat'),
    propEq('noReleaseNotesNeeded', false)
  )
)

export const fixes = filter(
  both<(issue: JiraIssue) => boolean>(
    propEq('type', 'fix'),
    propEq('noReleaseNotesNeeded', false)
  )
)

export function formatPrChangelog(issues: JiraIssue[]) {
  return [
    ...buildChangelogSection('New features', features(issues)),
    '',
    ...buildChangelogSection('Bug fixes', fixes(issues)),
    '',
    ...buildChangelogSection('No release notes needed', fixes(issues)),
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
      ].join('\n')
    ),
  ]
}
