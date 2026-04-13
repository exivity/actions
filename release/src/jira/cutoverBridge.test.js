const test = require('node:test')
const assert = require('node:assert/strict')

const {
  parseSubtreeSplitSha,
  buildLegacyBridgeRanges,
} = require('./cutoverBridge')

test('parseSubtreeSplitSha reads subtree metadata for the managed path', () => {
  const message = `Add edify subtree from exivity/edify

git-subtree-dir: edify
git-subtree-mainline: 0b6e7e25fa7e2d7173fe79ef10655415b3a06716
git-subtree-split: f7fb94604203670ac7ebbd1860d50e1241b804fd`

  assert.equal(
    parseSubtreeSplitSha(message, 'edify'),
    'f7fb94604203670ac7ebbd1860d50e1241b804fd',
  )
})

test('parseSubtreeSplitSha ignores subtree metadata for a different path', () => {
  const message = `Add proximity subtree from exivity/proximity

git-subtree-dir: proximity
git-subtree-mainline: abcdef0123456789
git-subtree-split: 1234567890abcdef1234567890abcdef12345678`

  assert.equal(parseSubtreeSplitSha(message, 'edify'), null)
})

test('buildLegacyBridgeRanges creates a bridge range for the first product-backed release', () => {
  const sourceCommits = [
    {
      sha: '4ed7d15a5',
      commit: {
        message: 'chore: add workflows',
      },
    },
    {
      sha: '4b4935d9a',
      commit: {
        message: `Add edify subtree from exivity/edify

git-subtree-dir: edify
git-subtree-mainline: 0b6e7e25fa7e2d7173fe79ef10655415b3a06716
git-subtree-split: f7fb94604203670ac7ebbd1860d50e1241b804fd`,
      },
    },
  ]

  assert.deepEqual(
    buildLegacyBridgeRanges({
      component: 'edify',
      sourceRepo: 'product',
      sourcePath: 'edify',
      releasedSha: '484ec20a345d8e916405872b1ebee29f55a40793',
      sourceCommits,
    }),
    [
      {
        repo: 'edify',
        baseSha: '484ec20a345d8e916405872b1ebee29f55a40793',
        headSha: 'f7fb94604203670ac7ebbd1860d50e1241b804fd',
      },
    ],
  )
})

test('buildLegacyBridgeRanges does nothing for standalone repositories', () => {
  assert.deepEqual(
    buildLegacyBridgeRanges({
      component: 'chronos',
      sourceRepo: 'chronos',
      sourcePath: undefined,
      releasedSha: 'sha-chronos',
      sourceCommits: [],
    }),
    [],
  )
})
