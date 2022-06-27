import type { getCommit } from '../../../lib/github'

export type Repositories = {
  [repository: string]: {
    releaseBranch?: string
  }
}

export type ChangelogType = 'feat' | 'fix' | 'chore'

export type ChangelogItem = {
  repository: string
  sha: string
  author: string
  date: string
  type: ChangelogType
  breaking: boolean
  title: string
  description?: string
  issues?: string[]
}

export type VersionIncrement = 'major' | 'minor' | 'patch'

export type Commit = Awaited<ReturnType<typeof getCommit>> & {
  repository: string
}

export type Lockfile = {
  version: string
  repositories: {
    [repository: string]: string
  }
}
