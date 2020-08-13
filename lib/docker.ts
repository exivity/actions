import { getInput, info } from '@actions/core'
import { exec } from '@actions/exec'
import path from 'path'

type Options = {
  defaultVersion: string
  image: string
}

export async function startDocker({ defaultVersion, image }: Options) {
  const version = getInput('version') || defaultVersion

  info(`About to start a Docker container from ${image}:${version}`)

  // Execute start-docker bash script
  await exec('bash start-docker.sh', undefined, {
    // Once bundled, executing file will be /{action-name}/dist/index.js
    cwd: path.resolve(__dirname, '..', '..', 'lib'),
    env: {
      IMAGE: image,
      TAG: version,
    },
  })
}
