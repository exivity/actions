import { getOctokit } from '@actions/github'

export async function release({
  octokit,
  dryRun,
}: {
  octokit: ReturnType<typeof getOctokit>
  dryRun: boolean
}) {}
