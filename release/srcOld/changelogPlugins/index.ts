import { getOctokit } from '@actions/github'
import type { getJiraClient } from '../common/jiraClient'
import { ChangelogItem } from '../changelog/utils'
import { associatedPullRequestPlugin } from './associatedPullRequest'
import { jiraPlugin } from './jira'
import { titleAndDescriptionPlugin } from './titleAndDescription'

export type JiraClient = ReturnType<typeof getJiraClient>

export type PluginParams = {
  octokit: ReturnType<typeof getOctokit>
  jiraClient: JiraClient
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
