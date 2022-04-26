import { parse as semverParse } from 'semver'
import { getRef, getRepository, getSha, getTag } from './github'

/**
 * A tag name must be valid ASCII and may contain lowercase and uppercase
 * letters, digits, underscores, periods and dashes. A tag name may not
 * start with a period or a dash and may contain a maximum of 128
 * characters.
 * See https://docs.docker.com/engine/reference/commandline/tag/
 */
export function branchToTag(ref = getRef()) {
  return ref.replace(/[^\w\w.-]/g, '-').substring(0, 127)
}

export function getLabels(component: string) {
  const { fqn } = getRepository()

  return {
    'org.opencontainers.image.vendor': 'Exivity',
    'org.opencontainers.image.title': component,
    'org.opencontainers.image.description': component,
    'org.opencontainers.image.url': 'https://exivity.com',
    'org.opencontainers.image.documentation': 'https://docs.exivity.com',
    'org.opencontainers.image.source': `https://github.com/${fqn}`,
    'org.opencontainers.image.created': new Date().toISOString(),
    'org.opencontainers.image.revision': getSha(),
  }
}

export function getComponentVersion() {
  const tag = getTag()
  const semver = semverParse(tag)

  return (semver?.version ?? getSha()) || 'unknown'
}
