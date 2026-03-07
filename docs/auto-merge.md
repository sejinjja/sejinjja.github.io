# Auto-merge Workflow

## Purpose

The repository now includes `.github/workflows/auto-merge.yml` to enable GitHub auto-merge for pull requests that match one of these conditions:

- The pull request author is `dependabot[bot]`
- The pull request has the `automerge` label

The workflow skips draft pull requests and uses `gh pr merge --auto --squash "$PR_URL"` so GitHub waits for required checks and approvals before merging.

## Repository Prerequisite

`gh pr merge --auto` only works when the repository setting is enabled.

1. Open the repository on GitHub.
2. Go to `Settings > General`.
3. Find the `Pull Requests` section.
4. Confirm that `Allow auto-merge` is enabled.

If the setting is disabled, the workflow fails with an error that points back to this prerequisite.

## Workflow Behavior

- Trigger: `pull_request_target`
- Supported events: `opened`, `reopened`, `synchronize`, `labeled`, `ready_for_review`
- Required permissions: `contents: write`, `pull-requests: write`
- Merge strategy: squash merge

## Verification With a Test PR

1. Create a test branch from the default branch.
2. Modify a safe dummy file, such as a temporary note in `docs/auto-merge.md` or another non-production text file.
3. Push the branch and open a pull request.
4. Add the `automerge` label to the pull request, or use a Dependabot PR.
5. Open the `Actions` tab and confirm the `Auto Merge` workflow runs successfully.
6. Open the pull request page and confirm it shows `Auto-merge enabled`.
7. After required checks and approvals pass, confirm GitHub merges the pull request automatically.
8. Delete the test branch and close out any temporary verification changes.
