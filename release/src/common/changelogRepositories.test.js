const { test } = require('node:test')
const assert = require('node:assert/strict')
const { resolveChangelogRepositories } = require('./changelogRepositories')
const A = 'a'.repeat(40),
  B = 'b'.repeat(40),
  C = 'c'.repeat(40),
  D = 'd'.repeat(40)
const repositories = [
  {
    component: 'proximity',
    sourceRepo: 'product',
    sourcePath: 'proximity',
    releasedSha: C,
    releaseBranch: 'main',
  },
  {
    component: 'glass',
    sourceRepo: 'product',
    sourcePath: 'glass',
    releasedSha: A,
    releaseBranch: 'main',
  },
  {
    component: 'pigeon',
    sourceRepo: 'pigeon',
    releasedSha: C,
    releaseBranch: 'main',
  },
]
function plan(
  version = 'v1.0.2',
  baseline = B,
  source = A,
  developmentPr = 12,
) {
  return {
    mode: 'maintenance',
    version,
    baseline: {
      commit: baseline,
      version: version === 'v1.0.2' ? 'v1.0.1' : 'v1.0.0',
    },
    components: Object.fromEntries(
      repositories.map((r) => [
        r.component,
        { repo: r.sourceRepo, path: r.sourcePath || '', baselineSha: source },
      ]),
    ),
    fixes: {
      product: { developmentPr },
      pigeon: { developmentPr: developmentPr + 1 },
    },
  }
}
const resolve = (p, loadBaseline = async () => null) =>
  resolveChangelogRepositories({
    repositories,
    lockfile: { version: p?.version || 'v2.0.0' },
    plan: p,
    loadBaseline,
  })
test('ordinary preparation leaves artifact/tag source resolution unchanged', async () => {
  assert.equal(await resolve(null), repositories)
  assert.equal(
    await resolveChangelogRepositories({
      repositories,
      lockfile: { version: 'v2.0.0' },
      plan: plan(),
    }),
    repositories,
  )
})
test('the next normal release starts notes before maintenance, preserving older unshipped main work', async () => {
  const p = plan()
  p.fixes.product.developmentCommit = D
  const result = await resolve(p)
  assert.equal(result[0].releasedSha, A)
  assert.equal(result[2].releasedSha, A)
  assert.deepEqual(result[0].excludedPullRequests, [12])
  assert.deepEqual(result[0].excludedCommitShas, [D])
  assert.deepEqual(result[2].excludedPullRequests, [13])
  assert.equal(repositories[0].releasedSha, C)
  assert.equal(repositories[0].excludedPullRequests, undefined)
})
test('repeated maintenance releases retain the last normal baseline and omit every shipped forward-port', async () => {
  const result = await resolve(plan('v1.0.2', C, B), async (ref) =>
    ref === C ? plan('v1.0.1', D, A, 8) : null,
  )
  assert.equal(result[0].releasedSha, A)
  assert.deepEqual(result[0].excludedPullRequests, [12, 8])
  assert.deepEqual(result[2].excludedPullRequests, [13, 9])
})
test('a stale plan retained at an ordinary baseline does not extend history past that release', async () => {
  const result = await resolve(plan(), async () => ({
    mode: 'maintenance',
    version: 'v0.9.9',
  }))
  assert.equal(result[0].releasedSha, A)
})
test('missing/cyclic history and changed component source mappings fail rather than use maintenance dates', async () => {
  await assert.rejects(
    resolve(plan(), async () => {
      throw Error('GitHub unavailable')
    }),
    /GitHub unavailable/,
  )
  await assert.rejects(
    resolve(plan(), async () => plan('v1.0.1')),
    /cyclic/,
  )
  const bad = plan()
  bad.components.proximity.repo = 'other'
  await assert.rejects(resolve(bad), /Invalid maintenance changelog source/)
})
