---
title: 消息角色、系统提示词与对话历史
row: M2-L1.4
---
**一句话：** LLM 请求是一个有序的消息列表，每条消息都标明了作者是谁；由于模型在两次调用之间什么都不记得，你的应用每一轮都要把整段对话重发一遍。

## 是什么

一次模型调用就是一个消息列表，每条消息都带有一个角色标签。系统提示词存放 operator（即构建这个应用的一方）的常设指令。用户消息是最终用户每一轮的发言，加上应用附带的数据。助手消息是模型之前说过的话。

打个比方，想想一个没有记忆的临时工：每个班次你都要把案卷交给他，常设指令放在最上面，还要付钱让他把全部内容重读一遍。

模型是无状态的。用 Anthropic 的话说：“Messages API 是无状态的，这意味着你每次都要把完整的对话历史发送给 API。”聊天看起来有记忆，只是因为应用把每一轮追加到一个列表里，再整个重发。

## FDE 为什么需要

一家区域性保险公司的理赔助手，让浏览器把完整的 `messages` 数组（包括系统提示词）直接 POST 给部署在三个容器上的后端。一位理赔员在 DevTools 里修改了提示词，允许“任意金额的赔付”，机器人就起草了一封批准函。后来的修复把对话历史放在容器内存里，结果只要请求落到另一个容器上，或者部署重启，机器人就会“忘记”理赔单号。

FDE 把系统提示词移到了服务端配置里，把对话历史存进以对话 ID 为键的 Postgres，并把赔付上限写进了代码。

## 核心概念

### 各家供应商的角色

| 作用 | Anthropic | OpenAI | Gemini |
|---|---|---|---|
| operator 的指令 | 顶层的 `system` 字段 | `developer` 消息（仍接受 `system`）或 Responses 的 `instructions` | `system_instruction` |
| 模型之前的发言 | `assistant` | `assistant` | `model` |
| 工具结果 | `user` 消息中的 `tool_result` 块 | `tool` 角色，或 Responses 的 `function_call_output` | 一个函数响应 part |

Anthropic 最新的模型还接受出现在对话中途的系统消息。

### 优先级靠训练，没有保证

模型被训练成偏向 operator 的指令：Anthropic 表示，当用户发言与之冲突时，“来自系统的指令优先”。Microsoft 则提醒：“系统消息并不能保证模型遵守每一条规则”，而 2025 年的“Control Illusion”研究发现，这种优先级划分在六个模型上都不可靠。硬性限制要在代码里强制执行；密钥不要放进提示词。

### “上下文”不是第三种角色

文档、检索到的段落和工具结果都是数据，要作为带标签的用户角色内容发送（在 Anthropic 上是 document、image 或 `tool_result` 块），或者放在工具角色里。Anthropic 建议把“不可信的内容放在 tool_result 块里，而不是放在系统提示词或普通的用户文本块里”。模型分辨不出助手发言是否真的出自它自己，所以任何能编辑对话历史的人都可以伪造这些发言。提示词和对话历史必须由服务器而不是浏览器来掌管。

### 应用就是记忆

```python
def chat(conversation_id, user_text):
    history = db.load(conversation_id)  # 来自数据库，而不是进程内存
    history.append({"role": "user", "content": user_text})
    reply = client.messages.create(
        model=os.environ["LLM_MODEL"], max_tokens=1024,
        system=SYSTEM_PROMPT,  # 来自服务端配置，绝不来自浏览器
        messages=history,
    )
    history.append({"role": "assistant", "content": reply.content})
    db.save(conversation_id, history)
    return reply
```

要保存每一个内容块，而不只是文本，这样工具调用块和思考块才不会丢；部分最新的模型会拒绝被编辑过的对话历史。

如果系统提示词有 1,000 个 token，每条用户发言 100 个 token，每条回复 300 个 token，那么第 20 轮要发送 8,700 个输入 token，所以越往后的轮次越贵、开始响应得也越慢；整场对话合计约 98,000 个 token。提示词缓存降低的是重复前缀的价格，而不是它占用的窗口。供应商保存的状态（OpenAI 的 `previous_response_id`、Gemini 的 `previous_interaction_id`）省去的是重发，而不是处理；OpenAI 仍然把整条链按输入计费。

## 常见误区

- **“模型记得之前几轮的对话。”** 其实是应用把它们重发了一遍。面向消费者的“记忆”功能只是把保存下来的笔记加进上下文，模型本身从未改变。
- **“系统提示词是放安全限制的稳妥之处。”** 它只是提高了优先级，并不保证被遵守，而且还可能泄露。
- **“文档应该放进系统提示词，这样模型才会重视它们。”** 这样做会把 operator 的权威赋予不可信的文本，还会破坏缓存；应当把文档作为用户内容发送。
- **“由供应商保存对话，长对话就便宜了。”** 完整的对话历史每一轮仍然会被处理，OpenAI 也仍然把它按输入计费。

## 典型面试题

<details>
<summary>什么是系统提示词？它和用户消息有什么不同？</summary>

它是 operator 为整段对话设定的常设指令，由应用放在专门的字段里。用户消息是最终用户每一轮的发言，加上附带的数据。两者冲突时，模型被训练成偏向系统提示词。

</details>

<details>
<summary>在 Anthropic 的 API 和 OpenAI Chat Completions 中，工具结果分别放在哪里？</summary>

Anthropic 使用 `user` 消息中的 `tool_result` 块，通过 `tool_use_id` 对应。Chat Completions 使用 `tool` 角色的消息，带有 `tool_call_id`。适配器必须在两者之间做映射。

</details>

<details>
<summary>你的助手运行在三个做了负载均衡的容器上。对话历史应该放在哪里？</summary>

放在以对话 ID 为键的数据库里；浏览器只发送这个 ID 和新消息。进程内存在多个容器之间、重启之后都会失效，而由浏览器构造的 `messages` 数组会让用户能改写系统提示词。

</details>

<details>
<summary>用户说机器人忘了两条消息之前的订单号。你怎么排查？</summary>

我先看之前那条消息是否在日志记录的 `messages` 里。可能的原因有：某条回复从未被追加、对话历史只存在于单个容器里、发生了重启、被裁剪，或者对话 ID 用错了。如果它就在里面却被忽略了，那是上下文质量问题，而不是状态 bug。

</details>

## 延伸阅读

- 参考：[Using the Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages)（Anthropic，约 10 分钟）
- 参考：[Conversation state](https://developers.openai.com/api/docs/guides/conversation-state)（OpenAI，约 15 分钟）

## 相关页面

- [LLM API（请求、响应、流式输出、SDK）](./03-llm-apis.md)
- [Token 与上下文窗口](./02-tokens-and-context-windows.md)
- [提示词结构](../08-prompting-context-structured-output/01-prompt-structure.md)
- [上下文工程](../08-prompting-context-structured-output/04-context-engineering.md)
- [卷与持久化](../../m1/05-containers-deployment/02-volumes-and-persistence.md)
