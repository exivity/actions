import { existsSync, readFileSync } from 'node:fs'
import { getLockFile } from './common/inputs'
import { tagAllRepositories } from './common/gitActions'
const { isMaintenancePlan } = require('./common/maintenancePlan')

export async function release() {
  if (existsSync('release-plan.json')) {
    const plan = JSON.parse(readFileSync('release-plan.json', 'utf8'))
    if (isMaintenancePlan(plan, await getLockFile())) {
      throw new Error(
        'Maintenance releases must use the frozen-plan publisher in exivity/exivity',
      )
    }
  }
  await tagAllRepositories()
}
