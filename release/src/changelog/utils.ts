import { info } from '@actions/core'
import {
  pipe,
  split,
  propOr,
  toLower,
  pathOr,
  tail,
  join,
  equals,
  reject,
  propEq,
  chain,
  map,
  flatten,
  prop,
} from 'ramda'

export type ChangelogType = 'feat' | 'fix' | 'chore'

export type ChangelogLinkType = 'pr' | 'commit' | 'issue' | 'milestone'

export type ChangelogLinkCommon = {
  slug: string
  url: string
  title: string
  description: string | null
}

export type ChangelogItem = {
  title: string
  description: string | null
  type: ChangelogType
  breaking: boolean
  warnings: string[]
  links: {
    commit: ChangelogLinkCommon & {
      originalTitle: string
      repository: string
      sha: string
      author: string
      date: string
    }
    pr?: ChangelogLinkCommon & {
      originalTitle: string
    }
    issues: ChangelogLinkCommon[]
    milestone?: ChangelogLinkCommon
  }
}

export const equalsChangelogType = pipe(propOr('', 'type'), toLower, equals)

export const getFirstLine = pipe(split('\n'), pathOr('', [0]))

export const removeFirstLine = pipe(split('\n'), tail, join('\n'))

export const rejectChores = reject(propEq('type', 'chore'))

function byDate(a: ChangelogItem, b: ChangelogItem) {
  if (a.links.commit.date < b.links.commit.date) {
    return -1
  }
  if (a.links.commit.date > b.links.commit.date) {
    return 1
  }
  return 0
}

function byType(a: ChangelogItem, b: ChangelogItem) {
  // Sort notes by type, feat first, then fix
  if (a.type < b.type) {
    return -1
  }
  if (a.type > b.type) {
    return 1
  }
  return 0
}

export const sortChangelogItems = (changelog: ChangelogItem[]) =>
  changelog.sort(byType).sort(byDate)

export const logChangelogItems = (changelog: ChangelogItem[]) => {
  info(`Changelog:`)
  changelog.forEach((item) => {
    info(
      `- [${item.links.commit.repository}] ${item.type}: ${item.title} (${item.links.commit.sha})`
    )
  })
}

export const getChangelogSlugs = pipe(
  flatten,
  map(pathOr([] as ChangelogLinkCommon[], ['links', 'issues'])),
  chain(map(prop('slug')))
)

export const removeIssuesFromReleaseTestRepo = (changelog: ChangelogItem[]) => {
  return changelog.filter(
    (item) => item.links.commit.repository !== 'release-test'
  )
}
