import { getExecOutput } from '@actions/exec'
import semver from 'semver'
import { getRef, getSha, getTag } from '../../lib/github'

const GHCR = 'ghcr.io/'

const RELEASE_BRANCHES = ['main', 'master']
const PREVIEW_BRANCHES = [] as string[]
const CANARY_BRANCHES = ['develop']

const RELEASE_TAG = 'latest'
const PREVIEW_TAG = 'next'
const CANARY_TAG = 'canary'

export function getTagData() {
  const repoTag = getTag()

  return { repoTag, semverTag: semver.valid(repoTag) }
}

export async function getImagePrefixAndTags() {
  const { repoTag, semverTag } = getTagData()

  if (semverTag) {
    const major = semver.major.toString()
    const majorMinor = `${semver.major}.${semver.minor}`

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
      return { prefix: null, tags: [semverTag, majorMinor, major, RELEASE_TAG] }
    }

    return { prefix: null, tags: [semverTag] }
  }

  const repoRef = getRef()

  if (RELEASE_BRANCHES.includes(repoRef)) {
    // Only release latest tag with version
    return { prefix: null, tags: [] }
  }

  if (PREVIEW_BRANCHES.includes(repoRef)) {
    // No preview tags at this point
    return { prefix: null, tags: [] }
  }

  if (CANARY_BRANCHES.includes(repoRef)) {
    // Release develop branches as canary tag
    return { prefix: GHCR, tags: [CANARY_TAG] }
  }

  // Image tags should comform with [\w][\w.-]{0,127}
  return {
    prefix: GHCR,
    tags: [repoRef.replace(/[^\w\w.-]/g, '-').substr(0, 127)],
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
  const { semverTag } = getTagData()

  return (semverTag ?? process.env['GITHUB_SHA']) || 'unknown'
}
