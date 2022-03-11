import { getExecOutput } from '@actions/exec'
import { context } from '@actions/github'
import { parse as semverParse } from 'semver'
import { getRef, getSha, getTag } from '../../lib/github'

export const GHCR = 'ghcr.io/'

const RELEASE_BRANCHES = ['main', 'master']
const BETA_BRANCHES = [] as string[]
const CANARY_BRANCHES = ['develop']

const RELEASE_TAG = 'latest'
const BETA_TAG = 'next'
const CANARY_TAG = 'canary'

/**
 * Deploy type is used to determine the Docker image tag and is based on the
 * current git tag or branch.
 *
 * - tag:semver: tag is a valid semver
 * - tag: non-semver tag
 * - branch:release: release branch
 * - branch:beta: beta branch
 * - branch:canary: canary branch
 * - branch: feature branch
 */
export function getDeployType() {
  const tag = getTag()
  const semver = semverParse(tag)

  if (semver) {
    return 'tag:semver'
  }

  if (tag) {
    return 'tag'
  }

  const ref = getRef()

  if (RELEASE_BRANCHES.includes(ref)) {
    return 'branch:release'
  }

  if (BETA_BRANCHES.includes(ref)) {
    return 'branch:beta'
  }

  if (CANARY_BRANCHES.includes(ref)) {
    return 'branch:canary'
  }

  return 'branch'
}

/**
 * Retrieve the image prefix and tag(s) based on deploy type. Implements the
 * following logic:
 *
 * - Semver tags are deployed to Docker Hub directly
 * - `develop` and feature branches are deployed to ghcr.io
 */
export async function getImagePrefixAndTags() {
  const type = getDeployType()

  switch (type) {
    case 'tag:semver':
      const tag = getTag()
      const semver = semverParse(tag)!

      // Figure out if there are any commits on top of tag
      // First, find SHA of commit which has the tag
      const repoShaOfTagCommit = (
        await getExecOutput(`git rev-list -n 1 tags/${tag}`)
      ).stdout.trim()

      // Now, find number of commits between commit and HEAD
      const commitsSinceTagCommit = (
        await getExecOutput(`git rev-list --count ${repoShaOfTagCommit}..HEAD`)
      ).stdout.trim()

      // Add all tags if repo tag is latest in series
      if (Number(commitsSinceTagCommit) === 0) {
        return {
          prefix: null,
          tags: [
            semver.version,
            `${semver.major}.${semver.minor}`,
            semver.major.toString(),
            RELEASE_TAG,
          ],
        }
      }

      // If tag is not the most recent, only tag with exact semver to prevent
      // overriding more recent tags
      return { prefix: null, tags: [semver!.version] }

    case 'tag':
      // No non-semver repo tags at this point
      return { prefix: GHCR, tags: [] }

    case 'branch:release':
      // Do not deploy release branches directly (only tagged commits)
      return { prefix: null, tags: [] }

    case 'branch:beta':
      // No beta tags at this point
      return { prefix: null, tags: [] }

    case 'branch:canary':
      // Release develop branches as canary tag
      return { prefix: GHCR, tags: [CANARY_TAG] }

    case 'branch':
      // Image tags should comform with [\w][\w.-]{0,127}
      const ref = getRef()
      return {
        prefix: GHCR,
        tags: [ref.replace(/[^\w\w.-]/g, '-').substr(0, 127)],
      }
  }
}

export function getImageLabels({
  component,
  version,
}: {
  component: string
  version: string
}) {
  return {
    'org.opencontainers.image.vendor': 'Exivity',
    'org.opencontainers.image.title': component,
    'org.opencontainers.image.description': component,
    'org.opencontainers.image.url': 'https://exivity.com',
    'org.opencontainers.image.documentation': 'https://docs.exivity.com',
    'org.opencontainers.image.source': `https://github.com/${context.repo.owner}/${context.repo.repo}`,
    'org.opencontainers.image.version': version,
    'org.opencontainers.image.created': new Date().toISOString(),
    'org.opencontainers.image.revision': getSha(),
  }
}

export function getComponentVersion() {
  const tag = getTag()
  const semver = semverParse(tag)

  return (semver?.version ?? getSha()) || 'unknown'
}
