import { debug } from '@actions/core'
import { HttpClient } from '@actions/http-client'
import FormData from 'form-data'
import { createReadStream, lstatSync } from 'fs'
import { getType } from 'mime'
import { basename } from 'path'
import { z } from 'zod'

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

  async scanFile(filename: string) {
    const url = `${VIRUSTOTAL_BASE_URL}/files`
    const formData = new FormData()

    const { name, mimeType, size, readStream } = asset(filename)
    formData.append('file', readStream, {
      filename: name,
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
      url: `https://www.virustotal.com/gui/file-analysis/${responseData.id}/detection`,
    }
  }
}

export function asset(path: string) {
  return {
    name: basename(path),
    mimeType: mimeOrDefault(path),
    size: lstatSync(path).size,
    readStream: createReadStream(path),
  }
}

export function mimeOrDefault(path: string) {
  return getType(path) || 'application/octet-stream'
}
