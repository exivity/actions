import { parseCommitMessage } from '../../../lib/conventionalCommits'
import type { ChangelogItem, ChangelogType, Commit } from './types'

export function createChangelogItemFromCommit(commit: Commit) {
  const commitMessageLines = commit.commit.message.split('\n')
  const commitTitle = commitMessageLines[0]
  const commitDescription = commitMessageLines.slice(1).join('\n')

  const parsed = parseCommitMessage(commitTitle)
  let type: ChangelogType
  switch (true) {
    case parsed.type?.toLowerCase() === 'feat':
    case parsed.type?.toLowerCase() === 'feature':
      type = 'feat'
      break

    case parsed.type?.toLowerCase() === 'fix':
    case parsed.type?.toLowerCase() === 'bugfix':
      type = 'fix'
      break

    default:
      type = 'chore'
  }

  return {
    repository: commit.repository,
    sha: commit.sha,
    author:
      commit.author?.login ||
      commit.author?.name ||
      commit.author?.login ||
      'unknown author',
    date:
      commit.commit.author?.date ||
      commit.commit.committer?.date ||
      'unknown date',
    type,
    breaking: parsed.breaking || false,
    title: parsed.description || commitTitle,
    description: commitDescription,
    issues: [],
  } as ChangelogItem
}

export function buildChangelog(
  version: string,
  changelogItems: ChangelogItem[]
) {
  return [
    ...buildChangelogHeader(version),
    ...buildChangelogItems(changelogItems),
  ]
}

export function noChores(changelogItem: ChangelogItem) {
  return changelogItem.type !== 'chore'
}

export function byDate(a: ChangelogItem, b: ChangelogItem) {
  if (a.date < b.date) {
    return -1
  }
  if (a.date > b.date) {
    return 1
  }
  return 0
}

export function byType(a: ChangelogItem, b: ChangelogItem) {
  // Sort notes by type, feat first, then fix
  if (a.type < b.type) {
    return -1
  }
  if (a.type > b.type) {
    return 1
  }
  return 0
}

function buildChangelogItem(changelogItem: ChangelogItem) {
  let result: string = `- **${changelogItem.title}**`
  if (changelogItem.description) {
    result += `\n  ${changelogItem.description.split('\n').join('\n  ')}`
  }

  return result
}

function buildChangelogSection(
  header: string,
  changelogItems: ChangelogItem[]
) {
  if (changelogItems.length === 0) {
    return []
  }

  return [`### ${header}`, '', ...changelogItems.map(buildChangelogItem)]
}

function buildChangelogItems(changelogItems: ChangelogItem[]) {
  return [
    ...buildChangelogSection(
      'New features',
      changelogItems.filter((item) => item.type === 'feat')
    ),
    '',
    ...buildChangelogSection(
      'Bug fixes',
      changelogItems.filter((item) => item.type === 'fix')
    ),
    '',
    '',
  ]
}

function buildChangelogHeader(version: string) {
  return [`## ${version}`, '']
}
