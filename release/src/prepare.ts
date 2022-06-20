import { getOctokit } from '@actions/github'

export async function prepare({
  octokit,
  dryRun,
}: {
  octokit: ReturnType<typeof getOctokit>
  dryRun: boolean
}) {}
