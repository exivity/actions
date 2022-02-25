export type SyncPlugin = {
  name: string
  run: () => Promise<string>
}
