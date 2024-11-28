import { info, setFailed, getInput } from '@actions/core'
import { analyseRepositories } from './analysis'
import { updateWorkflows } from './update-workflows'
import { updatePROverview } from './pr-links'

async function run() {
  try {
    const mode = getInput('mode')

    if (mode === 'update') {
      info('Running in update mode')
      await updateWorkflows()
    } else {
      info('Running in analyse mode')
      await analyseRepositories()
    }
  } catch (error: unknown) {
    // @ts-ignore
    setFailed(error?.message || error)
  }

  await updatePROverview()
}

run()
