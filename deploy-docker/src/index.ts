import { promises as fs } from 'fs'
import { getInput, setFailed } from '@actions/core'
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
  const dockerfile = getInput('dockerfile') || './Dockerfile'
  const ghToken = getToken()

  const [awsKeyId, awsSecretKey] = getAWSCredentials()

  const imageVersion = (
    process.env['GITHUB_REF']?.slice(0, 10) == 'refs/tags/'
      ? process.env['GITHUB_REF']
      : process.env['GITHUB_REF']
  )
    ?.split('/')
    .reverse()[0]
  console.log(`Image version will be: ${imageVersion}`)
  const compVersion =
    process.env['GITHUB_REF']?.slice(0, 10) == 'refs/tags/'
      ? process.env['GITHUB_REF']?.slice(10)
      : process.env['GIHUB_SHA']
  console.log(`Component version will be: ${compVersion}`)

  console.log('Writing metadata to metadata.json')
  await fs.writeFile(
    './metadata.json',
    JSON.stringify({ version: compVersion })
  )

  const sha = await getShaFromRef({
    octokit: getOctokit(ghToken),
    component: 'env-to-config',
    ref: 'main',
  })

  console.log('Downloading env-to-config')
  await downloadS3object({
    component: 'env-to-config',
    sha,
    usePlatformPrefix: true,
    prefix: undefined,
    path: `.`,
    awsKeyId,
    awsSecretKey,
  })

  console.log('Logging in to Docker Hub')
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

  let privateKeyArg = ''
  if (privateKey) {
    privateKeyArg = '--build-arg PRIVATE_KEY="$PRIVATE_KEY" '
  }

  console.log('Running docker build')
  !dryRun &&
    (await exec(
      `docker build -f ${dockerfile} ${privateKeyArg}--tag exivity/${component}:${imageVersion} .`,
      undefined,
      {
        env: {
          ...process.env,
          PRIVATE_KEY: privateKey,
        },
      }
    ))

  console.log('Pushing to docker hub')
  !dryRun && (await exec(`docker push exivity/${component}:${imageVersion}`))

  if (process.env['GITHUB_REF']?.slice(11) === 'develop' && !dryRun) {
    console.log('running on develop, so also pushing as latest')
    await exec(
      `docker tag exivity/${component}:${imageVersion} exivity/${component}:latest`
    )
    await exec(`docker push exivity/${component}:latest`)
  }
}

run().catch(setFailed)
