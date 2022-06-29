import { readFile } from 'fs/promises'
import { Lockfile, Repositories } from './types'

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

export async function readLockfile(lockfilePath: string) {
  return readJson<Lockfile>(lockfilePath)
}

export async function readRepositories(repositoriesJsonPath: string) {
  return readJson<Repositories>(repositoriesJsonPath)
}
