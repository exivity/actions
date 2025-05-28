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
  platforms?: string // Add platforms for multi-arch builds
  secrets?: string // Add secrets for Docker build
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
}: BuildOptions) {
  info('Building image...')

  const labelOptions = Object.entries(labels)
    .map(([key, value]) => `--label "${key}=${value}"`)
    .join(' ')

  const ssh = useSSH ? '--ssh default' : ''
  const secretArgs = secrets ? `--secret ${secrets}` : ''
  const buildArgsOptions = buildArgs ? `--build-arg ${buildArgs}` : ''
  const targetOption = target ? `--target ${target}` : ''
  const nameOfImage = imageName ? imageName : getImageFQN(image)

  // Check if multi-platform build is requested
  const isMultiPlatform = platforms && platforms.includes(',')
  const platformsOption = platforms ? `--platform ${platforms}` : ''

  let cmd = ''

  if (isMultiPlatform) {
    // For multi-platform builds, we need to set up a builder with docker-container driver
    info('Setting up multi-platform builder...')
    await exec(
      'docker buildx create --name multiplatform-builder --driver docker-container --use || true',
    )

    // For multi-platform builds, we use docker buildx with --push
    cmd = `/usr/bin/bash -c "docker buildx build ${ssh} ${secretArgs} ${buildArgsOptions} ${targetOption} ${platformsOption} -f ${dockerfile} -t ${nameOfImage} ${labelOptions} --push ${context}"`
  } else {
    // For single platform builds, use the existing approach
    cmd = `/usr/bin/bash -c "docker buildx build ${ssh} ${secretArgs} ${buildArgsOptions} ${targetOption} ${platformsOption} -f ${dockerfile} -t ${nameOfImage} ${labelOptions} ${context}"`
  }

  debug(`Executing command:\n${cmd}`)

  await exec(cmd, undefined, {
    env: {
      ...process.env,
      DOCKER_BUILDKIT: '1',
    },
  })

  // Return whether this was a multi-platform build that was already pushed
  return { pushed: isMultiPlatform }
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
