import {
  identity,
  filter,
  chain,
  uniq,
  pipe,
  split,
  pathOr,
  tail,
  join,
  toLower,
  equals,
  any,
  none,
} from 'ramda'
import type { Version2Models } from 'jira.js'

import {
  getCommitForTag,
  getCommitsSince,
  STANDARD_BRANCH,
  getAssociatedPullRequest,
} from '../../../lib/github'
import { getLatestVersion } from '../../../lib/git'
import { parseCommitMessage } from '../../../lib/conventionalCommits'
import { getJiraClient, getOctoKitClient } from './inputs'

export const JIRA_KEY_RGX = new RegExp(/\bEXVT-\d+\b|\bCLS-\d+\b/g)

function isRegExpMatchArray(args: any): args is RegExpMatchArray {
  return Array.isArray(args)
}

const cleanJiraKeyMatches = pipe(
  identity<(RegExpMatchArray | null | undefined)[]>,
  filter(isRegExpMatchArray),
  chain(identity),
  uniq
)

export const getFirstLine = pipe(split('\n'), pathOr('', [0]))
export const removeFirstLine = pipe(split('\n'), tail, join('\n'))

export enum JiraCustomFields {
  Epic = 'customfield_10005',
  ReleaseNotesTitle = 'customfield_10529',
  ReleaseNotesDescription = 'customfield_10530',
}

export enum JiraIssueType {
  Chore = 'Chore',
  Bug = 'Bug',
  Feature = 'Feature',
  Epic = 'Epic',
}

function getEpic(issue: Version2Models.Issue): string | null {
  return issue.fields[JiraCustomFields.Epic] ?? null
}

function noReleaseNotesNeeded(issue: Version2Models.Issue) {
  return issue.fields.labels.includes('no-release-notes-needed')
}

const toLowerEquals = pipe(toLower, equals)

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

        const { type = 'chore', breaking = false } = parseCommitMessage(
          commit.commit.message
        )

        return Promise.all(
          jiraKeys.map((key) =>
            jiraClient?.issues.getIssue({ issueIdOrKey: key })
          )
        ).then((tickets) =>
          tickets.flatMap((issue) => {
            if (!issue || none(toLowerEquals(type), ['feat', 'fix'])) return []

            const epic = getEpic(issue)

            return {
              title:
                (issue.fields[JiraCustomFields.ReleaseNotesTitle] as string) ??
                '',
              description:
                (issue.fields[
                  JiraCustomFields.ReleaseNotesDescription
                ] as string) ?? '',
              type: type as 'feat' | 'fix',
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
