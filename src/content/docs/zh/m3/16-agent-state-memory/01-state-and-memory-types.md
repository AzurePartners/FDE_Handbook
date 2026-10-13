---
title: Agent 状态与记忆类型
row: M3-L4.1
---
**一句话：** agent 依靠五类信息工作（本次调用的上下文、对话、任务进度、关于用户的事实，以及跨任务保留的知识），每一类都有各自的生命周期、负责人和存储。

## 是什么

问起 agent“记住”了什么，你听到的其实是五样东西混在一起。模型在两次调用之间什么都不保留（[消息角色](../../m2/07-llm-application-foundations/04-message-roles.md)），所以所谓记忆，指的是你的代码在每次调用时加载、并在事后写回的那些存储。

设想一位分析师的办公桌：此刻摊开的文件（短期上下文），客户的往来邮件（对话状态），本周的清单（任务状态），一张写着“欧元，不含烟草”的卡片（用户记忆），还有公司的档案库（长期记忆）。每晚清空桌面不会丢任何东西，其余的都已归档。

准确地说，这几类信息的区别在于生命周期、负责人（写入它并为其中的错误负责的组件）和存储（它存放在哪里、用哪个键）。

## FDE 为什么需要

一家资产管理公司的研究 agent 对“记忆”只有一个笼统的概念。一周之内：新开的聊天无视了一位分析师已确认的“不含烟草”规则，这条规则只存在于她的旧对话 thread 里；一位同事重做了上个季度的银行分析，而那份分析其实就在另一位分析师的聊天里；还有一个人的“数字以 EUR 计”，经由一份共享的笔记文件，进入了所有人的报告。

FDE 把每一项都归入这五类，给每类指定了负责人、存储和键（thread、任务、用户、团队），并让代码只加载每次调用所需的内容。没有任何一项修复动过提示词。（示例场景。）

## 核心概念

### 五类信息一览

| 类别 | 存续时间 | 负责人（写入方） | 存储（键） | 金融 agent 示例 |
|---|---|---|---|---|
| 短期上下文 | 一次调用 | 上下文构建器 | 无（每次重建） | 问题、两段申报文件摘录 |
| 对话状态 | 一个对话 thread | 聊天服务 | 消息（thread ID） | 今天关于 X 银行的聊天 |
| 任务状态 | 一项工作 | Orchestrator，每一步写入 | 任务记录（任务 ID） | “筛查 40 家银行：已完成 23 家” |
| 用户记忆 | 直到被修改 | 记忆服务，经确认后写入 | 用户档案（用户 ID） | “只用 EUR；不含烟草（3 月 2 日已确认）” |
| 长期记忆 | 数月，需审核 | 记忆服务或整理者 | 可检索的笔记（团队 ID） | Q2 的银行分析，在 Q3 复用 |

### 模型只能看到应用加载的内容

只有代码加载了的内容才会到达模型，每个存储按各自的键来取：

```python
def run_step(user, thread_id, task_id, question):
    prefs = profiles.get(user.id)                        # 用户记忆
    notes = team_notes.search(question, team=user.team)  # 长期记忆
    task = tasks.get(task_id)                            # 任务状态
    history = threads.get(thread_id)                     # 对话状态
    turn = f"Preferences: {prefs}\nNotes: {notes}\nTask: {task}\n\n{question}"
    reply = client.messages.create(                      # 短期上下文：
        model=os.environ["LLM_MODEL"], max_tokens=1024,  # 只属于这一次调用
        system=PROFILE, messages=history + [{"role": "user", "content": turn}])
    threads.append(thread_id, question, reply.content)   # 只存这一轮，不存额外内容
    return reply
```

写入同样是代码的工作：以 Anthropic 的 memory tool 为例，“Claude 请求文件操作，由你的应用来执行。”至于该允许写什么，那是[记忆写入策略](./06-memory-write-policies.md)要回答的问题。

### 划分一致，叫法各异

各个框架会给这些重新起名。Google 的 ADK 按前缀划定状态键的作用范围：`temp:` 只在一次 invocation 内有效，不带前缀的在一个会话内有效，`user:` 覆盖同一用户的所有会话，`app:` 覆盖所有用户。LangGraph 的“short-term memory”是按 thread 做检查点的状态，按本页的说法，是对话状态和任务状态，而不是短期上下文。LangChain 的文档引用了 CoALA 论文，把长期记忆分为语义记忆（事实）、情景记忆（经历）和程序性记忆（指令）。

## 常见误区

- **“记忆是一个打开就有的功能。”** 它其实是五个存储，生命周期和负责人各不相同；全塞进一个共享的桶里，内容就会在用户之间、任务之间泄露。
- **“聊天历史就是 agent 的记忆。”** 它只是一个 thread 的对话状态。新开的 thread 从空白开始，而埋在聊天文本里的进度很难据此恢复。
- **“agent 自己决定记住什么。”** 模型可以提出写入请求；执行写入、选择存储、决定下次加载什么的，是代码。
- **“长期记忆就是我们的知识库。”** 两者都可以被检索，但知识库由业务方整理维护，而记忆来自 agent 自己的工作，需要单独审核。

## 典型面试题

<details>
<summary>agent 带有哪几类状态和记忆？</summary>

短期上下文（本次调用）、对话状态（thread）、任务状态（一项工作的进度）、用户记忆（某个人的事实和偏好）和长期记忆（跨任务复用的知识）。它们在生命周期、负责人和存储上各不相同。

</details>

<details>
<summary>对话状态和任务状态有什么区别？</summary>

对话状态是一个 thread 中按顺序排列的各轮对话，以 thread ID 为键。任务状态是一项工作的结构化进度，以任务 ID 为键，由代码在每一步之后更新。一次聊天可以发起多个任务，任务也可以比发起它的聊天存活得更久。

</details>

<details>
<summary>你会如何为服务多位编辑的内容 agent 设计状态和记忆？</summary>

每位编辑的聊天是一个 thread。每篇文章是一条任务记录：简报、大纲、草稿位置、审核状态。编辑确认过的语气规则属于用户记忆；过往的调研笔记和审核中总结的经验教训，则是团队的长期记忆，标注日期和来源。

</details>

<details>
<summary>出资人希望 agent“记住我们讨论过的一切”，你怎么回应？</summary>

我会先问他们需要哪几类：通常是已确认的偏好和以往的分析，而不是每一条消息。什么都留着会多花 token，让过期的事实重新冒出来，还会增加隐私方面的义务，所以我会提议建立有名称、有负责人的存储，让用户可以查看和纠正。

</details>

## 延伸阅读

- 参考：[Conversational Context: Session, State, and Memory](https://adk.dev/sessions/)（Google ADK，约 5 分钟）
- 参考：[Memory overview](https://docs.langchain.com/oss/python/concepts/memory)（LangChain，约 12 分钟）

## 相关页面

- [消息角色、系统提示词与对话历史](../../m2/07-llm-application-foundations/04-message-roles.md)
- [上下文与持久化存储](./02-context-vs-durable-persistence.md)
- [对话 thread 与会话](./03-conversation-state.md)
- [任务状态（计划、进度、产物）](./04-task-state.md)
- [长期记忆与用户记忆](./05-long-term-and-user-memory.md)
