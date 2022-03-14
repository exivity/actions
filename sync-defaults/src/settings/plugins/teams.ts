import { warning } from '@actions/core'
import { Team } from '../types'
import { Diffable } from './diffable'

export class Teams extends Diffable<'teams'> {
  async find() {
    try {
      return (await this.github.rest.repos.listTeams(this.repo)).data as Team[]
    } catch (error) {
      warning('Could not fetch teams for repository, are you an owner/admin?')
      return []
    }
  }

  comparator(existing: Team, attrs: Team) {
    return existing.slug === attrs.name
  }

  changed(existing: Team, attrs: Team) {
    return existing.permission !== attrs.permission
  }

  update(existing: Team, attrs: Team) {
    return this.add(attrs)
  }

  add(attrs: Team) {
    this.logAdd(`Adding team "${attrs.name}"`)
    return this.github.rest.teams.addOrUpdateRepoPermissionsInOrg({
      team_slug: attrs.name,
      permission: attrs.permission,
      owner: this.repo.owner,
      repo: this.repo.repo,
      org: this.repo.owner,
    })
  }

  remove(existing: Team) {
    this.logUpdate(`Removing team "${existing.name}"`)
    return this.github.rest.teams.removeRepoInOrg({
      team_slug: existing.name,
      owner: this.repo.owner,
      repo: this.repo.repo,
      org: this.repo.owner,
    })
  }
}
