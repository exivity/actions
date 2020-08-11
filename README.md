# @exivity/actions

Public GitHub Actions used at Exivity for CI/CD

_Available actions:_

- [`rabbitmq`](#rabbitmq)
- [`db-server`](#db-server)
- [`init-ssh`](#init-ssh)

# `rabbitmq`

Starts a RabbitMQ server in a Docker container.

## Inputs

### `version`

**Optional** _Default: 3.8.6_ The RabbitMQ version to use. Currently, only 3.8.6 is supported.

## Example usage

```
uses: exivity/actions/rabbitmq@master
  with:
    version: 3.8.6
```

# `db-server`

🚧 _Work in progress..._

# `init-ssh`

Use a private key and prime the known_hosts file with pre-loaded keys for
github.com, gitlab.com and bitbucket.org.

## Inputs

### `private-key`

**Required** The full SSH private key.

## Example usage

```
uses: exivity/actions/init-ssh@master
  with:
    private-key: ${{ secrets.PRIVATE_KEY }}
```

Where the `PRIVATE_KEY` secret contains your private key:

```
-----BEGIN RSA PRIVATE KEY-----
key contents
-----END RSA PRIVATE KEY-----
```
