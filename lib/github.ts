import { info, warning } from '@actions/core'
import { getOctokit } from '@actions/github'

type Options = {
  octokit: ReturnType<typeof getOctokit>
  component: string
  ref: string
}

export async function getShaFromRef({ octokit, component, ref }: Options) {
  if (ref === 'develop') {
    const hasDevelop = (
      await octokit.repos.listBranches({
        owner: 'exivity',
        repo: component,
      })
    ).data.some((repoBranch) => repoBranch.name === 'develop')
    if (!hasDevelop) {
      warning(
        `Branch "develop" not available in repository "exivity/${component}", falling back to "master".`
      )
      ref = 'master'
    }
  }

  const sha = (
    await octokit.repos.getBranch({
      owner: 'exivity',
      repo: component,
      branch: ref,
    })
  ).data.commit.sha

  info(`Resolved ${ref} to ${sha}`)

  return sha
}

export async function getPR(
  octokit: ReturnType<typeof getOctokit>,
  repo: string,
  ref: string
) {
  // get most recent PR of current branch
  const {
    data: [most_recent],
  } = await octokit.pulls.list({
    owner: 'exivity',
    repo,
    head: `exivity:${ref}`,
    sort: 'updated',
  })

  return most_recent
}
