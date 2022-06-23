# Local development

To save time with the CI/CD roundtrip, you can run the workflows locally with
[act](https://github.com/nektos/act).

First, create a GitHub PAT, save it with:

```bash
echo GH_BOT_TOKEN=ghp_xxx > .secrets
```

Run prepare:

```bash
yarn build:release && \
    act workflow_dispatch --job release_prepare-test --rm
```

Run release:

```bash
yarn build:release && \
    act --eventpath fixtures/release/push_event.json --job release_release-test --rm
```
