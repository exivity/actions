import {
  identity,
  chain,
  pipe,
  split,
  pathOr,
  tail,
  join,
  equals,
  none,
} from 'ramda'

import {
  getCommit,
  getCommitsSince,
  getAssociatedPullRequest,
} from '../../../lib/github'
import { parseCommitMessage } from '../../../lib/conventionalCommits'
import {
  debug,
  getJiraClient,
  getOctoKitClient,
  ReleaseRepository,
} from '../common/inputs'

import {
  JIRA_KEY_RGX,
  cleanJiraKeyMatches,
  getReleaseNotesTitle,
  getReleaseNotesDescription,
  noReleaseNotesNeeded,
  getEpic,
  getIssueType,
} from './utils'
import { info } from '@actions/core'

export const getFirstLine = pipe(split('\n'), pathOr('', [0]))
export const removeFirstLine = pipe(split('\n'), tail, join('\n'))

export const getRepoJiraIssues = async ({
  component,
  releasedSha,
  sourceRepo,
  sourcePath,
  releaseBranch,
}: ReleaseRepository) => {
  const jiraClient = getJiraClient()
  const octokit = getOctoKitClient()
  const releasedCommit = await getCommit({
    octokit,
    owner: 'exivity',
    repo: sourceRepo,
    ref: releasedSha,
  })
  const timestamp =
    releasedCommit.commit.author?.date ?? releasedCommit.commit.committer?.date

  if (!timestamp) {
    throw new Error(
      `Could not find a release timestamp for ${component} at ${releasedSha}`,
    )
  }

  const commits = await getCommitsSince({
    octokit,
    owner: 'exivity',
    repo: sourceRepo,
    branch: releaseBranch,
    path: sourcePath,
    since: {
      timestamp,
      tag: releasedSha,
      sha: releasedSha,
    },
  })

  const jiraIssueKeys: string[] = []

  return {
    jiraIssueKeys,
    issues: await Promise.all(
      commits.map(async (commit) => {
        const associatedPullRequest = await getAssociatedPullRequest({
          octokit,
          owner: 'exivity',
          repo: sourceRepo,
          sha: commit.sha,
        })

        debug(() => `PR.title: ${associatedPullRequest?.title}`)
        debug(() => `PR.body: ${associatedPullRequest?.body}`)

        const jiraKeys = cleanJiraKeyMatches([
          commit.commit.message.match(JIRA_KEY_RGX),
          associatedPullRequest?.title.match(JIRA_KEY_RGX),
          associatedPullRequest?.body.match(JIRA_KEY_RGX),
        ])

        debug(() => `Found jira keys: ${jiraKeys.join(', ')}`)

        jiraIssueKeys.push(...jiraKeys)

        const { breaking = false } = parseCommitMessage(commit.commit.message)

        return Promise.all(
          jiraKeys.map(async (key) => {
            try {
              const issue = await jiraClient.issues.getIssue({
                issueIdOrKey: key,
              })
              const issueType = getIssueType(issue)

              if (!issue || none(equals(issueType), ['feat', 'fix'])) return []

              const epic = getEpic(issue)

              return [
                {
                  title: getReleaseNotesTitle(issue),
                  description: getReleaseNotesDescription(issue),
                  type: issueType,
                  breaking,
                  noReleaseNotesNeeded: noReleaseNotesNeeded(issue),
                  commit: `[exivity/${sourceRepo}@${commit.sha.substring(0, 7)}](${commit.html_url})`,
                  issue: `[${issue.key}](https://exivity.atlassian.net/browse/${issue.key})`,
                  pullRequest: associatedPullRequest
                    ? `[exivity/${sourceRepo}#${associatedPullRequest.number}](${associatedPullRequest.url})`
                    : 'No pull request',
                  milestone: epic
                    ? `[${getEpic(issue)}](https://exivity.atlassian.net/browse/${getEpic(issue)})`
                    : 'No milestone',
                },
              ]
            } catch (error) {
              info(`Issue fetch failed for ${key}`)
              return []
            }
          }),
        ).then((tickets) => tickets.flatMap(identity))
      }),
    ).then(chain(identity)),
  }
}

export type JiraIssue =
  ReturnType<typeof getRepoJiraIssues> extends Promise<infer I>
    ? I extends { issues: infer Prop }
      ? Prop extends (infer T)[]
        ? T
        : never
      : never
    : never
