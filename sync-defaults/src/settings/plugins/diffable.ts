// Base class to make it easy to check for changes to a list of items
//
//     class Thing extends Diffable {
//       find() {
//       }
//
//       comparator(existing, attrs) {
//       }
//
//       changed(existing, attrs) {
//       }
//
//       update(existing, attrs) {
//       }
//
//       add(attrs) {
//       }
//
//       remove(existing) {
//       }

import { GitHubSettingsPlugin, Settings } from './types'

//     }
export class Diffable<
  T extends keyof Settings
> extends GitHubSettingsPlugin<T> {
  constructor(github, repo, entries) {
    this.github = github
    this.repo = repo
    this.entries = entries
  }

  sync() {
    if (this.entries) {
      return this.find().then((existingRecords) => {
        const changes = []

        this.entries.forEach((attrs) => {
          const existing = existingRecords.find((record) => {
            return this.comparator(record, attrs)
          })

          if (!existing) {
            changes.push(this.add(attrs))
          } else if (this.changed(existing, attrs)) {
            changes.push(this.update(existing, attrs))
          }
        })

        existingRecords.forEach((x) => {
          if (!this.entries.find((y) => this.comparator(x, y))) {
            changes.push(this.remove(x))
          }
        })

        return Promise.all(changes)
      })
    }
  }
}
