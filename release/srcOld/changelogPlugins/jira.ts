import { info } from '@actions/core'
import type { Version2Models } from 'jira.js'
import {
  identity,
  filter,
  equals,
  pipe,
  chain,
  uniq,
  map,
  complement,
  isEmpty,
  innerJoin,
  path,
  pathEq,
  reject,
  assocPath,
} from 'ramda'

import type { PluginParams, JiraClient } from '.'

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

const jiraKey = new RegExp(/\bEXVT-\d+\b|\bCLS-\d+\b/g)

function isRegExpMatchArray(args: any): args is RegExpMatchArray {
  return Array.isArray(args)
}

function getReleaseNotesTitle(issue: Version2Models.Issue): string | null {
  return issue.fields[JiraCustomFields.ReleaseNotesTitle] ?? null
}

function getReleaseNotesDescription(
  issue: Version2Models.Issue
): string | null {
  return issue.fields[JiraCustomFields.ReleaseNotesDescription] ?? null
}

function getEpic(issue: Version2Models.Issue): string | null {
  return issue.fields[JiraCustomFields.Epic] ?? null
}

const cleanJiraKeyMatches = pipe(
  identity<(RegExpMatchArray | null | undefined)[]>,
  filter(isRegExpMatchArray),
  chain(identity),
  uniq
)

const getEpicMilestone = async (
  jiraClient: JiraClient,
  issue: Version2Models.Issue
) => {
  const epicKey = getEpic(issue)

  if (epicKey) {
    try {
      const epic = await jiraClient.issues.getIssue({
        issueIdOrKey: epicKey,
      })

      return {
        title: getReleaseNotesTitle(epic) || epic.fields.summary,
        description:
          getReleaseNotesDescription(epic) || epic.fields.description || null,
        slug: getReleaseNotesTitle(epic) || epic.fields.summary,
        url: `https://exivity.atlassian.net/browse/${epicKey}`,
      }
    } catch (e) {
      info(`Failed to get epic milestone for ${epicKey}`)
    }
  }
}

function isFulfilled<T>(arg: {
  status: string
  value?: T
}): arg is PromiseFulfilledResult<T> {
  return arg.status === 'fulfilled'
}

function isRejected(arg: any): arg is PromiseRejectedResult {
  return arg.status === 'rejected'
}

function hasLabel(issue: Version2Models.Issue, label: string) {
  return issue.fields.labels.includes(label)
}

const isNotEmpty = complement(isEmpty)

const issueTypePath = ['fields', 'issuetype', 'name']

const getWarnings = pipe(
  identity<Version2Models.Issue[]>,
  reject(pathEq(issueTypePath, JiraIssueType.Chore)),
  filter(
    (item: Version2Models.Issue) =>
      !getReleaseNotesTitle(item) && !hasLabel(item, 'no-release-notes-needed')
  ),
  map(
    ({ key }) =>
      `Please [provide release notes](https://exivity.atlassian.net/browse/${key}) (title and an optional description) in Jira`
  )
)

export async function jiraPlugin({ jiraClient, changelog }: PluginParams) {
  return Promise.all(
    changelog.map(async (changelogItem) => {
      const jirakeys = cleanJiraKeyMatches([
        changelogItem.links.pr?.originalTitle.match(jiraKey),
        changelogItem.links.pr?.description?.match(jiraKey),
        changelogItem.links.commit.description?.match(jiraKey),
        changelogItem.links.commit.originalTitle.match(jiraKey),
      ])

      let wrappedJiraIssues = await Promise.allSettled(
        jirakeys.map((issueIdOrKey) =>
          jiraClient.issues.getIssue({
            issueIdOrKey,
          })
        )
      )

      wrappedJiraIssues.filter(isRejected).forEach(({ reason }) => {
        info(`got error when getting issue:\n${JSON.stringify(reason)}`)
      })

      const jiraIssues = wrappedJiraIssues
        .filter(isFulfilled)
        .map((i) => i.value)

      const issuesTypeEqualsOneOf = (oneOf: JiraIssueType[]) => {
        return isNotEmpty(
          innerJoin(equals, oneOf, map(path(issueTypePath), jiraIssues))
        )
      }

      changelogItem = {
        ...changelogItem,
        warnings: getWarnings(jiraIssues),
        type: issuesTypeEqualsOneOf([JiraIssueType.Feature, JiraIssueType.Epic])
          ? ('feat' as const)
          : issuesTypeEqualsOneOf([JiraIssueType.Bug])
          ? ('fix' as const)
          : ('chore' as const),
        links: {
          ...changelogItem.links,
          issues: jiraIssues.map((jiraIssue) => ({
            title: getReleaseNotesTitle(jiraIssue) || jiraIssue.fields.summary,
            description: getReleaseNotesDescription(jiraIssue) || null,
            slug: jiraIssue.key,
            url: `https://exivity.atlassian.net/browse/${jiraIssue.key}`,
          })),
        },
      }

      const milestone =
        jiraIssues[0] && (await getEpicMilestone(jiraClient, jiraIssues[0]))

      return milestone
        ? assocPath(['links', 'milestone'], milestone, changelogItem)
        : changelogItem
    })
  )
}
