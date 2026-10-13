---
title: 上下文与持久化存储
row: M3-L4.2
---
**一句话：** 上下文是模型在一次调用中看到的内容，由你的应用每次重新构建；持久化存储则是进程之外的存储，在崩溃、重新部署或新会话之后，它仍然保有这项任务。

## 是什么

模型在两次调用之间什么都不保留；每次调用只能看到你的应用组装好的上下文（[消息角色、系统提示词与对话历史](../../m2/07-llm-application-foundations/04-message-roles.md)）。两次调用之间，这些文本通常存放在某个进程的内存里，崩溃或重新部署会把它抹掉，另一台服务器上的会话也永远看不到它。

打个比方，玩电子游戏：断电会清掉没保存的进度，但存档文件还在，而云存档在任何一台主机上都能加载。

准确地说，上下文是为一次调用准备的临时视图。持久化存储则是在既定的时间点（比如每一步之后），把状态写入比进程活得更久的存储（数据库、对象存储或持久卷），再由代码据此重建每次调用的上下文。

## FDE 为什么需要

一家媒体客户的 Content Operations agent（Research、Plan、Draft、Review）把每周的简报当作一段很长的对话，放在一个 worker 进程里运行。简报长到装不进窗口后，团队换成了 100 万 token 的模型，开启了压缩，就宣布记忆问题已经解决。结果一份压缩摘要丢掉了编辑制定的“不引用供应商新闻稿”规则，一份简报就引用了这些新闻稿。后来，一次例行部署在草稿写到一半时重启了 worker，agent 又从 Research 重新开始。

FDE 保留了压缩，但把计划、来源、已完成的章节和已确认的决定移进一条 Postgres 任务记录，每一步之后保存一次，并据此构建每次调用的上下文。她在草稿写到一半时杀掉一个 worker，另一台机器上全新的 worker 就从下一节接着写。

## 核心概念

### 更大的窗口不等于记忆

很长的历史更贵，因为每次调用都要重新发送它；它还会拉低质量：Anthropic 的压缩文档写道，“随着对话变长，回复质量会下降”（[上下文污染与上下文腐化](../../m2/08-prompting-context-structured-output/05-context-pollution.md)）。塞得进窗口，不等于存下来了：

| 技术 | 作用 | 重启后还在吗？ |
|---|---|---|
| 更大的上下文窗口 | 一次调用能装下更多内容 | 否：窗口不存储任何东西 |
| 压缩 | 对较早的几轮对话做摘要 | 仅当你把摘要存下来 |
| 上下文编辑（context editing） | 清除旧的工具结果 | 否：它只裁剪请求 |
| 数据库记录或记忆文件 | 把状态保存在进程之外 | 是，对任何 worker 都成立 |

Anthropic 的文档认为，对于“需要在许多变量之间保持精确状态”的任务，压缩并不是理想的选择；它为长时间运行的 agent 设计的 harness，则加入了进度文件和 git 历史，因为“压缩并不够用”。

### 先外部化，再重建

每一步之后保存；每次调用之前重建上下文：

```python
def run_task(task_id):
    task = store.load(task_id)          # 持久化的记录
    while task.next_step:
        messages = build_context(task)  # 每次调用都重新构建
        reply = client.messages.create(model=os.environ["LLM_MODEL"],
                                       max_tokens=4096, messages=messages)
        if reply.stop_reason != "end_turn":  # 被截断或被拒绝
            raise StepIncomplete(reply.stop_reason)
        text = "".join(b.text for b in reply.content if b.type == "text")
        task.complete(task.next_step, text)
        store.save(task)                # 在下一步之前保存
```

在 `store.save` 之后崩溃不会丢任何东西；在它之前崩溃则会重复一个步骤，所以带副作用的步骤需要[去重](../17-persistent-agents/05-duplicate-execution.md)。记录里存什么，属于[任务状态](./04-task-state.md)。Anthropic 的 memory tool 会这样告诉模型：“假定会被打断：你的上下文窗口随时都可能被重置。”

### 新机器测试

如果这个 worker 现在就挂了，另一台机器上全新的 worker，只凭任务 ID，能从存储里接着往下做吗？它必须能找到计划、已完成的步骤及其输出、已确认的决定，以及一切正在进行中的事项，比如一项待处理的审批。任何回答是“在对话里”的，都算不通过；[恢复测试（故障注入）](../17-persistent-agents/08-recovery-testing.md)会真的把这个测试跑一遍。

## 常见误区

- **“我们的模型有 100 万 token 的窗口，所以 agent 什么都记得。”** 窗口只装得下一次调用，崩溃或开新会话之后，它什么都不会留下。
- **“agent 框架会负责持久化。”** 只有持久化的后端才行：Google ADK 的内存会话服务在重启时会丢掉“所有对话数据”，而 OpenAI 的 `SQLiteSession` 不给文件路径时，数据会“在进程结束时丢失”。
- **“我们保存了每一条消息，所以任务可以恢复。”** 这保存的是对话记录，而不是任务进行到了哪一步；要恢复，就得重新加载一段可能装不下的历史，再去猜进度。

## 典型面试题

<details>
<summary>agent 的上下文和它持久化的状态有什么区别？</summary>

上下文是一次模型调用看到的内容，由应用构建，随进程消失。持久化的状态则在每一步之后写入存储，每次调用的上下文都由它重建。

</details>

<details>
<summary>压缩和上下文编辑与持久化存储有什么不同？</summary>

两者都是在缩减模型看到的内容：压缩是对较早的几轮对话做摘要，上下文编辑是清除过期的工具结果。两者都不存储任何东西；只有写入存储的进度，才能挺过崩溃。

</details>

<details>
<summary>客户说用了 100 万 token 的模型，他们的 agent 就不需要数据库了。你怎么回应？</summary>

窗口只装得下一次调用：重新部署或开新会话时，它从空白开始，而且很长的上下文更贵，质量也会下降。我会把进度和决定存进他们的数据库，再演示一个被杀掉的 worker 恢复运行。

</details>

<details>
<summary>部署之后，一个 agent 把写到一半的报告从头重来，还丢掉了一条已确认的约束。你怎么排查？</summary>

我会先查进度和这条约束存放在哪里：进程内存挺不过一次部署，而被压缩过的聊天可能丢掉一条约束。我会把两者都移进每一步之后保存的任务记录，再加一个终止 worker 再恢复的测试。

</details>

## 延伸阅读

- 文章：[Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)（Anthropic，约 10 分钟）
- 参考：[Sessions](https://openai.github.io/openai-agents-python/sessions/)（OpenAI Agents SDK，约 15 分钟）

## 相关页面

- [Agent 状态与记忆类型](./01-state-and-memory-types.md)
- [上下文污染与上下文腐化](../../m2/08-prompting-context-structured-output/05-context-pollution.md)
- [卷与持久化](../../m1/05-containers-deployment/02-volumes-and-persistence.md)
- [持久化执行（检查点、重放、恢复）](../17-persistent-agents/02-durable-execution.md)
- [Token 与上下文窗口](../../m2/07-llm-application-foundations/02-tokens-and-context-windows.md)
