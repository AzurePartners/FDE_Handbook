---
title: Git Mental Model
row: M1-L4.1
---
**In one sentence:** Git tracks a project's files through three areas, the working tree where you edit, the staging area where you mark what to save, and the commit history where saved snapshots live forever.

## What it is

Git is version control software: a tool that keeps a permanent record of every saved change to a project's files. A Git repository ("repo") is a folder Git watches, containing your files plus a hidden `.git` folder that stores the whole history. Understanding Git means understanding three areas a file passes through, not just memorizing commands.

The **working tree** is the folder as you see it: the files you open, edit, and delete in an editor. The **staging area** (also called the index) is a holding area where you list exactly which changes should go into the next save. The **commit history** is the permanent record: each commit is a snapshot with an ID, an author, a message, and a timestamp, plus a link back to the commit before it.

Think of writing a letter. The working tree is the draft on your desk, still changeable. The staging area is the pages you have decided to put in the envelope. The commit is the envelope once sealed and mailed: it now exists as a permanent record, even though you can still write and send a follow-up letter later.

## Why an FDE needs this

At a client, code changes constantly, sometimes written by you, sometimes by an AI tool. If an AI-generated change breaks something, the fastest fix is often not to debug forward but to check what changed and undo it. That only works if you understand which area a change is sitting in: an edit only in the working tree is easy to discard, one already committed needs a different command. Confusing the three areas is how people accidentally commit half a change, or panic and delete work that was actually still recoverable.

## Key concepts

### The three areas and how changes move

```
 working tree  --git add-->  staging area  --git commit-->  commit history
 (edit files)                (chosen changes)                (permanent snapshots)
      <---------------- git restore ----------------
```

A change starts in the working tree the moment you edit a file. `git add <file>` copies that change into the staging area. `git commit -m "message"` takes everything staged and saves it as a new commit; afterwards nothing is staged until your next `git add`. Nothing reaches the commit history without passing through staging first, which is why `git add` exists as its own step: it lets you commit only some of your edits, not all of them at once.

### The core commands

```
git status                  # see which files changed, and which area they're in
git add <file>               # working tree -> staging area
git add .                     # stage every changed file
git commit -m "message"        # staging area -> commit history
git restore <file>              # discard uncommitted changes in the working tree
git restore --staged <file>      # unstage a file, keep the edit in the working tree
```

`git status` is the command to run first, always. It lists modified files, which are staged and which are not, so you know exactly what `git add` or `git commit` would do next. `git restore` is the "undo" command for anything not yet committed: with no flag it throws away unstaged working-tree edits, putting the file back to its staged version (or the last commit, if nothing is staged), and with `--staged` it moves a file back out of staging without touching its content.

### Reading git status output

```
On branch main
Changes to be committed:
    modified:   app.py
Changes not staged for commit:
    modified:   config.py
```

`app.py` is staged and will be included in the next commit. `config.py` has edits too, but they are still only in the working tree; `git add config.py` would stage them.

## Common misconceptions

- **"`git add` saves my work."** It only moves a change into the staging area. The change is not part of the permanent history until `git commit` runs.
- **"`git restore` and `git restore --staged` do the same thing."** Plain `git restore <file>` discards the unstaged edit, putting the file back to its staged version, or the last commit if nothing is staged. `git restore --staged <file>` only unstages it; the edit itself stays in the working tree, unharmed.
- **"Once a file is staged, editing it again does nothing new."** Editing a staged file after `git add` creates a second, separate change in the working tree. `git status` then shows the file as both staged and modified, and you need to `git add` it again to stage the new edit too.
- **"The staging area is optional; `git commit -m` always commits everything."** `git commit -m` only commits what is staged. Running `git commit -a -m` stages and commits all tracked, modified files in one step, but new (untracked) files still need an explicit `git add`.

## Typical interview questions

<details>
<summary>What is the difference between the working tree, the staging area, and a commit?</summary>

The working tree is your files as you currently edit them. The staging area holds changes you have chosen, with `git add`, to include in the next save. A commit is a permanent snapshot of exactly what was staged at the time, with an ID, an author, and a message.

</details>

<details>
<summary>You edited three files but only want to commit changes to one of them. How do you do that?</summary>

Run `git add` on only that one file, not the others, then `git commit -m "message"`. The staging area lets you choose a subset of your working-tree changes to save, so the other two files stay uncommitted.

</details>

<details>
<summary>What does `git restore --staged <file>` do, and how is it different from `git restore <file>`?</summary>

`git restore --staged <file>` moves a file out of the staging area, back to just "modified in the working tree", without changing its content. `git restore <file>` (no flag) discards the unstaged working-tree edit, resetting the file to its staged version, or the last commit. The first keeps your edit; the second deletes it.

</details>

<details>
<summary>What would you check first if `git commit` seems to have saved the wrong thing?</summary>

Run `git status` to see exactly what is staged versus what is still only in the working tree. A common cause is forgetting to `git add` a file, or staging an old version of a file before making a later edit.

</details>

## Learn more

- Article: [Learn Git Branching](https://learngitbranching.js.org/) (interactive, about 2 hours)
- Video: [freeCodeCamp Git and GitHub crash course](https://www.youtube.com/watch?v=RGOj5yH7evk) (YouTube, about 1 hour)
- Article: [Atlassian Git tutorials](https://www.atlassian.com/git/tutorials) (Atlassian)

## Related

- [Diff and Revert](./03-diff-and-revert.md)
- [Branches and Merging](./02-branches-and-merging.md)
- [Secrets Management](./09-secrets-management.md)
