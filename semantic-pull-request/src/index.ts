import { info, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import { isSemanticCommitMessage } from '../../lib/conventionalCommits'
import {
  getEventData,
  getEventName,
  getPr,
  getRepository,
  getToken,
} from '../../lib/github'

const supportedEvents = ['pull_request'] as const

async function run() {
  // Inputs
  const token = getToken()
  const { owner, repo } = getRepository()
  const eventName = getEventName(supportedEvents)
  const eventData = getEventData(eventName)

  // Client
  const octokit = getOctokit(token)

  // Get latest PR data
  const pr = await getPr({
    octokit,
    owner,
    repo,
    number: eventData.pull_request.number,
  })

  if (!pr) throw Error("Couldn't get PR data.")

  // Validate PR title
  if (!isSemanticCommitMessage(pr.title)) {
    throw new Error(
      `PR title "${pr.title}" is not semantic, see above for more details.`,
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
      owner,
      repo,
      pull_number: pr.number,
    },
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
    if (!isSemanticCommitMessage(commitTitle)) {
      throw new Error(
        `Pull request has only one commit and it's not semantic; this may lead to a non-semantic commit in the base branch (see https://github.community/t/how-to-change-the-default-squash-merge-commit-message/1155). Amend the commit message to match the pull request title, or add another commit.`,
      )
    }
  }

  info('🎉 Congratulation! Your pull request is semantic.')
}

run().catch(setFailed)
