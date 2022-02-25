declare module 'probot-settings/lib/settings' {
  import type { getOctokit } from '@actions/github'

  type Repo = {
    owner: string
    repo: string
  }
  type Config = {}

  class Settings {
    static sync(
      ...args: ConstructorParameters<typeof Settings>
    ): ReturnType<Settings['update']>

    static sync(
      github: ReturnType<typeof getOctokit>,
      repo: Repo,
      config: Config
    ): Settings

    constructor(
      github: ReturnType<typeof getOctokit>,
      repo: Repo,
      config: Config
    )

    update(): Promise<unknown>
  }

  export default Settings
}
