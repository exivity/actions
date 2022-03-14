import { getOctokit } from '@actions/github'
import { Config, GitHubSettingsPlugin } from '../types'

type RepositorySettings = Config['repository'] & {
  mediaType: {}
  owner: string
  repo: string
}

function enableAutomatedSecurityFixes({
  github,
  settings,
  enabled,
}: {
  github: ReturnType<typeof getOctokit>
  settings?: RepositorySettings
  enabled?: boolean
}) {
  if (typeof enabled === 'undefined' || typeof settings === 'undefined') {
    return Promise.resolve()
  }

  const args = {
    owner: settings.owner,
    repo: settings.repo,
    mediaType: {
      previews: ['london'],
    },
  }
  const methodName = enabled
    ? 'enableAutomatedSecurityFixes'
    : 'disableAutomatedSecurityFixes'

  return github.rest.repos[methodName](args)
}

function enableVulnerabilityAlerts({
  github,
  settings,
  enabled,
}: {
  github: ReturnType<typeof getOctokit>
  settings?: RepositorySettings
  enabled?: boolean
}) {
  if (typeof enabled === 'undefined' || typeof settings === 'undefined') {
    return Promise.resolve()
  }

  const args = {
    owner: settings.owner,
    repo: settings.repo,
    mediaType: {
      previews: ['dorian'],
    },
  }
  const methodName = enabled
    ? 'enableVulnerabilityAlerts'
    : 'disableVulnerabilityAlerts'

  return github.rest.repos[methodName](args)
}

export class Repository extends GitHubSettingsPlugin<'repository'> {
  public settings?: Config['repository'] & {
    mediaType: {}
    owner: string
    repo: string
  }
  public topics?: NonNullable<Config['repository']>['topics']
  public enableVulnerabilityAlerts?: boolean
  public enableAutomatedSecurityFixes?: boolean

  init() {
    this.settings = {
      mediaType: { previews: ['baptiste'] },
      ...this.config,
      ...this.repo,
    }

    this.topics = this.config.topics
    delete this.config.topics

    this.enableVulnerabilityAlerts = this.config.enable_vulnerability_alerts
    delete this.config.enable_vulnerability_alerts

    this.enableAutomatedSecurityFixes =
      this.config.enable_automated_security_fixes
    delete this.config.enable_automated_security_fixes
  }

  async sync() {
    this.config.name = this.config.name || (this.config as any).repo

    if (!this.settings) {
      throw new Error('New settings not defined')
    }

    this.logUpdate(`Updating repository settings for "${this.repo.repo}"`)
    await this.github.rest.repos.update(this.settings)

    if (this.topics) {
      this.logUpdate(`Updating topics for "${this.repo.repo}"`)
      await this.github.rest.repos.replaceAllTopics({
        owner: this.settings!.owner,
        repo: this.settings!.repo,
        names: this.topics.split(/\s*,\s*/),
        mediaType: {
          previews: ['mercy'],
        },
      })
    }

    await enableVulnerabilityAlerts({
      enabled: this.enableVulnerabilityAlerts,
      ...this,
    })

    await enableAutomatedSecurityFixes({
      enabled: this.enableAutomatedSecurityFixes,
      ...this,
    })
  }
}
