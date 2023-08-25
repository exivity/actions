# `trigger-workflow` Action

This GitHub Action lets you initiate workflows in different repositories. It’s
designed for situations where a workflow in one repository needs to activate
workflows in other repositories.

### Running the Action Locally

To be determined based on your project setup.

## Usage in Workflows

To incorporate this action in your workflows, use the following step:

```yaml

- name: Trigger External Workflows
  uses: exivity/trigger-workflow@main
    with:
      gh-token: ${{ secrets.GH_TOKEN }}
      repo: 'target-repo-name'
      workflow: 'desired-workflow-file.yml' # e.g. 'build.yml'
```

### Inputs

- `gh-token`: A GitHub token with repository access. Not mandatory; defaults to
  ${{ github.token }}.
- `repo`: Specifies the repository in which the workflow should be triggered.
  This is mandatory.
- `workflow`: Defines the specific workflow to be initiated. Optional; defaults
  to 'build.yml'.
