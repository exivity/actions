import { debug, getInput, setFailed } from '@actions/core'
import { mkdtemp, writeFile } from 'fs/promises'
import { platform, tmpdir } from 'os'
import { join } from 'path'

const METHOD_SIGN_TOOL = 'Sign Tool'

async function run() {
  // Inputs
  const path = getInput('path', { required: true })
  const encodedCertificate = getInput('certificate-base64', { required: true })
  const certificatePassword = getInput('certificate-password', {
    required: true,
  })
  const method = getInput('method')

  // Assertions
  switch (method) {
    case METHOD_SIGN_TOOL:
      if (platform() !== 'win32') {
        throw new Error('Sign Tool is only available on Windows')
      }

      // Write temp pfx file
      const tmpDir = await mkdtemp(join(tmpdir()))
      const certificatePath = join(tmpDir, 'cert.pfx')
      await writeFile(
        certificatePath,
        Buffer.from(encodedCertificate, 'base64')
      )

      debug('Written pfx file')
      break

    default:
      throw new Error('Method is invalid')
  }
}

run().catch(setFailed)
