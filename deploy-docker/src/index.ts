import { promises as fs } from 'fs'
import { getInput } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getBooleanInput } from '../../lib/core'
import { getShaFromRef, getToken } from '../../lib/github'
import { downloadS3object, getAWSCredentials } from '../../lib/s3'
import { exec } from '@actions/exec'

async function run() {
  const component = getInput('component', { required: true })
  const dockerUser = getInput('docker-user', { required: true })
  const dockerPassword = getInput('docker-password', { required: true })
  const dryRun = getBooleanInput('dry-run', false)
  const privateKey = getInput('private-key')
  const ghToken = getToken()

  const [awsKeyId, awsSecretKey] = getAWSCredentials()

  const imageVersion =
    process.env['GITHUB_REF']?.slice(0, 10) == 'refs/tags/'
      ? process.env['GITHUB_REF']?.slice(10)
      : process.env['GITHUB_REF']?.slice(11)
  const compVersion =
    process.env['GITHUB_REF']?.slice(0, 10) == 'refs/tags/'
      ? process.env['GITHUB_REF']?.slice(10)
      : process.env['GIHUB_SHA']

  const sha = await getShaFromRef({
    octokit: getOctokit(ghToken),
    component: 'env-to-config',
    ref: 'main',
  })

  await downloadS3object({
    component: 'env-to-config',
    sha,
    usePlatformPrefix: true,
    prefix: undefined,
    path: `.`,
    awsKeyId,
    awsSecretKey,
  })

  await exec(
    'echo $DOCKER_HUB_TOKEN | docker login -u $DOCKER_HUB_USER --password-stdin',
    undefined,
    {
      env: {
        ...process.env,
        DOCKER_HUB_TOKEN: dockerPassword,
        DOCKER_HUB_USER: dockerUser,
      },
    }
  )

  await fs.writeFile(
    './metadata.json',
    JSON.stringify({ version: compVersion })
  )

  let privateKeyArg = ''
  if (privateKey) {
    privateKeyArg = '--build-arg PRIVATE_KEY="$PRIVATE_KEY" '
  }

  !dryRun &&
    (await exec(
      `docker build ${privateKeyArg}--tag exivity/${component}:${imageVersion} .`,
      undefined,
      {
        env: {
          ...process.env,
          PRIVATE_KEY: privateKey,
        },
      }
    ))

  !dryRun && (await exec(`docker push exivity/${component}:${imageVersion}`))

  if (process.env['GITHUB_REF']?.slice(11) === 'develop' && !dryRun) {
    await exec(
      `docker tag exivity/${component}:${imageVersion} exivity/${component}:latest`
    )
    await exec(`docker push exivity/${component}:latest`)
  }
}

run()
