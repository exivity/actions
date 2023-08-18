# Trigger Workflows Action

This GitHub Action allows you to trigger workflows in other repositories. It's
particularly useful when you want a workflow in one repository to initiate
workflows in multiple other repositories.

### Running the Action Locally

## Usage in Workflows

To use this action in your workflows, add the following step:

\```yaml

- name: Trigger Other Workflows uses: exivity/trigger-workflows-action@main
  with: token: ${{ secrets.TRIGGER_TOKEN }} repos:
  'proximity,pigeon,use,transcript,edify' \```
