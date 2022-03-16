import { getInput, info } from '@actions/core'
import { exec } from '@actions/exec'
import { promises as fs } from 'fs'
import { join as pathJoin } from 'path'

const TRUE_VALUES = [true, 'true', 'TRUE']
const FALSE_VALUES = [false, 'false', 'FALSE']

export function getBooleanInput(name: string, defaultValue: boolean) {
  let inputValue = getInput(name) || defaultValue

  if (TRUE_VALUES.includes(inputValue)) {
    return true
  }

  if (FALSE_VALUES.includes(inputValue)) {
    return false
  }

  throw new Error(
    `Can't parse input value (${JSON.stringify(inputValue)}) as boolean`
  )
}

export async function unzipAll(path: string) {
  for (const file of await fs.readdir(path)) {
    if (file.endsWith('.zip')) {
      await exec('7z', ['x', pathJoin(path, file), `-o${path}`])
    } else if ((await fs.lstat(pathJoin(path, file))).isDirectory()) {
      unzipAll(pathJoin(path, file))
    }
  }
}

/**
 * Iterates an array, and returns the first element for which the predicate
 * returns a value.
 */
export function shortCircuit<T, R>(
  input: T[],
  predicate: (value: T, index: number, array: typeof input) => R | undefined
) {
  let output: R | undefined

  input.some(
    (value, index, array) => !!(output = predicate(value, index, array))
  )

  return output
}

export function table(key: string, value: string) {
  info(`${key.padEnd(15)}: ${value}`)
}
