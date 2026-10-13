---
title: 工作流模式（提示词链、路由、并行化）
row: M3-L3.2
---
**一句话：** 工作流模式是用普通代码连接模型调用的几种固定方式：提示词链（prompt chaining）按顺序运行各步骤，并在步骤之间加检查；路由把每个输入送上一条专用路径；并行化同时运行多个调用，再合并结果。

## 是什么

很多业务任务的步骤可以事先列出来。工作流模式把这些步骤连在一起：每一步里由模型做语言方面的工作，接下来运行什么由代码决定。

打个比方，急诊室里，分诊把每位病人分流到各自该去的地方，各项检查并行进行，手术要等检查结果通过核对才开始，就像链中的一道 gate。

路径由代码固定，所以它们是[工作流，而不是 agent](./01-workflows-vs-agents.md)。如果由模型在运行时挑选子任务（orchestrator-workers），见[多 agent 系统](./04-multi-agent-systems.md)；评判循环见[审核与 critic 模式](./08-review-and-critic-patterns.md)。

## FDE 为什么需要

一家制造企业的采购团队用一个包办一切的长提示词来审核收到的合同（保密协议、供应商协议、租赁合同）。每次为保密协议做的修补都会弄坏供应商协议，而且当一份摘要引用了合同里根本没有的责任上限时，没人能说清是哪一部分出了问题。

FDE 把它重建成了工作流。路由器给每份合同打上标签：保密协议、供应商协议、租赁合同或其他，“其他”交给律师助理处理。提取步骤返回逐字引文，由一个代码 gate 确认每条引文确实出现在合同里。随后每种类型各自的检查并行运行，由代码合并。现在各个提示词可以独立修改，失败也会被拦在某个明确命名的步骤上。（示例场景。）

## 核心概念

### 带 gate 的提示词链

每次调用只做一步，并把输出交给下一步。gate 是步骤之间的一道代码检查：输出能不能解析？必需的部分在不在？提到的产品在目录里存不存在？如果检查不通过，就带着错误信息重试一次、转人工，或者停下来；绝不能往下传。

### 路由

第一次调用对输入分类；然后由代码把它送上一条有自己的提示词、工具或模型的路径。Anthropic 给出的理由是：不做路由，“针对某一类输入做优化，可能会损害其他输入上的表现”。让路由器从固定的列表里返回一个标签（见[结构化输出](../../m2/08-prompting-context-structured-output/06-structured-output.md)），再加一个兜底标签，比如 `other`，然后在带标签的示例上单独测试路由器。如果表单字段已经给出了类别，就直接用代码路由。

### 并行化：分段与投票

分段（sectioning）同时运行相互独立的几个部分，由代码合并：比如合同检查，或者与主回答并行、负责筛查输入的[护栏](../../m2/12-safety-guardrails-hitl/01-input-and-output-guardrails.md)。投票（voting）把同一个任务运行多次并设一个阈值，比如只要三项检查中有一项标记了某笔付款，就标记这笔付款。各次投票必须有可能不一致，所以 Anthropic 的示例会让各次调用的提示词有所不同。自洽性（self-consistency）方面的研究（Wang 等，ICLR 2023）发现，对采样得到的多条推理路径做多数投票，提高了准确率。

### 取舍

| 模式 | 调用次数 | 等待时间 | 换来什么 |
|---|---|---|---|
| 提示词链，3 步 | 3 | 各步耗时之和 | 每一步更简单，步骤之间有检查 |
| 路由加路径 | 2 | 多一次调用 | 专用提示词，可以用更便宜的模型 |
| 分段，3 部分 | 3 | 最慢的那一部分 | 每部分更聚焦，速度更快 |
| 投票，3 票 | 3 | 最慢的那一票 | 结果更可信，阈值可调 |

并行的分支仍然受同一套[限流](../../m1/03-apis-data-integration/04-rate-limits.md)约束。只有评测表明某个模式“确实改善了结果”（Anthropic）时才保留它。

### 先用普通代码

Anthropic 建议“从直接使用 LLM API 开始：很多模式只用几行代码就能实现”。

```python
client = anthropic.AsyncAnthropic()

async def llm(prompt):
    r = await client.messages.create(model=os.environ["LLM_MODEL"], max_tokens=2000,
                                     messages=[{"role": "user", "content": prompt}])
    return "".join(b.text for b in r.content if b.type == "text")

async def review_contract(text):
    kind = (await llm(ROUTER + text)).strip()          # 1. 路由
    if kind not in CHECKS:
        return to_paralegal(text, kind)
    clauses = await llm(EXTRACT + text)                 # 2. 提示词链
    missing = find_unquoted(clauses, text)              # 3. gate（普通代码）
    if missing:
        return to_paralegal(text, missing)
    checks = [llm(p + clauses) for p in CHECKS[kind]]   # 4. 分段
    return merge_into_table(await asyncio.gather(*checks))
```

LangGraph、Google ADK 和 Microsoft Agent Framework 提供同样的基本构件。必须扛得住崩溃，或者要等人处理的流程，需要[持久化执行](../17-persistent-agents/02-durable-execution.md)。

## 常见误区

- **“一个调得好的提示词就能处理所有类型的请求。”** 为一种类型做的修补常常弄坏另一种；路由能把改动限制在局部。
- **“并行运行调用能省钱。”** 省的是时间；每个分支都要花 token，投票还会让成本成倍增加。
- **“这些模式需要 agent 框架。”** 普通代码就能实现；Anthropic 提醒，框架的抽象可能把你调试时要看的提示词和响应藏起来。

## 典型面试题

<details>
<summary>什么是提示词链、路由和并行化？</summary>

它们都是固定路径的工作流模式：依次调用，并在调用之间设置代码 gate；由分类器为每个输入选择一条专用路径；同时发起多个调用（相互独立的部分或重复尝试），再由代码合并。

</details>

<details>
<summary>分段与 orchestrator-workers 有什么区别？</summary>

分段的子任务事先在代码里固定；orchestrator-workers 中的子任务由模型针对每个输入来决定：更灵活，但更难测试，成本也更高。

</details>

<details>
<summary>设计一个每周运行的流程：调研、提纲、初稿、SEO 标题和社交媒体帖子。</summary>

把调研、提纲和初稿串成一条提示词链，在提纲这一步设 gate，检查必需的章节和有来源的陈述。然后并行撰写标题和社交媒体帖子，发布由编辑审批。

</details>

<details>
<summary>一条四步的提示词链要花 40 秒。你怎么办？</summary>

在 trace 里查看每一步的延迟，把相互独立的步骤并行化，把规则类的步骤挪进代码，在评测仍然达标的地方试用更小的模型，如果用户可以等，就放到后台运行。

</details>

## 延伸阅读

- 文章：[Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)（Anthropic，约 15 分钟）
- 练习：[Basic workflows](https://platform.claude.com/cookbook/patterns-agents-basic-workflows)（Claude Cookbook，约 20 分钟）
- 参考：[Workflows and agents](https://docs.langchain.com/oss/python/langgraph/workflows-agents)（LangChain docs，约 25 分钟）

## 相关页面

- [工作流与 agent](./01-workflows-vs-agents.md)
- [审核与 critic 模式](./08-review-and-critic-patterns.md)
- [多 agent 系统](./04-multi-agent-systems.md)
- [同步与异步](../../m1/06-reliability-scale/01-sync-vs-async.md)
- [Skill 组合与版本管理](../14-agent-skills/06-skill-composition-and-versioning.md)
