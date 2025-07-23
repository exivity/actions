# Push to Central Repository Action

This GitHub Action pushes selected files and folders to a central repository
with an organized structure. It's designed to collect files like README.md,
templates, schema files, and other assets from multiple repositories and
organize them in a centralized location.

## Features

- 🗂️ **Organized Structure**: Automatically organizes files into `schemas/`,
  `templates/`, and `README_sources/` folders
- 🎯 **Flexible Selection**: Choose specific files, folders, or use glob
  patterns for schema files
- 🔧 **Custom Mappings**: Map source paths to custom destination categories
- 🔀 **Pull Request Support**: Option to create pull requests instead of direct
  pushes
- 🧪 **Dry Run Mode**: Test what would be pushed without making changes
- 📁 **Folder Structure Preservation**: Maintains folder structure within
  categories

## Directory Structure

The action creates the following structure in the central repository:

```
/
└── external/
    ├── schemas/
    │   ├── repo-a/
    │   │   ├── foo.schema.json
    │   │   └── bar.schema.json
    │   └── repo-b/
    │       └── baz.schema.json
    │
    ├── templates/
    │   ├── repo-a/
    │   │   ├── template1.html
    │   │   └── partials/
    │   │       └── component.hbs
    │   └── repo-b/
    │       └── widget/
    │           └── index.hbs
    │
    ├── README_sources/
    │   ├── repo-a/
    │   │   └── README.md
    │   └── repo-b/
    │       └── README.md
    │
    └── files/
        ├── repo-a/
        │   └── config.json
        └── repo-b/
            └── settings.yaml
```

## Usage

### Basic Example (Recommended: Multiline YAML)

```yaml
- uses: exivity/actions/push-to-central-repo@main
  with:
    central-repo-owner: 'your-org'
    central-repo-name: 'central-assets'
    files: |
      README.md
      package.json
      *.schema.json
    folders: |
      templates
      docs
    gh-token: ${{ secrets.GITHUB_TOKEN }}
```

### Alternative: Comma-separated format

```yaml
- uses: exivity/actions/push-to-central-repo@main
  with:
    central-repo-owner: 'your-org'
    central-repo-name: 'central-assets'
    files: 'README.md,package.json'
    folders: 'templates,docs'
    gh-token: ${{ secrets.GITHUB_TOKEN }}
```

### Advanced Example with Dry Run

```yaml
- uses: exivity/actions/push-to-central-repo@main
  with:
    central-repo-owner: 'your-org'
    central-repo-name: 'central-assets'
    central-repo-branch: 'develop'
    files: 'README.md,LICENSE,package.json'
    folders: 'templates,documentation'
    dry-run: true
    gh-token: ${{ secrets.PAT_TOKEN }}
```

### Dry Run Example

```yaml
- uses: exivity/actions/push-to-central-repo@main
  with:
    central-repo-owner: 'your-org'
    central-repo-name: 'central-assets'
    files: 'README.md'
    folders: 'templates'
    dry-run: true
    gh-token: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs

| Name                  | Required | Default | Description                                                                                                           |
| --------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------- |
| `central-repo-owner`  | ✅       |         | Owner of the central repository                                                                                       |
| `central-repo-name`   | ✅       |         | Name of the central repository                                                                                        |
| `central-repo-branch` |          | `main`  | Branch in central repository to push to                                                                               |
| `files`               |          |         | List of files/patterns to push (supports glob patterns like `*.schema.json`, multiline YAML list, or comma-separated) |
| `folders`             |          |         | List of folders to push (supports multiline YAML list or comma-separated)                                             |
| `gh-token`            | ✅       |         | GitHub token with write access to the central repository                                                              |
| `dry-run`             |          | `false` | Show what would be done without making changes                                                                        |

## File Categorization

The action automatically categorizes files based on their characteristics and
organizes them under the `external/` folder to clearly distinguish content from
external repositories:

1. **README.md files** → `external/README_sources/{repo-name}/README.md`
2. **Files ending with `.schema.json`** →
   `external/schemas/{repo-name}/{filename}`
3. **Files in `templates/` folder** → `external/templates/{repo-name}/{path}`
4. **Other files** → `external/files/{repo-name}/{filename}`

All commits follow conventional commit format:
`chore: update files from {repo-owner}/{repo-name}`

## Custom Mappings

You can define custom mappings to organize files into specific categories:

```json
{
  "docs": "documentation",
  "config": "configurations",
  "scripts": "automation",
  "styles": "assets"
}
```

This maps:

- Files in `docs/` folder → `external/documentation/{repo-name}/`
- Files in `config/` folder → `external/configurations/{repo-name}/`
- Files in `scripts/` folder → `external/automation/{repo-name}/`
- Files in `styles/` folder → `external/assets/{repo-name}/`

## Security Considerations

- The `gh-token` must have write access to the central repository
- When using `create-pr: true`, the token needs pull request creation
  permissions
- Consider using a dedicated service account or bot token for automation
- Review the `dry-run` output before running in production

## Common Workflows

### On Push to Main Branch

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
      - uses: actions/checkout@v4
      - uses: exivity/actions/push-to-central-repo@main
        with:
          central-repo-owner: 'your-org'
          central-repo-name: 'central-assets'
          files: 'README.md'
          folders: 'templates'
          schema-patterns: '**/*.schema.json'
          create-pr: true
          gh-token: ${{ secrets.PAT_TOKEN }}
```

### Scheduled Sync

```yaml
name: Sync Assets Weekly
on:
  schedule:
    - cron: '0 2 * * 1' # Every Monday at 2 AM

jobs:
  sync-assets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: exivity/actions/push-to-central-repo@main
        with:
          central-repo-owner: 'your-org'
          central-repo-name: 'central-assets'
          files: 'README.md,LICENSE'
          folders: 'templates,docs'
          schema-patterns: '**/*.schema.json'
          gh-token: ${{ secrets.PAT_TOKEN }}
          # Commits will use: "chore: update files from your-org/your-repo"
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure your token has write access to the central
   repository
2. **File Not Found**: Check that specified files and folders exist in your
   repository
3. **Branch Not Found**: Verify the central repository branch exists
4. **Rate Limiting**: Consider adding delays between API calls for large file
   sets

### Debug Mode

Add these steps to debug issues:

```yaml
- name: Debug - List files
  run: |
    echo "Files in current directory:"
    find . -name "*.schema.json" -type f
    ls -la README.md || echo "README.md not found"

- name: Test with dry run
  uses: exivity/actions/push-to-central-repo@main
  with:
    # ... your config ...
    dry-run: true
```
