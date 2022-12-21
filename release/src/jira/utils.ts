import { identity, filter, chain, uniq, pipe, isEmpty, map } from 'ramda'
import type { Version2Models } from 'jira.js'
import { getJiraClient } from '../common/inputs'
import { info } from 'console'

export const JIRA_KEY_RGX = new RegExp(/\bEXVT-\d+\b|\bCLS-\d+\b/g)

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

const isFeatOrFix = (type: string = JiraIssueType.Chore) => {
  return (
    type === JiraIssueType.Feature ||
    type === JiraIssueType.Bug ||
    type === JiraIssueType.Epic
  )
}

export function getIssueType(issue: Version2Models.Issue): string {
  return issue.fields.issuetype.name === JiraIssueType.Feature
    ? 'feat'
    : issue.fields.issuetype.name === JiraIssueType.Bug
    ? 'fix'
    : 'chore'
}

function isRegExpMatchArray(args: any): args is RegExpMatchArray {
  return Array.isArray(args)
}

export const cleanJiraKeyMatches = pipe(
  identity<(RegExpMatchArray | null | undefined)[]>,
  filter(isRegExpMatchArray),
  chain(identity),
  uniq
)

export function prIsNotAssociatedWithTicket(pr: {
  title: string
  body: string
}) {
  return (
    pr.title.match(JIRA_KEY_RGX) === null &&
    (!pr.body || pr.body.match(JIRA_KEY_RGX) === null)
  )
}

export function getReleaseNotesTitle(issue: Version2Models.Issue): string {
  return issue.fields[JiraCustomFields.ReleaseNotesTitle] ?? ''
}

export function noReleaseNotesTitlePresent(
  issue: Version2Models.Issue
): boolean {
  return (
    typeof issue.fields[JiraCustomFields.ReleaseNotesTitle] === 'string' &&
    isEmpty(issue.fields[JiraCustomFields.ReleaseNotesTitle])
  )
}

export function hasReleaseNotesTitle(issue: Version2Models.Issue): boolean {
  return (
    typeof issue.fields[JiraCustomFields.ReleaseNotesTitle] === 'string' &&
    issue.fields[JiraCustomFields.ReleaseNotesTitle].length > 0
  )
}

export function getReleaseNotesDescription(
  issue: Version2Models.Issue
): string {
  return issue.fields[JiraCustomFields.ReleaseNotesDescription] ?? ''
}

export function noReleaseNotesNeeded(issue: Version2Models.Issue) {
  return issue.fields.labels.includes('no-release-notes-needed')
}

export function releaseNotesAreMissing(issue: Version2Models.Issue) {
  return noReleaseNotesTitlePresent(issue) && !noReleaseNotesNeeded(issue)
}

export function getEpic(issue: Version2Models.Issue): string | null {
  return issue.fields[JiraCustomFields.Epic] ?? null
}

const getMissingReleaseNotes = pipe(
  filter(
    (issue: Version2Models.Issue) =>
      isFeatOrFix(issue.fields.issuetype.name) && releaseNotesAreMissing(issue)
  ),
  map(
    ({ key }) =>
      `Please [provide release notes](https://exivity.atlassian.net/browse/${key}) (title and an optional description) in Jira`
  )
)

export const getPrMissingReleaseNotes = async (pr: {
  title: string
  body: string | null
}) => {
  const jiraClient = getJiraClient()
  info(pr.body)
  if (!pr.body) return []

  const issues = cleanJiraKeyMatches([
    pr?.title.match(JIRA_KEY_RGX),
    pr?.body.match(JIRA_KEY_RGX),
  ])

  return Promise.all(
    issues.map((key) => jiraClient.issues.getIssue({ issueIdOrKey: key }))
  ).then((issues) => {
    issues.filter(hasReleaseNotesTitle).forEach((issue) => {
      info(
        `Found release notes for ${issue.key} in Jira: ${getReleaseNotesTitle(
          issue
        )}`
      )
    })

    return getMissingReleaseNotes(issues)
  })
}
