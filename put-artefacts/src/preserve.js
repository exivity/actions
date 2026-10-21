// A release tag names existing source artifacts. Recompiling that source can
// produce different bytes, so a tag build must never write to its SHA prefix.
export async function preserveTagArtifacts(ref, exists) {
  if (!ref?.startsWith('refs/tags/')) return false
  if (!(await exists())) {
    throw new Error(
      'Release-tag artifact prefix is missing. Build this source commit on its branch before tagging; tag builds cannot publish or replace source artifacts.',
    )
  }
  return true
}
