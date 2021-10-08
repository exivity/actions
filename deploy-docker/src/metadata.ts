import { getExecOutput } from '@actions/exec'
import { parse as semverParse } from 'semver'
import { getRef, getSha, getTag } from '../../lib/github'

const GHCR = 'ghcr.io/'

const RELEASE_BRANCHES = ['main', 'master']
const PREVIEW_BRANCHES = [] as string[]
const CANARY_BRANCHES = ['develop']

const RELEASE_TAG = 'latest'
const PREVIEW_TAG = 'next'
const CANARY_TAG = 'canary'

export function getTagType() {
  const { repoTag, semver } = getTagData()

  if (semver) {
    return 'tag:semver'
  }

  if (repoTag) {
    return 'tag'
  }

  const ref = getRef()

  if (RELEASE_BRANCHES.includes(ref)) {
    return 'branch:release'
  }

  if (PREVIEW_BRANCHES.includes(ref)) {
    return 'branch:preview'
  }

  if (CANARY_BRANCHES.includes(ref)) {
    return 'branch:canary'
  }

  return 'branch'
}

export function getTagData() {
  const repoTag = getTag()

  return { repoTag, semver: semverParse(repoTag) }
}

export async function getImagePrefixAndTags() {
  const type = getTagType()

  switch (type) {
    case 'tag:semver':
      const { repoTag, semver } = getTagData()

      // Figure out if there are any commits on top of tag
      // First, find SHA of commit which has the tag
      const repoShaOfTagCommit = (
        await getExecOutput(`git rev-list -n 1 tags/${repoTag}`)
      ).stdout.trim()

      // Now, find number of commits between commit and HEAD
      const commitsSinceTagCommit = (
        await getExecOutput(`git rev-list --count ${repoShaOfTagCommit}..HEAD`)
      ).stdout.trim()

      // Add all tags if repo tag is latest in series, to prevent overriding more
      // recent tags
      if (Number(commitsSinceTagCommit) === 0) {
        return {
          prefix: null,
          tags: [
            semver!.version,
            `${semver!.major}.${semver!.minor}`,
            semver!.major.toString(),
            RELEASE_TAG,
          ],
        }
      }

      return { prefix: null, tags: [semver!.version] }

    case 'branch:release':
      // Only release latest tag with version
      return { prefix: null, tags: [] }

    case 'branch:preview':
      // No preview tags at this point
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

    case 'tag':
      // No non-semver repo tags at this point
      return { prefix: GHCR, tags: [] }
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
    'org.opencontainers.image.url': 'https://exivity.com',
    'org.opencontainers.image.documentation': 'https://docs.exivity.com',
    'org.opencontainers.image.source': `https://github.com/${process.env['GITHUB_REPOSITORY']}`,
    'org.opencontainers.image.version': version,
    'org.opencontainers.image.created': new Date().toISOString(),
    'org.opencontainers.image.revision': getSha(),
  }
}

export function getComponentVersion() {
  const { semver } = getTagData()

  return (semver?.version ?? process.env['GITHUB_SHA']) || 'unknown'
}
