import { info } from '@actions/core'
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
