import { getOctokit } from '@actions/github'
import { getInput } from '@actions/core'
import { Version2Client } from 'jira.js'
import { existsSync } from 'fs'
import { readFile } from 'fs/promises'
import { info } from 'console'

import { getToken, STANDARD_BRANCH } from '../../../lib/github'
import { getBooleanInput } from '../../../lib/core'
const { resolveReleaseRepositories } = require('./releaseRepositories')
const { resolveChangelogRepositories } = require('./changelogRepositories')

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

export type RepositoryMetadata = {
  releaseBranch?: string
  sourceRepo?: string
  sourcePath?: string
  tagStrategy?: string
}

export type ReleaseRepository = {
  component: string
  releasedSha: string
  sourceRepo: string
  sourcePath?: string
  releaseBranch: string
  tagStrategy: string
  excludedPullRequests?: number[]
}

export const getJiraProjectId = () => Number(getInput('jira-project-id'))

export const isDryRun = () => getBooleanInput('dry-run', false)

export const getReleaseBranch = () => getInput('release-branch')

export const getUpcomingReleaseBranch = () =>
  getInput('upcoming-release-branch')

export const getReleaseRepo = () => getInput('releaser-repo')

export const getLockFile = async () => readJson<Lockfile>(getInput('lockfile'))

export const getLockFilePath = () => getInput('lockfile')

export const getRepositoryMetadataPath = () => getInput('repositories-metadata')

export const getRepositoryMetadata = async () => {
  const metadataPath = getRepositoryMetadataPath()

  return existsSync(metadataPath)
    ? await readJson<Record<string, RepositoryMetadata>>(metadataPath)
    : {}
}

export const getReleaseRepositories = async (): Promise<
  ReleaseRepository[]
> => {
  const [lockfile, repositoryMetadata] = await Promise.all([
    getLockFile(),
    getRepositoryMetadata(),
  ])

  return resolveReleaseRepositories(
    lockfile,
    repositoryMetadata,
    STANDARD_BRANCH,
  ) as ReleaseRepository[]
}

export const getRepositories = async () => {
  return (await getReleaseRepositories()).map(({ component }) => component)
}

export const getChangelogRepositories = async (): Promise<
  ReleaseRepository[]
> => {
  const [repositories, lockfile] = await Promise.all([
    getReleaseRepositories(),
    getLockFile(),
  ])
  const plan = existsSync('release-plan.json')
    ? await readJson<unknown>('release-plan.json')
    : null
  return resolveChangelogRepositories({
    repositories,
    lockfile,
    plan,
    loadBaseline: async (ref: string) => {
      try {
        const { data } = await getOctoKitClient().rest.repos.getContent({
          owner: 'exivity',
          repo: getReleaseRepo(),
          path: 'release-plan.json',
          ref,
        })
        if (
          Array.isArray(data) ||
          !('content' in data) ||
          data.encoding !== 'base64'
        )
          throw new Error('Unsupported maintenance changelog baseline file')
        return JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'))
      } catch (error) {
        if ((error as { status?: number }).status === 404) return null
        throw error
      }
    },
  })
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

let jiraClient: Version2Client | null = null

export const getJiraClient = () => {
  const username = getInput('jira-username')
  const apiToken = getInput('jira-token')

  if (jiraClient) return jiraClient

  if (!username || !apiToken) {
    throw new Error('jira-username and jira-token inputs are required.')
  }

  jiraClient = new Version2Client({
    host: 'https://exivity.atlassian.net',
    authentication: {
      basic: {
        email: username,
        apiToken,
      },
    },
  })

  if (!jiraClient) {
    throw new Error('jira-username and jira-token inputs are required.')
  }

  return jiraClient
}

export const debug = (text: string | (() => string)) => {
  const shouldDebug = getBooleanInput('debug', false)

  if (shouldDebug) {
    info(`[debug] ${typeof text === 'function' ? text() : text}`)
  }
}
