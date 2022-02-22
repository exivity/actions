import { debug } from '@actions/core'
import { HttpClient } from '@actions/http-client'
import { ITypedResponse } from '@actions/http-client/interfaces'
import { Blocks } from './types'

type Response<T> = {
  ok: boolean
  error?: string
} & T

type PostMessagePayload = {
  channel: string
  blocks: Blocks
  text?: string
}

type PostMessageResponse = {
  channel: string
  ts: string
  message: {
    text: string
    username: string
    bot_id: string
    attachments: unknown[]
    type: string
    subtype: string
    ts: string
  }
}

type ConversationsListPayload = {
  exclude_archived?: boolean
  limit?: number
  /**
   * Mix and match channel types by providing a comma-separated list of any
   * combination of public_channel, private_channel, mpim, im
   */
  types?: string
}

type ConversationsListResponse = {
  channels: {
    id: string
    name: string
    is_channel: boolean
    is_group: boolean
    is_im: boolean
    created: number
    creator: string
    is_archived: boolean
    is_general: boolean
    unlinked: number
    name_normalized: string
    is_shared: boolean
    is_ext_shared: boolean
    is_org_shared: boolean
    pending_shared: unknown[]
    is_pending_ext_shared: boolean
    is_member: boolean
    is_private: boolean
    is_mpim: boolean
    topic: {
      value: 'Company-wide announcements and work-based matters'
      creator: ''
      last_set: 0
    }
    purpose: {
      value: 'This channel is for team-wide communication and announcements. All team members are in this channel.'
      creator: ''
      last_set: 0
    }
    previous_names: []
    num_members: 4
  }[]
  response_metadata: {
    next_cursor: string
  }
}

type UsersListPayload = {
  limit?: number
}

type UsersListResponse = {
  members: {
    id: string
    team_id: string
    name: string
    deleted: boolean
    color: string
    real_name: string
    tz: string
    tz_label: string
    tz_offset: number
    profile: {
      avatar_hash: string
      status_text: string
      status_emoji: string
      real_name: string
      display_name: string
      real_name_normalized: string
      display_name_normalized: string
      email: string
      image_24: string
      image_32: string
      image_48: string
      image_72: string
      image_192: string
      image_512: string
      team: string
    }
    is_admin: boolean
    is_owner: boolean
    is_primary_owner: boolean
    is_restricted: boolean
    is_ultra_restricted: boolean
    is_bot: boolean
    updated: number
    is_app_user: boolean
    has_2fa: boolean
  }[]
  cache_ts: number
  response_metadata: {
    next_cursor: string
  }
}

const SLACK_BASE_URL = 'https://slack.com/api'

function toQueryString(params: {
  [key: string]: string | number | boolean
}): string {
  return Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join('&')
}

export class Slack {
  private httpClient = new HttpClient()

  constructor(private apiKey: string | undefined) {}

  async get<T>(
    method: string,
    payload: { [key: string]: string | number | boolean }
  ) {
    const url = `${SLACK_BASE_URL}/${method}?${toQueryString(payload)}`
    const response = await this.httpClient.getJson<Response<T>>(url, {
      Authorization: `Bearer ${this.apiKey}`,
    })
    return this.parseResponse(response)
  }

  async post<T>(method: string, payload: {}) {
    const url = `${SLACK_BASE_URL}/${method}`
    const response = await this.httpClient.postJson<Response<T>>(url, payload, {
      Authorization: `Bearer ${this.apiKey}`,
    })
    return this.parseResponse(response)
  }

  parseResponse<T>(response: ITypedResponse<Response<T>>) {
    debug(
      `Received response from Slack:\n${
        (JSON.stringify(response), undefined, 2)
      }`
    )
    if (response.statusCode >= 300) {
      throw new Error('Response status code is not 2xx')
    }
    if (response.result === null) {
      throw new Error('Response is empty')
    }
    if (response.result.ok === false) {
      throw new Error(`Slack returned an error: ${response.result.error}`)
    }

    return response.result
  }

  /**
   * Sends a message to a channel
   * https://api.slack.com/methods/chat.postMessage
   */
  async chatPostMessage(payload: PostMessagePayload) {
    try {
      return (await this.post<PostMessageResponse>('chat.postMessage', payload))
        .message
    } catch (error) {
      debug(
        `Received error from Slack:\n${(JSON.stringify(error), undefined, 2)}`
      )
      throw new Error('Could not send Slack message')
    }
  }

  /**
   * Lists all channels in a Slack team
   * https://api.slack.com/methods/conversations.list
   */
  async conversationsList(payload: ConversationsListPayload) {
    try {
      return (
        await this.get<ConversationsListResponse>('conversations.list', payload)
      ).channels
    } catch (error) {
      debug(
        `Received error from Slack:\n${JSON.stringify(error, undefined, 2)}`
      )
      throw new Error('Could not retrieve Slack channels')
    }
  }
  /**
   * Lists all channels in a Slack team
   * https://api.slack.com/methods/conversations.list
   */
  async usersList(payload: UsersListPayload) {
    try {
      return (await this.get<UsersListResponse>('users.list', payload)).members
    } catch (error) {
      debug(
        `Received error from Slack:\n${JSON.stringify(error, undefined, 2)}`
      )
      throw new Error('Could not retrieve Slack users')
    }
  }

  async resolveChannel(value: string) {
    if (value.startsWith('@')) {
      // Search for a user
      debug(`Trying to resolve user ${value}`)
      const users = await this.usersList({
        limit: 1000,
      })
      const userMatch = users.find((item) => item.name === value.substring(1))
      return userMatch?.id || null
    }

    if (value.startsWith('#')) {
      // Search for a channel
      debug(`Trying to resolve channel ${value}`)
      const channels = await this.conversationsList({
        exclude_archived: false,
        limit: 1000,
        types: 'public_channel',
      })
      const channelMatch = channels.find(
        (item) => item.name === value.substring(1)
      )
      return channelMatch?.id || null
    }

    // Should be already a channel or user ID
    return value
  }
}
