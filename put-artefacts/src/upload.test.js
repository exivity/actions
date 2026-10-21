import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, delimiter, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

function run(ref, state = 'present') {
  const root = mkdtempSync(join(tmpdir(), 'artifact-guard-'))
  try {
    mkdirSync(join(root, 'build'))
    writeFileSync(join(root, 'build', 'component.exe'), 'rebuilt bytes')
    writeFileSync(
      join(root, 'aws'),
      `#!/usr/bin/env node
const fs = require('node:fs');
fs.appendFileSync(process.env.CALL_LOG, JSON.stringify(process.argv.slice(2)) + String.fromCharCode(10));
if (process.env.STORAGE_STATE === 'denied') process.exit(2);
console.log(JSON.stringify({Contents: process.env.STORAGE_STATE === 'present' ? [{Key:'existing'}] : []}));
`,
      { mode: 0o755 },
    )
    const result = spawnSync(
      process.execPath,
      [resolve('put-artefacts/dist/index.js')],
      {
        encoding: 'utf8',
        env: {
          ...process.env,
          PATH: root + delimiter + process.env.PATH,
          GITHUB_REPOSITORY: 'exivity/transcript',
          GITHUB_SHA: 'a'.repeat(40),
          GITHUB_REF: ref,
          GITHUB_WORKSPACE: root,
          GITHUB_EVENT_NAME: 'push',
          'INPUT_AWS-ACCESS-KEY-ID': 'test',
          'INPUT_AWS-SECRET-ACCESS-KEY': 'test',
          'INPUT_USE-PLATFORM-PREFIX': 'true',
          INPUT_PREFIX: 'payload',
          CALL_LOG: join(root, 'calls'),
          STORAGE_STATE: state,
        },
      },
    )
    assert.ok(
      result.status === 0 || result.stdout.includes('::error::'),
      result.stdout + result.stderr,
    )
    const calls = readFileSync(join(root, 'calls'), 'utf8')
      .trim()
      .split('\n')
      .map(JSON.parse)
    return { ...result, calls }
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

test('bundled action lists the exact tag prefix and never calls upload', () => {
  const result = run('refs/tags/v3.39.3')
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.equal(result.calls.length, 1)
  assert.deepEqual(result.calls[0].slice(0, 2), ['s3api', 'list-objects-v2'])
  assert.ok(result.calls[0].includes('--no-paginate'))
  assert.equal(
    result.calls[0][result.calls[0].indexOf('--prefix') + 1],
    `build/transcript/${'a'.repeat(40)}/linux/payload/`,
  )
})
test('bundled action fails closed on missing artifacts or storage errors', () => {
  for (const state of ['empty', 'denied']) {
    const result = run('refs/tags/v3.39.3', state)
    assert.equal(result.status, 1)
    assert.equal(result.calls.length, 1)
  }
})
test('bundled action retains branch uploads', () => {
  const result = run('refs/heads/main')
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.equal(result.calls.length, 1)
  assert.deepEqual(result.calls[0].slice(0, 2), ['s3', 'cp'])
})
