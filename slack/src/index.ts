import { getInput, setFailed, warning } from '@actions/core'
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
  let userProvidedChannel = getInput('channel') || null
  const status = getInput('status')
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

  let channel: string | null = null
  if (!userProvidedChannel) {
    // Try to find Slack user based on commit author
    const author = (await getExecOutput('git log -1 --pretty=format:"%an"'))
      .stdout
    const email = (await getExecOutput('git log -1 --pretty=format:"%ae"'))
      .stdout
    const user = await slack.findUserFuzzy([author, email, context.actor])

    if (!user) {
      warning(
        'Could not find Slack user based on commit author, falling back to #builds'
      )
      channel = await slack.resolveChannel('#builds')
    } else {
      channel = user
    }
  } else {
    channel = await slack.resolveChannel(userProvidedChannel)
  }
  if (!channel) {
    throw new Error(`Could not resolve channel ${channel} to send message to`)
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
        {
          type: 'mrkdwn',
          text: `🔡 <https://github.com/exivity/${component}/commits/${sha}|${sha.substring(
            0,
            7
          )}>`,
        },
        {
          type: 'mrkdwn',
          text: `➡️ ${commitMessage}`,
        },
        {
          type: 'mrkdwn',
          text: `🧑‍💻 ${context.actor}`,
        },
      ],
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
        ...prBlock,
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
  ]

  await slack.chatPostMessage({
    channel,
    blocks,
  })
}

run().catch(setFailed)
