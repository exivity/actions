import { getOctokit } from '@actions/github'

import { readLockfile } from './common/files'
import { tagAllRepositories } from './common/gitUpdates'

export async function release({
  octokit,
  lockfilePath,
  dryRun,
}: {
  octokit: ReturnType<typeof getOctokit>
  lockfilePath: string
  dryRun: boolean
}) {
  const lockfile = await readLockfile(lockfilePath)

  await tagAllRepositories(dryRun, lockfile, octokit)
}
