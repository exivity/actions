import { getInput, setFailed } from '@actions/core'
import { exec } from '@actions/exec'
import path from 'path'

type Options = {
  defaultVersion: string
  image: string
}

export async function dockerAction({ defaultVersion, image }: Options) {
  try {
    // Input
    const version = getInput('version') || defaultVersion

    // Execute start-docker bash script
    await exec('bash start-docker.sh', undefined, {
      // Once bundled, executing file will be */dist/index.js
      cwd: path.resolve(__dirname, '..', '..'),
      env: {
        IMAGE: image,
        TAG: version,
      },
    })
  } catch (error) {
    setFailed(error.message)
  }
}
