import { info } from '@actions/core'
import { exec } from '@actions/exec'
import { join } from 'path'

const S3_BUCKET = 'exivity'
const S3_PREFIX = 'build'
const S3_REGION = 'eu-central-1'

type Options = {
  component: string
  sha: string
  suffix?: string
  path: string
}

export async function downloadS3object({
  component,
  sha,
  suffix,
  path,
}: Options) {
  const src = `s3://${S3_BUCKET}/${S3_PREFIX}/${component}/${sha}${
    suffix ? `/${suffix}` : ''
  }`
  const dest = join(process.env['GITHUB_WORKSPACE'], path)
  const cmd = `aws s3 cp --recursive --region ${S3_REGION} "${src}" "${dest}"`

  info(`About to execute ${cmd}`)

  await exec(cmd)
}
