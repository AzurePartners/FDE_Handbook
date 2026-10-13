---
title: 对话 thread 与会话
row: M3-L4.3
---
**一句话：** 对话 thread（常被称为会话）是一次对话按顺序存储下来的记录，有自己的 ID 和负责人；你的应用每一轮都加载并续写它，聊天才能在以后恢复。

## 是什么

模型在两次调用之间什么都不保留，所以一个会“记得”的聊天，其实是应用在重新加载一份存储下来的记录（[消息角色](../../m2/07-llm-application-foundations/04-message-roles.md)）。这份记录就是 thread；Google 的 ADK 把 `Session` 称为“用户与你的 agent 之间的单个对话 thread”。

打个比方，客服工单：有编号、有客户，每条消息按顺序排列，随时可以交给下一个班次接手。

准确地说，一个 thread 有 ID、负责人（某个租户内的用户，租户即客户组织）、有序的条目，以及最近活跃时间之类的元数据。LangGraph 称它为 thread；Google、OpenAI、Anthropic 和 Microsoft 的 agent SDK 称它为 session。

## FDE 为什么需要

一家财富管理公司的研究助手，只用 OpenAI 的 `previous_response_id` 链来保存历史，最新的 ID 放在浏览器和分享链接里。已存储的响应过期后，顾问们丢失了较早的聊天；合规部门想要公司从未持有过的对话记录；还有一位顾问通过粘贴来的链接，打开了同事与客户的讨论：后端拿到什么 ID 就取什么。

FDE 把历史移进了公司自己的 Postgres：每个聊天一行 `threads`（负责人、租户、最近活跃时间），每条消息、工具调用、结果或摘要一行 `thread_items`。每次加载都按已登录的顾问过滤，合规部门读取公司自己的表。（示例场景。）

## 核心概念

### 对话 thread 保存什么

每个条目都按顺序编号：用户消息和助手消息、每次工具调用及其结果（API 会拒绝没有结果的工具调用，见[工具调用循环](../../m2/10-tool-calling-deterministic-logic/02-tool-call-loop.md)），以及标明替换了哪些条目的摘要。它不包含每次调用的额外内容，比如检索到的段落，也不包含[任务进度](./04-task-state.md)和[用户记忆](./05-long-term-and-user-memory.md)，这两者有各自的存储。

### 谁来存储历史

| 方案 | 存放位置 | 你发送 | 注意事项 |
|---|---|---|---|
| 应用自管 | 你的数据库 | 你构建的视图 | schema、裁剪、留存都由你负责 |
| 框架会话 | 你选择的存储（ADK 的 `DatabaseSessionService`、LangGraph 的 checkpointer） | 会话 ID | 内存存储或本地存储只存在于一台主机上 |
| 供应商托管的对话 | OpenAI Conversations API；Claude Managed Agents 会话（beta） | 它的 ID 和新的输入 | 删除一个 OpenAI conversation，其中的条目仍会保留 |
| 响应链 | OpenAI `previous_response_id`；Gemini `previous_interaction_id` | 上一个 ID 和新的输入 | 响应会过期：OpenAI 30 天；Gemini 付费版 55 天，免费版 1 天 |

供应商校验的是你的 API key，而不是你的用户；负责人校验仍然要由你来做。只保留一个事实来源：OpenAI 的 Agents SDK 不会在服务端接续对话的机制之上再叠加它自己的 session。

### 裁剪，但不丢失记录

记录会保留每一个条目，供回看和审计；你发送的视图则是最新的摘要加上最近几轮（保留什么，见[上下文工程](../../m2/08-prompting-context-structured-output/04-context-engineering.md)）。Anthropic 的 `compaction` 摘要块要原样保留，包括 `signature`。有些工具会覆盖这份记录：OpenAI 的 `OpenAIResponsesCompactionSession` 会“清除并重写会话历史”。留存期限则是[另一个问题](./07-memory-pollution-staleness-privacy.md)。

### 为正确的用户恢复对话 thread

按 thread ID 和已登录用户来加载（[按用户的访问权限与操作 gate](../../m2/12-safety-guardrails-hitl/05-action-gates.md)）；OpenAI 的 Agents SDK 文档警告说，session ID“并不对用户做认证”。对取回的内容再校验一次负责人；2023 年 3 月，一个 Redis 客户端的 bug 曾让部分 ChatGPT 用户看到了其他用户的聊天标题。然后，对崩溃时留下的、没有得到答复的工具调用，补上一个“interrupted”结果。

```python
def resume(thread_id, user, text):
    thread = threads.get(thread_id, owner=user.id, tenant=user.tenant)
    if thread is None or (thread.owner, thread.tenant) != (user.id, user.tenant):
        raise NotFound()
    fixes = interrupted_results(thread.items)
    turn = {"role": "user", "content": fixes + [{"type": "text", "text": text}]}
    reply = client.messages.create(
        model=os.environ["LLM_MODEL"], max_tokens=1024, system=SYSTEM_PROMPT,
        messages=summary_and_recent(thread.items) + [turn])   # 视图
    thread.append(turn, reply.content)            # 记录
    return reply
```

## 常见误区

- **“聊天可以放在用户的 web 会话里。”** web 会话属于某一次登录和某一个浏览器，而且会过期；thread 需要有自己的 ID 和持久化存储。
- **“供应商替我们存了对话，我们就没问题了。”** 已存储的响应可能过期，供应商分不清你的用户，而审计需要导出。
- **“对较早的几轮做摘要，就是把它们删掉。”** 摘要改变的是模型看到的内容；存储的记录可以保持完整。

## 典型面试题

<details>
<summary>什么是对话 thread，它存储什么？</summary>

它是一次对话的存储记录：ID、负责人、有序的条目（消息、带结果的工具调用、摘要）和元数据。因为模型什么都不保留，应用每一轮都要重新加载它。

</details>

<details>
<summary>应用自管的历史与供应商存储的对话状态有什么区别？</summary>

应用自管：由我来存储条目、构建每一个视图，留存和访问都由我控制。供应商存储：我发送一个 ID，由供应商在前面补上历史；代码更少，但要适用它的留存规则，而负责人校验仍然在我这边。

</details>

<details>
<summary>你会如何为两家子公司的 300 名分析师存储 thread？</summary>

一张 `threads` 表（ID、负责人、租户、标题、最近活跃时间），按负责人建索引；再加一张 `thread_items` 表（thread ID、序号、类型、调用 ID、内容）。每条查询都按负责人和租户过滤；每家子公司各自设定留存期限。

</details>

<details>
<summary>部署之后，重新打开的聊天报 400 错误。你检查什么？</summary>

检查 thread 的末尾：worker 在工具执行到一半时被杀掉，留下了一个没有结果的调用，API 会拒绝它。我会在加载时补上“interrupted”结果，并把每次调用连同它的结果以原子写入的方式一起保存。

</details>

## 延伸阅读

- 参考：[Session: Tracking individual conversations](https://adk.dev/sessions/session/)（Google ADK，约 10 分钟）
- 参考：[Work with sessions](https://code.claude.com/docs/en/agent-sdk/sessions)（Claude Agent SDK，约 12 分钟）

## 相关页面

- [消息角色、系统提示词与对话历史](../../m2/07-llm-application-foundations/04-message-roles.md)
- [Agent 状态与记忆类型](./01-state-and-memory-types.md)
- [任务状态（计划、进度、产物）](./04-task-state.md)
- [上下文工程](../../m2/08-prompting-context-structured-output/04-context-engineering.md)
- [SQL 基础：SELECT、INSERT、JOIN](../../m1/03-apis-data-integration/11-sql-basics.md)
