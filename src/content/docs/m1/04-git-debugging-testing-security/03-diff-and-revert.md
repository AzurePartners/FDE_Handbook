---
title: Diff and Revert
row: M1-L4.1
---
**In one sentence:** A diff shows exactly which lines changed between two versions of a file, and a revert undoes a commit by adding a new commit rather than erasing the old one.

## What it is

A diff shows what changed between two versions of a file, line by line. Removed lines start with `-`, added lines start with `+`:

```
-old_price = price * 1.0
+old_price = price * 1.08
```

One line was removed and one added: a tax rate changed from 1.0 to 1.08. Reading a diff is how you review an AI tool's changes before trusting them.

A revert undoes an earlier commit by creating a new commit that applies the opposite change. The mistake still appears in `git log`, followed by the commit that cancels it.

## Why an FDE needs this

At a client, when a change breaks something, the fastest fix is often not to debug forward but to check `git diff` or `git log` for exactly what changed, then revert it. That buys time to investigate the real cause without leaving production broken.

## Key concepts

| Command | What it does | Safe after pushing? |
|---|---|---|
| `git diff` | Shows changes not yet staged | Yes, read-only |
| `git diff --staged` | Shows staged changes | Yes, read-only |
| `git diff <a> <b>` | Compares any two commits | Yes, read-only |
| `git revert <id>` | Adds a new commit that undoes an old one | Yes, history only grows |
| `git reset <id>` | Moves the branch pointer back; can drop commits | No, rewrites shared history |

The contrast to remember: revert adds to history, reset can erase it.

## Common misconceptions

- **"Deleting a commit removes it forever."** Commits stay in history unless you take specific, destructive steps to remove them, like `git reset` on a shared branch. `git revert` is the safe way to undo a change because it adds to the history instead of erasing it.
- **"`git revert` and `git reset` do the same thing."** `git revert` adds a new commit that cancels an old one, keeping both visible. `git reset` moves the branch pointer and can drop commits entirely.

## Typical interview questions

<details>
<summary>How would you undo a commit that already broke production?</summary>

Use `git revert <commit-id>` to create a new commit that undoes the change, keeping the mistake visible in history. Avoid `git reset` if the bad commit has already been pushed, since it can rewrite history others have pulled.

</details>

<details>
<summary>What does a `-` versus a `+` line mean in a diff?</summary>

A `-` line was removed from the old version; a `+` line was added in the new version. A single line changed usually shows as one of each, a removed old value and an added new one.

</details>

## Learn more

- Article: [Learn Git Branching](https://learngitbranching.js.org/) (interactive, about 2 hours)
- Article: [Atlassian Git tutorials](https://www.atlassian.com/git/tutorials) (Atlassian)

## Related

- [Git Mental Model](./01-git-mental-model.md)
- [Branches and Merging](./02-branches-and-merging.md)
