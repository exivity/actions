import type { Version2Models } from 'jira.js'
import type { PluginParams } from '.'
import { JiraCustomFields, JiraIssueType } from '../common/types'

export async function jiraPlugin({ jiraClient, changelog }: PluginParams) {
  const jiraKey = new RegExp(/\b[A-Z]+-\d+\b/g)
  for (const item of changelog) {
    const issues = [
      ...(item.links.pr
        ? item.links.pr.originalTitle.match(jiraKey) || []
        : []),
      ...(item.links.pr ? item.links.pr.description?.match(jiraKey) || [] : []),
      ...(item.links.commit.description?.match(jiraKey) || []),
      ...(item.links.commit.originalTitle.match(jiraKey) || []),
    ]

    // Take only first issue
    if (issues.length > 0) {
      const issueKey = issues[0]
      let issue
      try {
        issue = await jiraClient.issues.getIssue({
          issueIdOrKey: issueKey,
        })
      } catch (err) {
        throw new Error(
          `got error when getting issue ${issueKey}:\n${JSON.stringify(err)}`
        )
      }

      item.links.issue = {
        title: issue.fields.summary,
        description: issue.fields.description || null,
        slug: issueKey,
        url: `https://exivity.atlassian.net/browse/${issueKey}`,
      }

      const releaseNotesTitle = getReleaseNotesTitle(issue)
      if (releaseNotesTitle) {
        item.links.issue.title = releaseNotesTitle
        item.links.issue.description = getReleaseNotesDescription(issue) || null
      } else {
        item.warnings.push(
          `Please [provide release notes](https://exivity.atlassian.net/browse/${issueKey}) (title and an optional description) in Jira`
        )
      }

      // Change item type
      if (issue.fields.issuetype.name === JiraIssueType.Chore) {
        item.type = 'chore'
      }
      if (issue.fields.issuetype.name === JiraIssueType.Bug) {
        item.type = 'fix'
      }
      if (
        issue.fields.issuetype.name === JiraIssueType.Feature ||
        issue.fields.issuetype.name === JiraIssueType.Epic
      ) {
        item.type = 'feat'
      }

      // Add epic as milestone if present
      const epicKey = getEpic(issue)
      if (epicKey) {
        const epic = await jiraClient.issues.getIssue({ issueIdOrKey: epicKey })
        item.links.milestone = {
          title: getReleaseNotesTitle(epic) || epic.fields.summary,
          description:
            getReleaseNotesDescription(epic) || epic.fields.description || null,
          slug: getReleaseNotesTitle(epic) || epic.fields.summary,
          url: `https://exivity.atlassian.net/browse/${epicKey}`,
        }
      }
    }
  }

  return changelog
}

function getReleaseNotesTitle(issue: Version2Models.Issue) {
  return issue.fields[JiraCustomFields.ReleaseNotesTitle] as string | null
}

function getReleaseNotesDescription(issue: Version2Models.Issue) {
  return issue.fields[JiraCustomFields.ReleaseNotesDescription] as string | null
}

function getEpic(issue: Version2Models.Issue) {
  return issue.fields[JiraCustomFields.Epic] as string | null
}
