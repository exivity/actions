import { info } from '@actions/core'

import {
  getFileContent,
  RepoData,
  deleteRef,
  getRef,
  createRef,
  createOrUpdateFileContents,
  createPR,
} from '../github-api'

export async function updateRepoWorkflows(
  repoData: RepoData,
  workflowFiles: any[],
  searchPattern: string,
  replacePattern: string,
) {
  const branchName = 'chore/dev-ops-maintenance'
  const commitMessage = 'chore(devOps): automated maintenance'

  const defaultBranch = repoData.default_branch
  const repoName = repoData.name

  if (!defaultBranch) {
    info(
      `Error processing repository ${repoData.name}: repository does not have a default branch`,
    )
    return null
  }

  // Create a new branch from default branch
  const refData = await getRef(repoName, `heads/${defaultBranch}`)

  await createRef(repoName, `refs/heads/${branchName}`, refData.object.sha)

  let filesChanged = 0

  await Promise.all(
    workflowFiles.map(async (file) => {
      const content = await getFileContent('exivity', repoName, file.path)
      if (content && content.includes(searchPattern)) {
        const updatedContent = content.replace(
          new RegExp(searchPattern, 'g'),
          replacePattern,
        )
        if (updatedContent !== content) {
          const encodedContent = Buffer.from(updatedContent).toString('base64')
          await createOrUpdateFileContents(
            repoName,
            file.path,
            encodedContent,
            commitMessage,
            file.sha,
            branchName,
          )
          filesChanged++
        }
      }
    }),
  )

  if (filesChanged > 0) {
    // Create a pull request
    const prData = await createPR(
      repoName,
      'chore(devOps): automated maintenance',
      branchName,
      defaultBranch,
      `This PR replaces occurrences of "${searchPattern}" with "${replacePattern}" in workflow files.`,
    )
    return prData.html_url
  } else {
    // Delete branch if no changes were made
    await deleteRef(repoName, branchName)
    return null
  }
}
