const test = require('node:test')
const assert = require('node:assert/strict')

const {
  resolveReleaseRepositories,
  groupTagTargets,
} = require('./releaseRepositories')

test('resolveReleaseRepositories preserves standalone defaults', () => {
  const repositories = resolveReleaseRepositories({
    version: 'v1.2.3',
    repositories: {
      chronos: 'sha-chronos',
    },
  })

  assert.deepEqual(repositories, [
    {
      component: 'chronos',
      releasedSha: 'sha-chronos',
      sourceRepo: 'chronos',
      sourcePath: undefined,
      releaseBranch: 'main',
      tagStrategy: 'component-repo',
    },
  ])
})

test('resolveReleaseRepositories maps product-backed components from metadata', () => {
  const repositories = resolveReleaseRepositories(
    {
      version: 'v1.2.3',
      repositories: {
        glass: 'sha-product',
        proximity: 'sha-product',
        chronos: 'sha-chronos',
      },
    },
    {
      glass: {
        sourceRepo: 'product',
        sourcePath: 'glass',
        releaseBranch: 'main',
        tagStrategy: 'canonical',
      },
      proximity: {
        sourceRepo: 'product',
        sourcePath: 'proximity',
      },
    },
  )

  assert.deepEqual(repositories, [
    {
      component: 'glass',
      releasedSha: 'sha-product',
      sourceRepo: 'product',
      sourcePath: 'glass',
      releaseBranch: 'main',
      tagStrategy: 'canonical',
    },
    {
      component: 'proximity',
      releasedSha: 'sha-product',
      sourceRepo: 'product',
      sourcePath: 'proximity',
      releaseBranch: 'main',
      tagStrategy: 'source-repo',
    },
    {
      component: 'chronos',
      releasedSha: 'sha-chronos',
      sourceRepo: 'chronos',
      sourcePath: undefined,
      releaseBranch: 'main',
      tagStrategy: 'component-repo',
    },
  ])
})

test('groupTagTargets deduplicates shared source repositories', () => {
  const targets = groupTagTargets([
    {
      component: 'glass',
      releasedSha: 'sha-product',
      sourceRepo: 'product',
    },
    {
      component: 'proximity',
      releasedSha: 'sha-product',
      sourceRepo: 'product',
    },
    {
      component: 'chronos',
      releasedSha: 'sha-chronos',
      sourceRepo: 'chronos',
    },
  ])

  assert.deepEqual(targets, [
    {
      repo: 'product',
      sha: 'sha-product',
      components: ['glass', 'proximity'],
    },
    {
      repo: 'chronos',
      sha: 'sha-chronos',
      components: ['chronos'],
    },
  ])
})

test('groupTagTargets rejects conflicting SHAs for one source repository', () => {
  assert.throws(
    () =>
      groupTagTargets([
        {
          component: 'glass',
          releasedSha: 'sha-product-a',
          sourceRepo: 'product',
        },
        {
          component: 'proximity',
          releasedSha: 'sha-product-b',
          sourceRepo: 'product',
        },
      ]),
    /Conflicting release SHAs for product/,
  )
})
