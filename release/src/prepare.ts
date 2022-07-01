import { getOctokit } from '@actions/github'
import { info } from 'console'
import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import {
  getCommitSha,
  getLatestVersion,
  gitAdd,
  gitCommit,
  gitForceSwitchBranch,
  gitHasChanges,
  gitPush,
  gitSetAuthor,
} from '../../lib/git'
import { getCommitForTag, getCommitsSince, writeStatus } from '../../lib/github'
import { formatPrChangelog, formatPublicChangelog } from './changelogFormatters'
import { runPlugins } from './changelogPlugins'
import {
  byDate,
  byType,
  createChangelogItemFromCommit,
  noChores,
} from './common/changelog'
import { DEFAULT_REPOSITORY_RELEASE_BRANCH } from './common/consts'
import { readRepositories, readTextFile } from './common/files'
import type { getJiraClient } from './common/jiraClient'
import { createOrUpdatePullRequest } from './common/pr'
import { ChangelogItem, Commit, Lockfile } from './common/types'
import { inferVersionFromChangelog } from './common/version'

function isString(x: any): x is string {
  return typeof x === 'string'
}

export async function prepare({
  octokit,
  jiraClient,
  lockfilePath,
  changelogPath,
  repositoriesJsonPath,
  prTemplatePath,
  upcomingReleaseBranch,
  releaseBranch,
  dryRun,
}: {
  octokit: ReturnType<typeof getOctokit>
  jiraClient: ReturnType<typeof getJiraClient>
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
  const pendingCommits: Commit[] = []
  const lockfile: Lockfile = { version: '', repositories: {} }
  const repositories = await readRepositories(repositoriesJsonPath)
  const prTemplate = await readTextFile(prTemplatePath)
  const latestVersion = await getLatestVersion()

  // Iterate over repositories
  info(`Iterating repositories`)
  for (const [repository, repositoryOptions] of Object.entries(repositories)) {
    info(`- exivity/${repository}`)
    // Find commit for latest version tag in target repository
    const latestVersionCommit = await getCommitForTag({
      octokit,
      owner: 'exivity',
      repo: repository,
      tag: latestVersion,
    })

    // Get a list of commits from the last version
    const repoCommits = await getCommitsSince({
      octokit,
      owner: 'exivity',
      repo: repository,
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
      changelog.push(createChangelogItemFromCommit(commit))
    })
  }

  // Filter out chores
  changelog = changelog.filter(noChores)

  // Sort notes by date
  changelog.sort(byDate)

  // Run changelog plugins
  changelog = await runPlugins({ octokit, jiraClient, changelog })

  // Sort notes by type, feat first, then fix
  changelog.sort(byType)

  // Filter out chores again (plugins may have changed types)
  changelog = changelog.filter(noChores)

  // If there are no items in the changelog, we have nothing to release
  if (changelog.length === 0) {
    info(`Nothing to release`)
    return []
  }

  // Display summary of notes
  info(`Changelog:`)
  changelog.forEach((item) => {
    info(
      `- [${item.links.commit.repository}] ${item.type}: ${item.title} (${item.links.commit.sha})`
    )
  })

  // Infer upcoming version increment
  const upcomingVersion = inferVersionFromChangelog(latestVersion, changelog)
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
  const currentPublicChangelogContents = existsSync(changelogPath)
    ? await readFile(changelogPath, 'utf8')
    : '# Changelog\n\n'
  const publicChangelogContents = formatPublicChangelog(
    upcomingVersion,
    changelog
  )
  if (dryRun) {
    info(`Dry run, not writing changelog`)
  } else {
    await writeFile(
      changelogPath,
      currentPublicChangelogContents.replace(
        '# Changelog\n\n',
        `# Changelog\n\n${publicChangelogContents}\n\n`
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

  // Set status on commit
  const sha = await getCommitSha()
  if (dryRun) {
    info(`Dry run, no need to write commit status`)
  } else {
    const state = changelog.some((item) => item.warnings.length > 0)
      ? 'pending'
      : 'success'

    await writeStatus({
      octokit,
      owner: 'exivity',
      repo: 'exivity',
      sha,
      state,
      context: 'changelog',
      description:
        state === 'pending'
          ? 'Changelog contains warnings'
          : 'Changelog is good to go!',
    })
  }

  // Create or update pull request
  if (dryRun) {
    info(`Dry run, not creating pull request`)
  } else {
    const prChangelogContents = formatPrChangelog(upcomingVersion, changelog)
    const pr = await createOrUpdatePullRequest({
      octokit,
      title,
      prTemplate,
      changelogContents: prChangelogContents,
      upcomingReleaseBranch,
      releaseBranch,
    })
    info(pr.html_url)
  }

  return changelog.map((item) => item.links.issue?.slug).filter(isString)
}
