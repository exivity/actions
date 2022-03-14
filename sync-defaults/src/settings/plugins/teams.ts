import { Team } from '../types'
import { Diffable } from './diffable'

// it is necessary to use this endpoint until GitHub Enterprise supports
// the modern version under /orgs
const teamRepoEndpoint = '/teams/:team_id/repos/:owner/:repo'

export class Teams extends Diffable<'teams'> {
  async find() {
    let res: any
    try {
      res = await this.github.rest.repos.listTeams(this.repo)
    } catch (error) {
      console.log(error)
    }

    return res.data as Team[]
  }

  comparator(existing: Team, attrs: Team) {
    return existing.slug === attrs.name
  }

  changed(existing: Team, attrs: Team) {
    return existing.permission !== attrs.permission
  }

  update(existing: Team, attrs: Team) {
    this.logUpdate(`Updating team "${existing.name}"`)
    return this.github.request(
      `PUT ${teamRepoEndpoint}`,
      this.toParams(existing, attrs)
    )
  }

  async add(attrs: Team) {
    this.logUpdate(`Adding team "${attrs.name}"`)
    const { data: existing } = await this.github.request(
      'GET /orgs/:org/teams/:team_slug',
      { org: this.repo.owner, team_slug: attrs.name }
    )

    return this.github.request(
      `PUT ${teamRepoEndpoint}`,
      this.toParams(existing, attrs)
    )
  }

  remove(existing: Team) {
    this.logUpdate(`Removing team "${existing.name}"`)
    return this.github.request(`DELETE ${teamRepoEndpoint}`, {
      team_id: existing.id,
      ...this.repo,
      org: this.repo.owner,
    })
  }

  toParams(existing: Team, attrs: Team) {
    return {
      team_id: existing.id,
      owner: this.repo.owner,
      repo: this.repo.repo,
      org: this.repo.owner,
      permission: attrs.permission,
    }
  }
}
