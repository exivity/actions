import { debug, getInput, setFailed } from '@actions/core'
import { getExecOutput } from '@actions/exec'
import { promises as fs } from 'fs'
import glob from 'glob-promise'
import { platform, tmpdir } from 'os'
import { join, resolve } from 'path'

const METHOD_SIGN_TOOL = 'Sign Tool'

async function signTool(
  filePath: string,
  certificatePath: string,
  certificatePassword: string
) {
  /**
   * Path to SignTool.exe
   *
   * See https://docs.microsoft.com/en-us/dotnet/framework/tools/signtool-exe
   */
  const signToolPath =
    '"C:/Program Files (x86)/Windows Kits/10/bin/x64/SignTool.exe"'

  const { exitCode, stderr, stdout } = await getExecOutput(signToolPath, [
    /**
     * Digitally signs files. Digital signatures protect files from
     * tampering, and enable users to verify the signer based on a signing
     * certificate. For a list of the options supported by the sign command,
     * see sign Command Options.
     */
    'sign',

    /**
     * Specifies the signing certificate in a file. If the file is in
     * Personal Information Exchange (PFX) format and protected by a
     * password, use the /p option to specify the password. If the file does
     * not contain private keys, use the /csp and /kc options to specify the
     * CSP and private key container name.
     */
    '/f',
    certificatePath,

    /**
     * Specifies the password to use when opening a PFX file. (Use the /f
     * option to specify a PFX file.)
     */
    '/p',
    certificatePassword,

    /**
     * Specifies the URL of the RFC 3161 time stamp server. If this option
     * (or /t) is not present, the signed file will not be time stamped. A
     * warning is generated if time stamping fails. This option cannot be
     * used with the /t option.
     */
    '/tr',
    'http://timestamp.entrust.net/TSS/RFC3161sha2TS',

    /**
     * Used with the /tr option to request a digest algorithm used by the
     * RFC 3161 time stamp server.
     *
     * Note: A warning is generated if the /td switch is not provided while
     * timestamping. The default algorithm is SHA1, but SHA256 is
     * recommended.
     *
     * The /td switch must be declared after the /tr switch, not before. If
     * the /td switch is declared before the /tr switch, the timestamp that
     * is returned is from the SHA1 algorithm instead of the intended SHA256
     * algorithm.
     */
    '/td',
    'sha256',

    /**
     * Specifies the file digest algorithm to use for creating file
     * signatures.
     *
     * Note: A warning is generated if the/fd switch is not provided while
     * signing. The default algorithm is SHA1 but SHA256 is recommended.
     */
    '/fd',
    'sha256',

    filePath,
  ])

  if (exitCode !== 0) {
    throw new Error(`signtool.exe failed with code ${exitCode}: ${stderr}`)
  }

  debug(`signtool.exe output: ${stdout}`)
}

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
      const tmpDir = await fs.mkdtemp(join(tmpdir()))
      const certificatePath = resolve(tmpDir, 'cert.pfx')
      await fs.writeFile(
        certificatePath,
        Buffer.from(encodedCertificate, 'base64')
      )
      debug(`Written temporary pfx file to "${certificatePath}"`)

      // Obtain absolute paths
      const absPaths = await glob(path, { absolute: true })
      debug(`Absolute path to file(s): "${absPaths.join(', ')}"`)

      for (const absPath of absPaths) {
        await signTool(absPath, certificatePath, certificatePassword)
      }

      // Cleanup
      await fs.unlink(certificatePath)
      await fs.rmdir(tmpDir, { recursive: true })

      break

    default:
      throw new Error('Method is invalid')
  }
}

run().catch(setFailed)
