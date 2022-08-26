import { getInput, info, warning } from '@actions/core'
import { getOctokit } from '@actions/github'
import { context } from '@actions/github/lib/utils'
import { EventPayloadMap, WebhookEventName } from '@octokit/webhooks-types'
import { debug } from 'console'

export type ScheduleEvent = {
  schedule: string
}

export type EventName = WebhookEventName | 'schedule'

export type EventData<T extends EventName> = T extends WebhookEventName
  ? EventPayloadMap[T]
  : T extends 'schedule'
  ? ScheduleEvent
  : never

type Options = {
  octokit: ReturnType<typeof getOctokit>
  owner: string
  repo: string
  ref: string
  useFallback?: boolean
}

export const ReleaseBranches = ['master', 'main']
export const DevelopBranches = ['develop']

export async function getShaFromRef({
  octokit,
  owner,
  repo,
  ref,
  useFallback = true,
}: Options) {
  if (useFallback && ref === 'develop') {
    const availableBranches = (
      await octokit.rest.repos.listBranches({
        owner,
        repo,
      })
    ).data.map((branch) => branch.name)
    if (!availableBranches.includes('develop')) {
      const fallback = availableBranches.includes('main') ? 'main' : 'master'
      warning(
        `Branch "develop" not available in repository "${owner}/${repo}", falling back to "${fallback}".`
      )
      ref = fallback
    }
  }

  const sha = (
    await octokit.rest.repos.getBranch({
      owner,
      repo,
      branch: ref,
    })
  ).data.commit.sha

  info(`Resolved ${ref} to ${sha}`)

  return sha
}

export async function getPrFromRef({
  octokit,
  owner,
  repo,
  ref,
}: {
  octokit: ReturnType<typeof getOctokit>
  owner: string
  repo: string
  ref: string
}) {
  // Get a list of PRs for the current branch
  const { data } = await octokit.rest.pulls.list({
    owner,
    repo,
    head: `${owner}:${ref}`,
    sort: 'updated',
  })

  // Take the first one if data is not empty
  if (data.length > 0) {
    return data[0]
  }
}

export async function getPr({
  octokit,
  owner,
  repo,
  number,
}: {
  octokit: ReturnType<typeof getOctokit>
  owner: string
  repo: string
  number: string | number
}) {
  return (
    await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: parseInt(String(number), 10),
    })
  ).data
}

export function getRepository() {
  const { owner, repo } = context.repo

  if (!owner || !repo) {
    throw new Error('The GitHub repository is missing')
  }

  return { owner, repo, fqn: `${owner}/${repo}` }
}

export function getOwnerInput(inputName = 'owner') {
  return getInput(inputName) || getRepository().owner
}

export function getRepoInput(
  inputName = 'repo',
  fallbackInputName: string | undefined = 'component'
) {
  return fallbackInputName
    ? getInput(inputName) || getInput(fallbackInputName) || getRepository().repo
    : getInput(inputName) || getRepository().repo
}

export function getSha() {
  let sha = context.sha
  const eventName = getEventName()

  // See https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request:
  // Note that context.sha for this event is the last merge commit of the pull
  // request merge branch. If you want to get the commit ID for the last commit
  // to the head branch of the pull request, use
  // github.event.pull_request.head.sha instead.
  if (eventName === 'pull_request') {
    sha = getEventData(eventName).pull_request.head.sha
  }

  if (!sha) {
    throw new Error('The GitHub sha is missing')
  }

  return sha
}

/**
 * See: https://docs.github.com/en/actions/learn-github-actions/contexts#github-context
 *
 * The branch or tag ref that triggered the workflow run. For workflows
 * triggered by push, this is the branch or tag ref that was pushed. For
 * workflows triggered by pull_request, this is the pull request merge branch.
 * For workflows triggered by release, this is the release tag created. For
 * other triggers, this is the branch or tag ref that triggered the workflow
 * run. This is only set if a branch or tag is available for the event type.
 * The ref given is fully-formed, meaning that for branches the format is
 * refs/heads/<branch_name>, for pull requests it is
 * refs/pull/<pr_number>/merge, and for tags it is refs/tags/<tag_name>. For
 * example, refs/heads/feature-branch-1.
 */
