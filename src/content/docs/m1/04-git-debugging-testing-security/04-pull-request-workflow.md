---
title: Pull Request Workflow
row: M1-L4.1
---
**In one sentence:** A pull request (PR) is a request, made on a hosting platform like GitHub, to merge one branch into another, with a review step in between.

## What it is

Git itself only has branches and merges, which can happen with no review at all. A pull request, sometimes called a merge request, wraps a merge in a review step. Instead of merging your branch straight into `main`, you push the branch to the remote and open a PR, which shows the full diff, lets teammates comment on specific lines, and only merges once approved.

A PR typically includes a title, a description of what changed and why, the diff, reviewer comments on specific lines, and a merge button enabled once required approvals are in. Some teams also require automated tests to pass first.

## Why an FDE needs this

Pull requests give a client's own engineers one last look at a diff before it ships, which is exactly where an AI's confident-sounding but wrong change gets caught. A clear PR description also lets a reviewer understand the change without reading every line, which matters when you are new to a client's codebase and need their trust.

## Key concepts

### Clone, push, and pull

A **remote** is a copy of the repo hosted elsewhere, such as on GitHub. `git clone` copies it to your machine and names that remote `origin`. `git push` sends your new commits to the remote; `git pull` fetches commits others pushed and merges them into your current branch.

```
git clone https://github.com/acme/app.git   # copy the repo; remote is named origin
git pull                                     # bring in teammates' new commits
git push -u origin new-feature               # send your branch; -u remembers the pairing
```

### Opening a pull request

After pushing your branch, the hosting platform offers to open a PR comparing your branch against the target branch, usually `main`. A good PR description states what changed, why it changed, and how a reviewer can test it, for example which commands to run.

### Code review etiquette

- Review the diff, not the person. Comment on the code, for example "this loop can run twice on a retry", rather than "you missed this".
- Ask questions instead of issuing commands when unsure: "why not validate here too?" opens a conversation.
- Keep PRs small and focused on one change, so a reviewer can hold the whole thing in their head.
- Respond to every comment, even just to say "fixed" or "good catch, left as is because X".

### After approval

Once required approvals are in, and any automated checks pass, the PR is merged into the target branch. Most teams then delete the now-merged branch, since its commits already live in the target branch's history.

## Common misconceptions

- **"A pull request is a Git feature."** Pull requests are a feature of hosting platforms like GitHub or GitLab, not part of Git itself. Git only has branches and merges; the review workflow is added on top.
- **"Small PRs waste reviewers' time with too many requests."** The opposite is true: small, focused PRs get reviewed faster than one giant PR nobody wants to open, and they are easier to revert if something is wrong.
- **"A merged PR means the change is definitely correct."** Review catches what a reviewer notices, not everything. Tests and monitoring after merge still matter.

## Typical interview questions

<details>
<summary>What should a good pull request description include?</summary>

What changed, why it changed, and how a reviewer can test it, for example which commands to run. A good description lets a reviewer understand the change without reading every line of the diff first.

</details>

<details>
<summary>What is the difference between Git and a platform like GitHub for pull requests?</summary>

Git provides branches and merging as core features that work entirely locally. Pull requests are a hosting-platform feature built on top of Git, adding a review workflow, inline comments, and required approvals before a merge.

</details>

<details>
<summary>A reviewer leaves a comment you disagree with. How do you respond?</summary>

Respond directly on the comment rather than ignoring it, explaining your reasoning or asking a clarifying question, for example "left as is because the retry already handles that case, let me know if I'm missing something." Every comment gets a response, even if the answer is that no change is needed.

</details>

## Learn more

- Article: [Learn Git Branching](https://learngitbranching.js.org/) (interactive, about 2 hours)
- Article: [Atlassian Git tutorials](https://www.atlassian.com/git/tutorials) (Atlassian)

## Related

- [Branches and Merging](./02-branches-and-merging.md)
- [Diff and Revert](./03-diff-and-revert.md)
- [AI Code Review](../01-ai-assisted-development/06-verify-dont-trust.md)
