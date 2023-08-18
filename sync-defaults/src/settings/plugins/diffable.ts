import { Config, GitHubSettingsPlugin, OctokitResponse } from '../types'

type DiffableConfigKeys =
  | 'labels'
  | 'milestones'
  | 'collaborators'
  | 'teams'
  | 'branches'

type DiffableConfig = NonNullable<Config[DiffableConfigKeys]>

export abstract class Diffable<
  T extends DiffableConfigKeys
> extends GitHubSettingsPlugin<T> {
  async sync() {
    if (this.config) {
      const existingRecords = await this.find()
      const changes: Promise<OctokitResponse>[] = []
      this.config.forEach((attrs: DiffableConfig[number]) => {
        const existing = (existingRecords as any[]).find(
          (record: DiffableConfig[number]) => {
            return this.comparator(record, attrs)
          }
        )

        if (!existing) {
          changes.push(this.add(attrs))
        } else if (this.changed(existing, attrs)) {
          changes.push(this.update(existing, attrs))
        }
      })
      ;(existingRecords as any[]).forEach((x: DiffableConfig[number]) => {
        if (
          !(this.config as any[]).find((y: DiffableConfig[number]) =>
            this.comparator(x, y)
          )
        ) {
          changes.push(this.remove(x))
        }
      })

      return Promise.all(changes)
    }

    return []
  }

  abstract find(): Promise<Config[T]>

  abstract comparator(
    existing: DiffableConfig[number],
    attrs: DiffableConfig[number]
  ): boolean

  abstract changed(
    existing: DiffableConfig[number],
    attrs: DiffableConfig[number]
  ): boolean

  abstract update(
    existing: DiffableConfig[number],
    attrs: DiffableConfig[number]
  ): Promise<OctokitResponse>

  abstract add(attrs: DiffableConfig[number]): Promise<OctokitResponse>

  abstract remove(existing: DiffableConfig[number]): Promise<OctokitResponse>
}
