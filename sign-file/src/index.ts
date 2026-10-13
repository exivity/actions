import { debug, getInput, info, setFailed } from '@actions/core'
import { getExecOutput } from '@actions/exec'
import { promises as fs } from 'fs'
import { glob } from 'glob'
import { platform, tmpdir } from 'os'
import { join, resolve } from 'path'

const METHOD_SIGN_TOOL = 'signtool'
const METHOD_ARTIFACT_SIGNING = 'artifact-signing'

async function signTool(
  filePath: string,
  certificatePath: string,
  certificatePassword: string,
) {
  /**
   * Path to SignTool.exe
   *
   * See https://docs.microsoft.com/en-us/dotnet/framework/tools/signtool-exe
   */
  const signToolPath =
    '"C:/Program Files (x86)/Windows Kits/10/bin/10.0.22000.0/x64/SignTool.exe"'

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

/**
 * Sign with Azure Artifact Signing through the ArtifactSigning PowerShell
 * module (see sign-file/artifact-signing.ps1). Authentication comes from the
 * job's azure/login (OIDC), so no certificate material is handled here.
 */
async function artifactSigning(
  filePaths: string[],
  endpoint: string,
  accountName: string,
  certificateProfileName: string,
  description: string,
  descriptionUrl: string,
) {
  const script = resolve(__dirname, '..', 'artifact-signing.ps1')

  const args = [
    '-NoProfile',
    '-NonInteractive',
    '-ExecutionPolicy',
    'Bypass',
    '-File',
    script,
    '-Endpoint',
    endpoint,
    '-AccountName',
    accountName,
    '-CertificateProfileName',
    certificateProfileName,
    '-Files',
    filePaths.join(','),
  ]
  if (description) {
    args.push('-Description', description)
  }
  if (descriptionUrl) {
    args.push('-DescriptionUrl', descriptionUrl)
  }

  const { exitCode, stderr } = await getExecOutput('pwsh', args)

  if (exitCode !== 0) {
    throw new Error(
      `artifact-signing.ps1 failed with code ${exitCode}: ${stderr}`,
    )
  }
}

async function run() {
  // Inputs
  const path = getInput('path', { required: true })
  const method = getInput('method') || METHOD_SIGN_TOOL

  if (platform() !== 'win32') {
    throw new Error('sign-file is only available on Windows')
  }

  // Obtain absolute paths
  const absPaths = await glob(path, { absolute: true })
  debug(`Absolute path to file(s): "${absPaths.join(', ')}"`)
  if (absPaths.length === 0) {
    throw new Error(`No files matched "${path}"`)
  }

  switch (method) {
    case METHOD_SIGN_TOOL: {
      const encodedCertificate = getInput('certificate-base64', {
        required: true,
      })
      const certificatePassword = getInput('certificate-password', {
        required: true,
      })

      // Write temp pfx file
      const tmpDir = await fs.mkdtemp(join(tmpdir()))
      const certificatePath = resolve(tmpDir, 'cert.pfx')
      await fs.writeFile(
        certificatePath,
        Buffer.from(encodedCertificate, 'base64'),
      )
      debug(`Written temporary pfx file to "${certificatePath}"`)

      for (const absPath of absPaths) {
        await signTool(absPath, certificatePath, certificatePassword)
      }

      // Cleanup
      await fs.unlink(certificatePath)
      await fs.rmdir(tmpDir, { recursive: true })

      break
    }

    case METHOD_ARTIFACT_SIGNING: {
      const endpoint = getInput('endpoint', { required: true })
      const accountName = getInput('account-name', { required: true })
      const certificateProfileName = getInput('certificate-profile-name', {
        required: true,
      })
      const description = getInput('description')
      const descriptionUrl = getInput('description-url')

      info(
        `Signing ${absPaths.length} file(s) with Artifact Signing ${accountName}/${certificateProfileName}`,
      )
      await artifactSigning(
        absPaths,
        endpoint,
        accountName,
        certificateProfileName,
        description,
        descriptionUrl,
      )

      break
    }

    default:
      throw new Error(`Method "${method}" is invalid`)
  }
}

run().catch(setFailed)
