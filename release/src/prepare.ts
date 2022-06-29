import { getOctokit } from '@actions/github'
import { info } from 'console'
import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import {
  getLatestVersion,
  gitAdd,
  gitCommit,
  gitForceSwitchBranch,
  gitHasChanges,
  gitPush,
  gitSetAuthor,
} from '../../lib/git'
import { getCommitForTag, getCommitsSince } from '../../lib/github'
import { runPlugins } from './changelogPlugins'
import {
  buildChangelog,
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

  // Sort notes by type, feat first, then fix
  changelog.sort(byType)

  // Run changelog plugins
  changelog = await runPlugins({ octokit, jiraClient, changelog })

  // Filter out chores again (plugins may have changed types)
  changelog = changelog.filter(noChores)

  // @todo filter out duplicated (e.g. epics)

  // If there are no items in the changelog, we have nothing to release
  if (changelog.length === 0) {
    info(`Nothing to release`)
    return
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

    console.log(changelogContents.join('\n'))
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
