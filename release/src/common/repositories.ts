import { info } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getCommitForTag, getCommitsSince } from '../../../lib/github'
import { readRepositories } from './files'
import { ChangelogItem, Commit, Lockfile } from './types'
import { createChangelogItemFromCommit } from './changelog'
import { DEFAULT_REPOSITORY_RELEASE_BRANCH } from './consts'

export async function checkRepositories(
  repositoriesJsonPath: string,
  latestVersion: string,
  octokit: ReturnType<typeof getOctokit>
): Promise<[ChangelogItem[], Lockfile]> {
  const pendingCommits: Commit[] = []
  let changelog: ChangelogItem[] = []
  const lockfile: Lockfile = { version: '', repositories: {} }
  const repositories = await readRepositories(repositoriesJsonPath)

  // Iterate over repositories
  info(`Iterating repositories`)
  for (const [repository, repositoryOptions] of Object.entries(repositories)) {
    info(`- exivity/${repository}`)
    // Find commit for latest version tag in target repository
    const latestVersionCommit = await getCommitForTag({
      octokit,
      owner: 'exivity',
      repo: repository,
      tag: latestVersion,
    })

    // Get a list of commits from the last version
    const repoCommits = await getCommitsSince({
      octokit,
      owner: 'exivity',
      repo: repository,
      branch:
        repositoryOptions.releaseBranch || DEFAULT_REPOSITORY_RELEASE_BRANCH,
      since: latestVersionCommit,
    })

    // Record first commit in lockfile, or use latest version commit in case
    // there are no pending repo commits
    lockfile.repositories[repository] =
      repoCommits.length > 0 ? repoCommits[0].sha : latestVersionCommit.sha

    repoCommits.forEach((repoCommit) => {
      const commit = { ...repoCommit, repository }

      // Add to all commits
      pendingCommits.push(commit)

      // Add to notes
      changelog.push(createChangelogItemFromCommit(commit))
    })
  }

  return [changelog, lockfile]
}
