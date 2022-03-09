# @exivity/actions

Public GitHub Actions used at Exivity for CI/CD. These probably don't make much
sense outside the context of the Exivity development environment.

_Available actions:_

- [`accept`](#accept)
- [`commit-status`](#commit-status)
- [`db`](#db)
- [`deploy-image`](#deploy-image)
- [`get-artefacts`](#get-artefacts)
- [`init-ssh`](#init-ssh)
- [`postgres`](#postgres)
- [`process-binary`](#process-binary)
- [`put-artefacts`](#put-artefacts)
- [`rabbitmq`](#rabbitmq)
- [`rcedit`](#rcedit)
- [`review`](#review)
- [`semantic-pull-request`](#semantic-pull-request)
- [`sign-file`](#sign-file)
- [`slack`](#slack)
- [`virustotal`](#virustotal)

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

# `commit-status`

Writes a [commit status](https://docs.github.com/en/rest/reference/commits#commit-statuses).

## Example

```yaml
- uses: exivity/actions/commit-status@main
  with:
    context: auto-success
```

## Inputs

| name          | required | default           | description                                                                         |
| ------------- | -------- | ----------------- | ----------------------------------------------------------------------------------- |
| `component`   |          | Current component | Component to write the commit status for.                                           |
| `sha`         |          | Current sha       | Sha of commit to write the status for.                                              |
| `gh-token`    |          | `github.token`    | A GitHub token with write access to the component.                                  |
| `state`       |          | `"success"`       | The commit status state, can be `"error"`, `"failure"`, `"pending"` or `"success"`. |
| `context`     | ✅       |                   | A string label to differentiate this status from the status of other systems.       |
| `description` |          |                   | A short description of the status.                                                  |
| `target_url`  |          |                   | The target URL to associate with this status.                                       |

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

# `deploy-image`

Builds and deploys a component image.

## Example

```yaml
- uses: exivity/actions/deploy-image@main
  with:
    docker-hub-user: ${{ secrets.DOCKER_HUB_USER }}
    docker-hub-password: ${{ secrets.DOCKER_HUB_TOKEN }}
```

## Inputs

| name                  | required | default           | description                                                                                      |
| --------------------- | -------- | ----------------- | ------------------------------------------------------------------------------------------------ |
| `component`           |          | Current component | Component name to build the image for                                                            |
| `docker-hub-user`     | ✅       |                   | Username for Docker Hub                                                                          |
| `docker-hub-password` | ✅       |                   | Password for Docker Hub                                                                          |
| `ghcr-user`           |          | `github.actor`    | Username for GitHub Container Registry                                                           |
| `ghcr-password`       |          | `github.token`    | Password for GitHub Container Registry                                                           |
| `dockerfile`          |          | `"./Dockerfile"`  | Path to the Dockerfile                                                                           |
| `dry-run`             |          | `false`           | Do not deploy build artefacts when set to `true`                                                 |
| `gh-token`            |          | `github.token`    | The github token to delete image tags (only for 'delete' event), must have `packages:read` scope |

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

| name          | required | default | description               |
| ------------- | -------- | ------- | ------------------------- |
| `private-key` | ✅       |         | The full SSH private key. |

# `postgres`

Starts a PostgreSQL server

## Example

```yaml
- uses: exivity/actions/postgres@main
  with:
    mode: docker
    version: 12.3
```

## Inputs

| name       | required | default      | description                                                                                                                                                                                           |
| ---------- | -------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`     |          | `"host"`     | Whether to run PostgreSQL as a Docker container or start the server installed on the host. Either `"docker"` or `"host"`.                                                                             |
| `version`  |          | `"14.0"`     | The PostgreSQL version to use. Only affects Docker mode (host mode always uses default version). Make sure to use a string type to avoid truncation. Available versions: `"14.0"`, `"13.0"`, `"12.3"` |
| `password` |          | `"postgres"` | The password for the postgres user in de database, currently only works with host mode.                                                                                                               |

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

# `rabbitmq`

Starts a RabbitMQ server in a Docker container.

## Example

```yaml
- uses: exivity/actions/rabbitmq@main
  with:
    version: 3.8.6
```

## Inputs

| name      | required | default   | description                                                          |
| --------- | -------- | --------- | -------------------------------------------------------------------- |
| `version` |          | `"3.8.6"` | The RabbitMQ version to use. Currently, only `"3.8.6"` is supported. |

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

| name                        | required | default        | description                                                                                                          |
| --------------------------- | -------- | -------------- | -------------------------------------------------------------------------------------------------------------------- |
| `path`                      | ✅       |                | The path to the file to sign, glob patterns allowed                                                                  |
| `company-name`              |          | `"Exivity"`    | Company that produced the executable.                                                                                |
| `product-name`              |          | `"Exivity"`    | Name of the product with which the file is distributed.                                                              |
| `file-description`          |          | `"$repo:$sha"` | File description to be presented to users.                                                                           |
| `comments`                  |          |                | Additional information that should be displayed for diagnostic purposes.                                             |
| `internal-filename`         |          |                | Internal name of the file. Usually, this string should be the original filename, without the extension.              |
| `legal-copyright`           |          |                | Copyright notices that apply, including the full text of all notices, legal symbols, copyright dates, etc.           |
| `legal-trademarks1`         |          |                | Trademarks and registered trademarks, including the full text of all notices, legal symbols, trademark numbers, etc. |
| `legal-trademarks2`         |          |                | Trademarks and registered trademarks, including the full text of all notices, legal symbols, trademark numbers, etc. |
| `original-filename`         |          |                | Original name of the file, not including a path.                                                                     |
| `file-version`              |          |                | File's version to change to.                                                                                         |
| `product-version`           |          |                | Product's version to change to.                                                                                      |
| `icon`                      |          |                | Path to the icon file (.ico) to set as the exePath's default icon.                                                   |
| `requested-execution-level` |          |                | Requested execution level to change to, must be either asInvoker, highestAvailable, or requireAdministrator.         |
| `application-manifest`      |          |                | String path to a local manifest file to use.                                                                         |

# `review`

Reviews a PR.

## Example

```yaml
- uses: exivity/actions/review@main
  with:
    gh-token: ${{ secrets.GH_BOT_TOKEN }}
    body: Exivity bot approves everything!
```

## Inputs

| name        | required | default                               | description                                                                                                               |
| ----------- | -------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `component` |          | Current component                     | The component to review a PR for.                                                                                         |
| `pull`      |          | Latest pull request of current branch | PR number to review.                                                                                                      |
| `gh-token`  |          | `github.token`                        | A GitHub token from the PR reviewer.                                                                                      |
| `event`     |          | `"APPROVE"`                           | Choose from `"APPROVE"`, `"REQUEST_CHANGES"`, `"COMMENT"` or `"PENDING"`.                                                 |
| `body`      | Maybe    |                                       | The body of the review text, required when using `"REQUEST_CHANGES"` or `"COMMENT"`.                                      |
| `branch`    |          | Current branch                        | The head branch the pull request belongs to in order to get latest pull request, not needed if `pull` has been specified. |

# `semantic-pull-request`

Ensures your pull requests title follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
spec.

See [.github repository](https://github.com/exivity/.github#semantic-pull-request)
for example usage.

_Based on original work from [amannn/action-semantic-pull-request](https://github.com/amannn/action-semantic-pull-request)_

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

# `virustotal`

Analyse artefacts with VirusTotal

_Forked from: [crazy-max/ghaction-virustotal](https://github.com/crazy-max/ghaction-virustotal)_

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

# Development guide

When committing code to this repository, make sure to have Node & Yarn installed
since code needs to be compiled in a pre-commit hook.
