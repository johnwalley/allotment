# AGENTS.md

Allotment is a React split-view component published to npm. See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup and commands.

## Commit messages

[release-please](https://github.com/googleapis/release-please) generates releases and `CHANGELOG.md` from commit messages on `main`, so the commit type decides whether a change ships and appears in the changelog.

- `fix:` and `feat:` are only for changes to what users of the published `allotment` package get: code in `src/`, runtime `dependencies` or `peerDependencies` in the root `package.json`.
- Everything else uses a non-releasing type such as `chore:`, `docs:`, `test:`, `ci:` or `build:`. This includes:
  - dev dependency updates (`chore(deps): …`)
  - anything under `website/`, including its dependencies, even though they are listed under `dependencies` in `website/package.json`
  - Storybook stories, tests, CI and tooling config

PRs are squash-merged, so the PR title becomes the commit message. Check the title's type before merging.

If a commit on `main` has the wrong type, don't rewrite history. Add a commit override to the merged PR's body instead:

```
BEGIN_COMMIT_OVERRIDE
chore(deps): update dependency foo to v1.2.3 (#123)
END_COMMIT_OVERRIDE
```
