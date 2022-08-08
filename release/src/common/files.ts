import { readFile } from 'fs/promises'
import { Lockfile } from '../lockfile'

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

type Repositories = Record<string, string>

export async function getRepositories(repositoriesJsonPath: string) {
  return Object.keys(await readJson<Repositories>(repositoriesJsonPath))
}

export const readLockfile = readJson<Lockfile>
