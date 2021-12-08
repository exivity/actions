import { debug, getInput, info, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import glob from 'glob-promise'
import {
  DevelopBranches,
  getRef,
  getRepository,
  getSha,
  getToken,
  isDevelopBranch,
  isReleaseBranch,
  ReleaseBranches,
} from '../../lib/github'
import {
  AnalysisResult,
  guiUrlToId,
  idToGuiUrl,
  VirusTotal,
} from './virustotal'

type CommitStatus = Awaited<
  ReturnType<
    ReturnType<typeof getOctokit>['rest']['repos']['listCommitStatusesForRef']
  >
>['data'][number]

const ModeAnalyse = 'analyse'
const ModeCheck = 'check'

async function analyse(vt: VirusTotal, filePath: string) {
  const result = await vt.scanFile(filePath)
  info(`File "${filePath}" has been submitted for a scan`)
  info(`Analysis URL: ${idToGuiUrl(result.id)}`)
  return result
}

async function check(vt: VirusTotal, commitStatus: CommitStatus) {
  return vt.getFileReport(guiUrlToId(commitStatus.target_url))
}

async function writeStatus(
  octokit: ReturnType<typeof getOctokit>,
  result: AnalysisResult
) {
  await octokit.rest.repos.createCommitStatus({
    owner: 'exivity',
    repo: getRepository().component,
    sha: getSha(),
    state:
      result.status === 'pending'
        ? 'pending'
        : result.flagged === 0
        ? 'success'
        : 'failure',
    context: `virustotal (${result.filename})`,
    description:
      result.status === 'completed'
        ? `Detected as malicious or suspicious (${result.flagged} times)`
        : undefined,
    target_url: idToGuiUrl(result.id),
  })
  info('Written commit status')
}

async function getPendingVirusTotalStatuses(
  octokit: ReturnType<typeof getOctokit>
) {
  const refs = [...ReleaseBranches, ...DevelopBranches]
  const statuses: CommitStatus[] = []
  for (const ref of refs) {
    info(`Checking all statuses for ${ref}`)
    try {
      const { data } = await octokit.rest.repos.listCommitStatusesForRef({
        owner: 'exivity',
        repo: 'merlin', // @TODO: getRepository().component, // also revert GH_BOT_TOKEN -> GITHUB_TOKEN
        ref,
      })
      for (const status of data) {
        if (
          status.context.startsWith('virustotal') &&
          status.state === 'pending'
        ) {
          debug(`Found virustotal status "${status.context}"`)
          statuses.push(status)
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('Not Found')) {
          debug(`No commits found for branch ${ref}`)
        } else {
          throw error
        }
      }
    }
  }

  return statuses
}

async function run() {
  // Inputs
  const mode = getInput('mode')
  const virustotalApiKey = getInput('virustotal-api-key', {
    required: true,
  })
  const ghToken = getToken()

  // Libs
  const vt = new VirusTotal(virustotalApiKey)
  const octokit = getOctokit(ghToken)

  switch (mode) {
    case ModeAnalyse:
      // Inputs
      const path = getInput('path', { required: true })

      // Do not run on non-release and non-develop branches
      if (!isReleaseBranch() && !isDevelopBranch()) {
        info(`Skipping: feature branch "${getRef()}" is ignored`)
        return
      }

      // Obtain absolute paths
      const absPaths = await glob(path, { absolute: true })
      debug(`Absolute path to file(s): "${absPaths.join(', ')}"`)

      // Run
      for (const absPath of absPaths) {
        const result = await analyse(vt, absPath)
        await writeStatus(octokit, result)
      }

      break
    case ModeCheck:
      // Run
      for (const pendingStatus of await getPendingVirusTotalStatuses(octokit)) {
        const result = await check(vt, pendingStatus)
        await writeStatus(octokit, result)
      }
      break
    default:
      throw new Error(`Unknown mode "${mode}"`)
  }
}

run().catch(setFailed)
