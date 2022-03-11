import { info, setFailed, warning } from '@actions/core'
import { getOctokit } from '@actions/github'
import {
  getEventData,
  getEventName,
  getPr,
  getRepository,
  getToken,
} from '../../lib/github'
import { types } from './types'

const supportedEvents = ['pull_request'] as const

function validateCommitMessage(message: string) {
  const matches = message.match(/^(\w+)(?:\(([\w_-]+)\))?(!)?:\s+(.*)/)
  const availableTypes = Object.keys(types)

  const genericHelp =
    'See https://www.conventionalcommits.org/en/v1.0.0/ for more details.'
  const typesHelp = `Available types:\n- ${availableTypes.join('\n- ')}`

  if (!matches) {
    warning(
      `Commit message can't be matched to the conventional commit pattern. See https://www.conventionalcommits.org/en/v1.0.0/ for more details.`
    )
    return false
  }

  const [, type, , , description] = matches

  if (!type) {
    warning(`No release type found.${genericHelp}`)
    return false
  }

  if (!description) {
    warning(`No description found.${genericHelp}`)
    return false
  }

  if (!availableTypes.includes(type)) {
    warning(
      `\
No release type found or not a valid release type. \
Add a prefix to indicate what kind of release this pull request corresponds to. \
${genericHelp}\n\n${typesHelp}`
    )
    return false
  }

  return true
}

async function run() {
  // Inputs
  const token = getToken()
  const component = getRepository().component
  const eventName = getEventName(supportedEvents)
  const eventData = getEventData(eventName)

  // Client
  const octokit = getOctokit(token)

  // Get latest PR data
  const pr = await getPr(octokit, component, eventData.pull_request.number)

  // Validate PR title
  if (!validateCommitMessage(pr.title)) {
    throw new Error(
      `PR title "${pr.title}" is not semantic, see above for more details.`
    )
  }

  // Validate commit message if we have only a single (non-merge) commit
  const commits: Awaited<
    ReturnType<typeof octokit.rest.pulls.listCommits>
  >['data'] = []
  let nonMergeCommits: typeof commits = []

  for await (const response of octokit.paginate.iterator(
    octokit.rest.pulls.listCommits,
    {
      owner: 'exivity',
      repo: component,
      pull_number: pr.number,
    }
  )) {
    commits.push(...response.data)

    // GitHub does not count merge commits when deciding whether to use
    // the PR title or a commit message for the squash commit message.
    nonMergeCommits = commits.filter((commit) => commit.parents.length < 2)

    // We only need two non-merge commits to know that the PR
    // title won't be used.
    if (nonMergeCommits.length >= 2) break
  }

  // If there is only one (non merge) commit present, GitHub will use
  // that commit rather than the PR title for the title of a squash
  // commit. To make sure a semantic title is used for the squash
  // commit, we need to validate the commit title.
  if (nonMergeCommits.length === 1) {
    const commitTitle = nonMergeCommits[0].commit.message.split('\n')[0]
    if (!validateCommitMessage(commitTitle)) {
      throw new Error(
        `Pull request has only one commit and it's not semantic; this may lead to a non-semantic commit in the base branch (see https://github.community/t/how-to-change-the-default-squash-merge-commit-message/1155). Amend the commit message to match the pull request title, or add another commit.`
      )
    }

    if (commitTitle !== pr.title) {
      throw new Error(
        `The pull request has only one (non-merge) commit and in this case Github will use it as the default commit message when merging. The pull request title doesn't match the commit though ("${pr.title}" vs. "${commitTitle}"). Please update the pull request title accordingly to avoid surprises.`
      )
    }
  }

  info('🎉 Congratulation! Your pull request is semantic.')
}

run().catch(setFailed)
