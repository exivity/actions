import { getOctokit } from '@actions/github'
import Settings from 'probot-settings/lib/settings'
import { EventName } from '../../../lib/github'
import { SyncPluginOptions } from '../types'

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
  const config = {}

  return Settings.sync(octokit, repo, config)
}
