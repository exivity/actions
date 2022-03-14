import { mapPermissionsToPermission } from '../permissions'
import { Collaborator } from '../types'
import { Diffable } from './diffable'

export class Collaborators extends Diffable<'collaborators'> {
  init() {
    if (this.config) {
      // Force all usernames to lowercase to avoid comparison issues.
      this.config.forEach((collaborator) => {
        collaborator.username = collaborator.username.toLowerCase()
      })
    }
  }

  async find() {
    return (
      await this.github.rest.repos.listCollaborators({
        repo: this.repo.repo,
        owner: this.repo.owner,
        affiliation: 'direct',
      })
    ).data.map((user) => {
      if (!user.permissions) {
        throw new Error('User permissions not set')
      }
      return {
        // Force all usernames to lowercase to avoid comparison issues.
        username: user.login.toLowerCase(),
        permission: mapPermissionsToPermission(user.permissions),
      }
    })
  }

  comparator(existing: Collaborator, attrs: Collaborator) {
    return existing.username === attrs.username
  }

  changed(existing: Collaborator, attrs: Collaborator) {
    return existing.permission !== attrs.permission
  }

  update(existing: Collaborator, attrs: Collaborator) {
    return this.add(attrs)
  }

  add(attrs: Collaborator) {
    this.logUpdate(`Adding collaborator "${attrs.username}"`)
    return this.github.rest.repos.addCollaborator({ ...attrs, ...this.repo })
  }

  remove(existing: Collaborator) {
    this.logRemove(`Removing collaborator "${existing.username}"`)
    return this.github.rest.repos.removeCollaborator({
      username: existing.username,
      ...this.repo,
    })
  }
}
