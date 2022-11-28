import { info, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import { isFeatOrFix } from '../../lib/conventionalCommits'
import {
  getEventData,
  getEventName,
  getPr,
  getRepository,
  getToken,
} from '../../lib/github'
import {
  prIsNotAssociatedWithTicket,
  getPrMissingReleaseNotes,
} from '../../release/src/jira/utils'

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

  info(`${pr.author_association}`)

  info(`${JSON.stringify(pr.user, null, 4)}`)

  const requiresJiraTicket = isFeatOrFix(pr.title)

  // feat or fix needs to be associated to a jira ticket key
  if (requiresJiraTicket && prIsNotAssociatedWithTicket(pr)) {
    throw new Error(
      `PR has not been associated with a Jira Ticket. 
       A feat or fix always needs to associated with a Jira ticket in the PR body.`
    )
  }

  if (requiresJiraTicket) {
    const missingReleaseNotes = await getPrMissingReleaseNotes(pr)

    if (missingReleaseNotes.length > 0) {
      throw new Error(`
        Missing release notes for:
        ${missingReleaseNotes.join('\n')}
      `)
    }
  }

  requiresJiraTicket
    ? info("🎉 Congratulations! You've provided release notes!")
    : info('No release notes necessary')
}

run().catch(setFailed)
