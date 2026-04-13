import { info } from 'console'
import { zipObj } from 'ramda'
import { writeFile } from 'fs/promises'

import { getLastCommitSha } from '../../../lib/github'
import {
  isDryRun,
  getOctoKitClient,
  getReleaseRepositories,
  getLockFilePath,
  Lockfile,
} from './inputs'

export async function writeLockFile(version: string) {
  if (isDryRun()) {
    info(`Dry run, not writing lockfile`)
  } else {
    const repositories = await getReleaseRepositories()
    const octokit = getOctoKitClient()
    const lockFilePath = getLockFilePath()

    const lockfile: Lockfile = {
      version,
      repositories: zipObj(
        repositories.map(({ component }) => component),
        await Promise.all(
          repositories.map(({ sourceRepo, releaseBranch }) =>
            getLastCommitSha({
              octokit,
              owner: 'exivity',
              repo: sourceRepo,
              sha: releaseBranch,
            }),
          ),
        ),
      ),
    }

    await writeFile(lockFilePath, JSON.stringify(lockfile, null, 2) + '\n')

    info(`Written lockfile to: ${lockFilePath}`)
  }
}
