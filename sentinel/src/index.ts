import { info, setFailed, getInput } from '@actions/core'
import { analyseRepositories } from './analysis'
import { updateWorkflows } from './update-workflows'
import { updatePROverview } from './pr-links'

async function run() {
  try {
    const mode = getInput('mode')
    const isTest = getInput('is-test') === 'true'

    if (mode === 'update') {
      info('Running in update mode')
      await updateWorkflows(isTest)
    } else {
      info('Running in analyse mode')
      await analyseRepositories(isTest)
    }
  } catch (error: unknown) {
    // @ts-ignore
    setFailed(error?.message || error)
  }

  await updatePROverview()
}

run()
