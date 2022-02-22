import { getInput, setFailed } from '@actions/core'
import { info } from 'console'
import { getRepository, getSha } from '../../lib/github'
import { Slack } from './slack'
import { Blocks } from './types'

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

  // Resolve channel
  const resolvedChannel = await slack.resolveChannel(channel)
  if (!resolvedChannel) {
    throw new Error(`Could not resolve channel ${channel} to send message to`)
  }
  info(`Sending message to ${resolvedChannel}`)

  // Create blocks
  const statusText =
    status === 'success'
      ? '✅ *Build successful*\n\n'
      : status === 'failure'
      ? '🚨 *Build failed*\n\n'
      : status === 'cancelled'
      ? '🚫 *Build cancelled*\n\n'
      : ''
  const blocks: Blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${statusText}${message}`,
      },
      accessory: {
        type: 'image',
        image_url: 'https://avatars.githubusercontent.com/u/44036562?s=280&v=4',
        alt_text: 'GitHub Actions',
      },
    },
  ]

  await slack.chatPostMessage({
    channel: resolvedChannel,
    blocks,
  })
}

run().catch(setFailed)
