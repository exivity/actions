import { getOctokit } from '@actions/github'
import { info } from 'console'
import { writeFile } from 'fs/promises'
import semver from 'semver'
import { DEFAULT_RELEASE_BRANCH, Repositories } from '.'
import { parseCommitMessage } from '../../lib/conventionalCommits'
import { getLatestSemverTag } from '../../lib/git'
import { getCommit, getCommits, getRepository } from '../../lib/github'

type ChangelogType = 'feat' | 'fix' | 'chore'

type ChangelogItem = {
  repository: string
  sha: string
  author: string
  date: string
  type: ChangelogType
  breaking: boolean
  title: string
  description?: string
  issues?: string[]
}

type VersionIncrement = 'major' | 'minor' | 'patch'

type Commit = Awaited<ReturnType<typeof getCommit>> & {
  repository: string
}

type Lockfile = {
  version: string
  repositories: {
    [repository: string]: string
  }
}

const LOCKFILE_PATH = 'exivity.lock'

async function getLatestRelease() {
  const repo = getRepository()
  info(`Finding latest release in ${repo.fqn}...`)
  const latestReleaseTag = await getLatestSemverTag()
  if (typeof latestReleaseTag === 'undefined') {
    throw new Error('Could not determine latest release')
  }
  info(`Latest release: ${latestReleaseTag}`)

  return latestReleaseTag
}

async function getCommitForTag({
  octokit,
  repository,
  tag,
}: {
  octokit: ReturnType<typeof getOctokit>
  repository: string
  tag: string
}) {
  info(`  Lookup commit for tag ${tag}...`)
  try {
    const commit = await getCommit({
      octokit,
      owner: 'exivity',
      repo: repository,
      ref: `tags/${tag}`,
    })
    const timestamp = commit.commit.author?.date
    if (typeof timestamp === 'undefined') {
      throw new Error(
        `Could not find timestamp for commit ${commit.sha} in exivity/${repository}...`
      )
    }
    info(`  Commit: ${commit.sha}`)

    return { ...commit, tag, timestamp }
  } catch (error: unknown) {
    throw new Error(`Could not find tag ${tag} in exivity/${repository}...`)
  }
}

async function getCommitsSince({
  octokit,
  repository,
  branch,
  since,
}: {
  octokit: ReturnType<typeof getOctokit>
  repository: string
  branch: string
  since: { timestamp: string; tag: string; sha: string }
}) {
  info(
    `  Reading commits since ${since.timestamp} in exivity/${repository}#${branch}...`
  )
  info(
    `  See commits: https://github.com/exivity/${repository}/compare/${since.tag}...${branch}`
  )
  const commits = (
    await getCommits({
      octokit,
      owner: 'exivity',
      repo: repository,
      sha: branch,
      since: since.timestamp,
    })
  ).filter((commit) => commit.sha !== since.sha)
  info(`  Found ${commits.length} commits`)

  return commits
}

function createNote(commit: Commit) {
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

function noChores(changelogItem: ChangelogItem) {
  return changelogItem.type !== 'chore'
}

function byDate(a: ChangelogItem, b: ChangelogItem) {
  if (a.date < b.date) {
    return -1
  }
  if (a.date > b.date) {
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

export async function prepare({
  octokit,
  repositories,
  dryRun,
}: {
  octokit: ReturnType<typeof getOctokit>
  repositories: Repositories
  dryRun: boolean
}) {
  // Initial variables
  let changelog: ChangelogItem[] = []
  let pendingVersionIncrement: VersionIncrement = 'patch'
  let pendingVersion: string | null
  const pendingCommits: Commit[] = []
  const pendingLockfile: Lockfile = { version: '', repositories: {} }

  // Get latest release of current repository
  const latestReleaseTag = await getLatestRelease()

  // Iterate over repositories
  info(`Processing repositories...`)
  for (const [repository, repositoryOptions] of Object.entries(repositories)) {
    info(`- exivity/${repository}`)
    // Find commit for latest release tag in target repository
    const latestReleaseCommit = await getCommitForTag({
      octokit,
      repository,
      tag: latestReleaseTag,
    })

    // Get a list of commits from the last release
    const repoCommits = await getCommitsSince({
      octokit,
      repository,
      branch: repositoryOptions.releaseBranch || DEFAULT_RELEASE_BRANCH,
      since: latestReleaseCommit,
    })

    // Record first commit in lockfile, or use latest release commit in case
    // there are no pending repo commits
    pendingLockfile.repositories[repository] =
      repoCommits.length > 0 ? repoCommits[0].sha : latestReleaseCommit.sha

    repoCommits.forEach((repoCommit) => {
      const commit = { ...repoCommit, repository }

      // Add to all commits
      pendingCommits.push(commit)

      // Add to notes
      changelog.push(createNote(commit))
    })
  }

  if (changelog.length === 0) {
    info(`Nothing to release`)
    return
  }

  // Filter out chores
  changelog = changelog.filter(noChores)

  // Sort notes by date
  changelog.sort(byDate)

  // Sort notes by type, feat first, then fix
  changelog.sort(byType)

  // Display summary of notes
  info(`Changelog:`)
  changelog.forEach((item) => {
    info(`- [${item.repository}] ${item.type}: ${item.title} (${item.sha})`)
  })

  // Infer pending version increment
  info(`Inferring pending version increment...`)
  if (changelog.some((item) => item.breaking)) {
    info(`Breaking change detected, incrementing to major`)
    pendingVersionIncrement = 'major'
  } else if (changelog.some((item) => item.type === 'feat')) {
    info(`Feature detected, incrementing to minor`)
    pendingVersionIncrement = 'minor'
  } else {
    info(`Only fixes and/or chores detected, incrementing to patch`)
  }

  // Record pending version in lockfile
  pendingVersion = semver.inc(latestReleaseTag, pendingVersionIncrement)
  if (pendingVersion === null) {
    throw new Error(
      `Could not calculate new version (incremeting ${latestReleaseTag} to ${pendingVersionIncrement})`
    )
  }
  info(`Pending version: ${pendingVersion}`)
  pendingLockfile.version = pendingVersion

  // Write lockfilea
  await writeFile(LOCKFILE_PATH, JSON.stringify(pendingLockfile, null, 2))
  info(`Written lockfile to: ${LOCKFILE_PATH}`)
}
