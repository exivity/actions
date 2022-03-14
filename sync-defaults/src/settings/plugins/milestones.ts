import { Milestone } from '../types'
import { Diffable } from './diffable'

export class Milestones extends Diffable<'milestones'> {
  init() {
    if (this.config) {
      this.config.forEach((milestone: Milestone & { due_on?: string }) => {
        if (milestone.due_on) {
          delete milestone.due_on
        }
      })
    }
  }

  find() {
    const options = this.github.rest.issues.listMilestones.endpoint.merge({
      per_page: 100,
      state: 'all',
      ...this.repo,
    })
    return this.github.paginate(options) as Promise<Milestone[]>
  }

  comparator(existing: Milestone, attrs: Milestone) {
    return existing.title === attrs.title
  }

  changed(existing: Milestone, attrs: Milestone) {
    return (
      existing.description !== attrs.description ||
      existing.state !== attrs.state
    )
  }

  update(existing: Milestone, attrs: Milestone) {
    this.logUpdate(`Updating milestone "${attrs.title}"`)
    return this.github.rest.issues.updateMilestone({
      milestone_number: existing.number,
      ...attrs,
      ...this.repo,
    })
  }

  add(attrs: Milestone) {
    this.logUpdate(`Adding milestone "${attrs.title}"`)
    return this.github.rest.issues.createMilestone({ ...attrs, ...this.repo })
  }

  remove(existing: Milestone) {
    this.logUpdate(`Removing milestone "${existing.title}"`)
    return this.github.rest.issues.deleteMilestone({
      milestone_number: existing.number,
      ...this.repo,
    })
  }
}
