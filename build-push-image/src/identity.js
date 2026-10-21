// Keep build identity independent of the workflow event: a dispatch can build an older commit.
export function buildIdentity({ checkout, expected, outputTag, fallbackTag }) {
  if (!/^[a-f0-9]{40}$/.test(checkout))
    throw new Error('Cannot determine checkout SHA')
  if (expected && expected !== checkout)
    throw new Error('Checkout differs from source-revision')
  if (expected && !outputTag)
    throw new Error(
      'An explicit source-revision requires a candidate output-tag',
    )
  if (
    outputTag &&
    !/^candidate-[A-Za-z0-9_][A-Za-z0-9_.-]{0,116}$/.test(outputTag)
  ) {
    throw new Error(
      'output-tag must be a unique candidate-* tag (maximum 127 characters)',
    )
  }
  return { revision: checkout, tag: outputTag || fallbackTag }
}
