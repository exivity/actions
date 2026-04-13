function parseSubtreeSplitSha(message, sourcePath) {
  if (!sourcePath) {
    return null
  }

  const subtreeDirMatch = message.match(/^git-subtree-dir:\s*(.+)$/m)

  if (!subtreeDirMatch || subtreeDirMatch[1].trim() !== sourcePath) {
    return null
  }

  const subtreeSplitMatch = message.match(
    /^git-subtree-split:\s*([0-9a-f]{7,40})$/im,
  )

  return subtreeSplitMatch ? subtreeSplitMatch[1] : null
}

function buildLegacyBridgeRanges({
  component,
  sourceRepo,
  sourcePath,
  releasedSha,
  sourceCommits,
}) {
  if (sourceRepo === component || !sourcePath) {
    return []
  }

  const seen = new Set()

  return sourceCommits.flatMap((commit) => {
    const splitSha = parseSubtreeSplitSha(commit.commit.message, sourcePath)

    if (!splitSha) {
      return []
    }

    const key = `${component}:${releasedSha}:${splitSha}`

    if (seen.has(key)) {
      return []
    }

    seen.add(key)

    return [
      {
        repo: component,
        baseSha: releasedSha,
        headSha: splitSha,
      },
    ]
  })
}

module.exports = {
  parseSubtreeSplitSha,
  buildLegacyBridgeRanges,
}
