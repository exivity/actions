import { GitHubSettingsPlugin } from './types'

const previewHeaders = {
  accept:
    'application/vnd.github.hellcat-preview+json,application/vnd.github.luke-cage-preview+json,application/vnd.github.zzzax-preview+json',
}

export class Branches extends GitHubSettingsPlugin<'branches'> {
  sync() {
    return Promise.all(
      this.settings
        .filter((branch) => branch.protection !== undefined)
        .map((branch) => {
          const params = Object.assign(this.repo, { branch: branch.name })

          if (this.isEmpty(branch.protection)) {
            return this.github.repos.deleteBranchProtection(params)
          } else {
            Object.assign(params, branch.protection, {
              headers: previewHeaders,
            })
            return this.github.repos.updateBranchProtection(params)
          }
        })
    )
  }

  isEmpty(maybeEmpty) {
    return maybeEmpty === null || Object.keys(maybeEmpty).length === 0
  }
}
