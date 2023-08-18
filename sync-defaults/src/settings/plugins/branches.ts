import { GitHubSettingsPlugin } from '../types'

const previewHeaders = {
  accept:
    'application/vnd.github.hellcat-preview+json,application/vnd.github.luke-cage-preview+json,application/vnd.github.zzzax-preview+json',
}

export class Branches extends GitHubSettingsPlugin<'branches'> {
  async sync() {
    return Promise.all(
      this.config
        .filter((branch) => branch.protection !== undefined)
        .map((branch) => {
          const commonParams = { ...this.repo, branch: branch.name }
          if (this.isEmpty(branch.protection)) {
            this.logRemove(`Removing branch protection for "${branch.name}"`)

            return this.github.rest.repos.deleteBranchProtection(commonParams)
          } else {
            this.logUpdate(`Updating branch protection for "${branch.name}"`)
            const updateParams = {
              ...commonParams,
              ...branch.protection,
              headers: previewHeaders,
            }
            return this.github.rest.repos.updateBranchProtection(updateParams)
          }
        })
    )
  }

  isEmpty(maybeEmpty: null | {}): maybeEmpty is null {
    return maybeEmpty === null || Object.keys(maybeEmpty).length === 0
  }
}
