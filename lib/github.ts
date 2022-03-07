import { getInput, info, warning } from '@actions/core'
import { getOctokit } from '@actions/github'
import { EmitterWebhookEvent, EmitterWebhookEventName } from '@octokit/webhooks'
import { promises as fsPromises } from 'fs'

export type EventData<T extends EmitterWebhookEventName> =
  EmitterWebhookEvent<T>['payload']

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
  const [owner, component] = (process.env['GITHUB_REPOSITORY'] || '').split('/')

  if (!owner || !component) {
    throw new Error('The GitHub repository is missing')
  }

  return { owner, component }
}

export async function getSha() {
  let sha = process.env['GITHUB_SHA']
  const eventName = getEventName()

  // See https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request:
  // Note that GITHUB_SHA for this event is the last merge commit of the pull
  // request merge branch.If you want to get the commit ID for the last commit
  // to the head branch of the pull request, use
  // github.event.pull_request.head.sha instead.
  if (eventName === 'pull_request') {
    const eventData = await getEventData(eventName)
    sha = eventData.pull_request.head.sha
  }

  if (!sha) {
    throw new Error('The GitHub sha is missing')
  }

  return sha
}

export function getRef() {
  const ref =
    process.env['GITHUB_HEAD_REF'] ||
    process.env['GITHUB_REF']?.slice(0, 10) == 'refs/tags/'
      ? process.env['GITHUB_REF']?.slice(10) // slice 'refs/tags/'
      : process.env['GITHUB_REF']?.slice(11) // slice 'refs/heads/'

  if (!ref) {
    throw new Error('The GitHub ref is missing')
  }

  return ref
}

export function getTag() {
  return process.env['GITHUB_REF']?.slice(0, 10) == 'refs/tags/'
    ? process.env['GITHUB_REF']?.slice(10) // slice 'refs/tags/'
    : null
}

export function getWorkspacePath() {
  const workspacePath = process.env['GITHUB_WORKSPACE']

  if (!workspacePath) {
    throw new Error('The GitHub workspace path is missing')
  }

  return workspacePath
}

export function getToken(inputName = 'gh-token') {
  const ghToken = getInput(inputName) || process.env['GITHUB_TOKEN']

  if (!ghToken) {
    throw new Error('The GitHub token is missing')
  }

  return ghToken
}

export function getEventName<T extends EmitterWebhookEventName>(
  supportedEvents?: readonly T[]
) {
  const eventName = process.env['GITHUB_EVENT_NAME']

  if (!eventName) {
    throw new Error('The GitHub event name is missing')
  }

  if (supportedEvents && !supportedEvents.includes(eventName as any)) {
    throw new Error(`The event ${eventName} is not supported by this action`)
  }

  return eventName as T
}

export function isEvent<T extends EmitterWebhookEventName, U extends T>(
  input: T,
  compare: U,
  eventData: EventData<T>
): eventData is EventData<U> {
  return input === compare
}

export async function getEventData<
  T extends EmitterWebhookEventName
>(): Promise<EventData<T>> {
  const eventPath = process.env['GITHUB_EVENT_PATH']

  if (!eventPath) {
    throw new Error('The GitHub event path is missing')
  }

  const fileData = await fsPromises.readFile(eventPath, {
    encoding: 'utf8',
  })

  return JSON.parse(fileData)
}

export function getWorkflowName() {
  const workflowName = process.env['GITHUB_WORKFLOW']

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

  body = `${body}${body ? '\n\n---\n\n' : ''}\
_Automated review from [**${process.env.GITHUB_WORKFLOW}** \
workflow in **${process.env.GITHUB_REPOSITORY}**]\
(https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${
    process.env.GITHUB_RUN_ID
  })_`

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
