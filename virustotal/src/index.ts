import { debug, getInput, info, setFailed } from '@actions/core'
import glob from 'glob-promise'
import { VirusTotal } from './virustotal'

async function analyse(vt: VirusTotal, filePath: string) {
  const result = await vt.scanFile(filePath)
  info(`File "${filePath}" has been scanned`)
  info(JSON.stringify(result, undefined, 2))
}

async function run() {
  // Inputs
  const path = getInput('path', { required: true })
  const virustotalApiKey = getInput('virustotal_api_key', {
    required: true,
  })

  const vt = new VirusTotal(virustotalApiKey)

  // Obtain absolute paths
  const absPaths = await glob(path, { absolute: true })
  debug(`Absolute path to file(s): "${absPaths.join(', ')}"`)

  for (const absPath of absPaths) {
    await analyse(vt, absPath)
  }
}

run().catch(setFailed)
