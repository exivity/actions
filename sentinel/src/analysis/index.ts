import { getRepos } from '../github-api'
import {
  retrieveGithubFiles,
  retrieveRootFiles,
  retrieveWorkflowFiles,
} from '../repo-data'

import {
  actionsStandardsAdherence,
  exivityActionsReport,
  externalActionsReport,
} from './actions'
import { operatingSystemsReport } from './operating-systems'
import { standardsAdherenceReport } from './up-to-standards'

export async function analyseRepositories(isTest: boolean) {
  console.log('Starting analysis...')
  const repos = await getRepos(isTest)
  console.log(`Found ${repos.length} repositories.`)

  await Promise.all(
    repos.map(async (repo) => {
      console.log(`Analyzing ${repo.name}...`)
      await retrieveRootFiles(repo)
      await retrieveWorkflowFiles(repo)
      await retrieveGithubFiles(repo)
      console.log(`Finished retrieval of ${repo.name}`)
    }),
  )

  await operatingSystemsReport(repos)

  await externalActionsReport(repos)

  await exivityActionsReport(repos)

  await actionsStandardsAdherence(repos)

  await standardsAdherenceReport(repos)

  console.log('Analysis complete.')
}
