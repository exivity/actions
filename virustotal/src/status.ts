import { debug, info } from '@actions/core'
import { getOctokit } from '@actions/github'
import {
  getRepository,
  getSha,
  getShaFromRef,
  STANDARD_BRANCH,
  writeStatus as writeStatusGitHub,
} from '../../lib/github'
import { AnalysisResult, filehashToGuiUrl } from './virustotal'

export type CommitStatus = Awaited<
  ReturnType<
    ReturnType<typeof getOctokit>['rest']['repos']['listCommitStatusesForRef']
  >
>['data'][number] & { sha: string }

export async function getPendingVirusTotalStatuses(
  octokit: ReturnType<typeof getOctokit>,
) {
  const ref = STANDARD_BRANCH
  const statuses: CommitStatus[] = []

  info(`Checking all statuses for ${ref}`)
  try {
    const { owner, repo } = getRepository()
    const sha = await getShaFromRef({
      octokit,
      owner,
      repo,
      ref,
    })
    const { data } = await octokit.rest.repos.listCommitStatusesForRef({
      owner,
      repo,
      ref: sha,
    })
    debug(`Total statuses: ${data.length}`)
    // Results are in reverse chronological order, ignore any non-unique
    // subsequent statuses
    const uniqueStatuses = data.filter(
      (status, i, arr) =>
        arr.findIndex((s) => s.context === status.context) === i,
    )
    debug(`Total unique statuses: ${uniqueStatuses.length}`)
    if (!uniqueStatuses.length) {
      info(`No pending virustotal statuses found`)
    } else {
      for (const status of uniqueStatuses) {
        if (
          status.context.startsWith('virustotal') &&
          status.state === 'pending'
        ) {
          info(`Found pending virustotal status "${status.context}"`)
          statuses.push({ ...status, sha })
        }
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (
        error.message.includes('Not Found') ||
        error.message.includes('Branch not found')
      ) {
        info(`No commits found for branch ${ref}`)
      } else {
        throw error
      }
    }
  }

  return statuses
}

export async function writeStatus(
  octokit: ReturnType<typeof getOctokit>,
  result: AnalysisResult,
  sha?: string,
) {
  const { owner, repo } = getRepository()
  return writeStatusGitHub({
    octokit,
    owner,
    repo,
    sha: sha ?? getSha(),
    state:
      result.status === 'pending'
        ? 'pending'
        : result.flagged === 0
        ? 'success'
        : 'failure',
    context: `virustotal (${result.filename})`,
    description:
      result.status === 'completed'
        ? result.flagged
          ? `Detected as malicious or suspicious by ${result.flagged} security vendors`
          : 'No security vendors flagged this file as malicious'
        : undefined,
    target_url: filehashToGuiUrl(result.filehash),
  })
}
