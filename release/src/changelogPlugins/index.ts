import { getOctokit } from '@actions/github'
import type { ChangelogItem } from '../common/types'
import { associatedPullRequest } from './associatedPullRequest'
import { jiraPlugin } from './jira'

export type PluginParams = {
  octokit: ReturnType<typeof getOctokit>
  changelog: ChangelogItem[]
}

type Plugin = (params: PluginParams) => Promise<ChangelogItem[]>

const plugins: Plugin[] = [associatedPullRequest, jiraPlugin]

export async function runPlugins({ octokit, changelog }: PluginParams) {
  for (const plugin of plugins) {
    changelog = await plugin({ octokit, changelog })
  }

  return changelog
}
