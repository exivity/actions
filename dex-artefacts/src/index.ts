import { getInput, setFailed, warning } from '@actions/core'
import { platform } from 'os'
import { startDexBinary, startDexDocker } from '../../lib/dex'

const ACCEPT_BY_DEFAULT = false

async function run() {
  try {
    // Input
    const channel = getInput('channel')
    const accept = !!(getInput('accept') || ACCEPT_BY_DEFAULT)
    const mode = getInput('mode') || 'binary'
    const awsKeyId =
      getInput('aws-access-key-id') || process.env['AWS_ACCESS_KEY_ID']
    const awsSecretKey =
      getInput('aws-secret-access-key') || process.env['AWS_SECRET_ACCESS_KEY']

    // Assertions
    if (!awsKeyId || !awsSecretKey) {
      throw new Error('A required argument is missing')
    }

    if (mode !== 'docker' && mode !== 'binary') {
      throw new Error(`Mode must be 'docker' or 'binary'`)
    }

    // Override channel if set
    const channelArg = channel ? `--channel ${channel}` : ''

    // Construct env vars
    const env = {
      CI: 'true',
      AWS_ACCESS_KEY_ID: awsKeyId,
      AWS_SECRET_ACCESS_KEY: awsSecretKey,
    }

    let dexFn: typeof startDexDocker | typeof startDexBinary
    let additionalAcceptArgs = ''

    switch (mode) {
      case 'docker':
        dexFn = startDexDocker
        break

      case 'binary':
        dexFn = startDexBinary
        additionalAcceptArgs = '--env docker'
        break
    }

    // Create artefacts
    await dexFn({ cmd: `artefacts create ${channelArg} .`, env })

    // Accept artefacts
    if (accept) {
      if (platform() === 'linux') {
        warning("Linux doesn't support accepting artefacts at the moment.")
      } else {
        await dexFn({
          cmd: `artefacts accept ${channelArg} ${additionalAcceptArgs} .`,
          env,
        })
      }
    }

    // Publish artefacts
    await dexFn({ cmd: `artefacts publish ${channelArg} .`, env })
  } catch (error) {
    setFailed(error.message)
  }
}

run()
