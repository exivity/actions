import { Config, GitHubSettingsPlugin, OctokitResponse } from '../types'

type DiffableSettingKeys =
  | 'labels'
  | 'milestones'
  | 'collaborators'
  | 'teams'
  | 'branches'

export abstract class Diffable<
  T extends DiffableSettingKeys
> extends GitHubSettingsPlugin<T> {
  async sync() {
    if (this.config) {
      const existingRecords = await this.find()
      const changes: Promise<OctokitResponse>[] = []
      this.config.forEach((attrs: Config[T][number]) => {
        const existing = (existingRecords as any[]).find(
          (record: Config[T][number]) => {
            return this.comparator(record, attrs)
          }
        )

        if (!existing) {
          changes.push(this.add(attrs))
        } else if (this.changed(existing, attrs)) {
          changes.push(this.update(existing, attrs))
        }
      })
      ;(existingRecords as any[]).forEach((x: Config[T][number]) => {
        if (
          !(this.config as any[]).find((y: Config[T][number]) =>
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
    existing: Config[T][number],
    attrs: Config[T][number]
  ): boolean

  abstract changed(
    existing: Config[T][number],
    attrs: Config[T][number]
  ): boolean

  abstract update(
    existing: Config[T][number],
    attrs: Config[T][number]
  ): Promise<OctokitResponse>

  abstract add(attrs: Config[T][number]): Promise<OctokitResponse>

  abstract remove(existing: Config[T][number]): Promise<OctokitResponse>
}
