---
name: "publish"
description: "Commit all changes, push to origin main, and merge into gh-pages branch for GitHub Pages deployment. Invoke when user says '提交并发布', 'publish', or '发布到 GitHub Pages'."
---

# Publish (Commit & Deploy)

One-command workflow to commit, push, and deploy changes to GitHub Pages.

## Steps

Execute the following three steps **in order**:

### Step 1: Git Commit

1. Run `git status --porcelain` to check working tree status.
2. If there are changes, run `git diff --stat` and `git log --oneline -3` to understand the scope and recent history.
3. Stage all changes with `git add -A`.
4. Analyze the diff to generate a conventional commit message:
   - **Type**: `feat` / `fix` / `refactor` / `style` / `docs` / `chore`
   - **Scope**: `ui` / `seo` / `content` / `config` / `build` (omit if unclear)
   - **Description**: Present tense, imperative mood, under 72 chars
5. Execute `git commit -m "<type>[<scope>]: <description>"` with a multi-line body summarizing key changes.
6. If nothing to commit, report "no changes to commit" and skip to Step 2.

### Step 2: Push to Origin

1. Run `git push origin main` to push the current branch to remote.

### Step 3: Merge to gh-pages

1. Run `git push origin main:gh-pages` to fast-forward the gh-pages branch with main's HEAD.
   - This is equivalent to merging main into gh-pages for this GitHub Pages project where gh-pages is the deployment branch and main is the source branch.
   - GitHub Pages will automatically detect the push and rebuild the site.

## Conventions

- **Language**: Commit messages use English. UI redesigns use `refactor(ui):` prefix.
- **Safety**: Never use `--force`, `--no-verify`, or `amend`.
- **Verification**: After each step, check exit code. If a step fails, stop and report the error.

## Example

User says: "提交并发布"

```
Step 1: git add -A && git commit -m "refactor(ui): improve code block styling"
Step 2: git push origin main
Step 3: git push origin main:gh-pages
```

Done. GitHub Pages will deploy within 1-2 minutes.
