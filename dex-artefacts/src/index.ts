import { getInput, setFailed } from '@actions/core'
import { startDex } from '../../lib'

async function run() {
  try {
    // Input
    const channel = getInput('channel')
    const awsKeyId =
      getInput('aws-access-key-id') || process.env['AWS_ACCESS_KEY_ID']
    const awsSecretKey =
      getInput('aws-secret-access-key') || process.env['AWS_SECRET_ACCESS_KEY']

    console.log(process.env, { awsKeyId, awsSecretKey })

    // Assertions
    if (!awsKeyId || !awsSecretKey) {
      throw new Error('A required argument is missing')
    }

    // Override channel if set
    const channelArg = channel ? `--channel ${channel}` : ''

    // Construct env vars
    const env = {
      ...process.env,
      AWS_ACCESS_KEY_ID: awsKeyId,
      AWS_SECRET_ACCESS_KEY: awsSecretKey,
    }

    await startDex({ cmd: `artefacts create ${channelArg} .`, env })
    await startDex({ cmd: `artefacts accept ${channelArg} .`, env })
    await startDex({ cmd: `artefacts publish ${channelArg} .`, env })
  } catch (error) {
    setFailed(error.message)
  }
}

run()
