import type { PluginParams } from '.'
import { getAssociatedPullRequest } from '../../../lib/github'

export async function associatedPullRequest({
  octokit,
  changelog,
}: PluginParams) {
  for (const item of changelog) {
    const associatedPullRequest = await getAssociatedPullRequest({
      octokit,
      owner: 'exivity',
      repo: item.repository,
      sha: item.sha,
    })
    console.log(associatedPullRequest)
  }

  return changelog
}
