---
title: 密钥管理
row: M1-L4.4
---
**一句话：** 密钥（API key、数据库密码、token）永远不应该出现在代码或 git 仓库里，而应该通过专门为此设计的系统来存储和轮换。

## 是什么

密钥是指任何能授予访问权限、一旦被错误的人看到就会造成危害的值。密钥管理就是让这些值远离源代码和版本控制，把它们存放在专门设计用来安全保存它们的地方。

对小项目来说，合适的默认做法是使用环境变量：在代码库之外设置、由程序在启动时读取的值。在本地，这就是一个永远不提交到 git 的 `.env` 文件：

```
# .env (never committed)
DATABASE_URL=postgres://user:pass@localhost/app
WEATHER_API_KEY=abc123
```

```python
import os
db_url = os.environ["DATABASE_URL"]
```

`os.environ` 本身不会读取 `.env`，必须先有东西把它加载进来（见[开发环境](../01-ai-assisted-development/03-dev-environment.md)）。`.env` 文件必须写进 `.gitignore`，这样 git 永远不会跟踪它。提交到仓库的是一个 `.env.example` 文件，里面只有变量名、没有真实的值，让新加入的人知道需要填哪些内容。

对于生产系统，尤其是在客户那里，密钥不再放在 `.env` 里，而是放进专门的密钥存储服务，比如 Azure Key Vault。它集中存放密钥，控制谁能读取，并且在开启诊断日志后可以记录每一次访问。应用在启动时向 vault 请求密钥，由 vault 决定是否交给它。

## FDE 为什么需要

密钥泄露是安全事件，不是小 bug，而且这是 AI 工具常犯的错误，因为网上的示例代码为了直观，经常直接把 key 硬编码进去。FDE 要在上线前发现这个问题：密钥一旦被提交，即使之后的提交把它删掉，它仍然留在项目的历史里；如果仓库是公开的，这段历史也同样公开。

## 核心概念

### 绝不写进代码，配置文件也不行

密钥绝不能出现在源文件、提交信息或已提交的配置文件里，`docker-compose.yml` 也一样。私有仓库同样适用这条规则，因为私有仓库也可能被意外公开。

### 轮换

轮换是指定期把密钥替换成新值，或者在怀疑泄露后立即替换，让旧值的任何副本都失效。有了密钥存储服务，轮换会容易得多：只需要在一个地方更新，而不用翻遍每个可能存有副本的配置文件。一旦某个 key 被提交过，就要把它当作已经泄露并立即轮换，因为事后删掉那一行并不能把它从历史中移除。

## 常见误区

- **“先临时提交一个密钥，之后再删掉就行。”** 提交过的密钥会一直留在 git 历史里，可以从任何更早的提交中找回来。要立即轮换，而不只是删掉那一行。
- **“私有仓库存密钥已经足够安全。”** 私有仓库可能被意外公开、被 fork，或者被共享给外包人员，而他们并不需要历史里的每一个密钥。
- **“在生产环境，环境变量和密钥存储服务一样好。”** `.env` 适合小项目；生产环境中的客户数据需要密钥存储服务提供的访问控制和审计日志。

## 典型面试题

<details>
<summary>为什么密钥永远不应该提交到 git 仓库，即使是私有仓库？</summary>

git 会记录历史，所以提交过的密钥即使后来被删除，也仍然可以从更早的提交中恢复出来。私有仓库可能被公开、被 fork，或者被分享给超出预期范围的人，因此任何曾经提交过的密钥都应视为已泄露。

</details>

<details>
<summary>环境变量和 Azure Key Vault 这类密钥存储服务有什么区别？</summary>

环境变量让密钥不出现在代码里，程序启动时从操作系统或 `.env` 文件读取。密钥存储服务在此基础上增加了访问控制（哪些系统可以读取哪个密钥）、审计日志，以及在一个地方统一轮换密钥的能力。

</details>

<details>
<summary>你在某个仓库的历史里发现了六个月前提交的一个 API key，你会怎么做？</summary>

立即轮换这个 key：生成一个新的，并吊销旧的，因为在后续提交中删掉它并不能把它从历史中移除。检查这个 key 是否有被使用的迹象，并确认 `.gitignore` 已经覆盖了存放它的文件。

</details>

## 延伸阅读

- 文章：[Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)（OWASP，密钥管理速查表，约 30 分钟）
- 文章：[The Twelve-Factor App, Config](https://12factor.net/config)（12factor.net，十二要素应用中的配置原则）

## 相关页面

- [Git 心智模型](./01-git-mental-model.md)
- [API 认证](../03-apis-data-integration/02-auth.md)
- [配置](../05-containers-deployment/06-config-and-env-vars.md)
- 在模块 4 中深入讲解：[密钥管理、环境变量与轮换](../../m4/02-authentication-authorization-rbac-and-secrets/03-secret-management-environment-variables-and-rotation.md)
