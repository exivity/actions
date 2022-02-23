import { getInput, setFailed } from '@actions/core'
import { getExecOutput } from '@actions/exec'
import { context, getOctokit } from '@actions/github'
import { info } from 'console'
import {
  getPR,
  getRef,
  getRepository,
  getSha,
  getToken,
} from '../../lib/github'
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
  const component = getRepository().component
  const sha = await getSha()
  const slackApiToken = getInput('slack-api-token', {
    required: true,
  })
  const token = getToken()

  // Assertions
  if (!isValidStatus(status)) {
    throw new Error('The status input is invalid')
  }

  // Libs
  const slack = new Slack(slackApiToken)
  const octokit = getOctokit(token)

  // Additional context
  const commitMessage = (await getExecOutput('git log -1 --pretty=format:"%s"'))
    .stdout
  const ref = getRef()
  const pr = await getPR(octokit, component, ref)

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
  const prBlock = pr
    ? [
        {
          type: 'mrkdwn',
          text: `🙏 <https://github.com/exivity/${component}/pull/${pr.number}|#${pr.number}>`,
        },
      ]
    : []
  const blocks: Blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${statusText}${message}`,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `🗃️ ${component}`,
        },
        {
          type: 'mrkdwn',
          text: `🌿 ${ref}`,
        },
        {
          type: 'mrkdwn',
          text: `⚡ ${context.workflow}`,
        },
      ],
    },
    {
      type: 'context',
      elements: [
        ...prBlock,
        {
          type: 'mrkdwn',
          text: `➡️ ${commitMessage} by ${context.actor}`,
        },
      ],
    },
  ]

  await slack.chatPostMessage({
    channel: resolvedChannel,
    blocks,
  })
}

run().catch(setFailed)
