import type { PluginParams } from '.'
import { ChangelogItem } from '../common/types'

function formatTitle(changelogItem: ChangelogItem) {
  return capitalizeFirstLetter(
    changelogItem.links.issues && changelogItem.links.issues?.length > 0
      ? changelogItem.links.issues[0].title
      : changelogItem.links.pr
      ? changelogItem.links.pr.title
      : changelogItem.links.commit.title
  )
}

function formatDescription(changelogItem: ChangelogItem) {
  return changelogItem.links.issues?.[0]?.description || null
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export async function titleAndDescriptionPlugin({ changelog }: PluginParams) {
  for (const item of changelog) {
    item.title = formatTitle(item)
    item.description = formatDescription(item)
  }

  return changelog
}
