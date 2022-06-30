import { info } from '@actions/core'
import { getOctokit } from '@actions/github'
import { gitPushTags, gitTag, getAllIssueIdsInLatestTag } from '../../lib/git'
import {
  createLightweightTag,
  getEventData,
  getEventName,
  getRepository,
} from '../../lib/github'
import { readLockfile } from './common/files'
import { getJiraClient, transitionToReleased } from './common/jiraClient'

export async function release({
  octokit,
  jiraClient,
  lockfilePath,
  repositoriesJsonPath,
  dryRun,
}: {
  octokit: ReturnType<typeof getOctokit>
  jiraClient: ReturnType<typeof getJiraClient>
  lockfilePath: string
  repositoriesJsonPath: string
  dryRun: boolean
}) {
  // Variables
  const eventName = getEventName(['push'])
  const eventData = getEventData(eventName)
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

  if (dryRun) {
    info(`Dry run, not transitioning issues`)
  } else {
    const issueIds = await getAllIssueIdsInLatestTag()

    await Promise.all(
      issueIds.map(async (issueIdOrKey) => {
        await transitionToReleased(issueIdOrKey, jiraClient)

        info(`Transitioned issue ${issueIdOrKey} to Released`)
      })
    )
  }
}
