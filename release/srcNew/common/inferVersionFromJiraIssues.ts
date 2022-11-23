import { info } from '@actions/core'
import semver from 'semver'
import { any, propEq } from 'ramda'

export type VersionIncrement = 'major' | 'minor' | 'patch'

const containsFeature = any(propEq('type', 'feat'))
const containsBreakingChange = any(propEq('breaking', true))

const description = {
  major: 'major: breaking change detected',
  minor: 'minor: new feature detected',
  patch: 'patch: only fixes and/or chores detected',
} as const

export function inferVersionFromJiraIssues(
  from: string,
  issues: { type: 'feat' | 'fix'; breaking: boolean }[]
) {
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
