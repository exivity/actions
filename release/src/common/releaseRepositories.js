function resolveReleaseRepositories(lockfile, metadata = {}, defaultBranch = 'main') {
  return Object.entries(lockfile.repositories).map(([component, releasedSha]) => {
    const config = metadata[component] || {}
    const sourceRepo = config.sourceRepo || component

    return {
      component,
      releasedSha,
      sourceRepo,
      sourcePath: config.sourcePath,
      legacyOwner: config.legacyOwner,
      legacyRepo: config.legacyRepo,
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
    const existing = targets.get(repository.sourceRepo)

    if (!existing) {
      targets.set(repository.sourceRepo, {
        repo: repository.sourceRepo,
        sha: repository.releasedSha,
        components: [repository.component],
      })
      continue
    }

    if (existing.sha !== repository.releasedSha) {
      throw new Error(
        `Conflicting release SHAs for ${repository.sourceRepo}: ${existing.sha} and ${repository.releasedSha}`,
      )
    }

    existing.components.push(repository.component)
  }

  return Array.from(targets.values())
}

module.exports = {
  resolveReleaseRepositories,
  groupTagTargets,
}
