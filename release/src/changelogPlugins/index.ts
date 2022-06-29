import { getOctokit } from '@actions/github'
import type { getJiraClient } from '../common/jiraClient'
import type { ChangelogItem } from '../common/types'
import { associatedPullRequestPlugin } from './associatedPullRequest'
import { jiraPlugin } from './jira'
import { titleAndDescriptionPlugin } from './titleAndDescription'

export type PluginParams = {
  octokit: ReturnType<typeof getOctokit>
  jiraClient: ReturnType<typeof getJiraClient>
  changelog: ChangelogItem[]
}

type Plugin = (params: PluginParams) => Promise<ChangelogItem[]>

const plugins: Plugin[] = [
  associatedPullRequestPlugin,
  jiraPlugin,
  titleAndDescriptionPlugin,
]

export async function runPlugins({
  octokit,
  jiraClient,
  changelog,
}: PluginParams) {
  for (const plugin of plugins) {
    changelog = await plugin({ octokit, jiraClient, changelog })
  }

  return changelog
}
