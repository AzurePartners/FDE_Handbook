---
title: Diff 与撤销提交
row: M1-L4.1
---
**一句话：** diff 精确显示一个文件的两个版本之间改了哪些行；revert（撤销提交）通过新增一个提交来抵消某个提交，而不是把旧提交抹掉。

## 是什么

diff 逐行显示一个文件两个版本之间的变化。被删除的行以 `-` 开头，新增的行以 `+` 开头：

```
-old_price = price * 1.0
+old_price = price * 1.08
```

这里删了一行、加了一行：税率从 1.0 改成了 1.08。在信任 AI 工具的改动之前，你就是靠读 diff 来审查它们的。

revert 通过创建一个新提交、应用相反的改动，来撤销之前的某个提交。出错的那个提交仍然会出现在 `git log` 里，后面紧跟着抵消它的那个提交。

## FDE 为什么需要

在客户现场，某个改动把东西弄坏时，最快的办法往往不是顺着问题往下调试，而是用 `git diff` 或 `git log` 查清到底改了什么，然后把它 revert 掉。这样可以先让生产环境恢复正常，再腾出时间去查真正的原因。

## 核心概念

| 命令 | 作用 | 推送后使用是否安全？ |
|---|---|---|
| `git diff` | 显示尚未暂存的改动 | 安全，只读 |
| `git diff --staged` | 显示已暂存的改动 | 安全，只读 |
| `git diff <a> <b>` | 比较任意两个提交 | 安全，只读 |
| `git revert <id>` | 新增一个提交来撤销旧提交 | 安全，历史只增不减 |
| `git reset <id>` | 把分支指针往回移，可能丢弃提交 | 不安全，会改写共享的历史 |

要记住的区别：revert 是往历史里加东西，reset 可能会把历史抹掉。

## 常见误区

- **“删掉一个提交，它就永远消失了。”** 除非你采取特定的破坏性操作（比如在共享分支上执行 `git reset`），否则提交会一直留在历史里。`git revert` 是撤销改动的安全方式，因为它是在历史上追加，而不是抹除。
- **“`git revert` 和 `git reset` 作用一样。”** `git revert` 新增一个提交来抵消旧提交，两个提交都保留可见。`git reset` 移动分支指针，可能会把提交彻底丢掉。

## 典型面试题

<details>
<summary>某个提交已经把生产环境搞坏了，你会怎么撤销它？</summary>

用 `git revert <commit-id>` 创建一个新提交来撤销这次改动，同时让出错的提交在历史中保持可见。如果有问题的提交已经推送，就不要用 `git reset`，因为它可能改写别人已经拉取的历史。

</details>

<details>
<summary>diff 中以 `-` 开头和以 `+` 开头的行分别表示什么？</summary>

`-` 开头的行是从旧版本中删除的，`+` 开头的行是新版本中新增的。修改一行通常会同时显示一行 `-` 和一行 `+`：删掉旧值，加上新值。

</details>

## 延伸阅读

- 文章：[Learn Git Branching](https://learngitbranching.js.org/)（互动练习，约 2 小时）
- 文章：[Atlassian Git tutorials](https://www.atlassian.com/git/tutorials)（Atlassian 出品的 Git 系列教程）

## 相关页面

- [Git 心智模型](./01-git-mental-model.md)
- [分支与合并](./02-branches-and-merging.md)
