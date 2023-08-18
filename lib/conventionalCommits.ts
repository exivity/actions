import { warning } from '@actions/core'

// Source: https://github.com/commitizen/conventional-commit-types/blob/master/index.json',
export const types = {
  feat: {
    description: 'A new feature',
    title: 'Features',
  },
  fix: {
    description: 'A bug fix',
    title: 'Bug Fixes',
  },
  docs: {
    description: 'Documentation only changes',
    title: 'Documentation',
  },
  style: {
    description:
      'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
    title: 'Styles',
  },
  refactor: {
    description: 'A code change that neither fixes a bug nor adds a feature',
    title: 'Code Refactoring',
  },
  perf: {
    description: 'A code change that improves performance',
    title: 'Performance Improvements',
  },
  test: {
    description: 'Adding missing tests or correcting existing tests',
    title: 'Tests',
  },
  build: {
    description:
      'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
    title: 'Builds',
  },
  ci: {
    description:
      'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
    title: 'Continuous Integrations',
  },
  chore: {
    description: "Other changes that don't modify src or test files",
    title: 'Chores',
  },
  revert: {
    description: 'Reverts a previous commit',
    title: 'Reverts',
  },
}

const availableTypes = Object.keys(types)

export function parseCommitMessage(message: string) {
  // Test: https://regexr.com/6o8mb
  const matches = message.match(/^(\w+)(?:\(([\w_-]+)\))?(!)?:\s+(.*)/)

  if (!matches) {
    return {
      description: message,
    }
  }

  const [, type, component, breaking, description] = matches

  return {
    type,
    component,
    breaking: breaking === '!',
    description,
  }
}

export function isValidType(type: string) {
  return availableTypes.includes(type)
}

export function isFeatOrFix(message: string) {
  const { type } = parseCommitMessage(message)

  return type === 'feat' || type === 'fix'
}

export function isSemanticCommitMessage(message: string) {
  const parsed = parseCommitMessage(message)
  const availableTypes = Object.keys(types)

  const genericHelp =
    'See https://www.conventionalcommits.org/en/v1.0.0/ for more details.'
  const typesHelp = `Available types:\n- ${availableTypes.join('\n- ')}`

  if (typeof parsed.type === 'undefined') {
    warning(
      `Commit message can't be matched to the conventional commit pattern. See https://www.conventionalcommits.org/en/v1.0.0/ for more details.`
    )
    return false
  }

  const { type, description } = parsed

  if (!type) {
    warning(`No release type found. ${genericHelp}`)
    return false
  }

  if (!description) {
    warning(`No description found. ${genericHelp}`)
    return false
  }

  if (!isValidType(type)) {
    warning(
      `\
No release type found or not a valid release type. \
Add a prefix to indicate what kind of release this pull request corresponds to. \
${genericHelp}\n\n${typesHelp}`
    )
    return false
  }

  return true
}
