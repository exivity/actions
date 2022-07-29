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

export async function getVersion(
  jiraClient: ReturnType<typeof getJiraClient>,
  version: string,
  issueIdOrKey: string
) {
  const { fields } = (await jiraClient.issues.getEditIssueMeta({
    issueIdOrKey,
  })) as any
  // made into `any` because according to the api docs, these types are wrong
  console.log(JSON.stringify(fields))

  const versionData = fields?.fixVersions?.allowedValues?.filter(
    (data: any) => data.name === version
  )

  if (typeof versionData === 'undefined') {
    throw new Error('Cannot get version data')
  }

  if (versionData.length > 0) {
    return versionData[0]
  }

  //const newData = await jiraClient.
  // FIXME: Create the fixVersion option if it doesn't exist yet
}
