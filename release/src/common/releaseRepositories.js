function resolveReleaseRepositories(lockfile, metadata = {}, defaultBranch = 'main') {
  return Object.entries(lockfile.repositories).map(([component, releasedSha]) => {
    const config = metadata[component] || {}
    const sourceRepo = config.sourceRepo || component

    return {
      component,
      releasedSha,
      sourceRepo,
      sourcePath: config.sourcePath,
      releaseBranch: config.releaseBranch || defaultBranch,
      tagStrategy:
        config.tagStrategy ||
        (sourceRepo === component ? 'component-repo' : 'source-repo'),
    }
  })
}

function groupTagTargets(releaseRepositories) {
  const targets = new Map()

  for (const repository of releaseRepositories) {
    const tagStrategy = repository.tagStrategy || 'component-repo'
    const key =
      tagStrategy === 'canonical'
        ? `canonical:${repository.sourceRepo}`
        : `${tagStrategy}:${repository.sourceRepo}`
    const existing = targets.get(key)

    if (!existing) {
      targets.set(key, {
        repo: repository.sourceRepo,
        sha: tagStrategy === 'canonical' ? undefined : repository.releasedSha,
        candidateShas:
          tagStrategy === 'canonical' ? [repository.releasedSha] : undefined,
        components: [repository.component],
        tagStrategy,
      })
      continue
    }

    if (
      tagStrategy !== 'canonical' &&
      existing.sha !== repository.releasedSha
    ) {
      throw new Error(
        `Conflicting release SHAs for ${repository.sourceRepo}: ${existing.sha} and ${repository.releasedSha}`,
      )
    }

    if (
      tagStrategy === 'canonical' &&
      !existing.candidateShas.includes(repository.releasedSha)
    ) {
      existing.candidateShas.push(repository.releasedSha)
    }

    existing.components.push(repository.component)
  }

  return Array.from(targets.values())
}

module.exports = {
  resolveReleaseRepositories,
  groupTagTargets,
}
