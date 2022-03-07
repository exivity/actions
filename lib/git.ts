import { getExecOutput } from '@actions/exec'

async function execGit(command: string, silent = true) {
  return (await getExecOutput(command, undefined, { silent })).stdout
}

export async function getCommitMessage() {
  return execGit('git log -1 --pretty=format:"%s"')
}

export async function getCommitAuthor() {
  return execGit('git log -1 --pretty=format:"%an"')
}

export async function getCommitEmail() {
  return execGit('git log -1 --pretty=format:"%ae"')
}
