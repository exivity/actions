import { getOctokit } from '@actions/github'
import { info } from 'console'

import {
  getCommitSha,
  gitAdd,
  gitCommit,
  gitForceSwitchBranch,
  gitHasChanges,
  gitPush,
  gitSetAuthor,
} from '../../../lib/git'
import { writeStatus } from '../../../lib/github'
import { gitPushTags, gitTag } from '../../../lib/git'
import { createLightweightTag, getRepository } from '../../../lib/github'
import { ChangelogItem } from '../changelog'

import { createOrUpdatePullRequest } from './pr'
import { formatPrChangelog } from '../changelogFormatters'
import { readTextFile } from './files'
import { Lockfile } from './lockfile'

export async function switchToReleaseBranch(
  dryRun: boolean,
  releaseBranch: string,
  upcomingReleaseBranch: string
) {
  // Switch to upcoming release branch and reset state to current release branch
  if (dryRun) {
    info(`Dry run, not switching branches`)
  } else if (await gitHasChanges()) {
    info('Detected uncommitted changes, aborting')
  } else {
    await gitForceSwitchBranch(upcomingReleaseBranch, `origin/${releaseBranch}`)
  }
}

export async function commitAndPush(
  dryRun: boolean,
  title: string,
  upcomingReleaseBranch: string
): Promise<string> {
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

export async function updateMissingReleaseNotesWarningStatus(
  dryRun: boolean,
  changelog: ChangelogItem[] = [],
  octokit: ReturnType<typeof getOctokit>
) {
  const sha = await getCommitSha()
  if (dryRun) {
    info(`Dry run, no need to write commit status`)
  } else {
    info(JSON.stringify(changelog))

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

export async function updatePr(
  dryRun: boolean,
  title: string,
  prTemplatePath: string,
  upcomingReleaseBranch: string,
  releaseBranch: string,
  changelog: ChangelogItem[],
  octokit: ReturnType<typeof getOctokit>
) {
  const prTemplate = await readTextFile(prTemplatePath)

  if (dryRun) {
    info(`Dry run, not creating pull request`)
  } else {
    const prChangelogContents = formatPrChangelog(changelog)
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

async function tagRepositories(
  dryRun: boolean,
  lockfile: Lockfile,
  octokit: ReturnType<typeof getOctokit>
) {
  for (const [repository, sha] of Object.entries(lockfile.repositories)) {
    if (dryRun) {
      info(`Dry run, not tagging ${repository}`)
    } else {
      await createLightweightTag({
        octokit,
        owner: 'exivity',
        repo: repository,
        tag: lockfile.version,
        sha,
      })
    }
  }
}

export async function tagAllRepositories(
  dryRun: boolean,
  lockfile: Lockfile,
  octokit: ReturnType<typeof getOctokit>
) {
  const repository = getRepository()

  // Tag current commit with version
  if (dryRun) {
    info(`Dry run, not tagging ${repository.fqn}`)
  } else {
    await gitTag(lockfile.version)
    await gitPushTags()
    info(`Pushed tag ${lockfile.version} to ${repository.fqn}`)
  }

  // Tag repositories in lockfile
  await tagRepositories(dryRun, lockfile, octokit)
}
