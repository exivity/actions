import { getInput, setFailed, exportVariable } from '@actions/core'
import { getExecOutput } from '@actions/exec'
import path from 'path'

async function run() {
  // Input
  const privateKey = getInput('private-key')

  // Execute init-ssh bash script
  const output = await getExecOutput('bash init-ssh.sh', undefined, {
    cwd: path.resolve(__dirname, '..'),
    env: {
      ...process.env,
      PRIVATE_KEY: privateKey,
    },
  })

  output.stdout.split('\n').forEach((line) => {
    const matches = /^(SSH_AUTH_SOCK|SSH_AGENT_PID)=(.*);/.exec(line)

    if (matches && matches.length > 0) {
      exportVariable(matches[1], matches[2])
    }
  })
}

run().catch(setFailed)
