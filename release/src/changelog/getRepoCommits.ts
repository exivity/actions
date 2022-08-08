import { getOctokit } from '@actions/github'
import { info } from 'console'
import { curry } from 'ramda'

import { getLatestVersion } from '../../../lib/git'
import { getCommitForTag, getCommitsSince, Commit } from '../../../lib/github'

export const DEFAULT_REPOSITORY_RELEASE_BRANCH = 'main'

type Octokit = ReturnType<typeof getOctokit>

export const getRepoCommits =
  (octokit: Octokit) => async (repository: string) => {
    const latestVersion = await getLatestVersion()

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
