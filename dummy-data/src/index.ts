import path from 'path'
import os from 'os'
import AdmZip from 'adm-zip'
import { promises as fs } from 'fs'
import { getInput, info, setFailed, addPath } from '@actions/core'
import { getOctokit } from '@actions/github'
import { exec } from '@actions/exec'
import { getToken, getShaFromRef } from '../../lib/github'
import { unzipAll } from '../../lib/core'
import { downloadS3object, getAWSCredentials } from '../../lib/s3'

async function run() {
  // Input
  const ghToken = getToken()
  const seed = getInput('seed')
  const configLocation = getInput('config-file')
  const dbString = getInput('db-credentials')

  const octokit = getOctokit(ghToken)

  let command = `dummy-data${os.platform() === 'win32' ? '.exe' : ''} generate`
  if (seed) command += ` --seed ${seed}`
  if (configLocation) command += ` --config ${configLocation}`
  if (dbString) command += ` --db "${dbString}"`
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
  await exec(command, undefined, {
    cwd: path.resolve(__dirname, '..'),
    windowsVerbatimArguments: true,
  }).catch(setFailed)
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

run()
