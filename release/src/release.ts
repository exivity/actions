import { info } from '@actions/core'
import { getOctokit } from '@actions/github'
import { readFile } from 'fs/promises'
import { Repositories } from '.'
import { gitPushTags, gitTag } from '../../lib/git'
import { getEventData, getEventName, getRepository } from '../../lib/github'
import { Lockfile } from './types'

export async function release({
  octokit,
  lockfilePath,
  repositoriesJsonPath,
  dryRun,
}: {
  octokit: ReturnType<typeof getOctokit>
  lockfilePath: string
  repositoriesJsonPath: string
  dryRun: boolean
}) {
  // Variables
  const eventName = getEventName(['push'])
  const eventData = getEventData(eventName)
  const repository = getRepository()

  // Read repositories and lockfile
  let repositories: Repositories
  try {
    repositories = JSON.parse(await readFile(repositoriesJsonPath, 'utf8'))
  } catch (error: unknown) {
    throw new Error(
      `Can't read "${repositoriesJsonPath}" or it's not valid JSON`
    )
  }

  let lockfile: Lockfile
  try {
    lockfile = JSON.parse(await readFile(lockfilePath, 'utf8'))
  } catch (error: unknown) {
    throw new Error(`Can't read "${lockfilePath}" or it's not valid JSON`)
  }

  // Tag current commit with version
  if (dryRun) {
    info(`Dry run, not tagging ${repository.fqn}`)
  } else {
    await gitTag(lockfile.version)
    await gitPushTags()
    info(`Pushed tag ${lockfile.version}`)
  }
}
