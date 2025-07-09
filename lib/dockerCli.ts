import { debug, info } from '@actions/core'
import { exec } from '@actions/exec'

type LoginOptions = {
  registry: string
  user: string
  password: string
}

export async function dockerLogin({ registry, user, password }: LoginOptions) {
  info(`Logging in to Docker registry "${registry}"...`)

  const cmd =
    'bash -c "echo $REGISTRY_PASSWORD | docker login $REGISTRY -u $REGISTRY_USER --password-stdin"'
  debug(`Executing command:\n${cmd}`)

  await exec(cmd, undefined, {
    env: {
      ...process.env,
      REGISTRY: registry,
      REGISTRY_USER: user,
      REGISTRY_PASSWORD: password,
    },
  })
}

type BuildOptions = {
  dockerfile: string
  context: string
  labels: { [key: string]: string }
  image: Image
  imageName: string
  useSSH: boolean
  buildArgs?: string // Changed to a simple string
  target?: string // Add target for specifying build stage
  platforms?: string
  push?: boolean
  sbom?: boolean // Add SBOM support
}

export type Image = {
  registry: string
  namespace: string
  name: string
  tag: string
}

export async function dockerBuild({
  dockerfile,
  context,
  labels,
  imageName,
  image,
  useSSH,
  secrets,
  buildArgs,
  target,
  platforms,
  push,
  sbom,
}: BuildOptions & { secrets?: string }): Promise<{ digest?: string; image: string; metadata: any }> {
  info('Building image...')

  const labelOptions = Object.entries(labels)
    .map(([key, value]) => `--label "${key}=${value}"`)
    .join(' ')

  const ssh = useSSH ? '--ssh default' : ''
  const secretArgs = secrets ? `--secret ${secrets}` : ''
  const buildArgsOptions = buildArgs ? `--build-arg ${buildArgs}` : ''
  const targetOption = target ? `--target ${target}` : ''
  const platformsOption = platforms ? `--platform ${platforms}` : ''
  const pushOption = push ? '--push' : ''
  const loadOption =
    !push && (!platforms || platforms.split(',').length <= 1) ? '--load' : ''
  const sbomOption = sbom ? '--sbom=true' : ''

  const nameOfImage = imageName ? imageName : getImageFQN(image)
  
  // Add metadata output to capture build information
  const metadataOption = '--metadata-file /tmp/docker-build-metadata.json'
  
  // Correct command structure with context at the end
  const cmd = `/usr/bin/bash -c "docker buildx build ${ssh} ${secretArgs} ${buildArgsOptions} ${targetOption} ${platformsOption} ${sbomOption} ${metadataOption} -f ${dockerfile} -t ${nameOfImage} ${labelOptions} ${context} ${pushOption} ${loadOption}"`
  debug(`Executing command:\n${cmd}`)

  let buildOutput = ''
  await exec(cmd, undefined, {
    env: {
      ...process.env,
      DOCKER_BUILDKIT: '1',
    },
    listeners: {
      stdout: (data: Buffer) => {
        buildOutput += data.toString()
      }
    }
  })

  const finalImageName = imageName || getImageFQN(image)
  
  // Try to read build metadata
  let metadata: any = {}
  let digest: string | undefined

  try {
    const fs = require('fs')
    if (fs.existsSync('/tmp/docker-build-metadata.json')) {
      const metadataContent = fs.readFileSync('/tmp/docker-build-metadata.json', 'utf8')
      metadata = JSON.parse(metadataContent)
      
      // Extract digest from metadata
      if (metadata['containerimage.digest']) {
        digest = metadata['containerimage.digest']
      }
    }
  } catch (error) {
    debug(`Could not read build metadata: ${error}`)
  }

  // If metadata file doesn't exist, try to extract digest from build output
  if (!digest && buildOutput) {
    const digestMatch = buildOutput.match(/digest:\s*(sha256:[a-f0-9]{64})/i)
    if (digestMatch) {
      digest = digestMatch[1]
    }
  }

  return { digest, image: finalImageName, metadata }
}

export async function dockerAddTag(off: Image, on: Image) {
  info('Retagging image...')

  const offFQN = getImageFQN(off)
  const onFQN = getImageFQN(on)

  const setTag = `docker tag ${offFQN} "${onFQN}"`
  debug(`Executing command:\n${setTag}`)
  await exec(setTag)
}

export async function dockerPush(image: Image) {
  info('Pushing image...')

  const cmd = `docker push ${getImageFQN(image)}`
  debug(`Executing command:\n${cmd}`)

  await exec(cmd)
}

export async function dockerPull(image: Image) {
  info('Pulling image...')

  const cmd = `docker pull ${getImageFQN(image)}`
  debug(`Executing command:\n${cmd}`)

  await exec(cmd)
}

export function getImageFQN(image: Image) {
  return `${image.registry}/${image.namespace}/${image.name}:${image.tag}`
}
