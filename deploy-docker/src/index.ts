import { promises as fs } from 'fs'
import { getInput, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getBooleanInput } from '../../lib/core'
import {
  getShaFromRef,
  getToken,
  getRepository,
  getRef,
} from '../../lib/github'
import { downloadS3object, getAWSCredentials } from '../../lib/s3'
import { exec } from '@actions/exec'

const METADATA_FILENAME = 'metadata.json'

async function run() {
  const { component: defaultComponent } = getRepository()
  const component = getInput('component') || defaultComponent
  const dockerUser = getInput('docker-user', { required: true })
  const dockerPassword = getInput('docker-password', { required: true })
  const dryRun = getBooleanInput('dry-run', false)
  const privateKey = getInput('private-key')
  const dockerfile = getInput('dockerfile') || './Dockerfile'
  const ghToken = getToken()

  const [awsKeyId, awsSecretKey] = getAWSCredentials()

  const imageVersion = getRef().split('/').reverse()[0]
  console.log(`Image version will be: ${imageVersion}`)
  const componentVersion =
    process.env['GITHUB_REF']?.slice(0, 10) == 'refs/tags/'
      ? process.env['GITHUB_REF']?.slice(10)
      : process.env['GIHUB_SHA']
  console.log(`Component version will be: ${componentVersion}`)

  console.log(`Writing metadata to ${METADATA_FILENAME}`)
  await fs.writeFile(
    './' + METADATA_FILENAME,
    JSON.stringify({ version: componentVersion })
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
    'bash -c "echo $DOCKER_HUB_TOKEN | docker login -u $DOCKER_HUB_USER --password-stdin"',
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

  if (getRef() === 'develop' && !dryRun) {
    console.log('running on develop, so also pushing as latest')
    await exec(
      `docker tag exivity/${component}:${imageVersion} exivity/${component}:latest`
    )
    await exec(`docker push exivity/${component}:latest`)
  }
}

run().catch(setFailed)
