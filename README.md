# @exivity/actions

Public GitHub Actions used at Exivity for CI/CD. These probably don't make much
sense outside the context of the Exivity development environment.

_Available actions:_

- [`accept`](#accept)
- [`commit-status`](#commit-status)
- [`db`](#db)
- [`get-artefacts`](#get-artefacts)
- [`init-ssh`](#init-ssh)
- [`postgres`](#postgres)
- [`process-binary`](#process-binary)
- [`put-artefacts`](#put-artefacts)
- [`rabbitmq`](#rabbitmq)
- [`rcedit`](#rcedit)
- [`review`](#review)
- [`sign-file`](#sign-file)
- [`virustotal`](#virustotal)

# `accept`

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/exivity/actions/accept)

Triggers a scaffold repository build using the `workflow_dispatch` event. Does
not trigger for the `master` or `main` branch.

If the current branch includes a Jira key (e.g. EXVT-1000), the scaffold build
will try to resolve matching epic branches for other components.

See [.github repository](https://github.com/exivity/.github#accept) for example
usage.

## Example

```
- uses: exivity/actions/accept@main
  with:
    gh-token: ${{ secrets.GH_BOT_TOKEN }}
```

## Inputs

| name              | required | default            | description                                                                                                                                                                                                                                  |
| ----------------- | -------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scaffold-branch` |          | `"develop"`        | The scaffold branch to build.                                                                                                                                                                                                                |
| `gh-token`        |          | `env.GITHUB_TOKEN` | A GitHub token with access to the exivity/scaffold repository.                                                                                                                                                                               |
| `dry-run`         |          | `false`            | If `true`, scaffold will not build or run any tests.                                                                                                                                                                                         |
| `filter`          |          |                    | If provided, only trigger acceptance tests if files which match this input are modified. Glob patterns allowed. Multiple entries eparated by newline. If provided, and changed files do not match, writes a successful status to the commit. |

# `commit-status`

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/exivity/actions/commit-status)

Writes a [commit status](https://docs.github.com/en/rest/reference/commits#commit-statuses).

## Example

```
- uses: exivity/actions/commit-status@main
  with:
    context: auto-success
```

## Inputs

| name          | required | default            | description                                                                         |
| ------------- | -------- | ------------------ | ----------------------------------------------------------------------------------- |
| `component`   |          | Current component  | Component to write the commit status for.                                           |
| `sha`         |          | Current sha        | Sha of commit to write the status for.                                              |
| `gh-token`    |          | `env.GITHUB_TOKEN` | A GitHub token with write access to the component.                                  |
| `state`       |          | `"success"`        | The commit status state, can be `"error"`, `"failure"`, `"pending"` or `"success"`. |
| `context`     | ✅       |                    | A string label to differentiate this status from the status of other systems.       |
| `description` |          |                    | A short description of the status.                                                  |
| `target_url`  |          |                    | The target URL to associate with this status.                                       |

# `db`

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/exivity/actions/db)

Runs a PostgreSQL docker container, create a new database, pulls in the `db`
repository migrations and runs them.

## Example

```
- uses: exivity/actions/db@main
  with:
    branch: some-feature-branch
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Inputs

| name                    | required | default                                                                          | description                                                                                                                                                                                           |
| ----------------------- | -------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `branch`                |          | `"master"` or `"main"` when it matches the current branch, `"develop"` otherwise | The db repository branch to use.                                                                                                                                                                      |
| `db-name`               |          | `"exdb-test"`                                                                    | The db name to create.                                                                                                                                                                                |
| `mode`                  |          | `"host"`                                                                         | Whether to run PostgreSQL as a Docker container or start the server installed on the host. Either `"host"` or `"docker"`.                                                                             |
| `version`               |          | `"14.0"`                                                                         | The PostgreSQL version to use. Only affects Docker mode (host mode always uses default version). Make sure to use a string type to avoid truncation. Available versions: `"14.0"`, `"13.0"`, `"12.3"` |
| `aws-access-key-id`     |          | `env.AWS_ACCESS_KEY_ID`                                                          | The AWS access key ID                                                                                                                                                                                 |
| `aws-secret-access-key` |          | `env.AWS_SECRET_ACCESS_KEY`                                                      | The AWS secret access key                                                                                                                                                                             |
| `gh-token`              |          | `env.GITHUB_TOKEN`                                                               | A GitHub token with access to the exivity/db repository.                                                                                                                                              |
| `password`              |          | `"postgres"`                                                                     | The password for the postgres user in de database, currently only works with host mode.                                                                                                               |

# `get-artefacts`

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/exivity/actions/get-artefacts)

Download artefacts for the provided component. It will use the S3 _exivity_
bucket in the _eu-central-1_ region. Artefacts are downloaded with the
_build/{component}/{sha}[/{platform}][/{prefix}]_ prefix.

## Inputs

### `component`

**Required**  
Component to download artefacts for

### `sha`

**Optional**  
Use specific artefacts sha

### `branch`

**Optional**  
_Defaults to `master` when used on a master branch or if artifact repo has no
develop branch, else defaults to `develop`_  
If no sha is provided, resolve sha from branch name

### `use-platform-prefix`

**Optional**  
_Defaults to `false`_  
If `true`, uses `windows` or `linux` prefix depending on current os.

### `prefix`

**Optional**  
If specified, download artefacts from this prefix (appended after platform
prefix if specified).

### `path`

**Optional**  
_Defaults to `../{component}/build`_  
Put artefacts in this path

### `auto-unzip`

**Optional**  
_Default: `true`_  
Automatically unzip artefact files

### `aws-access-key-id`

**Optional**  
_Defaults to the AWS_ACCESS_KEY_ID environment variable_  
The AWS access key ID

### `aws-secret-access-key`

**Optional**  
_Defaults to the AWS_SECRET_ACCESS_KEY environment variable_  
The AWS secret access key

### `gh-token`

**Optional**  
_Defaults to the GITHUB_TOKEN environment variable_  
A GitHub token with access to the exivity/{component} repository.

## Example usage

```
- uses: exivity/actions/get-artefacts@main
  with:
    component: db
    branch: master
    path: db-artefacts
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    gh-token: ${{ secrets.GITHUB_TOKEN }}
```

# `init-ssh`

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/exivity/actions/init-ssh)

Use a private key and prime the known_hosts file with pre-loaded keys for
github.com, gitlab.com and bitbucket.org.

## Inputs

### `private-key`

**Required**  
The full SSH private key.

## Example usage

```
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

# `postgres`

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/exivity/actions/postgres)

Starts a PostgreSQL server

## Inputs

### `mode`

**Optional**  
_Options: `docker` or `host`, defaults to `host`_  
Whether to run PostgreSQL as a Docker container or start the server installed on
the host.

### `version`

**Optional**  
_Default: 14.0_  
The PostgreSQL version to use. Only affects Docker mode (host mode always uses
default version). Make sure to use a string type to avoid truncation. Available
versions:

- 14.0
- 13.0
- 12.3

### `password`

**Optional**  
_Defaults to "postgres"_  
The password for the postgres user in de database, currently only works with
host mode.

## Example usage

```
- uses: exivity/actions/postgres@main
  with:
    mode: docker
    version: 12.3
```

# `process-binary`

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/exivity/actions/process-binary)

A composite action running [`rcedit`](#rcedit), [`sign-file`](#sign-file) and
[`virustotal`](#virustotal) (in that order).

## Inputs

See individual actions for inputs.

## Example usage

```
- uses: exivity/actions/process-binary@main
  with:
    path: build/foo.exe
    certificate-base64: ${{ secrets.CODESIGN_CERTIFICATE_BASE64 }}
    certificate-password: ${{ secrets.CODESIGN_CERTIFICATE_PASSWORD }}
    virustotal-api-key: ${{ secrets.VIRUSTOTAL_API_KEY }}
    gh-token: ${{ secrets.GITHUB_TOKEN }}
```

# `put-artefacts`

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/exivity/actions/put-artefacts)

Uploads artefacts in the provided directory. It will use the S3 _exivity_ bucket
in the _eu-central-1_ region. Artefacts are uploaded to the
_build/{component}/{sha}[/{platform}][/{prefix}]_ prefix.

## Inputs

### `use-platform-prefix`

**Optional**  
_Defaults to `false`_  
If `true`, uses `windows` or `linux` prefix depending on current os.

### `prefix`

**Optional**  
If specified, upload artefacts with this prefix (appended after
platform prefix if specified).

### `path`

**Optional**  
_Default: build_  
Upload artefacts from this path.

### `zip`

**Optional**  
_Default: `false`_  
Zip artefact files before uploading as `{component_name}.tar.gz`

### `aws-access-key-id`

**Optional**  
_Defaults to the AWS_ACCESS_KEY_ID environment variable_  
The AWS access key ID

### `aws-secret-access-key`

**Optional**  
_Defaults to the AWS_SECRET_ACCESS_KEY environment variable_  
The AWS secret access key

## Example usage

```
- uses: exivity/actions/put-artefacts@main
  with:
    path: artefacts
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

# `rabbitmq`

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/exivity/actions/rabbitmq)

Starts a RabbitMQ server in a Docker container.

## Inputs

### `version`

**Optional**  
_Default: 3.8.6_  
The RabbitMQ version to use. Currently, only 3.8.6 is supported.

## Example usage

```
- uses: exivity/actions/rabbitmq@main
  with:
    version: 3.8.6
```

# `rcedit`

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/exivity/actions/rcedit)

Edit resources of a Windows executable

⚠️ Currently only works on 64 bit Windows hosts

## Inputs

### `path`

**Required**  
The path to the file to sign, glob patterns allowed

### `company-name`

**Optional**  
_Defaults to 'Exivity'_  
Company that produced the executable.

### `product-name`

**Optional**  
_Defaults to 'Exivity'_  
Name of the product with which the file is distributed.

### `file-description`

**Optional**  
_Defaults to '$repo:$sha'_  
File description to be presented to users.

### `comments`

**Optional**  
Additional information that should be displayed for diagnostic purposes.

### `internal-filename`

**Optional**  
Internal name of the file. Usually, this string should be the original filename, without the extension.

### `legal-copyright`

**Optional**  
Copyright notices that apply, including the full text of all notices, legal symbols, copyright dates, etc.

### `legal-trademarks1`

**Optional**  
Trademarks and registered trademarks, including the full text of all notices, legal symbols, trademark numbers, etc.

### `legal-trademarks2`

**Optional**  
Trademarks and registered trademarks, including the full text of all notices, legal symbols, trademark numbers, etc.

### `original-filename`

**Optional**  
Original name of the file, not including a path.

### `file-version`

**Optional**  
File's version to change to.

### `product-version`

**Optional**  
Product's version to change to.

### `icon`

**Optional**  
Path to the icon file (.ico) to set as the exePath's default icon.

### `requested-execution-level`

**Optional**  
Requested execution level to change to, must be either asInvoker, highestAvailable, or requireAdministrator.

### `application-manifest`

**Optional**  
String path to a local manifest file to use.

## Example usage

```
- uses: exivity/actions/rcedit@main
  with:
    path: build/foo.exe
```

# `review`

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/exivity/actions/review)

Reviews a PR.

## Inputs

### `component`

**Optional**  
_Defaults to current component_  
The component to review a PR for.

### `pull`

**Optional**  
_Defaults to latest of current branch_  
PR number to review.

### `gh-token`

**Optional**  
_Defaults to the GITHUB_TOKEN environment variable_  
A GitHub token from the PR reviewer.

### `event`

**Optional**  
_Defaults to `APPROVE`_  
Choose from APPROVE, REQUEST_CHANGES, COMMENT or PENDING.

### `body`

**Optional**  
The body of the review text, required when using REQUEST_CHANGES or COMMENT.

### `branch`

**Optional**  
_Defaults to current branch_  
The head branch the pull request belongs to in order to get latest pull request,
not needed if `pull` has been specified.

## Example usage

```
- uses: exivity/actions/review@main
  with:
    gh-token: ${{ secrets.GH_BOT_TOKEN }}
    body: Exivity bot approves everything!
```

# `sign-file`

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/exivity/actions/sign-file)

Digitally sign a file

⚠️ Currently only works on Windows hosts

## Inputs

### `path`

**Required**  
The path to the file to sign, glob patterns allowed

### `certificate-base64`

**Required**  
The contents of the `.pfx` file (PKCS#12 archive) encoded as base64 string

### `certificate-password`

**Required**  
The password for the `.pfx` file

### `method`

**Optional**  
_Defaults to `signtool`_  
The signature tool to use. Available options:

- `signtool`

## Example usage

```
- uses: exivity/actions/sign-file@main
  with:
    path: build/foo.exe
    certificate-base64: ${{ secrets.CODESIGN_CERTIFICATE_BASE64 }}
    certificate-password: ${{ secrets.CODESIGN_CERTIFICATE_PASSWORD }}
```

# `virustotal`

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/exivity/actions/virustotal)

Analyse artefacts with VirusTotal

_Forked from: [crazy-max/ghaction-virustotal](https://github.com/crazy-max/ghaction-virustotal)_

## Inputs

### `mode`

**Optional**  
_Options: `analyse` or `check`, defaults to `analyse`_  
Whether to analyse artefacts or check the analysis status

### `path`

**Optional**  
The path to the file to analyse, glob patterns allowed. Required when `mode` is
set to `analyse`.

### `virustotal-api-key`

**Required**  
The VirusTotal API key

### `gh-token`

**Optional**  
_Defaults to the GITHUB_TOKEN environment variable_  
GitHub token used for writing commit status

## Example usage

Build workflow:

```
- uses: exivity/actions/virustotal@main
  with:
    path: build/foo.exe
    virustotal-api-key: ${{ secrets.VIRUSTOTAL_API_KEY }}
    gh-token: ${{ secrets.GITHUB_TOKEN }}
```

Separate check workflow:

```
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
          gh-token: ${{ secrets.GITHUB_TOKEN }}
```

# Development guide

When committing code to this repository, make sure to have Node & Yarn installed
since code needs to be compiled in a pre-commit hook.
