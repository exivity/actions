# @exivity/actions

**Common actions**

These were originally built for use with the Exivity CI/CD workflows, but can be
applied outside of the context of the Exivity repositories.

- [`build-push-image`](#build-push-image)
- [`commit-status`](#commit-status)
- [`dispatch-workflow`](#dispatch-workflow)
- [`enable-automerge`](#enable-automerge)
- [`init-ssh`](#init-ssh)
- [`postgres`](#postgres)
- [`process-binary`](#process-binary)
- [`purge-ghcr`](#purge-ghcr)
- [`rabbitmq`](#rabbitmq)
- [`rcedit`](#rcedit)
- [`retag-image`](#retag-image)
- [`review`](#review)
- [`semantic-pull-request`](#semantic-pull-request)
- [`sign-file`](#sign-file)
- [`slack`](#slack)
- [`sync-defaults`](#sync-defaults)
- [`virustotal`](#virustotal)

**Exivity specific actions**

These probably don't make much sense outside the context of the Exivity CI/CD
workflows.

- [`accept`](#accept)
- [`db`](#db)
- [`get-artefacts`](#get-artefacts)
- [`release`](#release)
- [`put-artefacts`](#put-artefacts)

---

# `build-push-image`

Builds a container image and pushes it to a Docker registry. It uses the branch
name as the image tag and attaches some simple _opencontainers_ image labels.
The actions also writes a `metadata.json` file containing some basic information
about the image: component name, version (semver tag or git sha) and timestamp.
This file needs to be manually copied into the image in the Dockerfile if
needed.

## Example

```yaml
- uses: exivity/actions/build-push-image@main
```

## Inputs

| name         | required | default          | description                                                                   |
| ------------ | -------- | ---------------- | ----------------------------------------------------------------------------- |
| `namespace`  |          | Repository owner | The namespace of the image repository                                         |
| `name`       |          | Repository name  | The name of the image repository                                              |
| `dockerfile` |          | `"./Dockerfile"` | Path to the Dockerfile                                                        |
| `registry`   |          | `"ghcr.io"`      | Registry to use, e.g. `"ghcr.io"` (default) or `"docker.io"` (for Docker Hub) |
| `user`       |          | `github.actor`   | Username for the Docker registry                                              |
| `password`   |          | `github.token`   | Password for the Docker registry                                              |

# `commit-status`

Writes a
[commit status](https://docs.github.com/en/rest/reference/commits#commit-statuses).

## Example

```yaml
- uses: exivity/actions/commit-status@main
  with:
    context: auto-success
```

## Inputs

| name          | required | default          | description                                                                        |
| ------------- | -------- | ---------------- | ---------------------------------------------------------------------------------- |
| `owner`       |          | Repository owner | The owner of the repo                                                              |
| `repo`        |          | Repository name  | The repo to write the commit status for                                            |
| `sha`         |          | Current sha      | Sha of commit to write the status for                                              |
| `state`       |          | `"success"`      | The commit status state, can be `"error"`, `"failure"`, `"pending"` or `"success"` |
| `context`     | ✅       |                  | A string label to differentiate this status from the status of other systems       |
| `description` |          |                  | A short description of the status                                                  |
| `target_url`  |          |                  | The target URL to associate with this status                                       |
| `gh-token`    |          | `github.token`   | A GitHub token with write access to the component                                  |

# `dispatch-workflow`

Triggers another workflow run. The target workflow must
[define the `on: workflow_dispatch` trigger](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch).

The workflow should either be defined by ID or workflow filename. Look up the ID
of a workflow by calling the GitHub API at:

```
GET https://api.github.com/repos/{owner}/{repo}/actions/workflows
```

## Example

```yaml
- uses: exivity/actions/dispatch-workflow@main
  with:
    workflow:
    gh-token: ${{ secrets.GITHUB_PAT }}
```

## Inputs

| name       | required | default          | description                                                                               |
| ---------- | -------- | ---------------- | ----------------------------------------------------------------------------------------- |
| `owner`    |          | Repository owner | The owner of the target repo                                                              |
| `repo`     |          | Repository name  | The target repo to dispatch the workflow in                                               |
| `ref`      |          | Current ref      | The ref to dispatch the workflow on                                                       |
| `workflow` | ✅       |                  | The workflow (by ID or filename) to dispatch                                              |
| `inputs`   |          |                  | The inputs encoded as JSON string (of type `Record<string, string>`)                      |
| `gh-token` | ✅       |                  | A GitHub PAT with write access to the target repository. The default token can't be used. |

# `enable-automerge`

Enable GitHub automerge for the current PR.

_Based on original work from
[alexwilson/enable-github-automerge-action](https://github.com/alexwilson/enable-github-automerge-action)_

## Example

```yaml
- uses: exivity/actions/enable-automerge@main
  if: ${{ github.actor == 'dependabot[bot]' }}
```

## Inputs

| name           | required | default              | description                                                                                                            |
| -------------- | -------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `merge-method` |          | Default merge method | Merge method to use. Leave empty to use repository's default merge method. One of `"MERGE"`, `"SQUASH"` or `"REBASE"`. |
| `gh-token`     |          | `github.token`       | GitHub token with write access to the repository                                                                       |

# `init-ssh`

Use a private key and prime the known_hosts file with pre-loaded keys for
github.com, gitlab.com and bitbucket.org.

## Example

```yaml
- uses: exivity/actions/init-ssh@main
  with:
    private-key: ${{ secrets.PRIVATE_KEY }}
```

Where the `PRIVATE_KEY` secret contains your private key:

```
-----BEGIN RSA PRIVATE KEY-----
key contents
-----END RSA PRIVATE KEY-----
```

## Inputs

| name          | required | default | description              |
| ------------- | -------- | ------- | ------------------------ |
| `private-key` | ✅       |         | The full SSH private key |

# `postgres`

Starts a PostgreSQL server

## Example

```yaml
- uses: exivity/actions/postgres@main
  with:
    mode: docker
```

## Inputs

| name       | required | default      | description                                                                                                                                                                                           |
| ---------- | -------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`     |          | `"host"`     | Whether to run PostgreSQL as a Docker container or start the server installed on the host. Either `"docker"` or `"host"`                                                                              |
| `version`  |          | `"14.0"`     | The PostgreSQL version to use. Only affects Docker mode (host mode always uses default version). Make sure to use a string type to avoid truncation. Available versions: `"14.0"`, `"13.0"`, `"12.3"` |
| `password` |          | `"postgres"` | The password for the default `postgres` user in de database, currently only works with host mode                                                                                                      |

# `process-binary`

A composite action running [`rcedit`](#rcedit), [`sign-file`](#sign-file) and
[`virustotal`](#virustotal) (in that order).

## Example

```yaml
- uses: exivity/actions/process-binary@main
  with:
    path: build/foo.exe
    certificate-base64: ${{ secrets.CODESIGN_CERTIFICATE_BASE64 }}
    certificate-password: ${{ secrets.CODESIGN_CERTIFICATE_PASSWORD }}
    virustotal-api-key: ${{ secrets.VIRUSTOTAL_API_KEY }}
```

## Inputs

See individual actions for inputs.

# `purge-ghcr`

Delete a package version from GitHub Container Registry if a branch or tag is
deleted. This is useful to clean dangling versions from ghcr.io for images built
with [`build-push-image`](#build-push-image).

See [.github repository](https://github.com/exivity/.github#purge-ghcr) for
example usage.

## Example

Full example workflow:

```yaml
name: purge-ghcr

on: delete

jobs:
  purge-ghcr:
    runs-on: ubuntu-latest
    steps:
      - uses: exivity/actions/purge-ghcr@main
        with:
          gh-token: ${{ secrets.GITHUB_PAT }}
```

## Inputs

| name       | required | default          | description                                                                                                           |
| ---------- | -------- | ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| `org`      |          | Repository owner | The org who owns the package                                                                                          |
| `name`     |          | Repository name  | The package name                                                                                                      |
| `gh-token` |          | `github.token`   | The GitHub token with admin permissions in the organization and admin permissions to the container you want to delete |

# `rabbitmq`

Starts a RabbitMQ server in a Docker container.

## Example

```yaml
- uses: exivity/actions/rabbitmq@main
```

## Inputs

| name      | required | default   | description                                                         |
| --------- | -------- | --------- | ------------------------------------------------------------------- |
| `version` |          | `"3.8.6"` | The RabbitMQ version to use. Currently, only `"3.8.6"` is supported |

# `rcedit`

Edit resources of a Windows executable

⚠️ Currently only works on 64-bit Windows hosts

## Example

```yaml
- uses: exivity/actions/rcedit@main
  with:
    path: build/foo.exe
```

## Inputs

| name                        | required | default                           | description                                                                                                          |
| --------------------------- | -------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `path`                      | ✅       |                                   | The path to the file to sign, glob patterns allowed                                                                  |
| `file-description`          |          | `"Exivity component: $repo@$sha"` | File description to be presented to users                                                                            |
| `file-version`              |          |                                   | File's version to change to                                                                                          |
| `product-name`              |          | `"Exivity"`                       | Name of the product with which the file is distributed                                                               |
| `product-version`           |          |                                   | Product's version to change to                                                                                       |
| `company-name`              |          | `"Exivity"`                       | Company that produced the executable                                                                                 |
| `comments`                  |          |                                   | Additional information that should be displayed for diagnostic purposes                                              |
| `internal-filename`         |          |                                   | Internal name of the file. Usually, this string should be the original filename, without the extension               |
| `legal-copyright`           |          | `"© 2017 Exivity"`                | Copyright notices that apply, including the full text of all notices, legal symbols, copyright dates, etc.           |
| `legal-trademarks1`         |          |                                   | Trademarks and registered trademarks, including the full text of all notices, legal symbols, trademark numbers, etc. |
| `legal-trademarks2`         |          |                                   | Trademarks and registered trademarks, including the full text of all notices, legal symbols, trademark numbers, etc. |
| `original-filename`         |          |                                   | Original name of the file, not including a path                                                                      |
| `icon`                      |          |                                   | Path to the icon file (.ico) to set as the exePath's default icon                                                    |
| `requested-execution-level` |          |                                   | Requested execution level to change to, must be either asInvoker, highestAvailable, or requireAdministrator          |
| `application-manifest`      |          |                                   | String path to a local manifest file to use                                                                          |

# `retag-image`

Pulls, tags, then pushes an image.

## Example

```yaml
- uses: exivity/actions/retag-image@main
  with:
    source-tag: main
    target-tag: release
    target-user: ${{ secrets.DOCKER_HUB_USER }}
    target-password: ${{ secrets.DOCKER_HUB_TOKEN }}
```

## Params

| name               | required | default             | description                   |
| ------------------ | -------- | ------------------- | ----------------------------- |
| `source-registry`  |          | `ghcr.io`           | Source docker registry to use |
| `source-namespace` |          | <repo-owner>        | Source image namespace        |
| `source-name`      |          | <repo-name>         | Source image name             |
| `source-tag`       | ✅       |                     | Source image tag              |
| `source-user`      |          | ${{ github.actor }} | Username for source registry  |
| `source-password`  |          | ${{ github.token }} | Password for source registry  |
| `target-registry`  |          | `docker.io`         | Target docker registry to use |
| `target-namespace` |          | <repo-owner>        | Target image namespace        |
| `target-name`      |          | <repo-name>         | Target image name             |
| `target-tag`       | ✅       |                     | Target image tag              |
| `target-user`      | ✅       |                     | Username for target registry  |
| `target-password`  | ✅       |                     | Password for target registry  |

# `review`

Reviews a PR

## Example

```yaml
- uses: exivity/actions/review@main
  with:
    gh-token: ${{ secrets.GITHUB_PAT }}
    body: Exivity bot approves everything!
```

## Inputs

| name       | required | default                               | description                                                                                                              |
| ---------- | -------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `owner`    |          | Repository owner                      | The owner of the repo                                                                                                    |
| `repo`     |          | Repository name                       | The repo to review a PR for                                                                                              |
| `pull`     |          | Latest pull request of current branch | PR number to review                                                                                                      |
| `event`    |          | `"APPROVE"`                           | Choose from `"APPROVE"`, `"REQUEST_CHANGES"`, `"COMMENT"` or `"PENDING"`                                                 |
| `body`     | Maybe    |                                       | The body of the review text, required when using `"REQUEST_CHANGES"` or `"COMMENT"`                                      |
| `branch`   |          | Current branch                        | The head branch the pull request belongs to in order to get latest pull request, not needed if `pull` has been specified |
| `gh-token` |          | `github.token`                        | A GitHub token from the PR reviewer                                                                                      |

# `semantic-pull-request`

Ensures your pull requests title follow the
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) spec.

See
[.github repository](https://github.com/exivity/.github#semantic-pull-request)
for example usage.

_Based on original work from
[amannn/action-semantic-pull-request](https://github.com/amannn/action-semantic-pull-request)_

## Example

```yaml
- uses: exivity/actions/semantic-pull-request@main
```

## Inputs

| name       | required | default        | description                                     |
| ---------- | -------- | -------------- | ----------------------------------------------- |
| `gh-token` |          | `github.token` | GitHub token with read access to the repository |

# `sign-file`

Digitally sign a file

⚠️ Currently only works on Windows hosts

## Example

```yaml
- uses: exivity/actions/sign-file@main
  with:
    path: build/foo.exe
    certificate-base64: ${{ secrets.CODESIGN_CERTIFICATE_BASE64 }}
    certificate-password: ${{ secrets.CODESIGN_CERTIFICATE_PASSWORD }}
```

## Inputs

| name                   | required | default      | description                                                                |
| ---------------------- | -------- | ------------ | -------------------------------------------------------------------------- |
| `path`                 | ✅       |              | The path to the file to sign, glob patterns allowed                        |
| `certificate-base64`   | ✅       |              | The contents of the `.pfx` file (PKCS#12 archive) encoded as base64 string |
| `certificate-password` | ✅       |              | The password for the `.pfx` file                                           |
| `method`               |          | `"signtool"` | The signature tool to use. Available options: `"signtool"`                 |

# `slack`

Send a Slack message to the author of the commit triggering the workflow (if
available).

## Example

```yaml
- uses: exivity/actions/slack@main
  if: failure()
  with:
    status: ${{ job.status }}
    slack-api-token: ${{ secrets.SLACK_BOT_TOKEN }}
```

## Inputs

| name               | required | default        | description                                                                                                                                                                      |
| ------------------ | -------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message`          | Maybe    |                | The message body to send, markdown is supported. Requid when `status` is not set.                                                                                                |
| `status`           |          |                | Include a status message if set to `"success"`, `"failure"` or `"cancelled"`                                                                                                     |
| `channel`          |          |                | If provided, send message to this channel instead of commit author. Can be a channel ID, user ID, channel name as `"#channel-name"` or a users display name as `"@display-name"` |
| `fallback-channel` |          | `"#builds"`    | If a Slack user can't be resolved, use this channel as a fallback.                                                                                                               |
| `slack-api-token`  | ✅       |                | Slack API token                                                                                                                                                                  |
| `gh-token`         |          | `github.token` | GitHub token with read access to the repository                                                                                                                                  |

# `sync-defaults`

Syncs the repo settings with org defaults. Override org settings in a local
`.github/settings.yml` file. See
[probot/settings](https://github.com/probot/settings#usage) for all available
options.

See [.github repository](https://github.com/exivity/.github#sync-defaults) for
example usage.

_Based on original work from
[probot/settings](https://github.com/probot/settings)_

## Example

```yaml
- uses: exivity/actions/sync-defaults@main
  with:
    gh-token: ${{ secrets.GITHUB_PAT }}
```

## Inputs

| name       | required | default        | description                                      |
| ---------- | -------- | -------------- | ------------------------------------------------ |
| `gh-token` |          | `github.token` | GitHub token with admin access to the repository |

# `virustotal`

Analyse artefacts with VirusTotal

_Forked from:
[crazy-max/ghaction-virustotal](https://github.com/crazy-max/ghaction-virustotal)_

## Example

Build workflow:

```yaml
- uses: exivity/actions/virustotal@main
  with:
    path: build/foo.exe
    virustotal-api-key: ${{ secrets.VIRUSTOTAL_API_KEY }}
```

Separate check workflow:

```yaml
name: virustotal-check

on:
  workflow_dispatch:
  schedule:
    - cron: '0 3 * * *'

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: exivity/actions/virustotal@main
        with:
          mode: check
          virustotal-api-key: ${{ secrets.VIRUSTOTAL_API_KEY }}
```

## Inputs

| name                 | required | default        | description                                                                                         |
| -------------------- | -------- | -------------- | --------------------------------------------------------------------------------------------------- |
| `mode`               |          | `"analyse"`    | Whether to analyse artefacts or check the analysis status. Either `"analyse"` or `"check"`.         |
| `path`               | Maybe    |                | The path to the file to analyse, glob patterns allowed. Required when `mode` is set to `"analyse"`. |
| `virustotal-api-key` | ✅       |                | The VirusTotal API key                                                                              |
| `gh-token`           |          | `github.token` | GitHub token used for writing commit status                                                         |

---

# `accept`

Triggers a scaffold repository build using the `workflow_dispatch` event. Does
not trigger for the `master` or `main` branch.

If the current branch includes a Jira key (e.g. EXVT-1000), the scaffold build
will try to resolve matching epic branches for other components.

See [.github repository](https://github.com/exivity/.github#accept) for example
usage.

## Example

```yaml
- uses: exivity/actions/accept@main
  with:
    gh-token: ${{ secrets.GH_BOT_TOKEN }}
```

## Inputs

| name              | required | default        | description                                                                                                                                                                                                                                  |
| ----------------- | -------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scaffold-branch` |          | `"develop"`    | The scaffold branch to build.                                                                                                                                                                                                                |
| `gh-token`        |          | `github.token` | A GitHub token with access to the exivity/scaffold repository.                                                                                                                                                                               |
| `dry-run`         |          | `false`        | If `true`, scaffold will not build or run any tests.                                                                                                                                                                                         |
| `filter`          |          |                | If provided, only trigger acceptance tests if files which match this input are modified. Glob patterns allowed. Multiple entries eparated by newline. If provided, and changed files do not match, writes a successful status to the commit. |

# `db`

Runs a PostgreSQL docker container, create a new database, pulls in the `db`
repository migrations and runs them.

## Example

```yaml
- uses: exivity/actions/db@main
  with:
    branch: some-feature-branch
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    gh-token: ${{ secrets.GH_BOT_TOKEN }}
```

## Inputs

| name                    | required | default                                                                          | description                                                                                                                                                                                           |
| ----------------------- | -------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `branch`                |          | `"main"` or `"master"` when it matches the current branch, `"develop"` otherwise | The db repository branch to use.                                                                                                                                                                      |
| `db-name`               |          | `"exdb-test"`                                                                    | The db name to create.                                                                                                                                                                                |
| `mode`                  |          | `"host"`                                                                         | Whether to run PostgreSQL as a Docker container or start the server installed on the host. Either `"host"` or `"docker"`.                                                                             |
| `version`               |          | `"14.0"`                                                                         | The PostgreSQL version to use. Only affects Docker mode (host mode always uses default version). Make sure to use a string type to avoid truncation. Available versions: `"14.0"`, `"13.0"`, `"12.3"` |
| `aws-access-key-id`     | ✅       |                                                                                  | The AWS access key ID                                                                                                                                                                                 |
| `aws-secret-access-key` | ✅       |                                                                                  | The AWS secret access key                                                                                                                                                                             |
| `gh-token`              |          | `github.token`                                                                   | A GitHub token with access to the exivity/db repository.                                                                                                                                              |
| `password`              |          | `"postgres"`                                                                     | The password for the postgres user in de database, currently only works with host mode.                                                                                                               |

# `get-artefacts`

Download artefacts for the provided component. It will use the S3 _exivity_
bucket in the _eu-central-1_ region. Artefacts are downloaded with the
_build/{component}/{sha}[/{platform}][/{prefix}]_ prefix.

## Example

```yaml
- uses: exivity/actions/get-artefacts@main
  with:
    component: db
    branch: master
    path: db-artefacts
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    gh-token: ${{ secrets.GH_BOT_TOKEN }}
```

## Inputs

| name                    | required | default                                                                                         | description                                                                                      |
| ----------------------- | -------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `component`             | ✅       |                                                                                                 | Component to download artefacts for                                                              |
| `sha`                   |          |                                                                                                 | Use specific artefacts sha                                                                       |
| `branch`                |          | `"main"` or `"master"` when it matches the current branch, `"develop"` otherwise (if available) | If no sha is provided, resolve sha from branch name                                              |
| `use-platform-prefix`   |          | `false`                                                                                         | If `true`, uses `windows` or `linux` prefix depending on current os.                             |
| `prefix`                |          |                                                                                                 | If specified, download artefacts from this prefix (appended after platform prefix if specified). |
| `path`                  |          | `"../{component}/build"`                                                                        | Put artefacts in this path                                                                       |
| `auto-unzip`            |          | `true`                                                                                          | Automatically unzip artefact files                                                               |
| `aws-access-key-id`     | ✅       |                                                                                                 | The AWS access key ID                                                                            |
| `aws-secret-access-key` | ✅       |                                                                                                 | The AWS secret access key                                                                        |
| `gh-token`              |          | `github.token`                                                                                  | A GitHub token with access to the exivity/{component} repository.                                |

# `release`

Action to help releasing Exivity.

This action controls a _release_ repository which is used to release Exivity.
Whenever a change occurs in one of the components which is ready to be release,
a pull request is updated in the release repository which contains the upcoming
version increase inferred from all pending changes and updates to the
CHANGELOG.md. Merging this pull request will release a new version of Exivity.

The `ping` mode is supposed to be used by components, whenever they push to
their production branch. It will trigger a `prepare` workflow containing the
release action in `prepare` mode in the release repository.

The `prepare` mode is to be used in the release repository. It will pull in
pending changes in all components, update the upcoming version and CHANGELOG.md.

The `release` mode is to be used in the release repository. It will write a new
release tag in the release repository, plus new tags in all released components.

## Example

```yaml
- uses: exivity/actions/release@main
  with:
    mode: ping
    gh-token: ${{ secrets.GH_BOT_TOKEN }}
```

```yaml
- uses: exivity/actions/release@main
  with:
    mode: prepare
```

```yaml
- uses: exivity/actions/release@main
  with:
    mode: release
```

## Inputs

| name       | required | default        | description                                                   |
| ---------- | -------- | -------------- | ------------------------------------------------------------- |
| `mode`     |          | `"ping"`       | One of `"ping"`, `"prepare"` or `"release"`                   |
| `dry-run`  |          | `false`        | If `true`, running this action will have no side-effects.     |
| `gh-token` |          | `github.token` | A GitHub token with access to the exivity/exivity repository. |

# `put-artefacts`

Uploads artefacts in the provided directory. It will use the S3 _exivity_ bucket
in the _eu-central-1_ region. Artefacts are uploaded to the
_build/{component}/{sha}[/{platform}][/{prefix}]_ prefix.

## Example

```yaml
- uses: exivity/actions/put-artefacts@main
  with:
    path: artefacts
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Inputs

| name                    | required | default   | description                                                                                    |
| ----------------------- | -------- | --------- | ---------------------------------------------------------------------------------------------- |
| `use-platform-prefix`   |          | `false`   | If `true`, uses `windows` or `linux` prefix depending on current os.                           |
| `prefix`                |          |           | If specified, upload artefacts with this prefix (appended after platform prefix if specified). |
| `path`                  |          | `"build"` | Upload artefacts from this path.                                                               |
| `zip`                   |          | `false`   | Zip artefact files before uploading as `{component_name}.tar.gz`                               |
| `aws-access-key-id`     | ✅       |           | The AWS access key ID                                                                          |
| `aws-secret-access-key` | ✅       |           | The AWS secret access key                                                                      |

---

# Development guide

When committing code to this repository, make sure to have Node & Yarn installed
since code needs to be compiled in a pre-commit hook.

To make this easier, use the
[devcontainer](https://code.visualstudio.com/docs/remote/containers)
configuration included with this repo.
