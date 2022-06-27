import type { PluginParams } from '.'

export async function jiraPlugin({ octokit, changelog }: PluginParams) {
  return changelog
}
