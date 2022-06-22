import { getExecOutput } from '@actions/exec'
import { EOL } from 'os'
import semver from 'semver'

async function execGit(command: string, args?: string[], silent = true) {
  return (await getExecOutput(command, args, { silent })).stdout
}

export async function getCommitMessage() {
  return execGit('git log -1 --pretty=format:"%s"')
}

export async function getCommitAuthorName() {
  return execGit('git log -1 --pretty=format:"%an"')
}

export async function getCommitAuthorEmail() {
  return execGit('git log -1 --pretty=format:"%ae"')
}

export async function getAllTags() {
  return (await execGit('git tag')).split(EOL).filter((item) => item)
}

export async function getAllSemverTags() {
  const tags = await getAllTags()
  return tags.filter((tag) => semver.valid(tag))
}

export async function getLatestSemverTag() {
  const semvers = await getAllSemverTags()
  return semver.rsort(semvers)[0]
}

export async function gitCreateBranch(branch: string) {
  return execGit('git checkout -b', [branch])
}

export async function gitAdd() {
  return execGit('git add .')
}

export async function gitCommit(message: string) {
  return execGit('git commit -m', [message])
}

export async function gitPush(force = false) {
  return execGit('git push --set-upstream', [force ? '--force' : ''])
}
