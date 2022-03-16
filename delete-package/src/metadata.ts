import { parse as semverParse } from 'semver'
import { getRef, getSha, getTag } from '../../lib/github'

export function getTags() {
  const ref = getRef()
  const sha = getSha()
  return [ref, sha]
}

export function getLabels({
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
    'org.opencontainers.image.source': `https://github.com/${process.env['GITHUB_REPOSITORY']}`,
    'org.opencontainers.image.created': new Date().toISOString(),
    'org.opencontainers.image.revision': getSha(),
  }
}

export function getComponentVersion() {
  const tag = getTag()
  const semver = semverParse(tag)

  return (semver?.version ?? process.env['GITHUB_SHA']) || 'unknown'
}
