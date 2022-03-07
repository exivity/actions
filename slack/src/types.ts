/**
 * Source: https://raw.githubusercontent.com/slackapi/node-slack-sdk/main/packages/types/src/index.ts
 */

interface ImageElement {
  type: 'image'
  image_url: string
  alt_text: string
}

interface PlainTextElement {
  type: 'plain_text'
  text: string
  emoji?: boolean
}

interface MrkdwnElement {
  type: 'mrkdwn'
  text: string
  verbatim?: boolean
}

interface MrkdwnOption {
  text: MrkdwnElement
  value?: string
  url?: string
  description?: PlainTextElement
}

interface PlainTextOption {
  text: PlainTextElement
  value?: string
  url?: string
  description?: PlainTextElement
}

type Option = MrkdwnOption | PlainTextOption

interface Confirm {
  title?: PlainTextElement
  text: PlainTextElement | MrkdwnElement
  confirm?: PlainTextElement
  deny?: PlainTextElement
  style?: 'primary' | 'danger'
}

/*
 * Action Types
 */

// Selects and Multiselects are available in different surface areas so I've separated them here
type Select =
  | UsersSelect
  | StaticSelect
  | ConversationsSelect
  | ChannelsSelect
  | ExternalSelect

type MultiSelect =
  | MultiUsersSelect
  | MultiStaticSelect
  | MultiConversationsSelect
  | MultiChannelsSelect
  | MultiExternalSelect

interface Action {
  type: string
  action_id?: string
}

interface UsersSelect extends Action {
  type: 'users_select'
  initial_user?: string
  placeholder?: PlainTextElement
  confirm?: Confirm
  focus_on_load?: boolean
}

interface MultiUsersSelect extends Action {
  type: 'multi_users_select'
  initial_users?: string[]
  placeholder?: PlainTextElement
  max_selected_items?: number
  confirm?: Confirm
  focus_on_load?: boolean
}

interface StaticSelect extends Action {
  type: 'static_select'
  placeholder?: PlainTextElement
  initial_option?: PlainTextOption
  options?: PlainTextOption[]
  option_groups?: {
    label: PlainTextElement
    options: PlainTextOption[]
  }[]
  confirm?: Confirm
  focus_on_load?: boolean
}

interface MultiStaticSelect extends Action {
  type: 'multi_static_select'
  placeholder?: PlainTextElement
  initial_options?: PlainTextOption[]
  options?: PlainTextOption[]
  option_groups?: {
    label: PlainTextElement
    options: PlainTextOption[]
  }[]
  max_selected_items?: number
  confirm?: Confirm
  focus_on_load?: boolean
}

interface ConversationsSelect extends Action {
  type: 'conversations_select'
  initial_conversation?: string
  placeholder?: PlainTextElement
  confirm?: Confirm
  response_url_enabled?: boolean
  default_to_current_conversation?: boolean
  filter?: {
    include?: ('im' | 'mpim' | 'private' | 'public')[]
    exclude_external_shared_channels?: boolean
    exclude_bot_users?: boolean
  }
  focus_on_load?: boolean
}

interface MultiConversationsSelect extends Action {
  type: 'multi_conversations_select'
  initial_conversations?: string[]
  placeholder?: PlainTextElement
  max_selected_items?: number
  confirm?: Confirm
  default_to_current_conversation?: boolean
  filter?: {
    include?: ('im' | 'mpim' | 'private' | 'public')[]
    exclude_external_shared_channels?: boolean
    exclude_bot_users?: boolean
  }
  focus_on_load?: boolean
}

interface ChannelsSelect extends Action {
  type: 'channels_select'
  initial_channel?: string
  placeholder?: PlainTextElement
  confirm?: Confirm
  focus_on_load?: boolean
}

interface MultiChannelsSelect extends Action {
  type: 'multi_channels_select'
  initial_channels?: string[]
  placeholder?: PlainTextElement
  max_selected_items?: number
  confirm?: Confirm
  focus_on_load?: boolean
}

interface ExternalSelect extends Action {
  type: 'external_select'
  initial_option?: PlainTextOption
  placeholder?: PlainTextElement
  min_query_length?: number
  confirm?: Confirm
  focus_on_load?: boolean
}

interface MultiExternalSelect extends Action {
  type: 'multi_external_select'
  initial_options?: PlainTextOption[]
  placeholder?: PlainTextElement
  min_query_length?: number
  max_selected_items?: number
  confirm?: Confirm
  focus_on_load?: boolean
}

interface Button extends Action {
  type: 'button'
  text: PlainTextElement
  value?: string
  url?: string
  style?: 'danger' | 'primary'
  confirm?: Confirm
}

