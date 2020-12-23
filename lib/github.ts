import { info, warning } from '@actions/core'
import { getOctokit } from '@actions/github'

type Options = {
  ghToken: string
  component: string
  branch: string
}

export async function getShaFromBranch({
  ghToken,
  component,
  branch,
}: Options) {
  const octokit = getOctokit(ghToken)

  if (branch === 'develop') {
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
      branch = 'master'
    }
  }

  const sha = (
    await octokit.repos.getBranch({
      owner: 'exivity',
      repo: component,
      branch,
    })
  ).data.commit.sha

  info(`Resolved ${branch} to ${sha}`)

  return sha
}

export async function getPR(
  octokit: ReturnType<typeof getOctokit>,
  repo: string,
  branch: string
) {
  // get most recent PR of current branch
  const {
    data: [most_recent],
  } = await octokit.pulls.list({
    owner: 'exivity',
    repo,
    head: `exivity:${branch}`,
    sort: 'updated',
  })

  return most_recent
}
