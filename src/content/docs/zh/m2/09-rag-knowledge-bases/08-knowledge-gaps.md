---
title: 知识缺口与证据不足
row: M2-L3.8
---
**一句话：** 知识缺口是指你的来源回答不了的问题；处理它，就是要发现缺失或相互矛盾的证据，回答“这一点不在我们的资料里”而不是去猜，并把缺口记入日志，好让有人去补上。

## 是什么

检索总会返回点什么。向量检索即使面对胡言乱语，也会返回 k 个最近邻文本块（k 是你设定的数字），弱匹配只是分数更低而已。所以“有文本块返回”绝不等于“答案就在这里”。

设想一场开卷考试：桌上摊开一堆书页，并不意味着哪一页能回答这道题。诚实的回答是“书里没有这一条”，而不是用附近几页拼凑出一个猜测。

当仅凭检索到的文本块，一个认真的读者也无法作答时，证据就是不足的：事实缺失、不完整或相互矛盾，或者问题本身含糊不清。Google 的“Sufficient Context”研究（ICLR 2025）发现，面对相关但不完整的上下文，强模型往往会作答，而不是拒答。

## FDE 为什么需要

Northwind Academy 的一名学员问助手，能不能暂停课程，之后加入 10 月的那一期。其实并不存在暂停政策，但检索却返回了三个分数不错的文本块：一份付款 FAQ（逾期未付分期款后，访问权限会暂停）、课程页面（下一期 10 月 6 日开课）和迟交作业政策（可延期最多 7 天）。模型回答：“可以，最多暂停 7 天，10 月 6 日重新加入。”学员不再上课，教务处得出面收拾残局。（示例场景。）

光靠提示词解决不了这个问题。FDE 在代码里加了一道 gate，用来发现缺口、标记为需要升级，并记入日志。

## 核心概念

### 回答或拒答 gate

相关度阈值（见相关页面）决定哪些文本块进入提示词；置信度阈值决定到底要不要作答。它把最高的检索分数与一项充分性与冲突检查结合起来，这项检查通常是一次单独的、返回 JSON 的模型调用：

```python
v = judge_sufficiency(question, chunks)  # {"sufficient": false, "conflict": false}
if top_score(chunks) < cfg.score_floor or not v["sufficient"]:
    status = "insufficient_evidence"
elif v["conflict"]:
    status = "conflicting_sources"
else:
    status = "answer"
if status != "answer":
    log_gap(question, chunks, v, status, cfg.threshold_version)
```

用状态字段而不是自由文本，代码就能统计并分流这些没有给出答案的情况。用户听到的是类似“我们已发布的政策没有涉及暂停课程”的话；其余部分归拒答和升级负责。仍然要让模型可以说自己不知道：Anthropic 说，这样做“能大幅减少虚假信息”，但不会降到零。

### 相互矛盾的来源

FAQ 允许延期 7 天，某个课程页面却写的是 5 天。如果两者都不是过期的旧版本，就不要悄悄选一个：返回 `conflicting_sources`，说明来源之间不一致，并把两个页面都标记出来，交给各自的负责人。

### 调整阈值

分数是排序信号，不是概率。OpenAI file search 的 `score_threshold` 取值 0 到 1，Azure AI Search 的重排序器取值 0 到 4，Vertex AI RAG Engine 用的则是距离或相似度；分数还会随查询和模型版本而变。所以没有哪个像 0.7 这样的数值是通用的：设得太严，员工会被不必要的转人工淹没；设得太松，会给出自信的错误答案。用一个带标注的评测集（其中有无法回答的问题和相互矛盾的问题）遍历不同的取值，统计正确回答、错误回答和不必要的转人工各有多少。按与客户商定的权重，选出成本最低的取值（一次错误的退款回答，可能相当于十次转人工）；当 embedding 模型、重排序器或语料变化时，重新调整。

### 缺口日志

对每一次没有给出答案的情况，都记录问题、文本块 ID、分数、未通过的检查和阈值版本。定期复查并分类：内容缺失（由负责人来写）、答案本来存在却没检索到（工程上修复）、冲突（由负责人调和），或者问题本身含糊。在 Northwind，暂停课程的问题反复出现，于是教务处写了一条政策。

## 常见误区

- **“检索返回了文本块，答案就在其中。”** 检索总会返回排名前 k 的结果，哪怕面对的是胡言乱语。
- **“相似度分数高，说明这些文本块回答了问题。”** 相似度衡量的是相关程度，而不是够不够用。
- **“让模型说‘我不知道’就解决了。”** 这有帮助，但 Microsoft 的文档说过，Azure OpenAI On Your Data 的“limit responses to your data”设置（将于 2026 年 10 月 14 日停用）“不是硬性开关”。还要在代码里加检查。
- **“最严格的阈值最安全。”** 它会让员工被本来可以回答的问题淹没；要衡量每种错误各自要付出的代价。

## 典型面试题

<details>
<summary>什么是证据不足？为什么检索结果非空还不够？</summary>

仅凭这些文本块，一个认真的读者也无法作答：事实缺失、不完整或相互矛盾，或者问题含糊。最近邻检索总会返回排名前 k 的结果，所以我会加一道充分性检查。

</details>

<details>
<summary>相关度阈值和置信度阈值有什么区别？</summary>

相关度阈值过滤哪些文本块进入上下文。置信度阈值决定到底要不要作答，它把分数与充分性检查、冲突检查结合起来。相关的文本块可能通过相关度阈值，却并不包含答案。

</details>

<details>
<summary>两份现行文档给出的答案不一样，助手该怎么做？</summary>

先排除其中有一份是过期版本的可能。如果两份都是现行的，就不要选其中一份：说明来源之间不一致，转给人工，并把两份文档都记录下来，交给各自的负责人。

</details>

<details>
<summary>客户抱怨转人工太多，但机器人曾经给出过一个错误的退款答案。你怎么设定阈值？</summary>

在一个带标注的评测集上遍历阈值，其中包括无法回答的问题，统计正确回答、错误回答和不必要的转人工各有多少。按与客户商定的成本给它们加权，退款类问题更严格，并在模型或内容变化时重新运行。

</details>

## 延伸阅读

- 参考：[Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)（Anthropic，Claude Docs，约 8 分钟）
- 文章：[Deeper insights into retrieval augmented generation: The role of sufficient context](https://research.google/blog/deeper-insights-into-retrieval-augmented-generation-the-role-of-sufficient-context/)（Google Research Blog，约 12 分钟）

## 相关页面

- [混合检索、重排序与查询改写](./06-hybrid-search-and-reranking.md)
- [基于来源与引用](./07-grounding-and-citations.md)
- [RAG 评测（检索质量、groundedness、来源支持度）](../11-ai-evaluation/05-rag-evaluation.md)
- [拒答与兜底](../12-safety-guardrails-hitl/07-refusals-and-fallbacks.md)
- [升级通道与人工接管](../12-safety-guardrails-hitl/08-escalation-and-human-takeover.md)
