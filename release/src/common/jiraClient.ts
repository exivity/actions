import { info, warning } from '@actions/core'
import { Version2Client } from 'jira.js'

const transitionIds = {
  'Done->Released': '211',
  'New->Accepted': '171',
  'Accepted->InProgress': '71',
  'InProgress->Done': '91',
  'NoActionNeeded->New': '201',
  'InReview->Done': '91',
}

export function getJiraClient(username: string, token: string) {
  return new Version2Client({
    host: 'https://exivity.atlassian.net',
    authentication: {
      basic: {
        username,
        password: token,
      },
    },
    newErrorHandling: true,
  })
}

export async function transitionToReleased(
  issueIdOrKey: string,
  jiraClient: Version2Client
) {
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
        warning(`${issueIdOrKey} has unknown status ${status}`)
        return
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

export async function getVersion(
  dryRun: boolean,
  jiraClient: ReturnType<typeof getJiraClient>,
  version: string,
  issueIdOrKey: string
): Promise<string> {
  const { fields } = (await jiraClient.issues.getEditIssueMeta({
    issueIdOrKey,
  })) as any
  // made into `any` because according to the api docs, these types are wrong
  const field = fields?.fixVersions

  const versionData = field?.allowedValues?.filter(
    (data: any) => data.name === version
  )

  if (typeof versionData === 'undefined') {
    throw new Error('Cannot get version data')
  }

  if (versionData.length > 0) {
    if (typeof versionData[0].id !== 'string') {
      throw new Error(
        `returned version id is not a string, but: ${JSON.stringify(
          versionData[0].id
        )}`
      )
    }

    return versionData[0].id
  } else if (dryRun) {
    info("dry run, not creating new version id, returning that of 'next'")
    return '10456' // the 'next' version
  }

  const newData = await jiraClient.projectVersions.createVersion({
    name: version,
    projectId: 10002,
    releaseDate: toDateString(new Date()),
  })

  if (typeof newData.id !== 'string') {
    throw new Error(
      `newly created version id is not a string, but: ${JSON.stringify(
        versionData[0].id
      )}`
    )
  }

  return newData.id
}
