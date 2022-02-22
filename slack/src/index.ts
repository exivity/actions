import { getInput, setFailed } from '@actions/core'
import { info } from 'console'
import { getRepository, getSha } from '../../lib/github'
import { Slack } from './slack'

const validStatuses = ['', 'success', 'failure', 'cancelled'] as const

function isValidStatus(status: string): status is typeof validStatuses[number] {
  return validStatuses.includes(status as any)
}

async function run() {
  // Inputs
  const message = getInput('message', { required: true })
  const channel = getInput('channel') || '#builds'
  const status = getInput('status')
  const mention = getInput('mention')
  const component = getInput('component') || getRepository().component
  const sha = getInput('sha') || (await getSha())
  const slackApiToken = getInput('slack-api-token', {
    required: true,
  })

  // Assertions
  if (!isValidStatus(status)) {
    throw new Error('The status input is invalid')
  }

  // Libs
  const slack = new Slack(slackApiToken)

  // Send message
  const resolvedChannel = await slack.resolveChannel(channel)

  info(`Sending message to ${resolvedChannel}`)
}

run().catch(setFailed)
