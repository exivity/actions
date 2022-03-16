import { getInput, info } from '@actions/core'
import { exec } from '@actions/exec'
import { promises as fsPromises } from 'fs'
import { platform } from 'os'
import { basename, resolve } from 'path'
import { getWorkspacePath } from './github'

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
  const workspacePath = getWorkspacePath()
  const src = getS3url({ component, sha, usePlatformPrefix, prefix })
  const dest = resolve(workspacePath, path)
  const cmd = `aws s3 cp --recursive --region ${S3_REGION} "${src}" "${dest}"`

  info(`About to execute ${cmd}`)

  await exec(cmd, undefined, {
    env: {
      ...process.env,
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
  const workspacePath = getWorkspacePath()
  const src = resolve(workspacePath, path)
  const isDirectory = (await fsPromises.lstat(src)).isDirectory()

  const dest = getS3url({
    component,
    sha,
    usePlatformPrefix,
    prefix,
  })

  const cmd = [
    'aws',
    's3',
    'cp',
    isDirectory ? '--recursive' : '',
    '--region',
    S3_REGION,
    `"${src}"`,
    isDirectory ? `"${dest}"` : `"${dest}/${basename(path)}"`,
  ]
    .filter((item) => item)
    .join(' ')

  await exec(cmd, undefined, {
    env: {
      ...process.env,
      AWS_ACCESS_KEY_ID: awsKeyId,
      AWS_SECRET_ACCESS_KEY: awsSecretKey,
    },
  })
}

export function getAWSCredentials() {
  const awsKeyId = getInput('aws-access-key-id')
  const awsSecretKey = getInput('aws-secret-access-key')

  // Assertions
  if (!awsKeyId || !awsSecretKey) {
    throw new Error('A required AWS input is missing')
  }

  return [awsKeyId, awsSecretKey]
}
