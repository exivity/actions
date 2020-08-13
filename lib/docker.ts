import { getInput, info } from '@actions/core'
import { exec } from '@actions/exec'
import path from 'path'
import { sluggify } from './string'

type Options = {
  defaultVersion: string
  image: string
  ports: number[]
}

export async function startDocker({ defaultVersion, image, ports }: Options) {
  const version = getInput('version') || defaultVersion
  const portsArg = ports.map((port) => `-p ${port}:${port}`).join(' ')

  info(`About to start a Docker container from ${image}:${version}`)

  // Execute start-docker bash script
  await exec(`bash start-docker.sh ${portsArg}`, undefined, {
    // Once bundled, executing file will be /{action-name}/dist/index.js
    cwd: path.resolve(__dirname, '..', '..', 'lib'),
    env: {
      NAME: sluggify(image),
      IMAGE: image,
      TAG: version,
    },
  })
}
