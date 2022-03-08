import { getExecOutput } from '@actions/exec'
import { parse as semverParse } from 'semver'
import { getRef, getSha, getTag } from '../../lib/github'

export async function setTags() {
  const ref = getRef()
  const sha = await getSha()
  return [ref, sha]
}

export function setLabels({
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

export function setComponentVersion() {
  const tag = getTag()
  const semver = semverParse(tag)

  return (semver?.version ?? process.env['GITHUB_SHA']) || 'unknown'
}
