import { getOctokit } from '@actions/github'
import { info } from 'console'

export async function prepare({
  octokit,
  repositories,
  dryRun,
}: {
  octokit: ReturnType<typeof getOctokit>
  repositories: string[]
  dryRun: boolean
}) {
  // Get latest version of current repository
  // Iterate over repositories
  for (const repository in repositories) {
    info(`Reading commits since last release in exivity/${repository}...`)
  }
}
