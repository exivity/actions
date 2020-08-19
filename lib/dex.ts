import { getInput, info } from '@actions/core'
import { exec } from '@actions/exec'
import path from 'path'

type Options = {
  cmd?: string
  env?: { [key: string]: string }
}

export async function startDex({ cmd, env }: Options) {
  // Input
  const tag = getInput('tag') || 'latest'
  const cwd = getInput('cwd') || 'cwd'

  // Env vars
  const envOptions = Object.keys(env || {})
    .map((key) => `--env ${key}="${env[key]}"`)
    .join(' ')

  info(`About to start a Dex container`)

  // Execute docker-start script
  await exec(`bash dex-start.sh ${cmd}`, undefined, {
    // Once bundled, executing file will be /{action-name}/dist/index.js
    cwd: path.resolve(__dirname, '..', '..', 'lib'),
    env: {
      CWD: cwd,
      TAG: tag,
      ENV_OPTIONS: envOptions,
      GITHUB_WORKSPACE: process.env['GITHUB_WORKSPACE'],
    },
  })
}
