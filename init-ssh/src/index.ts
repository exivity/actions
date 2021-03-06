import { getInput, setFailed } from '@actions/core'
import { exec } from '@actions/exec'
import path from 'path'

async function run() {
  try {
    // Input
    const privateKey = getInput('private-key')

    // Execute init-ssh bash script
    await exec('bash init-ssh.sh', undefined, {
      cwd: path.resolve(__dirname, '..'),
      env: {
        ...process.env,
        PRIVATE_KEY: privateKey,
      },
    })
  } catch (error) {
    setFailed(error.message)
  }
}

run()
