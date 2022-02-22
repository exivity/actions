/**
 * Source: https://gist.github.com/jkolyer/90ba73456d6546d3fdf9f4c436c2122d
 */
export enum BlockTypeEnum {
  section = 'section',
  actions = 'actions',
  divider = 'divider',
  image = 'image',
  context = 'context',
  input = 'input',
  header = 'header',
}

export type AccessoryType =
  | 'users_select'
  | 'static_select'
  | 'multi_conversations_select'
  | 'button'
  | 'image'
  | 'overflow'
  | 'datepicker'
  | 'checkboxes'
  | 'radio_buttons'
  | 'timepicker'

export type TextType = 'plain_text' | 'mrkdwn'
export type TextField = {
  type: string
  text: TextType
  emoji?: boolean
}
export type ActionId = string
export type Value = string
export type Placeholder = TextField
export type TextFieldValue = {
  text: TextField
  description?: TextField
  value: Value
}
export type Option = TextFieldValue
export type Image = {
  image_url: string
  alt_text?: string
}

export type AccessoryBase = {
  type: AccessoryType
}

export type Accessory = AccessoryBase & {
  placeholder?: Placeholder
  options?: Option[]
  action_id?: ActionId
}

export type AccessoryButton = AccessoryBase &
  TextFieldValue & {
    url?: string
    action_id: ActionId
  }

export type AccessoryImage = AccessoryBase & Image

export type AccessoryTimePick = Accessory & {
  initial_time?: string
}

export type AccessoryDatePick = Accessory & {
  initial_date?: string
}

export type SectionProps = {
  type: keyof BlockTypeEnum.section
  text?: TextField
  fields?: TextField[]
  accessory?: Accessory
}

export type ActionProps = {
  type: keyof BlockTypeEnum.actions
  elements:
    | AccessoryButton[]
    | AccessoryDatePick[]
    | AccessoryTimePick[]
    | Accessory[]
}

export type DividerProps = {
  type: keyof BlockTypeEnum.divider
}

export type ImageProps = Image & {
  type: keyof BlockTypeEnum.image
  title?: TextFieldValue
}

export type ContextProps = {
  type: keyof BlockTypeEnum.context
  elements: (TextField | ImageProps)[]
}

export type InputElementType =
  | 'plain_text_input'
  | 'multi_users_select'
  | 'static_select'
  | 'datepicker'
  | 'timepicker'
  | 'checkboxes'
  | 'radio_buttons'

export type InputElement = {
  type: InputElementType
  action_id?: ActionId
  placeholder?: Placeholder
  options?: Option[]
  dispatch_action_config?: any
  multiline?: boolean
}

export type InputProps = {
  type: keyof BlockTypeEnum.input
  dispatch_action?: boolean
  element: InputElement | AccessoryDatePick | AccessoryTimePick | Accessory
  label?: TextField
}

export type HeaderProps = {
  type: keyof BlockTypeEnum.header
  text: TextField
}

export type Block =
  | SectionProps
  | ActionProps
  | DividerProps
  | ImageProps
  | ContextProps
  | InputProps
  | HeaderProps

export type Blocks = Block[]
