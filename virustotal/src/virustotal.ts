import { debug } from '@actions/core'
import { HttpClient } from '@actions/http-client'
import FormData from 'form-data'
import { createReadStream, lstatSync } from 'fs'
import { getType } from 'mime'
import { basename } from 'path'
import { z } from 'zod'

export type AnalysisResult = Awaited<ReturnType<VirusTotal['scanFile']>>

export type FileResult = {
  names: string[]
  last_analysis_results: {
    [vendor: string]: {
      category: string
      engine_name: string
      engine_update: string
      engine_version: string
      method: string
      result: string | null
    }
  }
  last_analysis_stats: {
    'confirmed-timeout': number
    failure: number
    harmless: number
    malicious: number
    suspicious: number
    timeout: number
    'type-unsupported': number
    undetected: number
  }
}

const UploadData = z.object({
  data: z.object({
    id: z.string(),
    type: z.string(),
    attributes: z.object({
      md5: z.string(),
    }),
  }),
})

const VIRUSTOTAL_BASE_URL = 'https://www.virustotal.com/api/v3'

export function md5ToGuiUrl(md5: string) {
  return `https://www.virustotal.com/gui/file/${md5}`
}

export function guiUrlToMd5(url: string) {
  // TODO: this is a hack
  return Buffer.from(url.split('/').splice(-2, 1)[0], 'base64').toString()
  // return url.split('/').pop() as string
}

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
      md5: responseData.attributes.md5,
      filename,
      status: 'pending' as 'pending' | 'completed',
      flagged: null as number | null,
    }
  }

  async getFileReport(md5: string) {
    const url = `${VIRUSTOTAL_BASE_URL}/files/${md5}`
    const response = await this.httpClient.getJson<{
      data: { attributes: FileResult }
    }>(url, {
      'x-apikey': this.apiKey,
    })
    debug(
      `Received response from VirusTotal:\n${JSON.stringify(
        response,
        undefined,
        2
      )}`
    )
    if (!response.result) {
      throw new Error(`No result found for ${md5}`)
    }

    const flagged =
      response.result.data.attributes.last_analysis_stats.malicious +
      response.result.data.attributes.last_analysis_stats.suspicious

    return {
      md5,
      filename: response.result.data.attributes.names[0],
      status: 'completed',
      flagged,
    } as AnalysisResult
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
