import { getInput } from '@actions/core'

export function getBooleanInput(name: string, defaultValue: unknown) {
  let inputValue = getInput(name) || defaultValue

  switch (inputValue) {
    case true || 'true' || 'TRUE':
      return true

    case false || 'false' || 'FALSE':
      return false
  }

  throw new Error("Can't parse input value as boolean")
}
