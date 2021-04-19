import path from 'path'
import os from 'os'
import AdmZip from 'adm-zip'
import { promises as fs } from 'fs'
import { getInput, info, setFailed, addPath } from '@actions/core'
import { getOctokit } from '@actions/github'
import { exec } from '@actions/exec'
import { getToken, getShaFromRef } from '../../lib/github'
import { unzipAll } from '../../lib/core'
import { downloadS3object } from '../../lib/s3'

async function run() {
  // Input
  const ghToken = getToken()
  const seed = getInput('seed')
  const config_location = getInput('config-file')
  const db_string = getInput('db-credentials')

  // Initialize GH client
  const octokit = getOctokit(ghToken)

  // Get dummy-data
  const { data: repoZip } = await octokit.request(
    'GET /repos/{owner}/{repo}/zipball/{ref}',
    {
      owner: 'exivity',
      repo: 'dummy-data',
      ref: 'master',
    }
  )

  const sha = await getShaFromRef({
    octokit,
    component: 'dummy-data',
    ref: 'master',
  })
  info(`got sha: ${sha}`)

  const dummyPath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    `exivity-dummy-data-${sha}`
  )
  info(`Extracting dummy-data to ${dummyPath}`)

  const zip = new AdmZip(Buffer.from(repoZip as ArrayBuffer))
  zip.extractEntryTo(
    `exivity-dummy-data-${sha}/`,
    path.resolve(__dirname, '..', '..', '..'),
    true
  )
  await exec(`ls`, [dummyPath], {
    ignoreReturnCode: false,
    failOnStdErr: false,
  })

  let command = 'node dummy-data.js generate'
  if (seed) command += ` --seed ${seed}`
  if (config_location) command += ` --config ${config_location}`
  if (db_string) command += ` --db "${db_string}"`
  else {
    const access = await fs
      .access(`${process.env.EXIVITY_HOME_PATH}/system/config.json`)
      .then(() => true)
      .catch(() => false)
    if (!access)
      command += ` --db "postgres://postgres:postgres@localhost:5432/exdb-test?sslmode=disable"`
  }

  await fs
    .access(
      `${process.env.EXIVITY_PROGRAM_PATH}/bin/transcript${
        os.platform() === 'win32' ? '.exe' : ''
      }`
    )
    .catch(() => installComponent('transcript', octokit))
    .catch(setFailed)

  await fs
    .access(
      `${process.env.EXIVITY_PROGRAM_PATH}/bin/edify${
        os.platform() === 'win32' ? '.exe' : ''
      }`
    )
    .catch(() => installComponent('edify', octokit))
    .catch(setFailed)

  await fs
    .access(`${process.env.EXIVITY_HOME_PATH}/system/config.json`)
    .catch(async () => {
      await fs.mkdir(`${process.env.EXIVITY_HOME_PATH}/system/report`, {
        recursive: true,
      })
      await exec(
        `cp config.json ${process.env.EXIVITY_HOME_PATH}/system/config.json`,
        undefined,
        { cwd: path.resolve(__dirname, '..') }
      )
    })
    .catch(setFailed)

  if (os.platform() === 'win32')
    addPath('C:\\Program Files\\PostgreSQL\\13\\bin')

  info('Executing dummy-data generate')
  await exec('npm install', undefined, { cwd: dummyPath })
    .then(() => exec('npm run build', undefined, { cwd: dummyPath }))
    .then(() =>
      exec(command, undefined, {
        cwd: dummyPath,
        windowsVerbatimArguments: true,
      })
    )
    .catch(setFailed)
}

async function installComponent(
  component: string,
  octokit: ReturnType<typeof getOctokit>
) {
  await fs.mkdir(`${process.env.EXIVITY_PROGRAM_PATH}/bin`, { recursive: true })

  const [awsKeyId, awsSecretKey] = getAWSCredentials()

  const sha = await getShaFromRef({
    octokit,
    component,
    ref: 'master',
  })

  await downloadS3object({
    component,
    sha,
    usePlatformPrefix: true,
    path: `${process.env.EXIVITY_PROGRAM_PATH}/bin/`,
    awsKeyId,
    awsSecretKey,
  })

  await unzipAll(`${process.env.EXIVITY_PROGRAM_PATH}/bin`)

  if (os.platform() !== 'win32')
    await exec(
      `sudo chmod 777 ${process.env.EXIVITY_PROGRAM_PATH}/bin/${component}`
    )

  await fs.mkdir(`${process.env.EXIVITY_HOME_PATH}/log/${component}`, {
    recursive: true,
  })
}

function getAWSCredentials() {
  const awsKeyId =
    getInput('aws-access-key-id') || process.env['AWS_ACCESS_KEY_ID']
  const awsSecretKey =
    getInput('aws-secret-access-key') || process.env['AWS_SECRET_ACCESS_KEY']

  // Assertions
  if (!awsKeyId || !awsSecretKey) {
    throw new Error('A required AWS input is missing')
  }

  return [awsKeyId, awsSecretKey]
}

run()
