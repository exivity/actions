import { info, setFailed } from '@actions/core'
import {
  getEventData,
  getEventName,
  getRepository,
  getToken,
} from '../../lib/github'
import * as settings from './settings'
import { SyncPlugin } from './types'

const supportedEvents = ['push', 'workflow_dispatch', 'schedule'] as const

async function run() {
  // Inputs
  const token = getToken()
  const { owner, repo } = getRepository()
  const eventName = getEventName(supportedEvents)
  const eventData = getEventData(eventName)

  // Run plugins
  // @ts-ignore Expression produces a union type that is too complex to represent.ts(2590)
  const plugins: SyncPlugin[] = [settings]

  for (const { name, run } of plugins) {
    info(`Running plugin "${name}"`)

    await run({
      ghToken: token,
      owner,
      repo,
      eventName,
      eventData,
    })
  }

  info('Running plugins done')
}

run().catch(setFailed)
