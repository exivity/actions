import { info } from '@actions/core'
import semver from 'semver'
import type { ChangelogItem, VersionIncrement } from './types'

export function inferVersionFromChangelog(
  from: string,
  changelog: ChangelogItem[]
) {
  let upcomingVersionIncrement: VersionIncrement = 'patch'
  let upcomingVersion: string | null

  // Infer upcoming version increment
  let incrementDescription: string
  if (changelog.some((item) => item.breaking)) {
    incrementDescription = 'major: breaking change detected'
    upcomingVersionIncrement = 'major'
  } else if (changelog.some((item) => item.type === 'feat')) {
    incrementDescription = 'minor: new feature detected'
    upcomingVersionIncrement = 'minor'
  } else {
    incrementDescription = 'patch: only fixes and/or chores detected'
  }

  // Record upcoming version in lockfile
  upcomingVersion = semver.inc(from, upcomingVersionIncrement)
  if (upcomingVersion === null) {
    throw new Error(
      `Could not calculate new version (incremeting ${from} to ${upcomingVersionIncrement})`
    )
  } else {
    upcomingVersion = `v${upcomingVersion}`
  }
  info(
    `Version increment (${incrementDescription}): ${from} -> ${upcomingVersion}`
  )

  return upcomingVersion
}
