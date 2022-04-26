import { EventData, EventName } from '../../lib/github'

export type SyncPluginOptions<T extends EventName> = {
  ghToken: string
  owner: string
  repo: string
  eventName: T
  eventData: EventData<T>
}

export type SyncPlugin = {
  name: string
  run: <T extends EventName>(options: SyncPluginOptions<T>) => Promise<unknown>
}
