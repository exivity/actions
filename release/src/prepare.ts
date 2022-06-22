import { getOctokit } from '@actions/github'
import { info } from 'console'
import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import semver from 'semver'
import { DEFAULT_REPOSITORY_RELEASE_BRANCH, Repositories } from '.'
import { parseCommitMessage } from '../../lib/conventionalCommits'
import {
  getLatestSemverTag,
  gitAdd,
  gitCommit,
  gitCreateBranch,
  gitPush,
} from '../../lib/git'
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
const CHANGELOG_PATH = 'CHANGELOG.md'
const PENDING_RELEASE_BRANCH = 'chore/pending-release'

async function getLatestVersion() {
  const repo = getRepository()
  const latestVersionTag = await getLatestSemverTag()
  if (typeof latestVersionTag === 'undefined') {
    throw new Error('Could not determine latest version')
  }
  info(`Latest version in ${repo.fqn}: ${latestVersionTag}`)

  return latestVersionTag
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
    // debug(`  Commit for tag ${tag}: ${commit.sha}`)

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
  const commits = (
    await getCommits({
      octokit,
      owner: 'exivity',
      repo: repository,
      sha: branch,
      since: since.timestamp,
    })
  ).filter((commit) => commit.sha !== since.sha)
  info(
    `  Found ${commits.length} commits since ${since.tag} in exivity/${repository}#${branch}`
  )
  // debug(
  //   `  See commits: https://github.com/exivity/${repository}/compare/${since.tag}...${branch}`
  // )

  return commits
}

async function createPullRequest({
  octokit,
  pendingVersion,
}: {
  octokit: ReturnType<typeof getOctokit>
  pendingVersion: string
}) {
  return octokit.rest.pulls.create({
    owner: 'exivity',
    repo: getRepository().repo,
    title: `chore: new release ${pendingVersion}`,
    body: 'Merging this pull request will create a new Exivity release.',
    head: PENDING_RELEASE_BRANCH,
    base: DEFAULT_REPOSITORY_RELEASE_BRANCH,
  })
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
  const date = new Date()
  return [
    `## ${version}`,
    '',
    `Released on ${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`,
    '',
  ]
}

function buildChangelog(version: string, changelogItems: ChangelogItem[]) {
  return [
    ...buildChangelogHeader(version),
    ...buildChangelogItems(changelogItems),
  ]
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

  // Get latest version of current repository
  const latestVersion = await getLatestVersion()

  // Iterate over repositories
  info(`Iterating repositories`)
  for (const [repository, repositoryOptions] of Object.entries(repositories)) {
    info(`- exivity/${repository}`)
    // Find commit for latest version tag in target repository
    const latestVersionCommit = await getCommitForTag({
      octokit,
      repository,
      tag: latestVersion,
    })

    // Get a list of commits from the last version
    const repoCommits = await getCommitsSince({
      octokit,
      repository,
      branch:
        repositoryOptions.releaseBranch || DEFAULT_REPOSITORY_RELEASE_BRANCH,
      since: latestVersionCommit,
    })

    // Record first commit in lockfile, or use latest version commit in case
    // there are no pending repo commits
    pendingLockfile.repositories[repository] =
      repoCommits.length > 0 ? repoCommits[0].sha : latestVersionCommit.sha

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
  let incrementDescription: string
  if (changelog.some((item) => item.breaking)) {
    incrementDescription = 'major: breaking change detected'
    pendingVersionIncrement = 'major'
  } else if (changelog.some((item) => item.type === 'feat')) {
    incrementDescription = 'minor: new feature detected'
    pendingVersionIncrement = 'minor'
  } else {
    incrementDescription = 'patch: only fixes and/or chores detected'
  }

  // Record pending version in lockfile
  pendingVersion = semver.inc(latestVersion, pendingVersionIncrement)
  if (pendingVersion === null) {
    throw new Error(
      `Could not calculate new version (incremeting ${latestVersion} to ${pendingVersionIncrement})`
    )
  } else {
    pendingVersion = `v${pendingVersion}`
  }
  info(
    `Version increment (${incrementDescription}): ${latestVersion} -> ${pendingVersion}`
  )
  pendingLockfile.version = pendingVersion

  // Write lockfile
  if (dryRun) {
    info(`Dry run, not writing lockfile`)
  } else {
    await writeFile(LOCKFILE_PATH, JSON.stringify(pendingLockfile, null, 2))
    info(`Written lockfile to: ${LOCKFILE_PATH}`)
  }

  // Write CHANGELOG.md
  const currentContents = existsSync(CHANGELOG_PATH)
    ? await readFile(CHANGELOG_PATH, 'utf8')
    : '# Changelog\n\n'
  const newContents = buildChangelog(pendingVersion, changelog)
  if (dryRun) {
    info(`Dry run, not writing changelog`)
  } else {
    await writeFile(
      CHANGELOG_PATH,
      currentContents.replace(
        '# Changelog\n\n',
        `# Changelog\n\n${newContents.join('\n')}\n\n`
      )
    )
    info(`Written changelog to: ${CHANGELOG_PATH}`)
  }

  // Checkout pending release branch
  if (dryRun) {
    info(`Dry run, not pushing changes`)
  } else {
    await gitCreateBranch(PENDING_RELEASE_BRANCH)
    await gitAdd()
    await gitCommit(`chore: new release ${pendingVersion}`)
    await gitPush(true)
  }

  // Create pull request
  if (dryRun) {
    info(`Dry run, not creating pull request`)
  } else {
    await createPullRequest({ octokit, pendingVersion })
  }
}
