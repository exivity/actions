import { parse as semverParse } from 'semver'
import { getRef, getRepository, getSha, getTag } from './github'

/**
 * The repository name needs to be unique in that namespace, can be two to 255
 * characters, and can only contain lowercase letters, numbers, hyphens (-), and
 * underscores (_).
 * See https://docs.docker.com/docker-hub/repos/
 */
export function validName(name: string) {
  return name.replace(/[^a-z0-9-_]/g, '-').substring(0, 254)
}

/**
 * A tag name must be valid ASCII and may contain lowercase and uppercase
 * letters, digits, underscores, periods and dashes. A tag name may not
 * start with a period or a dash and may contain a maximum of 128
 * characters.
 * See https://docs.docker.com/engine/reference/commandline/tag/
 */
export function validTag(tag: string) {
  return tag
    .replace(/^[\.-]+/, '')
    .replace(/[^\w.-]/g, '-')
    .substring(0, 127)
}

export function branchToTag(ref = getRef()) {
  return validTag(ref)
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getLabels(name: string) {
  const { owner, fqn } = getRepository()
  const tag = getTag()

  return {
    'org.opencontainers.image.vendor': capitalizeFirstLetter(owner),
    'org.opencontainers.image.title': name,
    'org.opencontainers.image.description': name,
    'org.opencontainers.image.source': `https://github.com/${fqn}`,
    'org.opencontainers.image.created': new Date().toISOString(),
    'org.opencontainers.image.revision': getSha(),
    'org.opencontainers.image.version': tag,
    ...(owner === 'exivity'
      ? {
          'org.opencontainers.image.url': 'https://exivity.com',
          'org.opencontainers.image.documentation': 'https://docs.exivity.com',
        }
      : {}),
  }
}

export function getImageVersion() {
  const tag = getTag()
  const semver = semverParse(tag)

  return (semver?.version ?? getSha()) || 'unknown'
}
