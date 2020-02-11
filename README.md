# @exivity/actions

Public GitHub Actions used at Exivity for CI/CD

## `init-ssh`

This action sets up a private key and prime the known_hosts file with
pre-loaded keys for github.com, gitlab.com and bitbucket.org.

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
