import { warning } from '@actions/core'
import { info } from 'console'
import { isEmpty } from 'ramda'
import {
  getJiraClient,
  getJiraProjectId,
  getLockFile,
  isDryRun,
} from '../common/inputs'
import { getIssuesFromIssueFile } from '../common/writeIssueFile'

const transitionIds = {
  'NoActionNeeded->New': '201',
  'New->Accepted': '171',
  'Accepted->InProgress': '71',
  'InProgress->Done': '91',
  'InReview->Done': '91',
  'Done->Released': '211',
}

export async function transitionToReleased(issueIdOrKey: string) {
  const jiraClient = getJiraClient()

  const issue = await jiraClient.issues.getIssue({
    issueIdOrKey,
    fields: ['status'],
    expand: ['transitions'],
  })

  let status = issue.fields.status.name

  while (status !== 'Released') {
    let flowKey: string
    switch (status) {
      case 'Done':
        flowKey = 'Done->Released'
        status = 'Released'
        break
      case 'New':
        flowKey = 'New->Accepted'
        status = 'Accepted'
        break
      case 'Accepted':
        flowKey = 'Accepted->InProgress'
        status = 'InProgress'
        break
      case 'In Progress':
        flowKey = 'InProgress->Done'
        status = 'Done'
        break
      case 'No action needed':
        flowKey = 'NoActionNeeded->New'
        status = 'New'
        break
      case 'In review':
        flowKey = 'InReview->Done'
        status = 'Done'
        break
      default:
        throw new Error(`Unknown status ${status}`)
    }

    return await jiraClient.issues.doTransition({
      issueIdOrKey,
      transition: {
        id: transitionIds[flowKey],
      },
    })
  }
}

function toDateString(date: Date): string {
  return `${date.getUTCFullYear()}-${('0' + date.getUTCMonth()).slice(-2)}-${(
    '0' + date.getUTCDate()
  ).slice(-2)}`
}

async function getReleaseVersion() {
  const jiraClient = getJiraClient()
  const lockfile = await getLockFile()

  try {
    const releaseVersions = await jiraClient.projectVersions.getProjectVersions(
      {
        projectIdOrKey: getJiraProjectId() as unknown as string,
      }
    )

    const version = releaseVersions.find(
      (version) => version.name === lockfile.version
    )

    if (version) return version
  } catch (err) {
    throw new Error(
      `Could not connect with project versions: ${JSON.stringify(err)}`
    )
  }

  try {
    const newVersion = await jiraClient.projectVersions.createVersion({
      name: lockfile.version,
      projectId: getJiraProjectId(),
      releaseDate: toDateString(new Date()),
    })

    return newVersion
  } catch (err) {
    throw new Error(
      `Could not create new release version in Jira: ${JSON.stringify(err)}`
    )
  }
}

export async function updateIssueFixVersion(jiraIssueIds: string[]) {
  const jiraClient = getJiraClient()
  const version = await getReleaseVersion()

  jiraIssueIds.forEach((issueIdOrKey) => {
    jiraClient.issues
      .editIssue({
        issueIdOrKey,
        fields: {
          fixVersions: [{ id: version.id }],
        },
      })
      .then(() => {
        info(`Set release version of ${issueIdOrKey} to ${version.name}`)
      })
      .catch((err) => {
        warning(
          `failed to set fixVersion for issue ${issueIdOrKey} to ${
            version.name
          }: ${JSON.stringify(err)}`
        )
      })
  })
}

export async function updateIssuesStatusAndFixVersion() {
  const jiraIssues = await getIssuesFromIssueFile()
  if (isEmpty(jiraIssues) || isDryRun()) {
    info('No issues to transition')
  }

  updateIssueFixVersion(jiraIssues)
  jiraIssues.forEach(transitionToReleased)
}
