import { getOctokit } from '@actions/github'
import { info } from 'console'
import { getLatestSemverTag } from '../../lib/git'
import { getRepository } from '../../lib/github'

export async function prepare({
  octokit,
  repositories,
  dryRun,
}: {
  octokit: ReturnType<typeof getOctokit>
  repositories: string[]
  dryRun: boolean
}) {
  const repo = getRepository()
  // Get latest version of current repository
  info(`Finding latest release in ${repo.fqn}...`)
  const latest = await getLatestSemverTag()
  if (typeof latest === 'undefined') {
    throw new Error('Could not determine latest version')
  }
  info(`Latest version: ${latest}`)

  // Iterate over repositories
  for (const repository of repositories) {
    info(`Reading commits since last release in exivity/${repository}...`)
  }
}
