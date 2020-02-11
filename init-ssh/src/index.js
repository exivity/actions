const path = require('path')
const { getInput, setFailed } = require('@actions/core')
const { exec } = require('@actions/exec')

async function run() {
  try {
    // Input
    const privateKey = getInput('private-key')

    // Execute init-ssh bash script
    await exec('bash init-ssh.sh', undefined, {
      cwd: path.resolve(__dirname, '..'),
      env: {
        PRIVATE_KEY: privateKey
      }
    })
  } catch (error) {
    setFailed(error.message)
  }
}

run()
