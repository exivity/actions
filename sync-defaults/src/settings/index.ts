import { debug, info } from '@actions/core'
import { getOctokit } from '@actions/github'
import { EventName } from '../../../lib/github'
import { SyncPluginOptions } from '../types'
import {
  Branches,
  Collaborators,
  Labels,
  Milestones,
  Repository,
  Teams,
} from './plugins'
import { Config } from './types'

const CONFIG_FILENAME = '.github/settings.yml'

const PLUGINS = {
  repository: Repository,
  labels: Labels,
  collaborators: Collaborators,
  teams: Teams,
  milestones: Milestones,
  branches: Branches,
}

export const name = 'settings'

export async function run<T extends EventName>({
  ghToken,
  component,
}: SyncPluginOptions<T>) {
  const octokit = getOctokit(ghToken)
  const repo = {
    owner: 'exivity',
    repo: component,
  }

  // Grab settings from .github/settings.yml
  for (const repo of ['.github', component]) {
    try {
      const settings = await octokit.rest.repos.getContent({
        owner: 'exivity',
        repo,
        path: '.github/settings.yml',
      })
      debug(JSON.stringify(settings.data, undefined, 2))
    } catch (error: unknown) {
      debug(`Could not get settings from "exivity/${repo}", ignoring`)
    }
  }

  const config: Config = {
    labels: [
      {
        name: 'feature',
        color: '#0E8A16',
        description: 'Adds functionality for end-users',
      },
      {
        name: 'bug',
        color: '#D93F0B',
        description: 'Undesired or defective behaviour',
      },
      {
        name: 'chore',
        color: '#1D76DB',
        description: "Doesn't affect functionality}",
      },
    ],
  }

  debug(`Got config:\n${JSON.stringify(config, undefined, 2)}`)

  return Promise.all(
    Object.entries(config).map(([section, sectionConfig]) => {
      info(`  ➡️ Running settings plugin "${section}"`)

      const Plugin = PLUGINS[section as keyof typeof PLUGINS]
      return new Plugin(octokit, repo, sectionConfig as any).sync()
    })
  )
}
