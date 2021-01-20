import { promises as fsPromises } from 'fs'

export async function getEventData() {
  const fileData = await fsPromises.readFile(process.env['GITHUB_EVENT_PATH'], {
    encoding: 'utf8',
  })

  return JSON.parse(fileData)
}
