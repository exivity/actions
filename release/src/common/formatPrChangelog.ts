import { both, filter, isEmpty, propEq } from 'ramda'

import { JiraIssue } from '../jira/getRepoJiraIssues'

// ramda types do not reflect new propEq yet 28.23
export const features = filter(
  both<(issue: JiraIssue) => boolean>(
    propEq('feat', 'type'),
    propEq(false, 'noReleaseNotesNeeded')
  )
)

// ramda types do not reflect new propEq yet 28.23
export const fixes = filter(
  both<(issue: JiraIssue) => boolean>(
    propEq('fix', 'type'),
    propEq(false, 'noReleaseNotesNeeded')
  )
)

export const noReleaseNotesNeeded = filter(propEq('noReleaseNotesNeeded', true))

export function formatPrChangelog(issues: JiraIssue[]) {
  return [
    ...buildChangelogSection('New features', features(issues)),
    '',
    ...buildChangelogSection('Bug fixes', fixes(issues)),
    '',
    ...buildChangelogSection(
      'No release notes needed',
      noReleaseNotesNeeded(issues)
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
      ].join('\n')
    ),
  ]
}
