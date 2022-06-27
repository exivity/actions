import { info } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getPrFromRef, getRepository } from '../../../lib/github'

export async function createOrUpdatePullRequest({
  octokit,
  title,
  prTemplate,
  changelogContents,
  upcomingReleaseBranch,
  releaseBranch,
}: {
  octokit: ReturnType<typeof getOctokit>
  title: string
  prTemplate: string
  changelogContents: string[]
  upcomingReleaseBranch: string
  releaseBranch: string
}) {
  const existingPullRequest = await getPrFromRef({
    octokit,
    owner: 'exivity',
    repo: getRepository().repo,
    ref: upcomingReleaseBranch,
  })
  const body = prTemplate.replace(
    '<!-- CHANGELOG_CONTENTS -->',
    changelogContents.join('\n')
  )
  if (existingPullRequest) {
    const pr = await octokit.rest.pulls.update({
      owner: 'exivity',
      repo: getRepository().repo,
      pull_number: existingPullRequest.number,
      title,
      body,
    })
    info(`Updated pull request #${pr.data.number}`)
    return pr.data
  } else {
    const pr = await octokit.rest.pulls.create({
      owner: 'exivity',
      repo: getRepository().repo,
      title,
      body,
      head: upcomingReleaseBranch,
      base: releaseBranch,
    })
    info(`Opened pull request #${pr.data.number}`)
    return pr.data
  }
}
