import deepmerge from 'deepmerge'

function findMatchingIndex(sourceItem: any, target: any) {
  if (Object.prototype.hasOwnProperty.call(sourceItem, 'name')) {
    return target
      .filter((targetItem: any) =>
        Object.prototype.hasOwnProperty.call(targetItem, 'name'),
      )
      .findIndex((targetItem: any) => sourceItem.name === targetItem.name)
  }
}

export function arrayMerge(target: any, source: any, options: any) {
  const destination = target.slice()

  source.forEach((sourceItem: any) => {
    const matchingIndex = findMatchingIndex(sourceItem, target)
    if (matchingIndex > -1) {
      destination[matchingIndex] = deepmerge(
        target[matchingIndex],
        sourceItem,
        options,
      )
    } else {
      destination.push(sourceItem)
    }
  })

  return destination
}
