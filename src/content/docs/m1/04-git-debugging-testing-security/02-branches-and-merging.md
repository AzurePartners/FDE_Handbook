---
title: Branches and Merging
row: M1-L4.1
---
**In one sentence:** A branch is a movable pointer to a commit that gives you a separate line of work where you can make changes safely, and a merge combines that branch's changes back into another one.

## What it is

Working directly on the main version of a project is risky: one bad change can break things for everyone using it. A branch lets you split off a separate line of commits, make changes, test them, and only bring them back once ready. Under the hood a branch is only a label naming one commit; each new commit on the branch moves the label forward, while `main` stays where it was.

In Git, the main line is usually called `main`. To start new work, you create a branch off of `main`, commit your changes there, and later merge the branch back. A merge combines the changes from one branch into another. Usually this happens automatically, but if two branches changed the same lines of the same file in different ways, Git cannot guess which version you want, and you get a merge conflict that needs a human decision.

## Why an FDE needs this

Client codebases are shared and often production-critical, so nobody wants an AI tool's untested change landing straight on `main`. Branches give you a safe place to let an AI make changes and test them before anyone else is affected. If the change turns out wrong, you delete the branch and `main` was never at risk.

## Key concepts

### Creating and switching branches

```
git branch new-feature        # create a new branch
git switch new-feature          # switch to it
git switch -c new-feature       # create and switch in one step
```

`git checkout` and `git checkout -b` are the older forms.

### Merging

```
git switch main
git merge new-feature
```

If the two branches touched different, non-adjacent lines, Git merges automatically and creates a merge commit. If `main` has no new commits since the branch split off, Git simply moves `main` forward to the branch tip (a "fast-forward") and creates no merge commit. If they touched the same or adjacent lines, Git stops and marks the file with conflict markers:

```
<<<<<<< HEAD
old_price = price * 1.0
=======
old_price = price * 1.08
>>>>>>> new-feature
```

Everything between `<<<<<<< HEAD` and `=======` is what is currently on your branch. Everything between `=======` and `>>>>>>> new-feature` is the incoming change. Edit the file to keep the correct version, delete the markers, stage the file, then commit to finish the merge.

### Choosing what to keep

A conflict is not something Git can resolve for you, since it has no idea which value is correct. Read both versions, check which one matches the current intent (a fixed tax rate, a corrected default), and sometimes the right answer is a combination of both, not simply picking one side.

## Common misconceptions

- **"Merging always happens automatically."** It does when changes do not overlap. When two branches edit the same lines, Git needs a human to resolve the conflict.
- **"A merge conflict means someone did something wrong."** It just means two people changed the same lines. It is a normal outcome of parallel work, not a sign of a mistake.
- **"Deleting a branch after merging loses the work."** Once merged, the branch's commits live on in the target branch's history. Deleting the branch pointer just removes the now-unneeded label.

## Typical interview questions

<details>
<summary>What is a merge conflict, and how do you resolve one?</summary>

A merge conflict happens when two branches change the same lines of the same file in different ways, and Git cannot decide which version to keep. Git marks the section with `<<<<<<<`, `=======`, and `>>>>>>>` markers. You edit the file to keep the correct content, remove the markers, stage it, and commit.

</details>

<details>
<summary>Why use a branch instead of committing straight to main?</summary>

A branch isolates your changes so `main` stays stable and deployable while you work. If your change breaks something, `main` is unaffected and others keep working from a known-good state.

</details>

<details>
<summary>Two teammates both edited the same function on separate branches. What happens when the second one merges?</summary>

Git tries an automatic merge first. If the edits touch separate, non-adjacent lines it succeeds on its own; if they touch the same or adjacent lines, Git stops and marks a conflict in the file, which the second person resolves by hand before completing the merge.

</details>

## Learn more

- Article: [Learn Git Branching](https://learngitbranching.js.org/) (interactive, about 2 hours)
- Video: [freeCodeCamp Git and GitHub crash course](https://www.youtube.com/watch?v=RGOj5yH7evk) (YouTube, about 1 hour)
- Article: [Atlassian Git tutorials](https://www.atlassian.com/git/tutorials) (Atlassian)

## Related

- [Git Mental Model](./01-git-mental-model.md)
- [Pull Request Workflow](./04-pull-request-workflow.md)
- [Diff and Revert](./03-diff-and-revert.md)
