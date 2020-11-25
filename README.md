# @exivity/actions

Public GitHub Actions used at Exivity for CI/CD. These probably don't make much
sense outside the context of the Exivity development environment.

_Available actions:_

- [`accept`](#accept)
- [`db`](#db)
- [`dex`](#dex)
- [`dex-artefacts`](#dex-artefacts)
- [`get-artefacts`](#get-artefacts)
- [`init-ssh`](#init-ssh)
- [`postgres`](#postgres)
- [`put-artefacts`](#put-artefacts)
- [`rabbitmq`](#rabbitmq)

# `accept`

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/exivity/actions/accept)

Triggers a scaffold repository build using the `workflow_dispatch` event. Does
not trigger for the `master` branch.

If the current branch includes a Jira key (e.g. EXVT-1000), the scaffold build
will try to resolve matching epic branches for other components.

## Inputs

### `scaffold-branch`

**Optional**  
_Defaults to `develop`_  
The scaffold branch to build.

### `gh-token`

**Optional**  
_Defaults to the GITHUB_TOKEN environment variable_  
A GitHub token with access to the exivity/scaffold repository.

## Example usage

```
- uses: exivity/actions/accept@master
  with:
    scaffold-branch: some-feature-branch
```

# `db`

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/exivity/actions/db)

Runs a PostgreSQL docker container, create a new database, pulls in the `db`
repository migrations and runs them.

## Inputs

### `branch`

**Optional**  
_Defaults to `master` when used on a master branch or if artifact repo has no
develop branch, else defaults to `develop`_  
The db repository branch to use.

### `db-name`

**Optional**  
_Default: `exdb-test`_  
The db name to create.

### `mode`

**Optional**  
_Options: `docker` or `host`, defaults to `host`_  
Whether to run PostgreSQL as a Docker container or start the server installed on
the host

### `version`

**Optional**  
_Default: 13.0_  
The PostgreSQL version to use. Only affects Docker mode (host mode always uses
default version). Make sure to use a string type to avoid truncation. Available
versions:

- 13.0
- 12.3

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
A GitHub token with access to the exivity/db repository.

### `password`

**Optional**  
_Defaults to "postgres"_  
The password for the postgres user in de database, currently only works with
host mode.

## Example usage

```
- uses: exivity/actions/db@master
  with:
    branch: some-feature-branch
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

# `dex`

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/exivity/actions/dex)

_🚧 This action is not yet ready for production_

Runs a dex command

## Inputs

### `cmd`

**Required**  
Dex command to execute.

### `cwd`

**Optional**  
_Default: `.`_  
Working directory

### `mode`

**Optional**  
_Options: `docker` or `binary`, defaults to `binary`_  
Whether to run Dex as a Docker container or download and execute a binary on the
host

### `tag`

**Optional**  
_Default: `latest`_  
The `exivity/dex` Docker image tag to use

## Example usage

```
- uses: exivity/actions/dex@master
  with:
    cmd: help
```

# `dex-artefacts`

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/exivity/actions/dex-artefacts)

_🚧 This action is not yet ready for production_

Create, accept and publish artefacts with dex

## Inputs

### `path`

**Optional**  
_Default: `.`_  
Component root directory

### `channel`

**Optional**  
Manually set channel

### `accept`

**Optional**  
_Default: `false`_  
Run acceptance tests

### `mode`

**Optional**  
_Options: `docker` or `binary`, defaults to `binary`_  
Whether to run Dex as a Docker container or download and execute a binary on the
host.

### `tag`

**Optional**  
_Default: `latest`_  
The `exivity/dex` Docker image tag to use

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
- uses: exivity/actions/dex-artefacts@master
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

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
- uses: exivity/actions/get-artefacts@master
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
- uses: exivity/actions/init-ssh@master
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
_Default: 13.0_  
The PostgreSQL version to use. Only affects Docker mode (host mode always uses
default version). Make sure to use a string type to avoid truncation. Available
versions:

- 13.0
- 12.3

### `password`

**Optional**  
_Defaults to "postgres"_  
The password for the postgres user in de database, currently only works with
host mode.

## Example usage

```
- uses: exivity/actions/postgres@master
  with:
    mode: docker
    version: 12.3
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
- uses: exivity/actions/put-artefacts@master
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
- uses: exivity/actions/rabbitmq@master
  with:
    version: 3.8.6
```
