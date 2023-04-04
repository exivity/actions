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
  getCommitForTag,
  getCommitsSince,
  STANDARD_BRANCH,
  getAssociatedPullRequest,
} from '../../../lib/github'
import { getLatestVersion } from '../../../lib/git'
import { parseCommitMessage } from '../../../lib/conventionalCommits'
import { getJiraClient, getOctoKitClient } from '../common/inputs'

import {
  JIRA_KEY_RGX,
  cleanJiraKeyMatches,
  getReleaseNotesTitle,
  getReleaseNotesDescription,
  noReleaseNotesNeeded,
  getEpic,
  getIssueType,
} from './utils'
import { debug } from 'console'

export const getFirstLine = pipe(split('\n'), pathOr('', [0]))
export const removeFirstLine = pipe(split('\n'), tail, join('\n'))

export const getRepoJiraIssues = async (repo: string) => {
  const jiraClient = getJiraClient()
  const octokit = getOctoKitClient()
  const latestVersion = await getLatestVersion()

  // Find commit for latest version tag in target repository
  const latestVersionCommit = await getCommitForTag({
    octokit,
    owner: 'exivity',
    repo,
    tag: latestVersion,
  })

  // Get a list of commits from the last version
  const commits = await getCommitsSince({
    octokit,
    owner: 'exivity',
    repo,
    branch: STANDARD_BRANCH,
    since: latestVersionCommit,
  })

  const jiraIssueKeys: string[] = []

  return {
    jiraIssueKeys,
    issues: await Promise.all(
      commits.map(async (commit) => {
        const associatedPullRequest = await getAssociatedPullRequest({
          octokit,
          owner: 'exivity',
          repo,
          sha: commit.sha,
        })

        const jiraKeys = cleanJiraKeyMatches([
          commit.commit.message.match(JIRA_KEY_RGX),
          associatedPullRequest?.title.match(JIRA_KEY_RGX),
          associatedPullRequest?.body.match(JIRA_KEY_RGX),
        ])

        jiraIssueKeys.push(...jiraKeys)

        const { breaking = false } = parseCommitMessage(commit.commit.message)

        return Promise.all(
          jiraKeys.map((key) =>
            jiraClient.issues.getIssue({ issueIdOrKey: key })
          )
        ).then((tickets) =>
          tickets.flatMap((issue) => {
            const issueType = getIssueType(issue)

            if (!issue || none(equals(issueType), ['feat', 'fix'])) return []

            const epic = getEpic(issue)

            debug(`
              Release note for ${issue.key}:
              title: ${getReleaseNotesTitle(issue)}
              description: ${getReleaseNotesDescription(issue)}
              --------------------------------------------------
            `)

            return {
              title: getReleaseNotesTitle(issue),
              description: getReleaseNotesDescription(issue),
              type: issueType,
              breaking,
              noReleaseNotesNeeded: noReleaseNotesNeeded(issue),
              commit: `[exivity/${repo}@${commit.sha.substring(0, 7)}](${
                commit.html_url
              })`,
              issue: `[${issue.key}](https://exivity.atlassian.net/browse/${issue.key})`,
              pullRequest: `[exivity/${repo}#${associatedPullRequest?.number}](${associatedPullRequest?.url})`,
              milestone: epic
                ? `[${getEpic(
                    issue
                  )}](https://exivity.atlassian.net/browse/${getEpic(issue)})`
                : 'No milestone',
            }
          })
        )
      })
    ).then(chain(identity)),
  }
}

export type JiraIssue = ReturnType<typeof getRepoJiraIssues> extends Promise<
  infer I
>
  ? I extends { issues: infer Prop }
    ? Prop extends (infer T)[]
      ? T
      : never
    : never
  : never
