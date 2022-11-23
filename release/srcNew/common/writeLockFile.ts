import { info } from 'console'
import { zipObj } from 'ramda'
import { writeFile } from 'fs/promises'

import { getLastCommitSha, STANDARD_BRANCH } from '../../../lib/github'
import {
  isDryRun,
  getOctoKitClient,
  getRepositories,
  getLockFilePath,
  Lockfile,
} from './inputs'

export async function writeLockFile(version: string) {
  if (isDryRun()) {
    info(`Dry run, not writing lockfile`)
  } else {
    const repositories = await getRepositories()
    const octokit = getOctoKitClient()
    const lockFilePath = getLockFilePath()

    const lockfile: Lockfile = {
      version,
      repositories: zipObj(
        repositories,
        await Promise.all(
          repositories.map((repository) =>
            getLastCommitSha({
              octokit,
              owner: 'exivity',
              repo: repository,
              sha: STANDARD_BRANCH,
            })
          )
        )
      ),
    }

    await writeFile(lockFilePath, JSON.stringify(lockfile, null, 2) + '\n')

    info(`Written lockfile to: ${lockFilePath}`)
  }
}
