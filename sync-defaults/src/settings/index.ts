import { getOctokit } from '@actions/github'
import { EventName } from '../../../lib/github'
import { SyncPluginOptions } from '../types'
import { Branches, Collaborators } from './plugins'

export const name = 'settings'

const FILE_NAME = '.github/settings.yml'

const PLUGINS = {
  repository: require('./plugins/repository'),
  labels: require('./plugins/labels'),
  collaborators: require('./plugins/collaborators'),
  teams: require('./plugins/teams'),
  milestones: require('./plugins/milestones'),
  branches: Branches,
}

export async function run<T extends EventName>({
  ghToken,
  component,
}: SyncPluginOptions<T>) {
  const octokit = getOctokit(ghToken)
  const repo = {
    owner: 'exivity',
    repo: component,
  }
  const config = {}
  return Promise.all(
    Object.entries(this.config).map(([section, config]) => {
      const debug = { repo: this.repo }
      debug[section] = config

      const Plugin = Settings.PLUGINS[section]
      return new Plugin(this.github, this.repo, config).sync()
    })
  )

  return Settings.sync(octokit.rest, repo, config)
}
