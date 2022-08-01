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
import { writeStatus } from '../../lib/github'
import { formatPrChangelog } from './changelogFormatters'
import {
  createChangelogItemFromCommit,
  prepareChangelog,
  writeToChangelog,
} from './common/changelog'
import { checkRepositories } from './common/repositories'
import { readTextFile } from './common/files'
import type { getJiraClient } from './common/jiraClient'
import { createOrUpdatePullRequest } from './common/pr'
import { ChangelogItem } from './common/types'
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
    return []
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
  await writeToChangelog(changelogPath, changelog, upcomingVersion, dryRun)

  // Commit and push changes
  const title = await commitAndPush(
    dryRun,
    upcomingVersion,
    upcomingReleaseBranch
  )

  // Set status on commit
  await updateCommitStatus(dryRun, changelog, octokit)

  // Create or update pull request
  await updatePr(
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

async function commitAndPush(
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

async function updateCommitStatus(
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

async function updatePr(
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
