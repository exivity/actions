import { debug, info } from '@actions/core'
import { getOctokit } from '@actions/github'
import deepmerge from 'deepmerge'
import yaml from 'js-yaml'
import { EventName } from '../../../lib/github'
import { SyncPluginOptions } from '../types'
import { arrayMerge } from './arrayMerge'
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
  owner,
  repo: repo_name,
}: SyncPluginOptions<T>) {
  const octokit = getOctokit(ghToken)
  const repo = {
    owner,
    repo: repo_name,
  }

  // Grab settings from .github/settings.yml
  let config: Config = {}
  for (const repo of ['.github', repo_name]) {
    try {
      const settings = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: CONFIG_FILENAME,
      })
      if ('content' in settings.data) {
        const buffer = Buffer.from(settings.data.content, 'base64')
        const content = buffer.toString('utf8')
        const repoConfig = yaml.load(content) as Config & { _extends?: string }
        debug(
          `Got config from "exivity/${repo}":\n${JSON.stringify(
            repoConfig,
            undefined,
            2,
          )}`,
        )
        if ('_extends' in repoConfig) {
          delete repoConfig._extends
        }
        config = deepmerge(config, repoConfig, { arrayMerge })
      } else {
        debug(
          `Could not get settings from "exivity/${repo}" (not a file), ignoring`,
        )
      }
    } catch (error: unknown) {
      debug(
        `Could not get settings from "exivity/${repo}" (fetch error), ignoring`,
      )
    }
  }
  debug(`Got config:\n${JSON.stringify(config, undefined, 2)}`)

  return Promise.all(
    Object.entries(config).map(([section, sectionConfig]) => {
      info(`  ➡️ Running settings plugin "${section}"`)

      const Plugin = PLUGINS[section as keyof typeof PLUGINS]
      return new Plugin(octokit, repo, sectionConfig as any).sync()
    }),
  )
}
