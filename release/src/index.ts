import { getInput, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getBooleanInput } from '../../lib/core'
import { getToken } from '../../lib/github'
import { ping } from './ping'
import { prepare } from './prepare'
import { release } from './release'

const ModePing = 'ping'
const ModePrepare = 'prepare'
const ModeRelease = 'release'

async function run() {
  // Inputs
  const mode = getInput('mode')
  const dryRun = getBooleanInput('dry-run', false)
  const ghToken = getToken()

  // Libs
  const octokit = getOctokit(ghToken)

  // Action
  const fn =
    mode === ModePing
      ? ping
      : mode === ModePrepare
      ? prepare
      : mode === ModeRelease
      ? release
      : null

  if (fn === null) {
    throw new Error(`Unknown mode "${mode}"`)
  }

  await fn({ octokit, dryRun })
}

run().catch(setFailed)
