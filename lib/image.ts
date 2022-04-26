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

/**
 * Returns a list of plain image tags to use.
 */
export function getTags(ref = getRef()) {
  // We use the the ref name (branch or tag name).
  const tags = [ref]

  // Clean up the refs so they can be used as tags.
  return tags.map(validTag)
}

type GetTagsFQNOptions = {
  repository: string
  tags: string[]
}

/**
 * Returns an array of FQN image tags (e.g. `registry/exivity/component:tag`)
 */
export function getTagsFQN({ repository, tags }: GetTagsFQNOptions) {
  return tags.map((tag: string) => `${repository}:${tag}`)
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getLabels(name: string) {
  const { owner, fqn } = getRepository()

  return {
    'org.opencontainers.image.vendor': capitalizeFirstLetter(owner),
    'org.opencontainers.image.title': name,
    'org.opencontainers.image.description': name,
    'org.opencontainers.image.source': `https://github.com/${fqn}`,
    'org.opencontainers.image.created': new Date().toISOString(),
    'org.opencontainers.image.revision': getSha(),
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
