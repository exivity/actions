export function formatLinkType(type: string) {
  switch (type) {
    case 'commit':
      return 'Commit'
    case 'pr':
      return 'Pull request'
    case 'issues':
      return 'Issue'
    case 'milestone':
      return 'Milestone'
    default:
      return 'Unknown'
  }
}
