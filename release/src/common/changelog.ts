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

  const item: ChangelogItem = {
    title: parsed.description || commitTitle,
    description: null,
    type,
    breaking: parsed.breaking || false,
    warnings: [],
    links: {
      commit: {
        repository: commit.repository,
        sha: commit.sha,
        originalTitle: commitTitle,
        title: parsed.description || commitTitle,
        description: commitDescription,
        author:
          commit.author?.login ||
          commit.author?.name ||
          commit.author?.login ||
          'unknown author',
        date:
          commit.commit.author?.date ||
          commit.commit.committer?.date ||
          'unknown date',
        slug: `exivity/${commit.repository}@${commit.sha.substring(0, 7)}`,
        url: `https://github.com/exivity/${commit.repository}/commit/${commit.sha}`,
      },
    },
  }

  return item
}

export function noChores(changelogItem: ChangelogItem) {
  return changelogItem.type !== 'chore'
}

export function byDate(a: ChangelogItem, b: ChangelogItem) {
  if (a.links.commit.date < b.links.commit.date) {
    return -1
  }
  if (a.links.commit.date > b.links.commit.date) {
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

export function formatLinkType(type: string) {
  switch (type) {
    case 'commit':
      return 'Commit'
    case 'pr':
      return 'Pull request'
    case 'issue':
      return 'Issue'
    case 'milestone':
      return 'Milestone'
    default:
      return 'Unknown'
  }
}
