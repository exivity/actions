import { ChangelogItem } from '../changelog'

export function formatLinkType(type: string) {
  switch (type) {
    case 'commit':
      return 'Commit'
    case 'pr':
      return 'Pull request'
    case 'issues':
      return 'Issue'
    case 'milestone':
      return 'Milestone'
    default:
      return 'Unknown'
  }
}

export function formatPublicChangelog(
  version: string,
  changelog: ChangelogItem[]
) {
  return [
    ...buildChangelogHeader(version),
    ...buildChangelogItems(changelog),
  ].join('\n')
}

function buildChangelogHeader(version: string) {
  return [`## ${version}`, '']
}

function buildChangelogItems(changelogItems: ChangelogItem[]) {
  return [
    ...buildChangelogSection(
      'New features',
      changelogItems.filter((item) => item.type === 'feat')
    ),
    '',
    ...buildChangelogSection(
      'Bug fixes',
      changelogItems.filter((item) => item.type === 'fix')
    ),
    '',
    '',
  ]
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
    '',
    '<!--',
    ...Object.entries(changelogItem.links).flatMap(([type, link]) => {
      if (Array.isArray(link)) {
        return link.map(
          (linkItem) =>
            `  - ${formatLinkType(type)}: [${linkItem.slug}](${linkItem.url})`
        )
      }
      return `  - ${formatLinkType(type)}: [${link.slug}](${link.url})`
    }),
    '-->',
    '',
  ].join('\n')
}
