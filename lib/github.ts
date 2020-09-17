import { info, warning } from '@actions/core'
import { getOctokit } from '@actions/github'

const S3_BUCKET = 'exivity'
const S3_PREFIX = 'build'
const S3_REGION = 'eu-central-1'

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
