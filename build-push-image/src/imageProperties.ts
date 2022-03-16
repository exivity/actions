import { parse as semverParse } from 'semver'
import { getRef, getRepository, getSha, getTag } from '../../lib/github'

/**
 * Returns a list of plain image tags to use.
 */
export function getTags() {
  /**
   * We use the the ref name (branch or tag) as the tag.
   */
  const tags = [getRef()]

  /**
   * A tag name must be valid ASCII and may contain lowercase and uppercase
   * letters, digits, underscores, periods and dashes. A tag name may not
   * start with a period or a dash and may contain a maximum of 128
   * characters.
   * See https://docs.docker.com/engine/reference/commandline/tag/
   */
  return tags.map((tag) => tag.replace(/[^\w\w.-]/g, '-').substring(0, 127))
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

type GetLabelsOptions = {
  repository: ReturnType<typeof getRepository>
}

export function getLabels({ repository }: GetLabelsOptions) {
  return {
    'org.opencontainers.image.vendor': 'Exivity',
    'org.opencontainers.image.title': repository.component,
    'org.opencontainers.image.description': repository.component,
    'org.opencontainers.image.url': 'https://exivity.com',
    'org.opencontainers.image.documentation': 'https://docs.exivity.com',
    'org.opencontainers.image.source': `https://github.com/${repository.fqn}`,
    'org.opencontainers.image.created': new Date().toISOString(),
    'org.opencontainers.image.revision': getSha(),
  }
}

export function getComponentVersion() {
  const tag = getTag()
  const semver = semverParse(tag)

  return (semver?.version ?? getSha()) || 'unknown'
}
