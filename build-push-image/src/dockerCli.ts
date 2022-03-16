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

type PushOptions = {
  repository: string
}

export async function dockerPush({ repository }: PushOptions) {
  info('Pushing image...')

  const cmd = `docker push ${repository} --all-tags`
  debug(`Executing command:\n${cmd}`)

  await exec(cmd)
}
