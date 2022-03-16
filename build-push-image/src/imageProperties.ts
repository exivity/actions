import { parse as semverParse } from 'semver'
import { getRef, getRepository, getSha, getTag } from '../../lib/github'

/**
 * Returns a list of plain image tags to use. In the current situation, this is
 * simply the ref name (branch or tag).
 */
export function getTags() {
  return [getRef()]
}

type GetTagsFQNOptions = {
  tags: string[]
  registry: string
  component: string
}

/**
 * Returns an array of FQN image tags (e.g. `registry/exivity/component:tag`)
 */
export function getTagsFQN({ tags, registry, component }: GetTagsFQNOptions) {
  /**
   * A tag name must be valid ASCII and may contain lowercase and uppercase
   * letters, digits, underscores, periods and dashes. A tag name may not
   * start with a period or a dash and may contain a maximum of 128
   * characters.
   * See https://docs.docker.com/engine/reference/commandline/tag/
   */
  function slugify(tag: string) {
    return tag.replace(/[^\w\w.-]/g, '-').substring(0, 127)
  }

  function prefix(tag: string) {
    return `${registry}/exivity/${component}:${tag}`
  }

  return tags.map(slugify).map(prefix)
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
