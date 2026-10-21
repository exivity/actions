import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildIdentity } from './identity.js'
const checkout = 'a'.repeat(40)
test('dispatch uses checkout provenance and explicit candidate tag', () => {
  assert.deepEqual(
    buildIdentity({
      checkout,
      expected: checkout,
      outputTag: 'candidate-v3.39.3-123',
      fallbackTag: 'main',
    }),
    { revision: checkout, tag: 'candidate-v3.39.3-123' },
  )
})
test('standard branch tag remains supported', () => {
  assert.equal(buildIdentity({ checkout, fallbackTag: 'main' }).tag, 'main')
})
test('wrong checkout and mutable output tags fail', () => {
  assert.throws(() => buildIdentity({ checkout, expected: 'b'.repeat(40) }))
  assert.throws(() =>
    buildIdentity({ checkout, expected: checkout, fallbackTag: 'main' }),
  )
  for (const outputTag of [
    'main',
    'daily',
    'exivity-3.39.3',
    'candidate-x:bad',
  ])
    assert.throws(() => buildIdentity({ checkout, outputTag }))
})