interface Overflow extends Action {
  type: 'overflow'
  options: PlainTextOption[]
  confirm?: Confirm
}

interface Datepicker extends Action {
  type: 'datepicker'
  initial_date?: string
  placeholder?: PlainTextElement
  confirm?: Confirm
  focus_on_load?: boolean
}

interface Timepicker extends Action {
  type: 'timepicker'
  initial_time?: string
  placeholder?: PlainTextElement
  confirm?: Confirm
  focus_on_load?: boolean
}

interface RadioButtons extends Action {
  type: 'radio_buttons'
  initial_option?: Option
  options: Option[]
  confirm?: Confirm
  focus_on_load?: boolean
}

interface Checkboxes extends Action {
  type: 'checkboxes'
  initial_options?: Option[]
  options: Option[]
  confirm?: Confirm
  focus_on_load?: boolean
}

interface PlainTextInput extends Action {
  type: 'plain_text_input'
  placeholder?: PlainTextElement
  initial_value?: string
  multiline?: boolean
  min_length?: number
  max_length?: number
  dispatch_action_config?: DispatchActionConfig
  focus_on_load?: boolean
}

interface DispatchActionConfig {
  trigger_actions_on?: ('on_enter_pressed' | 'on_character_entered')[]
}

/*
 * Block Types
 */

type KnownBlock =
  | ImageBlock
  | ContextBlock
  | ActionsBlock
  | DividerBlock
  | SectionBlock
  | InputBlock
  | FileBlock
  | HeaderBlock

interface Block {
  type: string
  block_id?: string
}

interface ImageBlock extends Block {
  type: 'image'
  image_url: string
  alt_text: string
  title?: PlainTextElement
}

interface ContextBlock extends Block {
  type: 'context'
  elements: (ImageElement | PlainTextElement | MrkdwnElement)[]
}

interface ActionsBlock extends Block {
  type: 'actions'
  elements: (
    | Button
    | Overflow
    | Datepicker
    | Timepicker
    | Select
    | RadioButtons
    | Checkboxes
    | Action
  )[]
}

interface DividerBlock extends Block {
  type: 'divider'
}

interface SectionBlock extends Block {
  type: 'section'
  text?: PlainTextElement | MrkdwnElement // either this or fields must be defined
  fields?: (PlainTextElement | MrkdwnElement)[] // either this or text must be defined
  accessory?:
    | Button
    | Overflow
    | Datepicker
    | Timepicker
    | Select
    | MultiSelect
    | Action
    | ImageElement
    | RadioButtons
    | Checkboxes
}

interface FileBlock extends Block {
  type: 'file'
  source: string // 'remote'
  external_id: string
}

interface HeaderBlock extends Block {
  type: 'header'
  text: PlainTextElement
}

interface InputBlock extends Block {
  type: 'input'
  label: PlainTextElement
  hint?: PlainTextElement
  optional?: boolean
  element:
    | Select
    | MultiSelect
    | Datepicker
    | Timepicker
    | PlainTextInput
    | RadioButtons
    | Checkboxes
  dispatch_action?: boolean
}

interface MessageAttachment {
  blocks?: (KnownBlock | Block)[]
  fallback?: string // either this or text must be defined
  color?: 'good' | 'warning' | 'danger' | string
  pretext?: string
  author_name?: string
  author_link?: string // author_name must be present
  author_icon?: string // author_name must be present
  title?: string
  title_link?: string // title must be present
  text?: string // either this or fallback must be defined
  fields?: {
    title: string
    value: string
    short?: boolean
  }[]
  image_url?: string
  thumb_url?: string
  footer?: string
  footer_icon?: string // footer must be present
  ts?: string
  actions?: AttachmentAction[]
  callback_id?: string
  mrkdwn_in?: ('pretext' | 'text' | 'fields')[]
}

interface AttachmentAction {
  id?: string
  confirm?: Confirmation
  data_source?: 'static' | 'channels' | 'conversations' | 'users' | 'external'
  min_query_length?: number
  name?: string
  options?: OptionField[]
  option_groups?: {
    text: string
    options: OptionField[]
  }[]
  selected_options?: OptionField[]
  style?: 'default' | 'primary' | 'danger'
  text: string
  type: 'button' | 'select'
  value?: string
  url?: string
}

interface OptionField {
  description?: string
  text: string
  value: string
}

interface Confirmation {
  dismiss_text?: string
  ok_text?: string
  text: string
  title?: string
}

export type Blocks = (KnownBlock | Block)[]
