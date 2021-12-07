import { debug } from '@actions/core'
import { HttpClient } from '@actions/http-client'
import FormData from 'form-data'
import { createReadStream, lstatSync } from 'fs'
import { getType } from 'mime'
import { basename } from 'path'
import { z } from 'zod'

export type AnalysisResult = Awaited<ReturnType<VirusTotal['scanFile']>>

const UploadData = z.object({
  data: z.object({
    id: z.string(),
    type: z.string(),
  }),
})

const VIRUSTOTAL_BASE_URL = 'https://www.virustotal.com/api/v3'

export class VirusTotal {
  private httpClient = new HttpClient()

  constructor(private apiKey: string | undefined) {}

  async scanFile(path: string) {
    const url = `${VIRUSTOTAL_BASE_URL}/files`
    const formData = new FormData()

    const { filename, mimeType, size, readStream } = asset(path)
    formData.append('file', readStream, {
      filename,
      contentType: mimeType,
      knownLength: size,
    })

    const response = await this.httpClient.sendStream('POST', url, formData, {
      'x-apikey': this.apiKey,
      ...formData.getHeaders(),
    })
    const responseRaw = await response.readBody()
    const responseJson = JSON.parse(responseRaw)
    debug(
      `Received response from VirusTotal:\n${JSON.stringify(
        responseJson,
        undefined,
        2
      )}`
    )
    const responseData = UploadData.parse(responseJson).data

    return {
      ...responseData,
      filename,
      url: `https://www.virustotal.com/gui/file-analysis/${responseData.id}/detection`,
    }
  }
}

export function asset(path: string) {
  return {
    filename: basename(path),
    mimeType: mimeOrDefault(path),
    size: lstatSync(path).size,
    readStream: createReadStream(path),
  }
}

export function mimeOrDefault(path: string) {
  return getType(path) || 'application/octet-stream'
}
