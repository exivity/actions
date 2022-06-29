import type { PluginParams } from '.'
import { ChangelogItem } from '../common/types'

function formatTitle(changelogItem: ChangelogItem) {
  return changelogItem.links.issue
    ? changelogItem.links.issue.title
    : changelogItem.links.pr
    ? changelogItem.links.pr.title
    : changelogItem.links.commit.title
}

function formatDecription(changelogItem: ChangelogItem) {
  return changelogItem.links.issue?.description || null
}

export async function titleAndDescriptionPlugin({ changelog }: PluginParams) {
  for (const item of changelog) {
    item.title = formatTitle(item)
    item.description = formatDecription(item)
  }

  return changelog
}
