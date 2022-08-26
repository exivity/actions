import { getOctokit } from '@actions/github'
import { info } from 'console'

import { getRecentVersion } from '../../../lib/git'
import {
  getCommitForTag,
  getCommitsSince,
  getCommitsBetween,
} from '../../../lib/github'

export const DEFAULT_REPOSITORY_RELEASE_BRANCH = 'main'

type Octokit = ReturnType<typeof getOctokit>

export const getRepoCommits =
  (octokit: Octokit) => async (repository: string) => {
    const latestVersion = await getRecentVersion(0)

    info(`- exivity/${repository}`)
    // Find commit for latest version tag in target repository
    const latestVersionCommit = await getCommitForTag({
      octokit,
      owner: 'exivity',
      repo: repository,
      tag: latestVersion,
    })

    // Get a list of commits from the last version
    return await getCommitsSince({
      octokit,
      owner: 'exivity',
      repo: repository,
      branch: DEFAULT_REPOSITORY_RELEASE_BRANCH,
      since: latestVersionCommit,
    })
  }

export const getRepoCommitsForOlderVersion =
  (octokit: Octokit, versionsSince: number) => async (repository: string) => {
    const olderVersion = await getRecentVersion(versionsSince)
    const versionAfter = await getRecentVersion(versionsSince - 1)

    info(`- exivity/${repository}`)
    // Find commit for latest version tag in target repository
    const olderVersionCommit = await getCommitForTag({
      octokit,
      owner: 'exivity',
      repo: repository,
      tag: olderVersion,
    })
    const versionAfterCommit = await getCommitForTag({
      octokit,
      owner: 'exivity',
      repo: repository,
      tag: versionAfter,
    })

    // Get a list of commits from the last version
    return await getCommitsBetween({
      octokit,
      owner: 'exivity',
      repo: repository,
      branch: DEFAULT_REPOSITORY_RELEASE_BRANCH,
      since: olderVersionCommit,
      until: versionAfterCommit,
    })
  }
