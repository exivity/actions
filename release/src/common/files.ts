import { info } from '@actions/core'
import { readFile } from 'fs/promises'
import { Lockfile } from './lockfile'

export async function readJson<Schema>(path: string) {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as Schema
  } catch (error: unknown) {
    throw new Error(`Can't read "${path}" or it's not valid JSON`)
  }
}

export async function readTextFile(path: string) {
  try {
    return readFile(path, 'utf8')
  } catch (error: unknown) {
    throw new Error(`Can't read "${path}"`)
  }
}

export const readLockfile = readJson<Lockfile>

export async function getRepositories(lockfilePath: string) {
  const lockfile = await readLockfile(lockfilePath)
  const repositories = Object.keys(lockfile.repositories)

  info(`Repositories from lockfile:`)
  repositories.forEach((repo) => {
    info(`- ${repo}`)
  })

  return repositories
}
