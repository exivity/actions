import { getExecOutput } from '@actions/exec'
import { EOL } from 'os'
import semver from 'semver'

async function execGit(command: string, silent = true) {
  return (await getExecOutput(command, undefined, { silent })).stdout
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
