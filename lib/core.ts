import { getInput } from '@actions/core'

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
