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
  const message = getInput('message')
  const status = getInput('status')
  const component = getRepository().component
  const sha = await getSha()
  const slackApiToken = getInput('slack-api-token', {
    required: true,
  })
  const token = getToken()
  const ref = getRef()
  let userProvidedChannel = getInput('channel') || null
  let channel: string | null = null

  // Assertions
  if (!isValidStatus(status)) {
    throw new Error('The status input is invalid')
  }

  if (!message && !status) {
    throw new Error('The message input is required when status is not set')
  }

  // Libs
  const slack = new Slack(slackApiToken)
  const octokit = getOctokit(token)

  // Additional context
  const commitMessage = (await getExecOutput('git log -1 --pretty=format:"%s"'))
    .stdout
  const author = (await getExecOutput('git log -1 --pretty=format:"%an"'))
    .stdout
  const email = (await getExecOutput('git log -1 --pretty=format:"%ae"')).stdout
  const pr = await getPR(octokit, component, ref)

  // Try to find Slack user based on commit author
  const user = await slack.findUserFuzzy([author, email, context.actor])

  if (userProvidedChannel) {
    channel = await slack.resolveChannelToUserId(userProvidedChannel)
  } else if (user) {
    channel = user.id
  }

  if (!channel) {
    throw new Error(`Could not find a channel to send the message to`)
  }

  info(`Sending message to ${channel}`)

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
  const shaBlock = {
    type: 'mrkdwn',
    text: `🔑 <https://github.com/exivity/${component}/commit/${sha}|${sha.substring(
      0,
      7
    )}>`,
  }
  const commitMessageBlock = {
    type: 'mrkdwn',
    text: `🔤 ${commitMessage}`,
  }
  const actorBlock = {
    type: 'mrkdwn',
    text: `🧑‍💻 ${context.actor}` + (user ? ` <@${user.id}>` : ''),
  }
  const componentBlock = {
    type: 'mrkdwn',
    text: `🗃️ ${component}`,
  }
  const refBlock = {
    type: 'mrkdwn',
    text: `🌿 ${ref}`,
  }
  const runBlock = {
    type: 'mrkdwn',
    text: `⚡ <https://github.com/exivity/${component}/actions/runs/${process.env.GITHUB_RUN_ID}|${context.workflow}>`,
  }
  const blocks: Blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${statusText}${message}`,
      },
    },
    {
      type: 'context',
      elements: [
        componentBlock,
        refBlock,
        ...prBlock,
        shaBlock,
        commitMessageBlock,
        actorBlock,
        runBlock,
      ],
    },
  ]

  await slack.chatPostMessage({
    channel,
    blocks,
  })
}

run().catch(setFailed)
