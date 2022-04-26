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
  labels: { [key: string]: string }
  tagsFQN: string[]
}

export type Image = {
  registry: string
  name: string
  tag: string
}

export async function dockerBuild({
  dockerfile,
  labels,
  tagsFQN,
}: BuildOptions) {
  info('Building image...')

  // Concat list of labels
  const labelOptions = Object.entries(labels)
    .map(([key, value]) => `--label "${key}=${value}"`)
    .join(' ')

  // Concat list of tags
  const tagOptions = tagsFQN.map((tag) => `--tag "${tag}"`).join(' ')

  const cmd = `docker build -f ${dockerfile} ${tagOptions} ${labelOptions} .`
  debug(`Executing command:\n${cmd}`)

  await exec(cmd)
}

export async function dockerRetag(off, on: Image) {
  info('Retagging image...')

  const offFQN = getImageFQN(off)
  const onFQN = getImageFQN(on)

  const setTag = `docker tag ${offFQN} "${onFQN}"`
  debug(`Executing command:\n${setTag}`)
  await exec(setTag)

  const removeTag = `docker rmi ${offFQN}`
  debug(`Executing command:\n${removeTag}`)
  await exec(removeTag)
}

export async function dockerPush(repository: string) {
  info('Pushing image...')

  const cmd = `docker push ${repository} --all-tags`
  debug(`Executing command:\n${cmd}`)

  await exec(cmd)
}

export async function dockerPush2(image: Image) {
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

function getImageFQN(image: Image) {
  return `${image.registry}/${image.name}:${image.tag}`
}
