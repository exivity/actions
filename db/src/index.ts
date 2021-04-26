import { getInput, info, setFailed } from '@actions/core'
import { exec } from '@actions/exec'
import { getOctokit } from '@actions/github'
import { platform } from 'os'
import path from 'path'
import { startDocker } from '../../lib/docker'
import { getShaFromRef, getToken, getWorkspacePath } from '../../lib/github'
import { defaultVersion, image, startPostgres } from '../../lib/postgres'
import { downloadS3object, getAWSCredentials } from '../../lib/s3'

async function run() {
  try {
    // Input
    const branch =
      getInput('branch') ||
      (process.env.GITHUB_REF === 'refs/heads/master' ? 'master' : 'develop')
    const dbName = getInput('db-name') || 'exdb-test'
    const mode = getInput('mode') || 'host'
    const password = getInput('password') || 'postgres'
    const ghToken = getToken()
    const workspacePath = getWorkspacePath()

    const [awsKeyId, awsSecretKey] = getAWSCredentials()

    // Assertions
    if (mode !== 'docker' && mode !== 'host') {
      throw new Error(`Mode must be 'docker' or 'host'`)
    }

    info(`Using exivity/db branch "${branch}"`)

    // Let's find the sha
    const octokit = getOctokit(ghToken)
    const sha = await getShaFromRef({
      octokit,
      component: 'db',
      ref: branch,
    })

    // Download db artefacts
    const dbDirectory = '../db'
    await downloadS3object({
      component: 'db',
      sha,
      path: dbDirectory,
      awsKeyId,
      awsSecretKey,
    })

    switch (mode) {
      case 'docker':
        await startDocker({
          image,
          defaultVersion,
          ports: [5432],
        })
        break

      case 'host':
        await startPostgres(password)
        break
    }

    // Execute unpack-artefacts script
    const migrateBin = platform() === 'win32' ? 'migrate.exe' : 'migrate'
    await exec('bash init-db.sh', undefined, {
      cwd: path.resolve(__dirname, '..'),
      env: {
        ...process.env,
        MODE: mode,
        BASE_DIR: path.join(workspacePath, dbDirectory),
        DB_NAME: dbName,
        MIGRATE_BIN: migrateBin,
        DB_PASSWORD: password,
      },
    })
  } catch (error) {
    setFailed(error.message)
  }
}

run()
