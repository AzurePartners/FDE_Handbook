---
title: 可复现的环境搭建
row: M7-L3.2
---
**一句话：** 可复现的环境搭建是一份记录下来的“配方”，涵盖 profile、Skill、代码、工具、数据和配置，让别人能从零重建你的 Alpha，并得到相同的行为。

## 是什么

构建 Alpha，就是把架构图上列出的各部分做出来：agent profile、各个 Skill、代码、工具连接、知识数据，以及一个基础界面或工作区。可复现，意味着这些部分都被写下来并做了版本管理，而不是只存在于你的脑子里或某个浏览器标签页里。

对 Course Support Assistant（课程支持助手）来说，这些部分包括：一个写明助手角色和禁止操作的 profile 文件、一个检索脚本、一个政策文件夹，以及一个简单的聊天页面。Profile 的格式见 [Agent Profile](../../m3/13-agent-profiles/02-agent-profiles.md)（M3），Skill 见 [Agent Skills](../../m3/14-agent-skills/01-agent-skills.md)（M3）。

## FDE 为什么需要

客户项目会被交接、暂停、再重启。如果 Alpha 只能在你的笔记本上、靠上周二贴进终端的一个 key 才能运行，你就没法交接，没法重跑评测，也没法判断某个改动是否有效。明天结果看起来不一样时，你需要知道变的是代码、提示词、数据还是模型。

## 核心概念

有三个习惯能让环境可复现。第一，密钥不进仓库，从环境变量中加载，见 [密钥管理](../../m4/02-authentication-authorization-rbac-and-secrets/03-secret-management-environment-variables-and-rotation.md)（M4）。第二，固定模型名称、提示词文件、数据快照和工具配置的版本。第三，按顺序写下命令，然后在一个干净的文件夹里测试一遍。记录格式见 [版本记录](../../m4/05-deployment-ci-cd-observability-and-production-readiness/03-version-records-model-prompt-data-tools-and-config.md)（M4）。

```text
repo/
  profile.md            agent 角色、边界、升级规则
  skills/               每个 Skill 一个文件夹
  data/policies/        源文档快照
  app/                  检索和模型调用代码
  .env.example          必需变量的名称，不含值
  VERSIONS.md           模型、提示词、数据、工具配置
  README.md             搭建和运行步骤
```

### 你要交付什么

- 按上面结构组织的仓库（或工作区导出）。
- `.env.example`，列出系统需要的每个变量。
- `VERSIONS.md`，包含一张表：

| 项目 | 值 |
|---|---|
| 模型 | （确切的模型名称） |
| 提示词文件及版本 | `profile.md`，v3 |
| 数据快照 | `data/policies`，快照日期 |
| 工具或 MCP 配置 | （文件名） |

- 一份 README，用编号步骤写清从一台干净机器到得到第一个回答的全过程。

### 通过标准

- 全新 clone 一份仓库，只按 README 操作，就能得到第一个正确的回答。
- 仓库和 README 中都没有出现任何密钥。
- `VERSIONS.md` 与实际运行的内容一致。
- 每个手动步骤都写了下来，包括申请账号或权限。

## 常见误区

- **“我这边能跑，就算搭好了。”** 它必须在干净环境的人那里也能跑。隐藏的本地文件和环境变量，通常就是“在我机器上能跑”的原因。
- **“可复现就是要容器化。”** 容器有帮助，但不是必需的。对 Alpha 来说，清晰的步骤加固定的版本就能达标。
- **“平台上的配置不需要记录。”** 在 UI 里做的设置，如果没人导出或截图，就会丢失。这些也要写下来。

## 典型面试题

<details>
<summary>你是怎么让 Alpha 可复现的？</summary>

我把 profile、Skill、代码和数据快照放进同一个仓库，在 `.env.example` 中列出必需的变量，在 `VERSIONS.md` 中固定版本，并写了一份 README。然后在一个干净的文件夹里按 README 操作，测试了一遍。

</details>

<details>
<summary>你怎么处理 API key？</summary>

它们放在环境变量里，绝不进仓库。仓库里只有一个列出变量名的模板文件。

</details>

<details>
<summary>有人说回答一夜之间变了。你的环境搭建方式怎么帮上忙？</summary>

我会对比 `VERSIONS.md` 中的条目，看模型、提示词、数据或工具配置是否有变化，然后把变化的那一项单独隔离出来排查。

</details>

## 延伸阅读

- 文章：[The Twelve-Factor App](https://12factor.net/)（Adam Wiggins，简短的在线指南；重点看 Dependencies 和 Config 两节）。

## 相关页面

- [端到端薄切片](./01-thin-end-to-end-slice.md)
- [Alpha 通过条件](./04-alpha-pass-condition.md)
- [版本记录](../../m4/05-deployment-ci-cd-observability-and-production-readiness/03-version-records-model-prompt-data-tools-and-config.md)（M4）
- [密钥管理](../../m4/02-authentication-authorization-rbac-and-secrets/03-secret-management-environment-variables-and-rotation.md)（M4）
- [Agent Profile](../../m3/13-agent-profiles/02-agent-profiles.md)（M3）
