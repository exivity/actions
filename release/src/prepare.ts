import { getOctokit } from '@actions/github'
import { info } from 'console'
import { writeFile } from 'fs/promises'
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
import { formatPrChangelog } from './changelogFormatters'
import {
  createChangelogItemFromCommit,
  prepareChangelog,
  write_to_changelog,
} from './common/changelog'
import { DEFAULT_REPOSITORY_RELEASE_BRANCH } from './common/consts'
import { readRepositories, readTextFile } from './common/files'
import type { getJiraClient } from './common/jiraClient'
import { createOrUpdatePullRequest } from './common/pr'
import { ChangelogItem, Commit, Lockfile } from './common/types'
import { inferVersionFromChangelog } from './common/version'

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
  const prTemplate = await readTextFile(prTemplatePath)
  const latestVersion = await getLatestVersion()

  let [changelog, lockfile] = await checkRepositories(
    repositoriesJsonPath,
    latestVersion,
    octokit
  )

  changelog = await prepareChangelog(changelog, octokit, jiraClient)
  if (changelog.length === 0) {
    return
  }

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
  await write_to_changelog(changelogPath, changelog, upcomingVersion, dryRun)

  // Commit and push changes
  const title = await commit_and_push(
    dryRun,
    upcomingVersion,
    upcomingReleaseBranch
  )

  // Set status on commit
  await update_commit_status(dryRun, changelog, octokit)

  // Create or update pull request
  await update_pr(
    dryRun,
    upcomingVersion,
    title,
    prTemplate,
    upcomingReleaseBranch,
    releaseBranch,
    changelog,
    octokit
  )
}

async function checkRepositories(
  repositoriesJsonPath: string,
  latestVersion: string,
  octokit: ReturnType<typeof getOctokit>
): Promise<[ChangelogItem[], Lockfile]> {
  const pendingCommits: Commit[] = []
  let changelog: ChangelogItem[] = []
  const lockfile: Lockfile = { version: '', repositories: {} }
  const repositories = await readRepositories(repositoriesJsonPath)

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

  return [changelog, lockfile]
}

async function commit_and_push(
  dryRun: boolean,
  upcomingVersion: string,
  upcomingReleaseBranch: string
): Promise<string> {
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
  return title
}

async function update_commit_status(
  dryRun: boolean,
  changelog: ChangelogItem[],
  octokit: ReturnType<typeof getOctokit>
) {
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
}

async function update_pr(
  dryRun: boolean,
  upcomingVersion: string,
  title: string,
  prTemplate: string,
  upcomingReleaseBranch: string,
  releaseBranch: string,
  changelog: ChangelogItem[],
  octokit: ReturnType<typeof getOctokit>
) {
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
}
