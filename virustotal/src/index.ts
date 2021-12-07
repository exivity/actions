import { debug, getInput, info, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import glob from 'glob-promise'
import {
  getRef,
  getRepository,
  getSha,
  getToken,
  isDevelopBranch,
  isReleaseBranch,
} from '../../lib/github'
import { AnalysisResult, VirusTotal } from './virustotal'

async function analyse(vt: VirusTotal, filePath: string) {
  const result = await vt.scanFile(filePath)
  info(`File "${filePath}" has been submitted for a scan`)
  info(`Analysis URL: ${result.url}`)
  return result
}

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

async function run() {
  // Inputs
  const path = getInput('path', { required: true })
  const virustotalApiKey = getInput('virustotal-api-key', {
    required: true,
  })
  const ghToken = getToken()

  // Do not run on non-release and non-develop branches
  if (!isReleaseBranch() && !isDevelopBranch()) {
    info(`Skipping: feature branch "${getRef()}" is ignored`)
    return
  }

  const vt = new VirusTotal(virustotalApiKey)
  const octokit = getOctokit(ghToken)

  // Obtain absolute paths
  const absPaths = await glob(path, { absolute: true })
  debug(`Absolute path to file(s): "${absPaths.join(', ')}"`)

  for (const absPath of absPaths) {
    const result = await analyse(vt, absPath)
    await writeStatus(octokit, result)
  }
}

run().catch(setFailed)
