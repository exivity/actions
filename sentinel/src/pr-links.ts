import { getInput } from '@actions/core'
import { getOctoKitClient } from '../../release/src/common/inputs'
import * as fs from 'fs'
import * as path from 'path'

// Helper function to check PR statuses and update links
export async function getUpdatedPrLinks() {
  const octokit = getOctoKitClient()
  const reportFilePath = getInput('report-file')
  const reportPath = path.join(process.cwd(), reportFilePath)
  const prLinks: string[] = []

  if (fs.existsSync(reportPath)) {
    try {
      const reportContent = await fs.promises.readFile(reportPath, 'utf8')
      const linkRegex = /^- \[.*\]\((.*)\)$/gm
      let match
      while ((match = linkRegex.exec(reportContent)) !== null) {
        const prUrl = match[1]
        const prMatch = prUrl.match(
          /https:\/\/github\.com\/exivity\/([^/]+)\/pull\/(\d+)/,
        )
        if (prMatch) {
          const repoName = prMatch[1]
          const prNumber = parseInt(prMatch[2], 10)
          try {
            const { data: prData } = await octokit.rest.pulls.get({
              owner: 'exivity',
              repo: repoName,
              pull_number: prNumber,
            })
            if (prData.state === 'open') {
              prLinks.push(`- [${repoName}](${prUrl})`)
            }
          } catch (error: any) {
            if (error.status !== 404) {
              console.error(
                `Error fetching PR data for ${repoName}#${prNumber}: ${error}`,
              )
            }
            // If status is 404, the PR is not found (possibly merged or closed), so we can ignore it
          }
        }
      }
    } catch (error) {
      console.error(`Error reading report file: ${error}`)
    }
  }

  return prLinks
}

export async function savePrLinks(prLinks: string[]) {
  let prOverview = '' // Initialize prOverview as a string

  if (prLinks.length > 0) {
    prOverview += `## Open Pull Requests\n\n`
    prLinks.forEach((link) => {
      prOverview += `${link}\n`
    })
    prOverview += `\n`
  }

  // Write prOverview to pr-overview.md in the root of the project
  const overviewPath = path.join(process.cwd(), 'pr-overview.md')
  await fs.promises.writeFile(overviewPath, prOverview, 'utf8')
}

export async function updatePROverview() {
  // Update report with PR links, removing links to closed PRs
  const prLinks = await getUpdatedPrLinks()
  await savePrLinks(prLinks)
}
