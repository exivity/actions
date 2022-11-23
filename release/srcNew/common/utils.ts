import { info } from 'console'

export const logIssues = (issues: { issue: string }[]) => {
  info(`Issues:`)
  issues.forEach(({ issue }) => {
    info(issue)
  })
}
