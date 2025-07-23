# Example workflows for push-to-central-repo action

## Overview

All files pushed by this action are organized under the `external/` folder in
the central repository to clearly distinguish content from external
repositories.

The structure created will be:

- `external/README_sources/{repo-name}/`
- `external/schemas/{repo-name}/`
- `external/templates/{repo-name}/`
- `external/files/{repo-name}/`

All commits use conventional commit format:
`chore: update files from {owner}/{repo}`

## Basic Usage

This workflow pushes README.md and files from templates folder to a central
repository:

```yaml
name: Push Assets to Central Repo

on:
  push:
    branches: [main]
    paths:
      - 'README.md'
      - 'templates/**'
      - '**/*.schema.json'

jobs:
  push-assets:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Push to central repository
        uses: exivity/actions/push-to-central-repo@main
        with:
          central-repo-owner: 'your-org'
          central-repo-name: 'central-assets'
          files: |
            README.md
            *.schema.json
          folders: |
            templates
          gh-token: ${{ secrets.PAT_TOKEN }}
```

## Dry Run Testing

This workflow tests what files would be pushed without making actual changes:

```yaml
name: Test Asset Push (Dry Run)

on:
  pull_request:
    paths:
      - 'README.md'
      - 'templates/**'
      - '**/*.schema.json'

jobs:
  test-push:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Test push (dry run)
        uses: exivity/actions/push-to-central-repo@main
        with:
          central-repo-owner: 'your-org'
          central-repo-name: 'central-assets'
          files: |
            README.md
            LICENSE
          folders: |
            templates
            docs
          dry-run: true
          gh-token: ${{ secrets.GITHUB_TOKEN }}
```

## Scheduled Sync

This workflow runs weekly to sync documentation and templates:

```yaml
name: Weekly Asset Sync

on:
  schedule:
    - cron: '0 2 * * 1' # Every Monday at 2 AM
  workflow_dispatch: # Allow manual trigger

jobs:
  sync-assets:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Sync to central repository
        uses: exivity/actions/push-to-central-repo@main
        with:
          central-repo-owner: 'your-org'
          central-repo-name: 'central-assets'
          central-repo-branch: 'develop'
          files: |
            README.md
            LICENSE
            CHANGELOG.md
          folders: |
            templates
            docs
          gh-token: ${{ secrets.PAT_TOKEN }}
```
