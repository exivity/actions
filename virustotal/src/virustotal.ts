import { debug } from '@actions/core'
import { HttpClient } from '@actions/http-client'
import FormData from 'form-data'
import { createReadStream, lstatSync } from 'fs'
import { getType } from 'mime'
import { basename } from 'path'
import { z } from 'zod'

export type AnalysisResult = Awaited<ReturnType<VirusTotal['uploadFile']>>

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
  }),
})

const FileData = z.object({
  data: z.object({
    id: z.string(),
    type: z.string(),
    attributes: z.object({
      md5: z.string(),
    }),
  }),
})

const VIRUSTOTAL_BASE_URL = 'https://www.virustotal.com/api/v3'

export function filehashToGuiUrl(filehash: string) {
  return `https://www.virustotal.com/gui/file/${filehash}`
}

export function guiUrlToFilehash(url: string) {
  return url.split('/').pop() as string
}

export function analysisIdToFilehash(id: string) {
  return Buffer.from(id, 'base64').toString().split(':')[0]
}

export class VirusTotal {
  private httpClient = new HttpClient()

  constructor(private apiKey: string | undefined) {}

  /**
   * Upload and analyse a file
   * https://developers.virustotal.com/reference/files-scan
   */
  async uploadFile(path: string, url = `${VIRUSTOTAL_BASE_URL}/files`) {
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
    debug(`Received response from VirusTotal:\n${responseRaw}`)
    let responseJson: any
    try {
      responseJson = JSON.parse(responseRaw)
      debug(
        `Parsed response from VirusTotal:\n${JSON.stringify(
          responseJson,
          undefined,
          2,
        )}`,
      )
    } catch (error) {
      throw new Error('Could parse read VirusTotal response')
    }
    const responseData = UploadData.parse(responseJson).data

    return {
      filehash: analysisIdToFilehash(responseData.id),
      filename,
      status: 'pending' as 'pending' | 'completed',
      flagged: null as number | null,
    }
  }

  /**
   * Get a URL for uploading files larger than 32MB
   * https://developers.virustotal.com/reference/files-upload-url
   */
  async getFileUploadURL() {
    const url = `${VIRUSTOTAL_BASE_URL}/files/upload_url`
    const response = await this.httpClient.getJson<{
      data: string
    }>(url, {
      'x-apikey': this.apiKey,
    })
    debug(
      `Received response from VirusTotal:\n${JSON.stringify(
        response,
        undefined,
        2,
      )}`,
    )
    if (!response.result) {
      throw new Error(`Could not obtain a file upload URL`)
    }

    return response.result.data
  }

  /**
   * Retrieve information about a file
   * https://developers.virustotal.com/reference/file-info
   */
  async getFileReport(filehash: string) {
    const url = `${VIRUSTOTAL_BASE_URL}/files/${filehash}`
    const response = await this.httpClient.getJson<{
      data: { attributes: FileResult }
    }>(url, {
      'x-apikey': this.apiKey,
    })
    debug(
      `Received response from VirusTotal:\n${JSON.stringify(
        response,
        undefined,
        2,
      )}`,
    )
    if (!response.result) {
      throw new Error(`No result found for ${filehash}`)
    }

    const flagged =
      response.result.data.attributes.last_analysis_stats.malicious +
      response.result.data.attributes.last_analysis_stats.suspicious

    return {
      filehash: filehash,
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
