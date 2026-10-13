---
title: 长期记忆与用户记忆
row: M3-L4.5
---
**一句话：** 用户记忆是 agent 记下的关于某一个人的信息（偏好、已确认的约束、决定）；长期记忆是 agent 从过往工作中留下的内容（以往的分析、经验教训）；两者都存放在模型之外，由你的代码划定范围并加载。

## 是什么

新会话从空白开始：模型在两次调用之间什么都不会保留。记忆让 agent 今天就知道你上个月敲定的事。**用户记忆** 保存关于某一个人的事实：偏好、已确认的约束和以往的决定。**长期记忆** 保存 agent 从早期工作中学到的内容，通常供整个团队使用：以往的分析和经验教训。

家庭医生就是这样工作的：你的病历上记着过敏史和常设指令，而诊所的病例笔记则让那里的每位医生都受益。

准确地说，两者的存续时间都比单个[对话 thread](./03-conversation-state.md)、单个[任务](./04-task-state.md)更长。它们是你的应用存储起来、再加载进后续调用的数据。价格这类业务方负责的事实，应放在[业务方自有的知识来源](../13-agent-profiles/03-profile-vs-knowledge.md)里，而不是记忆里。

## FDE 为什么需要

一家内容机构用同一个 Draft agent 服务六个客户品牌，记忆按编辑分别保存。一位编辑从银行客户调到运动服饰品牌后，她的记忆把银行的正式语气带进了运动鞋文案。接替她负责银行客户的人从空白记忆起步，又用了一句银行法务早已否决的措辞。没人看得到 agent 记住了什么，所以也没人能纠正。（示例场景。）

FDE 把记忆按范围拆开：品牌经验（比如法务否决过的措辞）改为以客户为键的长期记忆，由负责该客户的团队共享；工作习惯仍留在各编辑自己的用户记忆里。现在有一个“记忆”标签页，列出每一条记忆及其来源和日期，供编辑纠正。

## 核心概念

### 存储与调取记忆

- **Profile 记录：** 每次调用都会加载的结构化字段，比如一位 Finance 分析师的 `currency: CHF` 和 `exclude: defense (confirmed May 14)`。它们是精确的，所以已确认的约束应放在这里。
- **可检索的笔记：** 许多带日期的小条目，比如附有来源的 Q2 公用事业板块回顾，通过关键词或[向量检索](../../m2/09-rag-knowledge-bases/04-embeddings-and-vector-search.md)调取。它们扩展性好，但检索可能漏掉某一条。
- **通过工具读写的记忆文件：** 由模型自己读取和写入。用 Anthropic 的 memory tool 时，Claude 在 `/memories` 路径下请求 `view` 或 `str_replace` 之类的命令，你的 handler 再把这个路径映射到“比如每个用户一个目录，或数据库中的键”这样的存储上。它可以保存什么，是[写入策略](./06-memory-write-policies.md)要回答的问题。

调取分为预先加载和按需调取两种：Google 的 ADK 提供 `preload_memory`，在每一轮开始时检索记忆；还有 `load_memory`，由 agent 自己决定何时调用。按需调取能省 token，但 agent 可能不去查。

### 按用户、团队和租户划定范围

每次读写都带一个范围键（scope key）：租户、团队、用户。代码从已登录的会话中取得这个键，绝不取自模型或用户输入的文字。memory tool 的 handler 里是这样的：

```python
from pathlib import Path

def resolve(session, path: str) -> Path:
    root = (Path("/srv/memory") / session.tenant_id / session.user_id).resolve()
    target = (root / path.removeprefix("/memories").lstrip("/")).resolve()
    if not target.is_relative_to(root):  # 拦截用 "../" 跳出根目录的路径
        raise PermissionError(path)
    return target
```

### 让用户查看和纠正记忆

向用户展示关于他们的每一条记忆，附上来源和日期，让用户的编辑真正修改已存储的条目，并列出每个回答用到了哪些记忆。Claude 的应用提供用户可以查看和编辑的记忆摘要，而且每个项目有各自独立的记忆。隐私方面的义务见[记忆污染、过期与隐私风险](./07-memory-pollution-staleness-privacy.md)。

## 常见误区

- **“记忆就是模型从我们的对话中学习。”** 没有任何东西会重新训练模型。记忆是你的应用存储并重新加载的数据，所以你可以检查、纠正和删除它。
- **“记忆不过是对旧对话做向量检索。”** 这只是调取方式之一，而检索可能漏掉已确认的约束；约束应放进每次都加载的记录里。
- **“框架默认就会按用户划分记忆范围。”** Microsoft Agent Framework 的一个示例会让所有会话共用同一个记忆文件夹，直到你设置按用户或按租户划分的文件夹。
- **“删除这段对话，agent 记住的内容也就删掉了。”** 记忆与 thread 分开存放；OpenAI 帮助中心说明，ChatGPT 的已保存记忆与对话历史是分开保存的。

## 典型面试题

<details>
<summary>agent 里的用户记忆和长期记忆分别是什么？</summary>

用户记忆涵盖某一个人的偏好、已确认的约束和决定，每次调用都会加载。长期记忆保存过往工作的经验教训和以往的分析，通常由团队共享，需要时再检索。

</details>

<details>
<summary>agent 记忆与 RAG 知识库有什么不同？</summary>

知识库保存业务方拥有并维护的事实，比如政策。记忆来自 agent 的交互，所以需要按用户划定范围，还需要一种让人能检查和纠正它的途径。

</details>

<details>
<summary>为一个要记住以往分析、偏好和已确认约束的 Finance agent 设计记忆。</summary>

每个用户一份记录，保存偏好和已确认的约束，每条都带日期，每次调用都加载。以往的分析做成带日期、带来源的笔记，以租户和团队为键，通过工具来检索。分析师在记忆页面上查看并纠正条目。

</details>

<details>
<summary>agent“忘了”一份记忆里明明有的以往分析，你怎么排查？</summary>

先看 trace：如果没有记忆检索，说明按需调取失败了，我会把工具描述改得更明确，或者预加载一份摘要。如果检索了却没命中，就要查范围键（挂在作者个人用户键下的笔记，同事是看不到的）或排序。最后我会补一条评测用例。

</details>

## 延伸阅读

- 文章：[Bringing memory to Claude](https://claude.com/blog/memory)（Anthropic，约 5 分钟）
- 参考：[Memory: Long-term knowledge with MemoryService](https://adk.dev/sessions/memory/)（Google ADK，约 10 分钟）

## 相关页面

- [Agent 状态与记忆类型](./01-state-and-memory-types.md)
- [记忆写入策略](./06-memory-write-policies.md)
- [记忆污染、过期与隐私风险](./07-memory-pollution-staleness-privacy.md)
- [将 agent 知识与 profile 分离](../13-agent-profiles/03-profile-vs-knowledge.md)
- [Embedding 与向量检索](../../m2/09-rag-knowledge-bases/04-embeddings-and-vector-search.md)
