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
  // Inputs
  const path = getInput('path', { required: true })

  const comments = getInput('comments')
  const companyName = getInput('company-name') || 'Exivity'
  const productName = getInput('product-name') || 'Exivity'
  const sha = getSha()
  const fileDescription =
    getInput('file-description') || `${getRepository().component}:${sha}`
  const internalFilename = getInput('internal-filename')
  const legalCopyright = getInput('legal-copyright')
  const legalTrademarks1 = getInput('legal-trademarks1')
  const legalTrademarks2 = getInput('legal-trademarks2')
  const originalFilename = getInput('original-filename')
  const fileVersion = getInput('file-version')
  const productVersion = getInput('product-version')
  const icon = getInput('icon')
  const requestedExecutionLevel = getInput(
    'requested-execution-level'
  ) as typeof executionLevels[number]
  const applicationManifest = getInput('application-manifest')

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
