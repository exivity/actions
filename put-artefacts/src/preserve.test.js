import assert from 'node:assert/strict'
import { test } from 'node:test'
import { preserveTagArtifacts } from './preserve.js'

test('release tag preserves artifacts without uploading rebuilt bytes', async () => {
  for (const ref of ['refs/tags/v3.39.3', 'refs/tags/other-release']) {
    assert.equal(await preserveTagArtifacts(ref, async () => true), true)
  }
})
test('tag without prior artifacts fails instead of silently building a partial prefix', async () => {
  await assert.rejects(
    preserveTagArtifacts('refs/tags/v3.39.3', async () => false),
    /Build this source commit on its branch/,
  )
  await assert.rejects(
    preserveTagArtifacts('refs/tags/v3.39.3', async () => {
      throw Error('storage denied')
    }),
    /storage denied/,
  )
})
test('branch, pull request and dispatch builds keep existing upload behavior', async () => {
  for (const ref of [
    'refs/heads/main',
    'refs/heads/maintenance/v3.39.3',
    'refs/pull/12/merge',
    undefined,
  ]) {
    assert.equal(
      await preserveTagArtifacts(ref, async () => {
        throw Error('must not query storage')
      }),
      false,
    )
  }
})
