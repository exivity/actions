import * as yaml from 'yaml'
import * as fs from 'fs'

import { createOrUpdateFileContents, createPR } from '../github-api'
import { RepoData, retrieveWorkflowFiles } from '../repo-data'
import { createBranch } from '../utils'

async function getDependabotFile(): Promise<Map<string, any>> {
  const file = await fs.promises.readFile('dependabot-blocks.yaml', 'utf8')

  try {
    return yaml.parse(file)
  } catch {
    throw `Error parsing dependabot-blocks as yaml`
  }
}

async function makeDependabot(repo: RepoData): Promise<string> {
  const blocks = await getDependabotFile()

  const dependabot = {
    version: 2,
    updates: [] as any[],
  }

  if (repo.workflowFiles?.length ?? 0 > 0) {
    dependabot.updates.push(blocks['githubactions'])
  }

  if (repo.rootFiles?.find((file) => file.name === 'Dockerfile')) {
    dependabot.updates.push(blocks['docker'])
  }

  for (let topic of repo.topics ?? []) {
    topic = topic.toLowerCase().replace(/-/g, '')
    if (topic in blocks) {
      dependabot.updates.push(blocks[topic])
    }
  }

  return yaml.stringify(dependabot)
}

export async function addDependabot(
  repo: RepoData,
): Promise<string | undefined> {
  if (
    repo.githubFiles?.find((file) => file.name == 'dependabot.yml') ||
    !repo.topics
  ) {
    return
  }

  console.log(`Creating dependabot.yml for ${repo.name}`)

  const dependabot = await makeDependabot(repo)

  const branchName = 'chore/dev-ops-maintenance'
  const commitMessage = 'chore(devOps): automated adding dependabot.yml'

  await createBranch(repo, branchName)

  const encodedContent = Buffer.from(dependabot).toString('base64')
  await createOrUpdateFileContents(
    repo.name,
    '.github/dependabot.yml',
    encodedContent,
    commitMessage,
    branchName,
  )

  const prData = await createPR(
    repo.name,
    'chore(devOps): automated adding dependabot.yml',
    branchName,
    repo.default_branch!,
    `This PR adds a default dependabot.yml file to ${repo.name}, please check if anything was missed.`,
  )

  return prData.html_url
}
