import { info } from '@actions/core'
import semver from 'semver'
import { JiraIssue } from '../jira/getRepoJiraIssues'

export type VersionIncrement = 'major' | 'minor' | 'patch'

const containsFeature = (issues: JiraIssue[]) =>
  issues.some((issue) => issue.type === 'feat')
const containsBreakingChange = (issues: JiraIssue[]) =>
  issues.some((issue) => issue.breaking)

const description = {
  major: 'major: breaking change detected',
  minor: 'minor: new feature detected',
  patch: 'patch: only fixes and/or chores detected',
} as const

export function inferVersionFromJiraIssues(from: string, issues: JiraIssue[]) {
  const upcomingVersionIncrement: VersionIncrement = containsBreakingChange(
    issues
  )
    ? 'major'
    : containsFeature(issues)
    ? 'minor'
    : 'patch'

  const upcomingVersion = semver.inc(from, upcomingVersionIncrement)

  if (upcomingVersion === null) {
    throw new Error(
      `Could not calculate new version (incrementing ${from} to ${upcomingVersionIncrement})`
    )
  }

  info(
    `Version increment (${description[upcomingVersionIncrement]}): ${from} -> v${upcomingVersion}`
  )

  return `v${upcomingVersion}`
}
