const { test } = require('node:test')
const assert = require('node:assert/strict')
const { isMaintenancePlan } = require('./maintenancePlan')
test('matching maintenance release cannot enter standard tagger', () => {
  assert.equal(
    isMaintenancePlan(
      { mode: 'maintenance', version: 'v3.39.3' },
      { version: 'v3.39.3' },
    ),
    true,
  )
})
test('subsequent standard release can proceed with an older maintenance plan present', () => {
  assert.equal(
    isMaintenancePlan(
      { mode: 'maintenance', version: 'v3.39.3' },
      { version: 'v3.40.0' },
    ),
    false,
  )
  assert.equal(isMaintenancePlan(undefined, { version: 'v3.40.0' }), false)
})
