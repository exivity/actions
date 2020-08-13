# @exivity/actions

Public GitHub Actions used at Exivity for CI/CD. These probably don't make much
sense outside the context of the Exivity development environment.

_Available actions:_

- [`accept`](#accept)
- [`db`](#db)
- [`get-artefacts`](#get-artefacts)
- [`init-ssh`](#init-ssh)
- [`postgres`](#postgres)
- [`put-artefacts`](#put-artefacts)
- [`rabbitmq`](#rabbitmq)

# `accept`

Triggers a scaffold repository build on AppVeyor

## Inputs

### `scaffold-branch`

**Optional** _Defaults to `develop` or `custom` depending on current branch_ The
scaffold branch to build.

### `appveyor-token`

**Required** _Defaults to the APPVEYOR_TOKEN environment variable_ AppVeyor API
token

## Example usage

```
- uses: exivity/actions/accept@master
  with:
    scaffold-branch: some-feature-branch
    appveyor-token: ${{ secrets.APPVEYOR_TOKEN }}
```

# `db`

Runs a PostgreSQL docker container, create a new database, pulls in the `db`
repository migrations and runs them.

## Inputs

### `branch`

**Optional** _Default: `develop`_ The db repository branch to use.

### `db-name`

**Optional** _Default: `exdb-test`_ The db name to create.

### `aws-access-key-id`

**Optional** _Defaults to the AWS_ACCESS_KEY_ID environment variable_ The AWS
access key ID

### `aws-secret-access-key`

**Optional** _Defaults to the AWS_SECRET_ACCESS_KEY environment variable_ The
AWS secret access key

### `gh-token`

**Optional** _Defaults to the GH_TOKEN environment variable_ A GitHub token with
access to the exivity/db repository.

## Example usage

```
- uses: exivity/actions/db@master
  with:
    branch: some-feature-branch
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

# `get-artefacts`

Download artefacts for the provided component. It will use the S3 _exivity_
bucket in the _eu-central-1_ region. Artefacts are downloaded with the
_build/{component}/{sha}_ prefix.

## Inputs

### `component`

**Required** Component to download artefacts for

### `sha`

**Optional** Use specific artefacts sha

### `branch`

**Optional** _Defaults to `develop`_ If no sha is provided, resolve sha from
branch name

### `path`

**Required** Put artefacts in this path

### `aws-access-key-id`

**Optional** _Defaults to the AWS_ACCESS_KEY_ID environment variable_ The AWS
access key ID

### `aws-secret-access-key`

**Optional** _Defaults to the AWS_SECRET_ACCESS_KEY environment variable_ The
AWS secret access key

### `gh-token`

**Optional** _Defaults to the GH_TOKEN environment variable_ A GitHub token with
access to the exivity/{component} repository.

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

Use a private key and prime the known_hosts file with pre-loaded keys for
github.com, gitlab.com and bitbucket.org.

## Inputs

### `private-key`

**Required** The full SSH private key.

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

Starts a PostgreSQL server in a Docker container.

## Inputs

### `version`

**Optional** _Default: 12.3_ The PostgreSQL version to use. Currently, only 12.3
is supported.

## Example usage

```
- uses: exivity/actions/postgres@master
  with:
    version: 12.3
```

# `put-artefacts`

Uploads artefacts in the provided directory. It will use the S3 _exivity_ bucket
in the _eu-central-1_ region. Artefacts are uploaded to the
_build/{component}/{sha}_ prefix.

## Inputs

### `path`

**Optional** _Default: build_ Upload artefacts from this path.

### `aws-access-key-id`

**Optional** _Defaults to the AWS_ACCESS_KEY_ID environment variable_ The AWS
access key ID

### `aws-secret-access-key`

**Optional** _Defaults to the AWS_SECRET_ACCESS_KEY environment variable_ The
AWS secret access key

## Example usage

```
- uses: exivity/actions/put-artefacts@master
  with:
    path: artefacts
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

# `rabbitmq`

Starts a RabbitMQ server in a Docker container.

## Inputs

### `version`

**Optional** _Default: 3.8.6_ The RabbitMQ version to use. Currently, only 3.8.6
is supported.

## Example usage

```
- uses: exivity/actions/rabbitmq@master
  with:
    version: 3.8.6
```
