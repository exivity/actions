import { getOctokit } from '@actions/github'

export type Settings = {
  repository: Repository
  labels: Label[]
  milestones: Milestone[]
  collaborators: null
  teams: Team[]
  branches: Branch[]
}

export type Branch = {
  name: string
  protection: Protection
}

export type Protection = {
  required_pull_request_reviews: RequiredPullRequestReviews
  required_status_checks: RequiredStatusChecks
  enforce_admins: boolean
  required_linear_history: boolean
  restrictions: Restrictions
}

export type RequiredPullRequestReviews = {
  required_approving_review_count: number
  dismiss_stale_reviews: boolean
  require_code_owner_reviews: boolean
  dismissal_restrictions: DismissalRestrictions
}

export type DismissalRestrictions = {
  users: any[]
  teams: any[]
}

export type RequiredStatusChecks = {
  strict: boolean
  contexts: any[]
}

export type Restrictions = {
  apps: any[]
  users: any[]
  teams: any[]
}

export type Label = {
  name: string
  color?: string
  description?: string
  new_name?: string
}

export type Milestone = {
  title: string
  description: string
  state: string
}

export type Repository = {
  name: string
  description: string
  homepage: string
  topics: string
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
  enable_automated_security_fixes: boolean
  enable_vulnerability_alerts: boolean
}

export type Team = {
  name: string
  permission: string
}

export abstract class GitHubSettingsPlugin<T extends keyof Settings> {
  constructor(
    public github: ReturnType<typeof getOctokit>['rest'],
    public repo: {
      owner: string
      repo: string
    },
    public settings: Settings[T]
  ) {}

  abstract sync(): Promise<any>
}
