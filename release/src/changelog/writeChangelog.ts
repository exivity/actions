import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { info } from '@actions/core'

import { formatPublicChangelog } from '../changelogFormatters'

import { ChangelogItem } from './'

export async function writeChangelog(
  changelogPath: string,
  changelog: ChangelogItem[],
  upcomingVersion: string,
  dryRun: boolean
) {
  const currentPublicChangelogContents = existsSync(changelogPath)
    ? await readFile(changelogPath, 'utf8')
    : '# Changelog\n\n'

  const publicChangelogContents = formatPublicChangelog(
    upcomingVersion,
    changelog
  )

  if (dryRun) {
    info(`Dry run, not writing changelog`)
  } else {
    await writeFile(
      changelogPath,
      currentPublicChangelogContents.replace(
        '# Changelog\n\n',
        `# Changelog\n\n${publicChangelogContents}\n\n`
      )
    )

    info(`Written changelog to: ${changelogPath}`)
  }
}
