import { getOctokit } from '@actions/github'
import { info } from '@actions/core'
import { writeFile } from 'fs/promises'
import { zipObj } from 'ramda'

import { getLastCommitSha } from '../../../lib/github'
import { REPOSITORY_RELEASE_BRANCH } from '../changelog'

type Octokit = ReturnType<typeof getOctokit>

export async function getRepositoriesLastSha(
  octokit: Octokit,
  repositories: string[]
) {
  const shas = repositories.map((repository) =>
    getLastCommitSha({
      octokit,
      owner: 'exivity',
      repo: repository,
      sha: REPOSITORY_RELEASE_BRANCH,
    })
  )

  return Promise.all(shas)
}

export type Lockfile = {
  version: string
  repositories: {
    [repository: string]: string
  }
}

export async function writeLockFile(
  dryRun: boolean,
  octokit: Octokit,
  version: string,
  repositories: string[],
  lockfilePath: string
) {
  if (dryRun) {
    info(`Dry run, not writing lockfile`)
  } else {
    const lockfile: Lockfile = {
      version,
      repositories: zipObj(
        repositories,
        await getRepositoriesLastSha(octokit, repositories)
      ),
    }

    await writeFile(lockfilePath, JSON.stringify(lockfile, null, 2) + '\n')

    info(`Written lockfile to: ${lockfilePath}`)
  }
}
