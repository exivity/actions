import type { PluginParams } from '.'
import { parseCommitMessage } from '../../../lib/conventionalCommits'
import { getAssociatedPullRequest } from '../../../lib/github'

export async function associatedPullRequestPlugin({
  octokit,
  changelog,
}: PluginParams) {
  for (const item of changelog) {
    const associatedPullRequest = await getAssociatedPullRequest({
      octokit,
      owner: 'exivity',
      repo: item.links.commit.repository,
      sha: item.links.commit.sha,
    })

    if (typeof associatedPullRequest !== 'undefined') {
      item.links.pr = {
        title: parseCommitMessage(associatedPullRequest.title).description,
        originalTitle: associatedPullRequest.title,
        description: associatedPullRequest.body,
        slug: `exivity/${item.links.commit.repository}#${associatedPullRequest.number}`,
        url: associatedPullRequest.url,
      }
    }
  }

  return changelog
}
