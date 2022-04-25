import { getInput, info, warning } from '@actions/core'
import { getOctokit } from '@actions/github'
import { context } from '@actions/github/lib/utils'
import { EventPayloadMap, WebhookEventName } from '@octokit/webhooks-types'

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
  component: string
  ref: string
  useFallback?: boolean
}

export const ReleaseBranches = ['master', 'main']
export const DevelopBranches = ['develop']

export async function getShaFromRef({
  octokit,
  component,
  ref,
  useFallback = true,
}: Options) {
  if (useFallback && ref === 'develop') {
    const availableBranches = (
      await octokit.rest.repos.listBranches({
        owner: 'exivity',
        repo: component,
      })
    ).data.map((branch) => branch.name)
    if (!availableBranches.includes('develop')) {
      const fallback = availableBranches.includes('main') ? 'main' : 'master'
      warning(
        `Branch "develop" not available in repository "exivity/${component}", falling back to "${fallback}".`
      )
      ref = fallback
    }
  }

  const sha = (
    await octokit.rest.repos.getBranch({
      owner: 'exivity',
      repo: component,
      branch: ref,
    })
  ).data.commit.sha

  info(`Resolved ${ref} to ${sha}`)

  return sha
}

export async function getPrFromRef(
  octokit: ReturnType<typeof getOctokit>,
  repo: string,
  ref: string
) {
  // Get a list of PRs for the current branch
  const { data } = await octokit.rest.pulls.list({
    owner: 'exivity',
    repo,
    head: `exivity:${ref}`,
    sort: 'updated',
  })

  // Take the first one if data is not empty
  if (data.length > 0) {
    return data[0]
  }
}

export async function getPr(
  octokit: ReturnType<typeof getOctokit>,
  repo: string,
  number: string | number
) {
  return (
    await octokit.rest.pulls.get({
      owner: 'exivity',
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

export function getRef() {
  // HEAD_REF not available from `context`
  const ref =
    process.env['GITHUB_HEAD_REF'] || context.ref?.slice(0, 10) == 'refs/tags/'
      ? context.ref?.slice(10) // slice 'refs/tags/'
      : context.ref?.slice(11) // slice 'refs/heads/'

  if (!ref) {
    throw new Error('The GitHub ref is missing')
  }

  return ref
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

export async function getCommit(
  octokit: ReturnType<typeof getOctokit>,
  repo: string,
  ref: string
) {
  return (
    await octokit.rest.repos.getCommit({
      owner: 'exivity',
      repo,
      ref,
    })
  ).data
}

export async function review(
  octokit: ReturnType<typeof getOctokit>,
  repo: string,
  pull_number: number,
  event: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT',
  body?: string
) {
  info(`Calling GitHub API to ${event} PR ${pull_number} of repo ${repo}`)

  const repository = getRepository().fqn
  body = `${body}${body ? '\n\n---\n\n' : ''}\
_Automated review from [**${getWorkflowName()}** \
workflow in **${repository}**]\
(https://github.com/${repository}/actions/runs/${context.runId})_`

  return (
    await octokit.rest.pulls.createReview({
      owner: 'exivity',
      repo,
      pull_number,
      event,
      body,
    })
  ).data
}

export async function writeStatus(
  octokit: ReturnType<typeof getOctokit>,
  repo: string,
  sha: string,
  state: 'error' | 'failure' | 'pending' | 'success',
  context: string,
  description?: string,
  target_url?: string
) {
  info(
    `Calling GitHub API to write ${state} commit status for ${sha} of repo ${repo}`
  )

  return (
    await octokit.rest.repos.createCommitStatus({
      owner: 'exivity',
      repo,
      sha: sha,
      state,
      context,
      description,
      target_url,
    })
  ).data
}
