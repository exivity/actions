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
  gitFetch,
  gitHasChanges,
  gitPush,
  gitReset,
  gitSetAuthor,
  gitSwitchBranch,
} from '../../lib/git'
import {
  getCommit,
  getCommits,
  getPrFromRef,
  getRepository,
} from '../../lib/github'

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
const UPCOMING_RELEASE_BRANCH = 'chore/upcoming-release'

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

async function createOrUpdatePullRequest({
  octokit,
  upcomingVersion,
  prTemplate,
  changelogContents,
}: {
  octokit: ReturnType<typeof getOctokit>
  upcomingVersion: string
  prTemplate: string
  changelogContents: string[]
}) {
  const existingPullRequest = await getPrFromRef({
    octokit,
    owner: 'exivity',
    repo: getRepository().repo,
    ref: UPCOMING_RELEASE_BRANCH,
  })
  const title = `chore: new release ${upcomingVersion}`
  const body = prTemplate.replace(
    '<!-- CHANGELOG_CONTENTS -->',
    changelogContents.join('\n')
  )
  if (existingPullRequest) {
    const pr = await octokit.rest.pulls.update({
      owner: 'exivity',
      repo: getRepository().repo,
      pull_number: existingPullRequest.number,
      title,
      body,
    })
    info(`Updated pull request #${pr.data.number}`)
    return pr.data
  } else {
    const pr = await octokit.rest.pulls.create({
      owner: 'exivity',
      repo: getRepository().repo,
      title,
      body,
      head: UPCOMING_RELEASE_BRANCH,
      base: DEFAULT_REPOSITORY_RELEASE_BRANCH,
    })
    info(`Opened pull request #${pr.data.number}`)
    return pr.data
  }
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
  return [`## ${version}`, '']
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
  repositoriesJsonPath,
  prTemplatePath,
  dryRun,
}: {
  octokit: ReturnType<typeof getOctokit>
  repositoriesJsonPath: string
  prTemplatePath: string
  dryRun: boolean
}) {
  // Initial variables
  let changelog: ChangelogItem[] = []
  let upcomingVersionIncrement: VersionIncrement = 'patch'
  let upcomingVersion: string | null
  const pendingCommits: Commit[] = []
  const lockfile: Lockfile = { version: '', repositories: {} }

  let repositories: Repositories
  try {
    repositories = JSON.parse(await readFile(repositoriesJsonPath, 'utf8'))
  } catch (error: unknown) {
    throw new Error(
      `Can't read "${repositoriesJsonPath}" or it's not valid JSON`
    )
  }

  let prTemplate: string
  try {
    prTemplate = await readFile(prTemplatePath, 'utf8')
  } catch (error: unknown) {
    throw new Error(`Can't read "${prTemplatePath}"`)
  }

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
    lockfile.repositories[repository] =
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
  upcomingVersion = semver.inc(latestVersion, upcomingVersionIncrement)
  if (upcomingVersion === null) {
    throw new Error(
      `Could not calculate new version (incremeting ${latestVersion} to ${upcomingVersionIncrement})`
    )
  } else {
    upcomingVersion = `v${upcomingVersion}`
  }
  info(
    `Version increment (${incrementDescription}): ${latestVersion} -> ${upcomingVersion}`
  )
  lockfile.version = upcomingVersion

  // Switch to upcoming release branch and reset state to current release branch
  if (dryRun) {
    info(`Dry run, not switching branches`)
  } else if (await gitHasChanges()) {
    info('Detected uncommitted changes, aborting')
  } else {
    await gitFetch('origin', DEFAULT_REPOSITORY_RELEASE_BRANCH)
    await gitSwitchBranch(UPCOMING_RELEASE_BRANCH)
    await gitReset(DEFAULT_REPOSITORY_RELEASE_BRANCH, true)
  }

  // Write lockfile
  if (dryRun) {
    info(`Dry run, not writing lockfile`)
  } else {
    await writeFile(LOCKFILE_PATH, JSON.stringify(lockfile, null, 2) + '\n')
    info(`Written lockfile to: ${LOCKFILE_PATH}`)
  }

  // Write CHANGELOG.md
  const currentContents = existsSync(CHANGELOG_PATH)
    ? await readFile(CHANGELOG_PATH, 'utf8')
    : '# Changelog\n\n'
  const changelogContents = buildChangelog(upcomingVersion, changelog)
  if (dryRun) {
    info(`Dry run, not writing changelog`)
  } else {
    await writeFile(
      CHANGELOG_PATH,
      currentContents.replace(
        '# Changelog\n\n',
        `# Changelog\n\n${changelogContents.join('\n')}\n\n`
      )
    )
    info(`Written changelog to: ${CHANGELOG_PATH}`)
  }

  // Commit and push changes
  if (dryRun) {
    info(`Dry run, not committing and pushing changes`)
  } else {
    await gitAdd()
    await gitSetAuthor('Exivity bot', 'bot@exivity.com')
    await gitCommit(`chore: release ${upcomingVersion}`)
    await gitPush(true)
    info(`Written changes to branch: ${UPCOMING_RELEASE_BRANCH}`)
  }

  // Create or update pull request
  if (dryRun) {
    info(`Dry run, not creating pull request`)
  } else {
    const pr = await createOrUpdatePullRequest({
      octokit,
      upcomingVersion,
      prTemplate,
      changelogContents,
    })
    info(pr.html_url)
  }
}
