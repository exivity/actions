import { getExecOutput } from '@actions/exec'
import { EOL } from 'os'
import semver from 'semver'

async function execGit(command: string, args?: string[], silent = false) {
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

export async function gitSwitchBranch(branch: string) {
  return execGit('git checkout -b', [branch])
}

export async function gitAdd() {
  return execGit('git add .')
}

export async function gitSetAuthor(name: string, email: string) {
  await execGit('git config --global user.name', [name])
  await execGit('git config --global user.email', [email])
}

export async function gitCommit(message: string) {
  return execGit('git commit --no-verify --message', [message])
}

export async function gitPush(force = false) {
  // This will infer the origin my_branch part, thus you can do `git push -u`
  await execGit('git config --global push.default current')
  return execGit('git push --set-upstream', [force ? '--force' : ''])
}

export async function gitHasChanges() {
  return (await execGit('git status --porcelain')).length > 0
}

export async function gitReset(branch: string, hard = false) {
  return execGit('git reset', [hard ? '--hard' : '', branch])
}
