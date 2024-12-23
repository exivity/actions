import { info, setFailed, getInput } from '@actions/core'
import { analyseRepositories } from './analysis'
import { updateRepositories } from './update'
import { updatePROverview } from './pr-links'

async function run() {
  try {
    const mode = getInput('mode')
    const isTest = getInput('is-test') === 'true'

    if (mode === 'update') {
      info('Running in update mode')
      await updateRepositories(isTest, 'update')
    } else if (mode === 'dependabot') {
      info('Running in dependabot mode')
      await updateRepositories(isTest, 'dependabot')
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
