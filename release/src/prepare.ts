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
  gitForceSwitchBranch,
  gitHasChanges,
  gitPush,
  gitSetAuthor,
} from '../../lib/git'
import {
  getCommit,
  getCommits,
  getPrFromRef,
  getRepository,
} from '../../lib/github'
import {
  ChangelogItem,
  ChangelogType,
  Commit,
  Lockfile,
  VersionIncrement,
} from './types'

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
  title,
  prTemplate,
  changelogContents,
  upcomingReleaseBranch,
  releaseBranch,
}: {
  octokit: ReturnType<typeof getOctokit>
  title: string
  prTemplate: string
  changelogContents: string[]
  upcomingReleaseBranch: string
  releaseBranch: string
}) {
  const existingPullRequest = await getPrFromRef({
    octokit,
    owner: 'exivity',
    repo: getRepository().repo,
    ref: upcomingReleaseBranch,
  })
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
      head: upcomingReleaseBranch,
      base: releaseBranch,
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
  lockfilePath,
  changelogPath,
  repositoriesJsonPath,
  prTemplatePath,
  upcomingReleaseBranch,
  releaseBranch,
  dryRun,
}: {
  octokit: ReturnType<typeof getOctokit>
  lockfilePath: string
  changelogPath: string
  repositoriesJsonPath: string
  prTemplatePath: string
  upcomingReleaseBranch: string
  releaseBranch: string
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
    await gitForceSwitchBranch(upcomingReleaseBranch, `origin/${releaseBranch}`)
  }

  // Write lockfile
  if (dryRun) {
    info(`Dry run, not writing lockfile`)
  } else {
    await writeFile(lockfilePath, JSON.stringify(lockfile, null, 2) + '\n')
    info(`Written lockfile to: ${lockfilePath}`)
  }

  // Write CHANGELOG.md
  const currentContents = existsSync(changelogPath)
    ? await readFile(changelogPath, 'utf8')
    : '# Changelog\n\n'
  const changelogContents = buildChangelog(upcomingVersion, changelog)
  if (dryRun) {
    info(`Dry run, not writing changelog`)
  } else {
    await writeFile(
      changelogPath,
      currentContents.replace(
        '# Changelog\n\n',
        `# Changelog\n\n${changelogContents.join('\n')}\n\n`
      )
    )
    info(`Written changelog to: ${changelogPath}`)
  }

  // Commit and push changes
  const title = `chore: release ${upcomingVersion}`
  if (dryRun) {
    info(`Dry run, not committing and pushing changes`)
  } else {
    await gitAdd()
    await gitSetAuthor('Exivity bot', 'bot@exivity.com')
    await gitCommit(title)
    await gitPush(true)
    info(`Written changes to branch: ${upcomingReleaseBranch}`)
  }

  // Create or update pull request
  if (dryRun) {
    info(`Dry run, not creating pull request`)
  } else {
    const pr = await createOrUpdatePullRequest({
      octokit,
      title,
      prTemplate,
      changelogContents,
      upcomingReleaseBranch,
      releaseBranch,
    })
    info(pr.html_url)
  }
}
