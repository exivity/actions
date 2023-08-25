import { info } from '@actions/core'
import { getOctokit } from '@actions/github'

export type Branch = {
  name: string
  protection: null | Protection
}

export type Protection = {
  required_pull_request_reviews: null | RequiredPullRequestReviews
  required_status_checks: null | RequiredStatusChecks
  enforce_admins: boolean
  required_linear_history: boolean
  restrictions: null | Restrictions
}

export type RequiredPullRequestReviews = {
  required_approving_review_count: number
  dismiss_stale_reviews: boolean
  require_code_owner_reviews: boolean
  dismissal_restrictions: DismissalRestrictions
}

export type DismissalRestrictions = {
  users: string[]
  teams: string[]
}

export type RequiredStatusChecks = {
  strict: boolean
  contexts: string[]
}

export type Restrictions = {
  apps: string[]
  users: string[]
  teams: string[]
}

export type RenameLabel = {
  name: string
  new_name: string
}

export type Label = {
  name: string
  color?: string
  description?: string
  new_name?: string
}

export type Milestone = {
  number: number
  title: string
  description: string
  state: 'open' | 'closed'
}

export type Repository = {
  name: string
  description: string
  homepage: string
  topics?: string
  private: boolean
  has_issues: boolean
  has_projects: boolean
  has_wiki: boolean
  has_downloads: boolean
  default_branch: string
  allow_squash_merge: boolean
  allow_merge_commit: boolean
  allow_rebase_merge: boolean
  delete_branch_on_merge: boolean
  enable_automated_security_fixes?: boolean
  enable_vulnerability_alerts?: boolean
}

export type Permission = 'pull' | 'push' | 'admin' | 'maintain' | 'triage'

export type Collaborator = {
  username: string
  permission: Permission
}

export type Team = {
  id: number
  slug: string
  name: string
  permission: Permission
}

export type Config = {
  repository?: Repository
  labels?: Label[]
  milestones?: Milestone[]
  collaborators?: Collaborator[]
  teams?: Team[]
  branches?: Branch[]
}

// Simple generic response type, extracted from @octokit/types
export type OctokitResponse = {
  headers: { [header: string]: string | number | undefined }
  status: number
  url: string
  data: unknown
}

export abstract class GitHubSettingsPlugin<T extends keyof Config> {
  constructor(
    public github: ReturnType<typeof getOctokit>,
    public repo: {
      owner: string
      repo: string
    },
    public config: NonNullable<Config[T]>,
  ) {
    this.init()
  }

  init() {}

  abstract sync(): Promise<any>

  log(message: string) {
    info(`    ℹ️ ${message}`)
  }

  logAdd(message: string) {
    info(`    ✅ ${message}`)
  }

  logUpdate(message: string) {
    info(`    🔃 ${message}`)
  }

  logRemove(message: string) {
    info(`    ❌ ${message}`)
  }
}
