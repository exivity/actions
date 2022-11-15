import { getOctokit } from '@actions/github'
import { info } from 'console'

import {
  getCommitForTag,
  getCommitsSince,
  STANDARD_BRANCH,
} from '../../../lib/github'

type Octokit = ReturnType<typeof getOctokit>

export const getRepoCommits =
  (octokit: Octokit, latestVersion: string) => async (repository: string) => {
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
      branch: STANDARD_BRANCH,
      since: latestVersionCommit,
    })
  }
