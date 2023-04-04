import { info } from 'console'
import { debug, getOctoKitClient } from './inputs'

export const logIssues = (issues: { issue: string }[]) => {
  info(`Issues:`)
  issues.forEach(({ issue }) => {
    info(issue)
  })
  debug(`Issues: ${JSON.stringify(issues, null, 2)}`)
}

export const logAvailableRequests = async () => {
  const octokit = getOctoKitClient()
  const core = (await octokit.request('GET /rate_limit', {})).data.resources
    .core

  info(
    `Remaining github API calls: ${
      core.remaining
    }. Rate limit will reset at ${new Date(
      core.reset * 1000
    ).toLocaleTimeString()}.`
  )
}
