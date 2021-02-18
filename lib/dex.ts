import { getInput, info } from '@actions/core'
import { exec } from '@actions/exec'
import path from 'path'

type Options = {
  cmd?: string
  env?: { [key: string]: string }
}

export async function startDexDocker({ cmd, env }: Options) {
  // Use this Docker image tag
  const tag = getInput('tag') || 'latest'

  // Path/cwd input will be used as the Docker mount path in the dex-start bash
  // script
  const cwd = getInput('path') || getInput('cwd') || '.'

  // Env vars
  const envOptions = Object.keys(env || {})
    .map((key) => `--env ${key}=${(env || {})[key]}`)
    .join(' ')

  info(`About to start a Dex container`)

  // Execute docker-start script
  await exec(`bash dex-docker-start.sh ${cmd}`, undefined, {
    // Once bundled, executing file will be /{action-name}/dist/index.js
    cwd: path.resolve(__dirname, '..', '..', 'lib'),
    env: {
      ...process.env,
      CWD: cwd,
      TAG: tag,
      ENV: envOptions,
    },
  })
}

export async function startDexBinary({ cmd, env }: Options) {
  // Path/cwd input will be used as the cwd for the dex binary
  const cwd = getInput('path') || getInput('cwd') || '.'

  info(`About to start the Dex binary`)

  // Execute docker-start script
  await exec(`bash dex-binary-start.sh ${cmd}`, undefined, {
    // Once bundled, executing file will be /{action-name}/dist/index.js
    cwd: path.resolve(__dirname, '..', '..', 'lib'),
    env: {
      ...process.env,
      CWD: cwd,
      ...env,
    },
  })
}
