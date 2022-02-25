import { info, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import {
  getEventData,
  getEventName,
  getRepository,
  getToken,
} from '../../lib/github'
import { settings } from './plugins'
import { SyncPlugin } from './types'

const supportedEvents = ['push', 'workflow_dispatch', 'schedule'] as const

async function run() {
  // Inputs
  const token = getToken()
  const component = getRepository().component
  const eventName = getEventName(supportedEvents)
  const eventData = await getEventData(eventName)

  // Client
  const octokit = getOctokit(token)

  // Run plugins
  const plugins: SyncPlugin[] = [settings]

  for (const { name, run } of plugins) {
    info(`Running sync plugin "${name}"`)

    await run()
  }

  info('🎉 Congratulation! Your pull request is semantic.')
}

run().catch(setFailed)
