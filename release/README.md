# Local development

To save time with the CI/CD roundtrip, you can run the workflows locally with
[act](https://github.com/nektos/act).

First, create a GitHub PAT, save it with:

```bash
export GITHUB_PAT=ghp_xxx
```

Now run:

```bash
yarn build:release && \
    act workflow_dispatch -j release_prepare-test -s GH_BOT_TOKEN=$GITHUB_PAT
```
