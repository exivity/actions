import { getInput, info } from '@actions/core'
import { exec } from '@actions/exec'
import path from 'path'

type Options = {
  cmd?: string
  env?: { [key: string]: string }
}

export async function startDex({ cmd, env }: Options) {
  // Use this Docker image tag
  const tag = getInput('tag') || 'latest'

  // Path/cwd input will be used as the Docker mount path in the dex-start bash
  // script
  const cwd = getInput('path') || getInput('cwd') || '.'

  // Env vars
  const envOptions = Object.keys(env || {})
    .map((key) => `--env "${key}=${env[key]}"`)
    .join(' ')

  console.log(envOptions)

  info(`About to start a Dex container`)

  // Execute docker-start script
  await exec(`bash dex-start.sh ${cmd}`, undefined, {
    // Once bundled, executing file will be /{action-name}/dist/index.js
    cwd: path.resolve(__dirname, '..', '..', 'lib'),
    env: {
      CWD: cwd,
      TAG: tag,
      ENV: envOptions,
      GITHUB_WORKSPACE: process.env['GITHUB_WORKSPACE'],
    },
  })
}
