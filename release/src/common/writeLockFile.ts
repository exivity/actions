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
          repositories.map(
            async ({ component, sourceRepo, sourcePath, releaseBranch }) => {
              const sha = await getLastCommitSha({
                octokit,
                owner: 'exivity',
                repo: sourceRepo,
                sha: releaseBranch,
                path: sourcePath,
              })

              if (!sha) {
                throw new Error(
                  `Could not resolve release artifact SHA for ${component} from exivity/${sourceRepo}#${releaseBranch}${sourcePath ? ` (${sourcePath})` : ''}`,
                )
              }

              return sha
            },
          ),
        ),
      ),
    }

    await writeFile(lockFilePath, JSON.stringify(lockfile, null, 2) + '\n')

    info(`Written lockfile to: ${lockFilePath}`)
  }
}
