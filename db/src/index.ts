import { getInput, setFailed } from '@actions/core'
import { exec } from '@actions/exec'
import { platform } from 'os'
import path from 'path'
import {
  downloadS3object,
  getShaFromBranch,
  startDocker,
  startPostgres,
} from '../../lib'

async function run() {
  try {
    // Input
    const branch = getInput('branch') || 'develop'
    const dbName = getInput('db-name') || 'exdb-test'
    const mode = getInput('mode') || 'host'
    const awsKeyId =
      getInput('aws-access-key-id') || process.env['AWS_ACCESS_KEY_ID']
    const awsSecretKey =
      getInput('aws-secret-access-key') || process.env['AWS_SECRET_ACCESS_KEY']
    const ghToken = getInput('gh-token') || process.env['GITHUB_TOKEN']

    // Assertions
    if (!awsKeyId || !awsSecretKey || !ghToken) {
      throw new Error('A required argument is missing')
    }

    if (mode !== 'docker' && mode !== 'host') {
      throw new Error(`Mode must be 'docker' or 'host'`)
    }

    // Let's find the sha
    const sha = await getShaFromBranch({
      ghToken,
      component: 'db',
      branch,
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
          image: 'exivity/postgres',
          defaultVersion: '12.3',
          ports: [5432],
        })
        break

      case 'host':
        await startPostgres()
        break
    }

    // Execute unpack-artefacts script
    const migrateBin = platform() === 'win32' ? 'migrate.exe' : 'migrate'
    await exec('bash init-db.sh', undefined, {
      cwd: path.resolve(__dirname, '..'),
      env: {
        MODE: mode,
        BASE_DIR: path.join(process.env['GITHUB_WORKSPACE'], dbDirectory),
        DB_NAME: dbName,
        MIGRATE_BIN: migrateBin,
      },
    })
  } catch (error) {
    setFailed(error.message)
  }
}

run()
