import {
  getFileContent,
  deleteRef,
  createOrUpdateFileContents,
  createPR,
} from '../github-api'
import { RepoData } from '../repo-data'
import { createBranch } from '../utils'

export async function updateRepoWorkflows(
  repoData: RepoData,
  searchPattern: string,
  replacePattern: string,
) {
  const branchName = 'chore/dev-ops-maintenance'
  const commitMessage = 'chore(devOps): automated maintenance'

  await createBranch(repoData, branchName)

  let filesChanged = 0

  await Promise.all(
    (repoData.workflowFiles ?? []).map(async (file) => {
      const content = await getFileContent('exivity', repoData.name, file.path)
      if (content && content.includes(searchPattern)) {
        const updatedContent = content.replace(
          new RegExp(searchPattern, 'g'),
          replacePattern,
        )
        if (updatedContent !== content) {
          const encodedContent = Buffer.from(updatedContent).toString('base64')
          await createOrUpdateFileContents(
            repoData.name,
            file.path,
            encodedContent,
            commitMessage,
            branchName,
            file.sha,
          )
          filesChanged++
        }
      }
    }),
  )

  if (filesChanged > 0) {
    // Create a pull request
    const prData = await createPR(
      repoData.name,
      'chore(devOps): automated maintenance',
      branchName,
      repoData.default_branch!,
      `This PR replaces occurrences of "${searchPattern}" with "${replacePattern}" in workflow files.`,
    )
    return prData.html_url
  } else {
    // Delete branch if no changes were made
    await deleteRef(repoData.name, branchName)
    return null
  }
}
