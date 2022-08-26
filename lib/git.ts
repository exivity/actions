import { info } from '@actions/core'
import { EOL } from 'os'
import semver from 'semver'
import { exec } from './core'
import { getRepository } from './github'

export async function getCommitSha() {
  return exec('git log -1 --pretty=format:"%H"')
}

export async function getCommitMessage() {
  return exec('git log -1 --pretty=format:"%s"')
}

export async function getCommitAuthorName() {
  return exec('git log -1 --pretty=format:"%an"')
}

export async function getCommitAuthorEmail() {
  return exec('git log -1 --pretty=format:"%ae"')
}

export async function getAllTags() {
  return (await exec('git tag')).split(EOL).filter((item) => item)
}

export async function getAllSemverTags() {
  const tags = await getAllTags()
  return tags.filter((tag) => semver.valid(tag))
}

export async function getSemverTag(position: number) {
  const semvers = await getAllSemverTags()
  return semver.rsort(semvers)[position]
}

export async function gitFetch(remote: string, branch: string) {
  return exec('git fetch', [remote, branch])
}

export async function gitForceSwitchBranch(
  branch: string,
  startPoint?: string
) {
  return exec('git switch -C', [branch, startPoint || ''])
}

export async function gitAdd() {
  return exec('git add .')
}

export async function gitSetAuthor(name: string, email: string) {
  await exec('git config --global user.name', [name])
  await exec('git config --global user.email', [email])
}

export async function gitCommit(message: string) {
  return exec('git commit --no-verify --message', [message])
}

export async function gitPush(force = false) {
  // This will infer the origin my_branch part, thus you can do `git push -u`
  await exec('git config --global push.default current')
  return exec('git push --set-upstream', [force ? '--force' : ''])
}

export async function gitPushTags() {
  return exec('git push --tags')
}

export async function gitHasChanges() {
  return (await exec('git status --porcelain')).length > 0
}

export async function gitGetLatestCommitInBranch(branch: string) {
  return exec(`git log -n 1 ${branch} --pretty=format:"%H"`)
}

export async function gitHardReset(commit: string) {
  return exec(`git reset --hard ${commit}`)
}

export async function gitTag(tag: string) {
  return exec(`git tag`, [tag])
}

export async function getRecentVersion(versionsSince: number) {
  const repo = getRepository()
  const versionTag = await getSemverTag(versionsSince)
  if (typeof versionTag === 'undefined') {
    throw new Error('Could not determine latest version')
  }
  info(`Latest version in ${repo.fqn}: ${versionTag}`)

  return versionTag
}
