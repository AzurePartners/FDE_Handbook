---
title: RBAC、最小权限与读写权限
row: M4-L2.2
---
**一句话：** 基于角色的访问控制（Role-Based Access Control）通过角色来授予权限，最小权限是指每个身份只拿到它需要的访问权限，而区分读与写是最基本也最重要的一条界线，尤其是在决定不同的 agent 和用户能查看什么、能执行什么的时候。

## 是什么

**RBAC** 把权限归入角色（查看者、编辑者、管理员），再把角色分配给用户或服务账号（service account）。**最小权限**（最少的访问、最短的时间、默认拒绝）作为通用原则，在模块一中已有讲解（[最小权限](../../m1/04-git-debugging-testing-security/11-least-privilege.md)）；本页的重点是 RBAC 以及 agent 的读写划分。**读与写**的区分是最小权限的第一刀：只需要查询信息的 agent，应该只有只读权限，不能修改，也不能删除。对 AI 系统来说，你要决定每个 agent 或用户能*查看*（读）什么、能*执行*（写入/操作）什么，并且把这两类权限都收得尽量窄，窄到刚好够完成任务。

## FDE 为什么需要

你要负责定义集成及其 agent 所持有的权限。授权过多，尤其是授予 agent 并不需要的写入/执行权限，是安全审查里的头号问题，也是 agent 被操纵或出 bug 时影响范围最大的风险。能做成只读的就做成只读，写入权限则严格限定范围，这样集成才能通过审批，一次失误也不会酿成灾难。

## 核心概念

- **角色：** 一组有名字的权限，分配给各个身份。
- **最小权限：** 最少的访问，最短的时间，默认拒绝。
- **读与写/执行：** 除非任务确实需要修改数据或执行操作，否则只授予只读权限。
- **按 agent 限定权限：** 不同的 agent 拿到不同的、最小的权限集合。
- **随时间收窄：** 从窄处起步，只在需求得到证实时才放宽。

## 常见误区

- **“先给宽泛的权限，以后再收紧。”** “以后”很少真的到来，宽泛的授权会变成长期存在的风险。
- **“agent 要有写权限才有用。”** 很多 agent 只需要读取并给出建议；写入操作应当独立出来，并由 gate 把关。
- **“最小权限会拖慢交付。”** 它能避免那种会让交付慢得多的事故。

## 典型面试题

<details>
<summary>什么是最小权限？它如何应用到 AI agent 上？</summary>

每个身份只给它需要的访问权限，默认拒绝。对 agent 来说，这意味着：只需要查询的地方给只读权限；只为它必须执行的具体操作授予范围严格限定的写入/执行权限；并且每个 agent 使用各自独立、更窄的角色，这样即使出现 bug 或被人操纵，影响也不会超出任务所需的范围。

</details>

<details>
<summary>为什么要为 agent 把读权限和写权限分开？</summary>

因为读取风险低，而真正的破坏发生在写入或执行的时候。只需要获取信息的 agent，永远不该有修改或删除数据的能力。把两者分开可以限制影响范围：出现错误或提示词注入（prompt injection）时，也无法造成 agent 从未被授予的写入。

</details>

## 延伸阅读

- 文章：[OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)（默认拒绝，RBAC 与 ABAC 的对比）
- 文章：[OWASP LLM06: Excessive Agency](https://genai.owasp.org/llm-top-10/)（每个 agent 只配最少的工具和权限）

## 相关页面

- [模块一 → 最小权限](../../m1/04-git-debugging-testing-security/11-least-privilege.md)（通用原则）
- [认证与授权](./01-authentication-vs-authorization-keys-oauth-sessions-and.md)
- [与权限绑定的人在回路](./04-human-in-the-loop-tied-to-permissions.md)
