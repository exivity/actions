import { debug, getInput, info, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import {
  getEventData,
  getEventName,
  getRepository,
  getToken,
} from '../../lib/github'

const supportedEvents = ['pull_request'] as const

const validMergeMethods = ['MERGE', 'SQUASH', 'REBASE'] as const

async function getMergeMethod(
  client: ReturnType<typeof getOctokit>,
  repo: ReturnType<typeof getRepository>
) {
  // Merge is the default behaviour.
  let mergeMethod = 'MERGE'

  // Try to discover the repository's default merge method.
  try {
    const repositorySettings = (await client.graphql(
      `
          query($repository: String!, $owner: String!) {
            repository(name:$repository, owner:$owner) {
              viewerDefaultMergeMethod
            }
          }
        `,
      {
        repository: repo.repo,
        owner: repo.owner,
      }
    )) as any
    const viewerDefaultMergeMethod =
      repositorySettings?.repository?.viewerDefaultMergeMethod || undefined

    if (viewerDefaultMergeMethod && viewerDefaultMergeMethod.length > 0) {
      mergeMethod = viewerDefaultMergeMethod
    }
  } catch (err: any) {
    throw new Error(`Failed to read default merge method: ${err.message}`)
  }

  return mergeMethod
}

async function enableAutoMerge(
  client: ReturnType<typeof getOctokit>,
  pullRequestId: string,
  mergeMethod: string
) {
  const response = (await client.graphql(
    `
        mutation(
          $pullRequestId: ID!,
          $mergeMethod: PullRequestMergeMethod!
        ) {
            enablePullRequestAutoMerge(input: {
              pullRequestId: $pullRequestId,
              mergeMethod: $mergeMethod
            }) {
            clientMutationId
            pullRequest {
              id
              state
              autoMergeRequest {
                enabledAt
                enabledBy {
                  login
                }
              }
            }
          }
        }
      `,
    {
      pullRequestId,
      mergeMethod,
    }
  )) as any

  const enableAutoMergeResponse = {
    mutationId: response?.enablePullRequestAutoMerge?.clientMutationId,
    enabledAt:
      response?.enablePullRequestAutoMerge?.pullRequest?.autoMergeRequest
        ?.enabledAt,
    enabledBy:
      response?.enablePullRequestAutoMerge?.pullRequest?.autoMergeRequest
        ?.enabledBy?.login,
    pullRequestState: response?.enablePullRequestAutoMerge?.pullRequest?.state,
  }

  if (
    !enableAutoMergeResponse.enabledAt &&
    !enableAutoMergeResponse.enabledBy
  ) {
    throw new Error(
      `Failed to enable auto-merge: Received: ${JSON.stringify(
        enableAutoMergeResponse
      )}`
    )
  }

  return enableAutoMergeResponse
}

function isValidMergeMethod(
  mergeMethod: string
): mergeMethod is typeof validMergeMethods[number] {
  return validMergeMethods.includes(mergeMethod as any)
}
async function run() {
  // Inputs
  const token = getToken()
  const repo = getRepository()
  const eventName = getEventName(supportedEvents)
  const eventData = getEventData(eventName)
  const preferredMergeMethod = getInput('merge-method')

  // Assertions
  if (preferredMergeMethod && !isValidMergeMethod(preferredMergeMethod)) {
    throw new Error('The merge-method input is provided but invalid')
  }

  // Client
  const octokit = getOctokit(token)

  // Get merge method
  const mergeMethod =
    preferredMergeMethod || (await getMergeMethod(octokit, repo))
  debug(`merge-method is: ${mergeMethod}`)

  // Get PR number
  const pullRequestNumber = eventData.pull_request.number
  const pullRequestId = eventData.pull_request.node_id

  // Enable auto-merge
  const { enabledBy, enabledAt } = await enableAutoMerge(
    octokit,
    pullRequestId,
    mergeMethod
  )
  info(
    `Successfully enabled auto-merge for pull-request #${pullRequestNumber} as ${enabledBy} at ${enabledAt}`
  )
}

run().catch(setFailed)
