---
title: Pull Request 工作流
row: M1-L4.1
---
**一句话：** pull request（PR）是在 GitHub 这类托管平台上发起的请求，要求把一个分支合并到另一个分支，中间加了一道审查环节。

## 是什么

Git 本身只有分支和合并，合并完全可以不经任何审查就发生。pull request（有时也叫 merge request）在合并外面套了一层审查流程。你不是直接把分支合并进 `main`，而是先把分支推送到远程仓库，再发起一个 PR。PR 会展示完整的 diff，同事可以针对具体某一行发表评论，只有通过批准后才会合并。

一个 PR 通常包括：标题、对改了什么以及为什么改的说明、diff、评审人针对具体行的评论，以及在拿到必需的批准后才可点击的合并按钮。有些团队还要求自动化测试先通过。

## FDE 为什么需要

pull request 让客户自己的工程师在代码上线前最后看一眼 diff，而 AI 那种听起来很自信、实际却是错的改动，恰恰就是在这一步被拦下来的。清楚的 PR 说明还能让评审人不必逐行阅读就理解这次改动。你刚接触客户的代码库、需要赢得对方信任时，这一点尤其重要。

## 核心概念

### clone、push 和 pull

**远程仓库**（remote）是托管在别处（比如 GitHub 上）的一份仓库副本。`git clone` 把它复制到你的机器上，并把这个远程仓库命名为 `origin`。`git push` 把你的新提交发送到远程仓库；`git pull` 拉取别人推送的提交，并合并到你当前的分支。

```
git clone https://github.com/acme/app.git   # 复制仓库，远程仓库名为 origin
git pull                                     # 拉取同事的新提交
git push -u origin new-feature               # 推送你的分支；-u 会记住这个对应关系
```

### 发起 pull request

推送分支之后，托管平台会提示你发起一个 PR，把你的分支和目标分支（通常是 `main`）进行比较。好的 PR 说明要讲清楚改了什么、为什么改，以及评审人如何测试，比如要运行哪些命令。

### 代码审查礼仪

- 审查的是 diff，不是人。针对代码发表评论，比如“重试时这个循环可能会执行两次”，而不是“你漏了这个”。
- 拿不准时用提问代替命令：“为什么这里不也做一下校验？”这样能打开讨论。
- PR 要小，每个 PR 只聚焦一处改动，让评审人能把整个改动装在脑子里。
- 每条评论都要回复，哪怕只是说一句“已修复”，或者“发现得好，但因为 X 暂不修改”。

### 批准之后

拿到必需的批准、所有自动化检查也通过后，PR 就会被合并到目标分支。大多数团队随后会删除这个已合并的分支，因为它的提交已经保存在目标分支的历史里了。

## 常见误区

- **“pull request 是 Git 的功能。”** pull request 是 GitHub、GitLab 这类托管平台提供的功能，不是 Git 本身的一部分。Git 只有分支和合并，审查流程是在它之上额外加的。
- **“小 PR 太多，会浪费评审人的时间。”** 恰恰相反：小而聚焦的 PR，比一个谁都不想打开的巨型 PR 审得更快；出了问题也更容易撤销。
- **“PR 合并了，就说明改动肯定是对的。”** 审查只能发现评审人注意到的问题，不可能面面俱到。合并后的测试和监控依然重要。

## 典型面试题

<details>
<summary>一份好的 pull request 说明应该包含什么？</summary>

改了什么、为什么改，以及评审人如何测试，比如要运行哪些命令。好的说明能让评审人在逐行阅读 diff 之前就理解这次改动。

</details>

<details>
<summary>在 pull request 这件事上，Git 和 GitHub 这类平台有什么区别？</summary>

Git 提供分支和合并这些核心功能，完全可以在本地运行。pull request 是托管平台在 Git 之上构建的功能，增加了审查流程、行内评论，以及合并前的必需批准。

</details>

<details>
<summary>评审人留了一条你不同意的评论，你会怎么回应？</summary>

直接在这条评论下回复，而不是置之不理：说明你的理由，或者提一个澄清性的问题，比如“暂不修改，因为重试逻辑已经处理了这种情况，如果我漏了什么请告诉我”。每条评论都要有回应，即使答案是不需要改。

</details>

## 延伸阅读

- 文章：[Learn Git Branching](https://learngitbranching.js.org/)（互动练习，约 2 小时）
- 文章：[Atlassian Git tutorials](https://www.atlassian.com/git/tutorials)（Atlassian 出品的 Git 系列教程）

## 相关页面

- [分支与合并](./02-branches-and-merging.md)
- [Diff 与撤销提交](./03-diff-and-revert.md)
- [AI 代码审查](../01-ai-assisted-development/06-verify-dont-trust.md)
