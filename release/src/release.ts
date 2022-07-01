import { info } from '@actions/core'
import { getOctokit } from '@actions/github'
import { gitPushTags, gitTag, getJiraIdsFromLatestTag } from '../../lib/git'
import { createLightweightTag, getRepository } from '../../lib/github'
import { readLockfile } from './common/files'
import { getJiraClient, transitionToReleased } from './common/jiraClient'

export async function release({
  octokit,
  jiraClient,
  lockfilePath,
  dryRun,
}: {
  octokit: ReturnType<typeof getOctokit>
  jiraClient: ReturnType<typeof getJiraClient>
  lockfilePath: string
  dryRun: boolean
}) {
  // Variables
  const repository = getRepository()

  const lockfile = await readLockfile(lockfilePath)

  // Tag current commit with version
  if (dryRun) {
    info(`Dry run, not tagging ${repository.fqn}`)
  } else {
    await gitTag(lockfile.version)
    await gitPushTags()
    info(`Pushed tag ${lockfile.version} to ${repository.fqn}`)
  }

  // Tag repositories in lockfile
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

  const issueIds = await getJiraIdsFromLatestTag()

  info(`Transitioning:`)
  info(`${issueIds.join('\n')}`)

  await Promise.all(
    issueIds.map((issueIdOrKey) => {
      return transitionToReleased(issueIdOrKey, jiraClient)
    })
  ).then(() => {
    issueIds.forEach((issueIdOrKey) => {
      info(`Transitioned issue ${issueIdOrKey} to released`)
    })
  })
}
