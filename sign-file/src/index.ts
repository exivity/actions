import { getInput, setFailed } from '@actions/core'

const METHOD_SIGN_TOOL = 'Sign Tool'

async function run() {
  // Inputs
  const path = getInput('path', { required: true })
  const certificate = getInput('certificate-base64', { required: true })
  const certificatePassword = getInput('certificate-password', {
    required: true,
  })
  const method = getInput('method')

  // Assertions
  switch (method) {
    case METHOD_SIGN_TOOL:
      console.log('Hi from sign-tool')
      break

    default:
      throw new Error('Method is invalid')
  }
}

run().catch(setFailed)
