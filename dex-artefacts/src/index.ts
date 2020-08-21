import { getInput, setFailed, warning } from '@actions/core'
import { platform } from 'os'
import { startDex } from '../../lib/dex'

const ACCEPT_BY_DEFAULT = false

async function run() {
  try {
    // Input
    const channel = getInput('channel')
    const accept = !!getInput('accept') || ACCEPT_BY_DEFAULT
    const awsKeyId =
      getInput('aws-access-key-id') || process.env['AWS_ACCESS_KEY_ID']
    const awsSecretKey =
      getInput('aws-secret-access-key') || process.env['AWS_SECRET_ACCESS_KEY']

    // Assertions
    if (!awsKeyId || !awsSecretKey) {
      throw new Error('A required argument is missing')
    }

    // Override channel if set
    const channelArg = channel ? `--channel ${channel}` : ''

    // Construct env vars
    const env = {
      CI: 'true',
      AWS_ACCESS_KEY_ID: awsKeyId,
      AWS_SECRET_ACCESS_KEY: awsSecretKey,
    }

    // Create artefacts
    await startDex({ cmd: `artefacts create ${channelArg} .`, env })

    // Accept artefacts
    if (accept) {
      if (platform() === 'linux') {
        warning("Linux doesn't support accepting artefacts at the moment.")
      } else {
        await startDex({ cmd: `artefacts accept ${channelArg} .`, env })
      }
    }

    // Publish artefacts
    await startDex({ cmd: `artefacts publish ${channelArg} .`, env })
  } catch (error) {
    setFailed(error.message)
  }
}

run()
