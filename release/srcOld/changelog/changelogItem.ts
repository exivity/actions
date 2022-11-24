import { any, pipe, toLower, equals } from 'ramda'

import { Commit } from '../../../lib/github'
import { parseCommitMessage } from '../../../lib/conventionalCommits'

import { ChangelogItem, getFirstLine, removeFirstLine } from './utils'

export const repoRgx = /(?<=exivity\/).*?(?=\/)/

const toLowerEquals = pipe(toLower, equals)

export function createChangelogItem(commit: Commit): ChangelogItem {
  const commitTitle = getFirstLine(commit.commit.message)
  const commitDescription = removeFirstLine(commit.commit.message)
  const { type, description, breaking } = parseCommitMessage(commitTitle)

  const typeEqualsOneOf = any(toLowerEquals(type ?? ''))

  const repository = commit.html_url.match(repoRgx)?.[0] ?? ''

  return {
    title: description || commitTitle,
    description: null,
    type: typeEqualsOneOf(['feat', 'feature'])
      ? 'feat'
      : typeEqualsOneOf(['fix', 'bugfix'])
      ? 'fix'
      : 'chore',
    breaking: breaking || false,
    warnings: [],
    links: {
      commit: {
        repository,
        sha: commit.sha,
        originalTitle: commitTitle,
        title: description || commitTitle,
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
        slug: `exivity/${repository}@${commit.sha.substring(0, 7)}`,
        url: commit.html_url,
      },
      issues: [],
    },
  }
}
