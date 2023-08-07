import { debug, getInput, info, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import glob from 'glob-promise'
import { getRef, getToken, isReleaseBranch } from '../../lib/github'
import {
  CommitStatus,
  getPendingVirusTotalStatuses,
  writeStatus,
} from './status'
import { filehashToGuiUrl, guiUrlToFilehash, VirusTotal } from './virustotal'

const Debug = false

const ModeAnalyse = 'analyse'
const ModeCheck = 'check'

async function analyse(vt: VirusTotal, filePath: string) {
  const uploadUrl = await vt.getFileUploadURL()
  const result = await vt.uploadFile(filePath, uploadUrl)
  info(`File "${filePath}" has been submitted for a scan`)
  info(`Analysis URL: ${filehashToGuiUrl(result.filehash)}`)
  return result
}

async function check(vt: VirusTotal, commitStatus: CommitStatus) {
  const result = await vt.getFileReport(
    guiUrlToFilehash(commitStatus.target_url),
  )
  info(
    `Current status is "${result.status}" with "${result.flagged}" flags from security vendors`,
  )
  return result
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
      // Also check for a debug flag, so we can test this in a PR
      if (!Debug && !isReleaseBranch()) {
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
        await writeStatus(octokit, result, pendingStatus.sha)
      }
      break
    default:
      throw new Error(`Unknown mode "${mode}"`)
  }
}

run().catch(setFailed)
