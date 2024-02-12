import { info, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import { isEmpty } from 'ramda'
import { table } from '../../lib/core'
import {
  getEventData,
  getEventName,
  getOwnerInput,
  getRepoInput,
  getToken,
  isEvent,
} from '../../lib/github'
import { branchToTag, validTag } from '../../lib/image'

async function run() {
  // Inputs
  const org = getOwnerInput('org')
  const name = getRepoInput('name')
  const ghToken = getToken()

  const eventName = getEventName(['delete', 'workflow_dispatch'])
  const eventData = getEventData<typeof eventName>()

  let tag: string

  if (isEvent(eventName, 'workflow_dispatch', eventData)) {
    tag = eventData.inputs?.tag as string
  } else if (
    isEvent(eventName, 'delete', eventData) &&
    eventData.ref_type === 'branch'
  ) {
    tag = validTag(eventData.ref)
  } else {
    tag = branchToTag()
  }

  table('Package name', name)
  table('Tag to delete', tag)

  const octokit = getOctokit(ghToken)

  const versions = await octokit.paginate(
    octokit.rest.packages.getAllPackageVersionsForPackageOwnedByOrg,
    {
      org,
      package_type: 'container',
      package_name: name,
      per_page: 1000,
    },
  )

  info(`Got ${versions.length} package versions, matching with tags...`)

  // Look for versions with matching tags
  for (const version of versions) {
    const tagOverlap = version.metadata?.container?.tags?.includes(tag)
    const imageTag = version.metadata?.container?.tags?.join('","')

    if (tagOverlap || isEmpty(imageTag)) {
      info(
        `🗑️ Package version ${version.id} tagged with "${imageTag}" matches and will be deleted`,
      )
      octokit.rest.packages.deletePackageVersionForOrg({
        org,
        package_type: 'container',
        package_name: name,
        package_version_id: version.id,
      })
    } else {
      info(
        `ℹ️ Package version ${version.id} tagged with "${imageTag}" doesn't match any of the tags to delete`,
      )
    }
  }
}

run().catch(setFailed)
