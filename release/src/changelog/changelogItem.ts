import { any } from 'ramda'

import { Commit } from '../../../lib/github'
import { parseCommitMessage } from '../../../lib/conventionalCommits'

import {
  ChangelogItem,
  getFirstLine,
  removeFirstLine,
  equalsChangelogType,
} from './utils'

export const repoRgx = /(?<=exivity\/).*?(?=\/)/

export function createChangelogItem(commit: Commit): ChangelogItem {
  const commitTitle = getFirstLine(commit.commit.message)
  const commitDescription = removeFirstLine(commit.commit.message)
  const parsed = parseCommitMessage(commitTitle)

  const typeEqualsOneOf = any(equalsChangelogType(parsed))

  const type = typeEqualsOneOf(['feat', 'feature'])
    ? 'feat'
    : typeEqualsOneOf(['fix', 'bugfix'])
    ? 'fix'
    : 'chore'

  const repository = commit.html_url.match(repoRgx)?.[0] ?? ''

  return {
    title: parsed.description || commitTitle,
    description: null,
    type,
    breaking: parsed.breaking || false,
    warnings: [],
    links: {
      commit: {
        repository,
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
        slug: `exivity/${repository}@${commit.sha.substring(0, 7)}`,
        url: commit.html_url,
      },
      issues: [],
    },
  }
}
