import type { Version2Models } from 'jira.js'
import type { PluginParams } from '.'
import { JiraCustomFields, JiraIssueType } from '../common/types'

export async function jiraPlugin({ jiraClient, changelog }: PluginParams) {
  // const jiraKey = new RegExp(/\b[A-Z]+-\d+\b/g)
  const jiraKey = new RegExp(/race/g)
  for (const item of changelog) {
    const issues = [
      ...(item.links.pr ? item.links.pr.title.match(jiraKey) || [] : []),
      ...(item.links.pr ? item.links.pr.description?.match(jiraKey) || [] : []),
      ...(item.links.commit.description?.match(jiraKey) || []),
      ...(item.links.commit.title.match(jiraKey) || []),
    ]

    // Take only first issue
    if (issues.length > 0) {
      const issueKey = 'EXVT-5340' // issues[0]
      const issue = await jiraClient.issues.getIssue({ issueIdOrKey: issueKey })

      item.links.issue = {
        title: getReleaseNotesTitle(issue) || issue.fields.summary,
        description:
          getReleaseNotesDescription(issue) || issue.fields.description || null,
        slug: issueKey,
        url: `https://exivity.atlassian.net/browse/${issueKey}`,
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

      // Add epic as milestoneif present
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