export function getRef() {
  const ref = context.ref

  // Tag
  if (ref && ref.startsWith('refs/tags/')) {
    debug(`Ref taken from refs/tags: ${ref.slice(10)}`)
    return ref.slice(10) // slice 'refs/tags/'
  }

  // Branch
  if (ref && ref.startsWith('refs/heads/')) {
    debug(`Ref taken from refs/heads: ${ref.slice(11)}`)
    return ref.slice(11) // slice 'refs/heads/'
  }

  // Pull request with HEAD_REF set (not available from `context`)
  if (ref && ref.startsWith('refs/pull/') && process.env['GITHUB_HEAD_REF']) {
    debug(`Ref taken from GITHUB_HEAD_REF: ${process.env['GITHUB_HEAD_REF']}`)
    return process.env['GITHUB_HEAD_REF']
  }

  // Pull request with HEAD_REF unset
  if (ref && ref.startsWith('refs/pull/')) {
    throw new Error(
      'Workflow triggered by pull request, but GITHUB_HEAD_REF is missing'
    )
  }

  throw new Error('The git ref could not be determined')
}

export function getTag() {
  return context.ref?.slice(0, 10) == 'refs/tags/'
    ? context.ref?.slice(10) // slice 'refs/tags/'
    : null
}

export function getWorkspacePath() {
  // Not available from `context`
  const workspacePath = process.env['GITHUB_WORKSPACE']

  if (!workspacePath) {
    throw new Error('The GitHub workspace path is missing')
  }

  return workspacePath
}

export function getToken(inputName = 'gh-token') {
  const ghToken = getInput(inputName)

  if (!ghToken) {
    throw new Error('The GitHub token is missing')
  }

  return ghToken
}

/**
 * Schedule is not in the WebhookEventName, but is valid, so we add it
 * to the type here.
 */
export function getEventName<T extends EventName>(
  supportedEvents?: readonly T[]
) {
  const eventName = context.eventName

  if (!eventName) {
    throw new Error('The GitHub event name is missing')
  }

  if (supportedEvents && !supportedEvents.includes(eventName as any)) {
    throw new Error(`The event ${eventName} is not supported by this action`)
  }

  return eventName as T
}

export function isEvent<T extends EventName, U extends T>(
  input: T,
  compare: U,
  eventData: EventData<T>
  // @ts-ignore
): eventData is EventData<U> {
  return input === compare
}

export function getEventData<T extends EventName>(eventName?: T): EventData<T> {
  const payload = context.payload as EventData<T>

  if (Object.keys(payload).length === 0) {
    throw new Error('The GitHub event payload is missing')
  }

  return payload
}

export function getWorkflowName() {
  const workflowName = context.workflow

  if (!workflowName) {
    throw new Error('The GitHub workflow name is missing')
  }

  return workflowName
}

export function isReleaseBranch(ref?: string) {
  if (!ref) {
    ref = getRef()
  }

  return ReleaseBranches.includes(ref)
}

export function isDevelopBranch(ref?: string) {
  if (!ref) {
    ref = getRef()
  }

  return DevelopBranches.includes(ref)
}

export async function getCommit({
  octokit,
  owner,
  repo,
  ref,
}: {
  octokit: ReturnType<typeof getOctokit>
  owner: string
  repo: string
  ref: string
}) {
  return (
    await octokit.rest.repos.getCommit({
      owner,
      repo,
      ref,
    })
  ).data
}

export type Commit = Awaited<ReturnType<typeof getCommit>>

export async function getCommitForTag({
  octokit,
  owner,
  repo,
  tag,
}: {
  octokit: ReturnType<typeof getOctokit>
  owner: string
  repo: string
  tag: string
}) {
  try {
    const commit = await getCommit({
      octokit,
      owner,
      repo,
      ref: `tags/${tag}`,
    })
    const timestamp = commit.commit.author?.date
    if (typeof timestamp === 'undefined') {
      throw new Error(
        `Could not find timestamp for commit ${commit.sha} in ${owner}/${repo}...`
      )
    }
    return { ...commit, tag, timestamp }
  } catch (error: unknown) {
    throw new Error(
      `Could not find commit for tag ${tag} in ${owner}/${repo}...`
    )
  }
}

export async function getCommits({
  octokit,
  owner,
  repo,
  sha,
  since,
  until,
}: {
  octokit: ReturnType<typeof getOctokit>
  owner: string
  repo: string
  sha?: string
  since?: string
  until?: string
}) {
  return await octokit.paginate(octokit.rest.repos.listCommits, {
    owner,
    repo,
    sha,
    since,
    until,
  })
}

export async function getLastCommitSha({
  octokit,
  owner,
  repo,
  sha,
  since,
  until,
}: {
  octokit: ReturnType<typeof getOctokit>
  owner: string
  repo: string
  sha?: string
  since?: string
  until?: string
}) {
  return await octokit
    .paginate(octokit.rest.repos.listCommits, {
      owner,
      repo,
      sha,
      since,
      until,
    })
    .then((commits) => commits?.[0]?.sha)
}

