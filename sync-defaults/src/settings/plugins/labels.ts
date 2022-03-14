import { Label } from '../types'
import { Diffable } from './diffable'

const previewHeaders = {
  accept: 'application/vnd.github.symmetra-preview+json',
}

export class Labels extends Diffable<'labels'> {
  init() {
    if (this.config) {
      this.config.forEach((label) => {
        // Force color to string since some hex colors can be numerical (e.g. 999999)
        if (label.color) {
          label.color = String(label.color).replace(/^#/, '')
          if (label.color.length < 6) {
            label.color.padStart(6, '0')
          }
        }
      })
    }
  }

  find() {
    const options = this.github.rest.issues.listLabelsForRepo.endpoint.merge(
      this.wrapAttrs({ per_page: 100 })
    )
    return this.github.paginate(options) as Promise<Label[]>
  }

  comparator(existing: Label, attrs: Label) {
    return existing.name === attrs.name
  }

  changed(existing: Label, attrs: Label) {
    return (
      'new_name' in attrs ||
      existing.color !== attrs.color ||
      existing.description !== attrs.description
    )
  }

  update(existing: Label, attrs: Label) {
    return this.github.rest.issues.updateLabel(this.wrapAttrs(attrs))
  }

  add(attrs: Label) {
    return this.github.rest.issues.createLabel(this.wrapAttrs(attrs))
  }

  remove(existing: Label) {
    return this.github.rest.issues.deleteLabel(
      this.wrapAttrs({ name: existing.name })
    )
  }

  wrapAttrs<T>(attrs: T) {
    return { ...attrs, ...this.repo, headers: previewHeaders }
  }
}
