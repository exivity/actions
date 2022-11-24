import { tagAllRepositories } from './common/gitActions'

export async function release() {
  await tagAllRepositories()
}