export async function getCommitsSince({
  octokit,
  owner,
  repo,
  branch,
  since,
}: {
  octokit: ReturnType<typeof getOctokit>
  owner: string
  repo: string
  branch: string
  since: { timestamp: string; tag: string; sha: string }
}) {
  const commits = (
    await getCommits({
      octokit,
      owner,
      repo,
      sha: branch,
      since: since.timestamp,
    })
  ).filter((commit) => commit.sha !== since.sha)
  info(
    `  Found ${commits.length} commits since ${since.tag} in ${owner}/${repo}#${branch}`
  )

  return commits
}

export async function getCommitsBetween({
  octokit,
  owner,
  repo,
  branch,
  since,
  until,
}: {
  octokit: ReturnType<typeof getOctokit>
  owner: string
  repo: string
  branch: string
  since: { timestamp: string; tag: string; sha: string }
  until: { timestamp: string; tag: string; sha: string }
}) {
  const commits = (
    await getCommits({
      octokit,
      owner,
      repo,
      sha: branch,
      since: since.timestamp,
      until: until.timestamp,
    })
  ).filter((commit) => commit.sha !== since.sha && commit.sha !== until.sha)
  info(
    `  Found ${commits.length} commits between ${since.tag} and ${until.tag} in ${owner}/${repo}#${branch}`
  )

  return commits
}

export async function review({
  octokit,
  owner,
  repo,
  pull_number,
  event,
  body,
}: {
  octokit: ReturnType<typeof getOctokit>
  owner: string
  repo: string
  pull_number: number
  event: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT'
  body?: string
}) {
  info(`Will ${event} PR ${pull_number} of repo ${repo}...`)

  const repository = getRepository().fqn
  body = `${body}${body ? '\n\n---\n\n' : ''}\
_Automated review from [**${getWorkflowName()}** \
workflow in **${repository}**]\
(https://github.com/${repository}/actions/runs/${context.runId})_`

  return (
    await octokit.rest.pulls.createReview({
      owner,
      repo,
      pull_number,
      event,
      body,
    })
  ).data
}

export async function writeStatus({
  octokit,
  owner,
  repo,
  sha,
  state,
  context,
  description,
  target_url,
}: {
  octokit: ReturnType<typeof getOctokit>
  owner: string
  repo: string
  sha: string
  state: 'error' | 'failure' | 'pending' | 'success'
  context: string
  description?: string
  target_url?: string
}) {
  info(`Writing ${state} commit status for ${sha} of repo ${repo}`)

  return (
    await octokit.rest.repos.createCommitStatus({
      owner,
      repo,
      sha: sha,
      state,
      context,
      description,
      target_url,
    })
  ).data
}

export async function dispatchWorkflow({
  octokit,
  owner,
  repo,
  workflow_id,
  ref,
  inputs,
}: {
  octokit: ReturnType<typeof getOctokit>
  owner: string
  repo: string
  workflow_id: number | string
  ref: string
  inputs?: { [key: string]: string }
}) {
  info(
    `Dispatching workflow "${workflow_id}" of repo ${owner}:${repo}#${ref} with inputs:\n${JSON.stringify(
      inputs,
      undefined,
      2
    )}`
  )

  // Create workflow-dispatch event
  // See: https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event
  return octokit.request(
    'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
    {
      owner,
      repo,
      workflow_id,
      ref,
      inputs,
    }
  )
}

export async function createLightweightTag({
  octokit,
  owner,
  repo,
  tag,
  sha,
}: {
  octokit: ReturnType<typeof getOctokit>
  owner: string
  repo: string
  tag: string
  sha: string
}) {
  info(`Creating lightweight tag "${tag}" on ${owner}:${repo}@${sha}...`)
  return octokit.rest.git.createRef({
    owner,
    repo,
    ref: `refs/tags/${tag}`,
    sha,
  })
}

export async function getAssociatedPullRequest({
  octokit,
  owner,
  repo,
  sha,
}: {
  octokit: ReturnType<typeof getOctokit>
  owner: string
  repo: string
  sha: string
}) {
  // Obtain the the commits most recent associated pull requests
  try {
    const associatedPRs = await octokit.graphql<{
      repository: {
        commit: {
          associatedPullRequests?: {
            edges: {
              node: {
                number: number
                title: string
                body: string
                url: string
              }
            }[]
          }
        }
      }
    }>(
      `
query ($sha: String!, $repo: String!, $owner: String!) {
  repository(name: $repo, owner: $owner) {
    commit: object(expression: $sha) {
      ... on Commit {
        associatedPullRequests(first: 1) {
          edges {
            node {
              number
              title
              body
              url
            }
          }
        }
      }
    }
  }
}
      `,
      {
        owner,
        repo,
        sha,
      }
    )
    return associatedPRs.repository?.commit?.associatedPullRequests?.edges[0]
      ?.node
  } catch (err: any) {
    throw new Error(
      `Failed to fetch associated pull requests for ${owner}:${repo}@${sha}`
    )
  }
}
