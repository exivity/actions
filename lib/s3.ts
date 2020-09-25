import { info } from '@actions/core'
import { exec } from '@actions/exec'
import { platform } from 'os'
import { resolve } from 'path'

const S3_BUCKET = 'exivity'
const S3_PREFIX = 'build'
const S3_REGION = 'eu-central-1'

type S3Options = {
  component: string
  sha: string
  usePlatformPrefix?: boolean
  prefix?: string
}

type Options = S3Options & {
  path: string
  awsKeyId: string
  awsSecretKey: string
}

function getS3url({ component, sha, usePlatformPrefix, prefix }: S3Options) {
  const platformPrefix = platform() === 'win32' ? 'windows' : 'linux'
  return `s3://${S3_BUCKET}/${S3_PREFIX}/${component}/${sha}${
    usePlatformPrefix ? `/${platformPrefix}` : ''
  }${prefix ? `/${prefix}` : ''}`
}

export async function downloadS3object({
  component,
  sha,
  usePlatformPrefix,
  prefix,
  path,
  awsKeyId,
  awsSecretKey,
}: Options) {
  const src = getS3url({ component, sha, usePlatformPrefix, prefix })
  const dest = resolve(process.env['GITHUB_WORKSPACE'], path)
  const cmd = `aws s3 cp --recursive --region ${S3_REGION} "${src}" "${dest}"`

  info(`About to execute ${cmd}`)

  await exec(cmd, undefined, {
    env: {
      AWS_ACCESS_KEY_ID: awsKeyId,
      AWS_SECRET_ACCESS_KEY: awsSecretKey,
    },
  })
}

export async function uploadS3object({
  component,
  sha,
  usePlatformPrefix,
  prefix,
  path,
  awsKeyId,
  awsSecretKey,
}: Options) {
  const src = resolve(process.env['GITHUB_WORKSPACE'], path)
  const dest = getS3url({ component, sha, usePlatformPrefix, prefix })
  const cmd = `aws s3 cp --recursive --region ${S3_REGION} "${src}" "${dest}"`

  info(`About to execute ${cmd}`)

  await exec(cmd, undefined, {
    env: {
      AWS_ACCESS_KEY_ID: awsKeyId,
      AWS_SECRET_ACCESS_KEY: awsSecretKey,
    },
  })
}
