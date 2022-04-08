import { debug, getInput, setFailed } from '@actions/core'
import glob from 'glob-promise'
import rcedit from 'rcedit'
import { getRepository, getSha } from '../../lib/github'

const executionLevels = [
  'asInvoker',
  'highestAvailable',
  'requireAdministrator',
] as const

async function run() {
  const component = getRepository().component
  const sha = getSha()

  // Inputs
  const path = getInput('path', { required: true })

  const fileDescription =
    getInput('file-description') || `Exivity (${component} component)`
  const fileVersion = getInput('file-version') || undefined
  const productName = getInput('product-name') || component
  const productVersion = getInput('product-version') || sha
  const companyName = getInput('company-name') || 'Exivity'
  const comments = getInput('comments') || undefined
  const internalFilename = getInput('internal-filename') || undefined
  const legalCopyright = getInput('legal-copyright') || `© 2017 Exivity`
  const legalTrademarks1 = getInput('legal-trademarks1') || undefined
  const legalTrademarks2 = getInput('legal-trademarks2') || undefined
  const originalFilename = getInput('original-filename') || undefined
  const icon = getInput('icon') || undefined
  const requestedExecutionLevel =
    (getInput('requested-execution-level') as typeof executionLevels[number]) ||
    undefined
  const applicationManifest = getInput('application-manifest') || undefined

  // Assertions
  if (
    !comments &&
    !companyName &&
    !fileDescription &&
    !internalFilename &&
    !legalCopyright &&
    !legalTrademarks1 &&
    !legalTrademarks2 &&
    !originalFilename &&
    !productName &&
    !fileVersion &&
    !productVersion &&
    !icon &&
    !requestedExecutionLevel &&
    !applicationManifest
  ) {
    throw new Error('No properties set')
  }

  if (
    requestedExecutionLevel &&
    !executionLevels.includes(requestedExecutionLevel)
  ) {
    throw new Error('Invalid value for requested-execution-level')
  }

  // Obtain absolute paths
  const absPaths = await glob(path, { absolute: true })
  debug(`Absolute path to file(s): "${absPaths.join(', ')}"`)

  for (const absPath of absPaths) {
    await rcedit(absPath, {
      'version-string': {
        Comments: comments,
        CompanyName: companyName,
        FileDescription: fileDescription,
        InternalFilename: internalFilename,
        LegalCopyright: legalCopyright,
        LegalTrademarks1: legalTrademarks1,
        LegalTrademarks2: legalTrademarks2,
        OriginalFilename: originalFilename,
        ProductName: productName,
      },
      'file-version': fileVersion,
      'product-version': productVersion,
      icon: icon,
      'requested-execution-level': requestedExecutionLevel,
      'application-manifest': applicationManifest,
    })
    debug(`processed ${absPath} with rcedit`)
  }
}

run().catch(setFailed)
