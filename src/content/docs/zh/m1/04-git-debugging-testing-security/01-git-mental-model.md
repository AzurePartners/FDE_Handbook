---
title: Git 心智模型
row: M1-L4.1
---
**一句话：** Git 通过三个区域管理项目文件：你编辑文件的工作区，你标记要保存哪些改动的暂存区，以及永久保存快照的提交历史。

## 是什么

Git 是一种版本控制软件，它会为项目文件的每一次保存留下永久记录。Git 仓库（repo）就是一个被 Git 管理的文件夹，里面除了你的文件，还有一个隐藏的 `.git` 文件夹，存放全部历史。理解 Git，关键不在于背命令，而在于搞清楚文件要经过的三个区域。

**工作区**（working tree）就是你看到的那个文件夹：你在编辑器里打开、修改、删除的文件都在这里。**暂存区**（staging area，也叫 index）是一个中转区，你在这里明确列出哪些改动要进入下一次保存。**提交历史**是永久记录：每个提交都是一个快照，带有 ID、作者、提交信息和时间戳，并且指向它的上一个提交。

可以拿写信来类比。工作区是摊在桌上的草稿，随时可以改。暂存区是你已经决定装进信封的那几页。提交则是封好并寄出的信：它从此成为永久记录，不过之后你仍然可以再写一封信补充说明。

## FDE 为什么需要

在客户现场，代码一直在变，有时是你写的，有时是 AI 工具生成的。如果 AI 生成的改动把东西弄坏了，最快的办法往往不是顺着问题往下调试，而是先看改了什么，再把它撤掉。前提是你清楚这个改动停在哪个区域：只在工作区的修改很容易丢弃，已经提交的改动则要用别的命令处理。很多人把这三个区域搞混，结果不小心只提交了一半的改动，或者一慌就删掉了本来还能找回的工作。

## 核心概念

### 三个区域以及改动如何流转

```
 working tree  --git add-->  staging area  --git commit-->  commit history
 (edit files)                (chosen changes)                (permanent snapshots)
      <---------------- git restore ----------------
```

你一编辑文件，改动就出现在工作区。`git add <file>` 把这个改动复制到暂存区。`git commit -m "message"` 把所有已暂存的内容保存为一个新提交；提交之后，在你下次执行 `git add` 之前，暂存区是空的。任何改动都必须先经过暂存区才能进入提交历史，这正是 `git add` 单独作为一步存在的原因：它让你可以只提交部分修改，而不是一次性全部提交。

### 核心命令

```
git status                  # 查看哪些文件有改动，以及它们在哪个区域
git add <file>               # 工作区 -> 暂存区
git add .                     # 暂存所有有改动的文件
git commit -m "message"        # 暂存区 -> 提交历史
git restore <file>              # 丢弃工作区中尚未提交的改动
git restore --staged <file>      # 取消暂存，修改仍保留在工作区
```

`git status` 永远是第一个要跑的命令。它会列出被修改的文件，以及哪些已暂存、哪些还没有，这样你就能准确知道接下来 `git add` 或 `git commit` 会做什么。`git restore` 是针对尚未提交内容的“撤销”命令：不带参数时，它会丢掉工作区里未暂存的修改，把文件恢复到暂存区中的版本（如果没有暂存内容，就恢复到最近一次提交）；加上 `--staged` 时，它只把文件移出暂存区，不改动文件内容。

### 读懂 git status 的输出

```
On branch main
Changes to be committed:
    modified:   app.py
Changes not staged for commit:
    modified:   config.py
```

`app.py` 已暂存，会被包含在下一次提交中。`config.py` 也有修改，但这些修改还只在工作区里；执行 `git add config.py` 就会把它们暂存起来。

## 常见误区

- **“`git add` 就是保存了我的工作。”** 它只是把改动放进暂存区。在运行 `git commit` 之前，这个改动还不是永久历史的一部分。
- **“`git restore` 和 `git restore --staged` 作用一样。”** 不带参数的 `git restore <file>` 会丢弃未暂存的修改，把文件恢复到暂存区中的版本；如果没有暂存内容，就恢复到最近一次提交。`git restore --staged <file>` 只是取消暂存，修改本身完好地留在工作区。
- **“文件一旦暂存，再改它也不会产生新的东西。”** 在 `git add` 之后再编辑已暂存的文件，会在工作区产生第二处独立的改动。这时 `git status` 会显示该文件既已暂存又被修改，你需要再执行一次 `git add`，才能把新的修改也暂存进去。
- **“暂存区可有可无，`git commit -m` 总会提交所有内容。”** `git commit -m` 只提交已暂存的内容。`git commit -a -m` 可以一步完成暂存和提交所有已跟踪且有修改的文件，但新建的（未跟踪的）文件仍然需要显式执行 `git add`。

## 典型面试题

<details>
<summary>工作区、暂存区和提交之间有什么区别？</summary>

工作区就是你当前正在编辑的文件。暂存区存放你用 `git add` 选中、准备放进下一次保存的改动。提交是对当时暂存内容的一份永久快照，带有 ID、作者和提交信息。

</details>

<details>
<summary>你改了三个文件，但只想提交其中一个文件的改动，该怎么做？</summary>

只对那一个文件执行 `git add`，其他两个不要加，然后执行 `git commit -m "message"`。暂存区允许你从工作区的改动中挑出一部分来保存，所以另外两个文件会保持未提交状态。

</details>

<details>
<summary>`git restore --staged <file>` 是做什么的？它和 `git restore <file>` 有什么不同？</summary>

`git restore --staged <file>` 把文件移出暂存区，让它回到“仅在工作区中被修改”的状态，文件内容不变。`git restore <file>`（不带参数）会丢弃工作区中未暂存的修改，把文件恢复到暂存区中的版本，或者最近一次提交。前者保留你的修改，后者会把修改删掉。

</details>

<details>
<summary>如果 `git commit` 似乎保存了错误的内容，你会先检查什么？</summary>

先运行 `git status`，准确看清哪些内容已暂存、哪些还只在工作区。常见原因是忘了对某个文件执行 `git add`，或者先暂存了文件的旧版本，之后又做了修改。

</details>

## 延伸阅读

- 文章：[Learn Git Branching](https://learngitbranching.js.org/)（互动练习，约 2 小时）
- 视频：[freeCodeCamp Git and GitHub crash course](https://www.youtube.com/watch?v=RGOj5yH7evk)（YouTube，约 1 小时）
- 文章：[Atlassian Git tutorials](https://www.atlassian.com/git/tutorials)（Atlassian 出品的 Git 系列教程）

## 相关页面

- [Diff 与撤销提交](./03-diff-and-revert.md)
- [分支与合并](./02-branches-and-merging.md)
- [密钥管理](./09-secrets-management.md)
