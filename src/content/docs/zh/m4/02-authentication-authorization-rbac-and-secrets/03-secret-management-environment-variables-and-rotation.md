---
title: 密钥管理、环境变量与轮换
row: M4-L2.3
---
**一句话：** 密钥（API key、密码、token）必须放在代码之外的安全存储里，在运行时通过环境变量或密钥保管库注入，绝不能写进日志，并且要按计划轮换，一旦暴露就立即轮换。

## 是什么

基础做法包括：不让凭证进入源代码，在运行时通过**环境变量**或密钥保管库注入，并按计划**轮换**，一旦泄露立即轮换。这些在模块一中已有讲解（[密钥管理](../../m1/04-git-debugging-testing-security/09-secrets-management.md)）。到了企业规模，真正关键的细节有：一个托管的**密钥存储 / 密钥保管库**，负责加密密钥并控制访问权限；**按服务账号**（service account）分别发放凭证，而不是共用 key；以及跨多个服务协调轮换。另一个反复出现、又容易被忽略的风险是**在日志中泄露密钥**：调试时把请求或 token 打印出来，密钥就会扩散到日志存放的每一个地方。

## FDE 为什么需要

处理客户的凭证时，一个被提交进仓库或打印进日志的密钥就是需要上报的事故，安全审查也一定过不了。从第一天起就把密钥处理做规范，可以避开企业安全审查中最常见的一项问题。

## 核心概念

- **密钥存储 / 密钥保管库：** 经过加密、受访问控制的密钥存放处。
- **运行时注入：** 用环境变量或 vault API，绝不硬编码。
- **绝不记录密钥：** 写日志之前先脱敏；日志是最主要的泄露渠道之一。
- **轮换：** 按计划轮换，暴露之后也要轮换；旧密钥随之失效。
- **历史很重要：** 把密钥从最新一次提交里删掉，并不会把它从 git 历史里删掉，要轮换。

```python
# 错误做法：API_KEY = "sk-live-abc123"     （写在代码里，永远留在 git 历史中）
import os
api_key = os.environ["API_KEY"]          # 运行时从密钥存储中注入
```

## 常见误区

- **“把密钥从最新一次提交里删掉就解决了。”** 它仍然留在历史里，真正的解决办法是轮换。
- **“环境变量绝对安全。”** 比写在代码里好，但它们会通过日志、错误转储和子进程泄露，要小心处理。
- **“只有被攻破之后才需要轮换。”** 按计划轮换，可以限制任何一次泄露的密钥能被利用多长时间。

## 典型面试题

<details>
<summary>同事把一个 API key 提交进了仓库，你会怎么做？</summary>

马上轮换。它已经在 git 历史里，任何有仓库访问权限的人都可能看到过，所以光删文件不够。然后把它迁到密钥存储里，改成运行时注入，把它加进 .gitignore，并启用提交前（pre-commit）的密钥扫描，防止再发生。

</details>

<details>
<summary>为什么日志是密钥泄露的常见途径？</summary>

日志往往比主存储保存得更久，放在防护较弱的系统里，被更多人读到，所以调试时打印一个 token 或完整的请求，就会悄悄把它扩散出去。解决办法是在任何内容写入日志之前，先对密钥（以及 PII）脱敏。

</details>

## 延伸阅读

- 文章：[OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)（轮换、密钥保管库、代码里不放密钥）
- 文章：[OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)（绝不记录 token、key 和 PII）

## 相关页面

- [模块一 → 密钥管理](../../m1/04-git-debugging-testing-security/09-secrets-management.md)（基础做法）
- [认证与授权](./01-authentication-vs-authorization-keys-oauth-sessions-and.md)
- [PII/PHI 处理与合规基础](../03-real-world-data-quality-freshness-provenance-and-entity/06-pii-phi-handling-and-compliance-basics-soc-2-gdpr-hipaa.md)
