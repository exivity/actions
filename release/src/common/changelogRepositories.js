const { isMaintenancePlan } = require('./maintenancePlan')
const fullSha = /^[a-f0-9]{40}$/

// A maintenance artifact commit can be newer than unreleased work on main.
// Keep normal changelog collection anchored at the last ordinary release and
// omit the reviewed development PRs whose fixes already shipped as maintenance.
async function resolveChangelogRepositories({
  repositories,
  lockfile,
  plan,
  loadBaseline,
}) {
  if (!isMaintenancePlan(plan, lockfile)) return repositories
  const result = repositories.map((r) => ({
    ...r,
    excludedPullRequests: [],
    excludedCommitShas: [],
  }))
  const seen = new Set()
  let current = plan
  while (current) {
    const baseline = current.baseline
    if (!fullSha.test(baseline?.commit) || seen.has(baseline.commit))
      throw new Error('Invalid or cyclic maintenance changelog baseline')
    seen.add(baseline.commit)
    for (const repository of result) {
      const component = current.components?.[repository.component]
      if (
        !component ||
        !fullSha.test(component.baselineSha) ||
        component.repo !== repository.sourceRepo ||
        (component.path || '') !== (repository.sourcePath || '')
      )
        throw new Error(
          `Invalid maintenance changelog source: ${repository.component}`,
        )
      repository.releasedSha = component.baselineSha
      const pr = current.fixes?.[repository.sourceRepo]?.developmentPr
      const commit = current.fixes?.[repository.sourceRepo]?.developmentCommit
      if (commit !== undefined) {
        if (!fullSha.test(commit))
          throw new Error(
            `Invalid released development commit: ${repository.sourceRepo}`,
          )
        if (!repository.excludedCommitShas.includes(commit))
          repository.excludedCommitShas.push(commit)
      }
      if (pr !== undefined) {
        if (!Number.isSafeInteger(pr) || pr <= 0)
          throw new Error(
            `Invalid released development PR: ${repository.sourceRepo}`,
          )
        if (!repository.excludedPullRequests.includes(pr))
          repository.excludedPullRequests.push(pr)
      }
    }
    const previous = await loadBaseline(baseline.commit)
    current = isMaintenancePlan(previous, { version: baseline.version })
      ? previous
      : null
  }
  return result
}

module.exports = { resolveChangelogRepositories }
