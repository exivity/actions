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
import { AnalysisResult, VirusTotal } from './virustotal'

const ModeAnalyse = 'analyse'
const ModeCheck = 'check'

async function analyse(vt: VirusTotal, filePath: string) {
  const result = await vt.scanFile(filePath)
  info(`File "${filePath}" has been submitted for a scan`)
  info(`Analysis URL: ${result.url}`)
  return result
}

async function check(vt: VirusTotal, commitStatus: AnalysisResult) {}

async function writeStatus(
  octokit: ReturnType<typeof getOctokit>,
  result: AnalysisResult
) {
  await octokit.rest.repos.createCommitStatus({
    owner: 'exivity',
    repo: getRepository().component,
    sha: getSha(),
    state: 'pending',
    context: `virustotal (${result.filename})`,
    target_url: result.url,
  })
  info('Written commit status')
}

async function getPendingVirusTotalStatuses(
  octokit: ReturnType<typeof getOctokit>
) {
  const refs = [...ReleaseBranches, ...DevelopBranches]
  for (const ref of refs) {
    info(`Checking statuses for ${ref}`)
    try {
      const { data: statuses } =
        await octokit.rest.repos.listCommitStatusesForRef({
          owner: 'exivity',
          repo: 'merlin', // @TODO: getRepository().component, // also revert GH_BOT_TOKEN -> GITHUB_TOKEN
          ref,
        })
      for (const status of statuses) {
        info(`Got status "${JSON.stringify(status, null, 2)}"`)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('No commit found for SHA:')) {
          debug(`No commits found for branch ${ref}`)
        } else {
          throw error
        }
      }
    }
  }

  return []
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
        // await writeStatus(octokit, result)
      }
      break
    default:
      throw new Error(`Unknown mode "${mode}"`)
  }
}

run().catch(setFailed)
