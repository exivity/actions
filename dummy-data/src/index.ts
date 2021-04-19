import path from 'path'
import AdmZip from 'adm-zip'
import { promises as fs } from 'fs'
import { getInput, info, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import { exec } from '@actions/exec'
import { getToken, getShaFromRef } from '../../lib/github'

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

  const dummyPath = path.resolve(__dirname, '..', '..', '..', 'dummy-data')
  info(`Extracting dummy-data to ${dummyPath}`)

  const sha = await getShaFromRef({
    octokit,
    component: 'dummy-data',
    ref: 'master',
  })
  info(`got sha: ${sha}`)

  // FIXME: unzip correctly
  const zip = new AdmZip(Buffer.from(repoZip as ArrayBuffer))
  zip.extractEntryTo(
    `exivity-dummy-data-${sha}`,
    path.resolve(__dirname, '..', '..', '..'),
    true
  )
  await exec(`ls`, [path.resolve(__dirname, '..', '..', '..')], {
    ignoreReturnCode: false,
    failOnStdErr: false,
  })

  let command = 'npm run start generate'
  if (seed) command += ` --seed ${seed}`
  if (config_location) command += ` --config ${config_location}`
  if (db_string) command += ` --db "${db_string}"`
  else {
    const access = await fs
      .access(`${process.env.EXIVITY_HOME_PATH}/system/config.json`)
      .then(() => true)
      .catch(() => false)
    if (!access) command += ` --db "postgres:postgres@localhost/exdb-test"`
  }

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

run()
