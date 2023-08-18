import { warning } from '@actions/core'
import { getOctokit } from '@actions/github'
import { info } from 'console'

import {
  gitAdd,
  gitCommit,
  gitForceSwitchBranch,
  gitHasChanges,
  gitPush,
  gitSetAuthor,
} from '../../../lib/git'
import { gitPushTags, gitTag } from '../../../lib/git'
import {
  createLightweightTag,
  getRepository,
  getPrFromRef,
} from '../../../lib/github'
import { JiraIssue } from '../jira/getRepoJiraIssues'

import { formatPrChangelog } from './formatPrChangelog'

import {
  getLockFile,
  getOctoKitClient,
  getPrTemplate,
  isDryRun,
  Lockfile,
} from './inputs'

const releaseBranch = 'main'
const upcomingReleaseBranch = 'chore/upcoming-release'

export async function switchToReleaseBranch() {
  // Switch to upcoming release branch and reset state to current release branch
  if (isDryRun()) {
    info(`Dry run, not switching branches`)
  } else if (await gitHasChanges()) {
    info('Detected uncommitted changes, aborting')
  } else {
    await gitForceSwitchBranch(upcomingReleaseBranch, `origin/${releaseBranch}`)
  }
}

export async function commitAndPush(title: string): Promise<string> {
  if (isDryRun()) {
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

async function tagRepositories(lockfile: Lockfile) {
  const octokit = getOctoKitClient()

  for (const [repository, sha] of Object.entries(lockfile.repositories)) {
    if (isDryRun()) {
      info(`Dry run, not tagging ${repository}`)
    } else {
      try {
        await createLightweightTag({
          octokit,
          owner: 'exivity',
          repo: repository,
          tag: lockfile.version,
          sha,
        })
      } catch (e) {
        warning(`Could not create lightweight tag on ${repository}: ${e}`)
      }
    }
  }
}

export async function tagAllRepositories() {
  const repository = getRepository()
  const dryRun = isDryRun()
  const lockfile = await getLockFile()

  // Tag current commit with version
  if (dryRun) {
    info(`Dry run, not tagging ${repository.fqn}`)
  } else {
    try {
      await gitTag(lockfile.version)
      await gitPushTags()
      info(`Pushed tag ${lockfile.version} to ${repository.fqn}`)
    } catch (e) {
      warning(`Could not push tag to ${repository.fqn}: ${e}`)
    }
  }

  // Tag repositories in lockfile
  await tagRepositories(lockfile)
}

export async function createOrUpdatePullRequest({
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
  changelogContents: string
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
    changelogContents
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

export async function updatePr(title: string, issues: JiraIssue[]) {
  const octokit = getOctoKitClient()
  const prTemplate = await getPrTemplate()

  if (isDryRun()) {
    info(`Dry run, not creating pull request`)
  } else {
    const prChangelogContents = formatPrChangelog(issues)
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
