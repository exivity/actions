import { getInput, info, warning } from '@actions/core'
import { getOctokit } from '@actions/github'
import { promises as fsPromises } from 'fs'

type Options = {
  octokit: ReturnType<typeof getOctokit>
  component: string
  ref: string
}

export async function getShaFromRef({ octokit, component, ref }: Options) {
  if (ref === 'develop') {
    const hasDevelop = (
      await octokit.repos.listBranches({
        owner: 'exivity',
        repo: component,
      })
    ).data.some((repoBranch) => repoBranch.name === 'develop')
    if (!hasDevelop) {
      warning(
        `Branch "develop" not available in repository "exivity/${component}", falling back to "master".`
      )
      ref = 'master'
    }
  }

  const sha = (
    await octokit.repos.getBranch({
      owner: 'exivity',
      repo: component,
      branch: ref,
    })
  ).data.commit.sha

  info(`Resolved ${ref} to ${sha}`)

  return sha
}

export async function getPR(
  octokit: ReturnType<typeof getOctokit>,
  repo: string,
  ref: string
) {
  // get most recent PR of current branch
  const {
    data: [most_recent],
  } = await octokit.pulls.list({
    owner: 'exivity',
    repo,
    head: `exivity:${ref}`,
    sort: 'updated',
  })

  return most_recent
}

export function getRepository() {
  const [owner, component] = (process.env['GITHUB_REPOSITORY'] || '').split('/')

  if (!owner || !component) {
    throw new Error('The GitHub repository is missing')
  }

  return { owner, component }
}

export function getSha() {
  const sha = process.env['GITHUB_SHA']

  if (!sha) {
    throw new Error('The GitHub sha is missing')
  }

  return sha
}

export function getRef() {
  const ref =
    process.env['GITHUB_HEAD_REF'] || process.env['GITHUB_REF']?.slice(11)

  if (!ref) {
    throw new Error('The GitHub ref is missing')
  }

  return ref
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

export function getEventName<T extends string = string>() {
  const eventName = process.env['GITHUB_EVENT_NAME']

  if (!eventName) {
    throw new Error('The GitHub event name is missing')
  }

  return eventName as T
}

export async function getEventData<T = any>() {
  const eventPath = process.env['GITHUB_EVENT_PATH']

  if (!eventPath) {
    throw new Error('The GitHub event path is missing')
  }

  const fileData = await fsPromises.readFile(eventPath, {
    encoding: 'utf8',
  })

  return JSON.parse(fileData) as T
}

export function getWorkflowName() {
  const workflowName = process.env['GITHUB_WORKFLOW']

  if (!workflowName) {
    throw new Error('The GitHub workflow name is missing')
  }

  return workflowName
}
