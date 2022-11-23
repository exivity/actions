import { getOctokit } from '@actions/github'
import { getInput, getBooleanInput } from '@actions/core'
import { Version2Client } from 'jira.js'
import { existsSync } from 'fs'
import { readFile } from 'fs/promises'

import { getToken } from '../../../lib/github'

async function readTextFile(path: string) {
  try {
    return readFile(path, 'utf8')
  } catch (error: unknown) {
    throw new Error(`Can't read "${path}"`)
  }
}

async function readJson<Schema>(path: string) {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as Schema
  } catch (error: unknown) {
    throw new Error(`Can't read "${path}" or it's not valid JSON`)
  }
}

export type Lockfile = {
  version: string
  repositories: {
    [repository: string]: string
  }
}

export const isDryRun = () => getBooleanInput('dry-run') ?? false

export const getReleaseBranch = () => getInput('release-branch')

export const getUpcomingReleaseBranch = () =>
  getInput('upcoming-release-branch')

export const getReleaseRepo = () => getInput('releaser-repo')

export const getLockFile = async () => readJson<Lockfile>(getInput('lockfile'))

export const getLockFilePath = () => getInput('lockfile')

export const getRepositories = async () => {
  const lockfile = await getLockFile()
  return Object.keys(lockfile.repositories)
}

export const getChangeLogPath = () => getInput('changelog')

export const getChangeLog = async () => {
  const changelogPath = getChangeLogPath()

  return existsSync(changelogPath)
    ? await readFile(changelogPath, 'utf8')
    : '# Changelog\n\n'
}

export const getPrTemplate = async () =>
  await readTextFile(getInput('pr-template'))

export const getOctoKitClient = () => {
  return getOctokit(getToken())
}

export const getJiraClient = () => {
  const username = getInput('jira-username')
  const password = getInput('jira-token')

  if (!username || !password) return null

  return new Version2Client({
    host: 'https://exivity.atlassian.net',
    authentication: {
      basic: {
        username,
        password,
      },
    },
    newErrorHandling: true,
  })
}
