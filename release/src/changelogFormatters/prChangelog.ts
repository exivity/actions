import { formatLinkType } from '../common/changelog'
import type { ChangelogItem } from '../common/types'

export function formatPrChangelog(version: string, changelog: ChangelogItem[]) {
  return [
    ...buildChangelogSection(
      'New features',
      changelog.filter((item) => item.type === 'feat')
    ),
    '',
    ...buildChangelogSection(
      'Bug fixes',
      changelog.filter((item) => item.type === 'fix')
    ),
    '',
    '',
  ].join('\n')
}

function buildChangelogSection(
  header: string,
  changelogItems: ChangelogItem[]
) {
  if (changelogItems.length === 0) {
    return []
  }

  return [`### ${header}`, '', ...changelogItems.map(buildChangelogItem)]
}

function buildChangelogItem(changelogItem: ChangelogItem) {
  return [
    `- **${changelogItem.title}**`,
    ...(changelogItem.description
      ? [`  ${changelogItem.description.split('\n').join('\n  ')}`]
      : []),
    ...(changelogItem.warnings.length > 0
      ? [`⚠️ _WARNING:_ ${changelogItem.warnings.join('\n')}`]
      : []),
    '',
    '  <details>',
    '    <summary>Show details</summary>',
    '',
    ...Object.entries(changelogItem.links).map(([type, link]) => {
      return `    - ${formatLinkType(type)}: [${link.slug}](${link.url})`
    }),
    '  </details>',
    '',
  ].join('\n')
}
