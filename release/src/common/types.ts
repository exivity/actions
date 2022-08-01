import type { getCommit } from '../../../lib/github'

export type Repositories = {
  [repository: string]: {
    releaseBranch?: string
  }
}

export type ChangelogType = 'feat' | 'fix' | 'chore'

export type ChangelogLinkType = 'pr' | 'commit' | 'issue' | 'milestone'

export type ChangelogLinkCommon = {
  slug: string
  url: string
  title: string
  description: string | null
}

export type ChangelogItem = {
  title: string
  description: string | null
  type: ChangelogType
  breaking: boolean
  warnings: string[]
  links: {
    commit: ChangelogLinkCommon & {
      originalTitle: string
      repository: string
      sha: string
      author: string
      date: string
    }
    pr?: ChangelogLinkCommon & {
      originalTitle: string
    }
    issues?: ChangelogLinkCommon[]
    milestone?: ChangelogLinkCommon
  }
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

export enum JiraCustomFields {
  Epic = 'customfield_10005',
  ReleaseNotesTitle = 'customfield_10529',
  ReleaseNotesDescription = 'customfield_10530',
}

export enum JiraIssueType {
  Chore = 'Chore',
  Bug = 'Bug',
  Feature = 'Feature',
  Epic = 'Epic',
}

export enum JiraIssueStatus {}

export enum JiraEpicStatus {
  Concept = 'Concept',
  Planned = 'Planned',
  Refining = 'Refining',
  InProgress = 'In Progress',
  ReadyForRelease = 'Ready for release',
  Released = 'Released',
  Canceled = 'Canceled',
}

export enum JiraStatusCategory {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
}
