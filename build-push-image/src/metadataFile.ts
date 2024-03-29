import { info } from '@actions/core'
import { promises as fs } from 'fs'
import { getImageVersion } from '../../lib/image'

const METADATA_FILENAME = 'metadata.json'

/**
 * This function composes a metadata.json file that is to be copied into the
 * docker image on build. This requires the line `COPY ./metadata.json {target}`
 * to be present in the Dockerfile.
 */
export async function writeMetadataFile(repo: string) {
  const metadata = {
    component: repo,
    version: getImageVersion(),
    created: new Date().toISOString(),
  }
  const contents = JSON.stringify(metadata, undefined, 2)

  info(`Writing metadata to ${METADATA_FILENAME}:\n${contents}`)
  await fs.writeFile('./' + METADATA_FILENAME, contents)
}
