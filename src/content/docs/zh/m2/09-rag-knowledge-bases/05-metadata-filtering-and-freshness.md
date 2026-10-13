---
title: 元数据、过滤与新鲜度
row: M2-L3.5
---
**一句话：** 元数据是随每个文本块一起存储的标签，比如版本、状态和受众；过滤条件用这些标签来决定哪些文本块有资格被检索，新鲜度则让索引与当前文档保持一致。

## 是什么

向量检索只按含义给文本块排序，所以去年的退款政策看起来和今年的一样相关。元数据是和每个文本块的 embedding（嵌入向量）一起存储的结构化标签：`source`、`section`、`version`、`effective_from`、`status`（current、superseded、draft）、`audience` 和 `access_level`。

打个比方，图书馆的目录卡上标着“已撤架”或“仅限馆内阅览”：图书管理员在把书递给你之前会先看这张卡，而不是把每个版本都递给你。

**过滤条件**（filter）是检索查询中的一条硬性的“是或否”规则（`status = current`），不符合条件的文本块根本不会成为候选。**新鲜度**（freshness）让索引与来源保持同步：来源变化时重建索引，让被取代的版本下线，并移除已删除的文档。

## FDE 为什么需要

一位客户的客服助手检索它的帮助中心、退款政策和一份内部的升级处理手册（playbook）。7 月 1 日，退款期限从 30 天缩短到 14 天。客服上传了新政策，却没有删除旧文件，也没有任何字段标明哪一份是当前有效的。旧的“30 天”文本块和客户的措辞很匹配，经常排在第一位，于是财务部门收到了争议。账户抵扣额的申请还会把手册里的内部限额带出来。

在提示词里加一句“只使用当前有效的、面向客户的文档”不会有任何改变：模型分不清这些文本块，而且已经看过内部文本了。FDE 转而去修流水线。

## 核心概念

### 每个文本块都要有标签

标签必须放在每个文本块上，而不只是父文档上；Azure AI Search 警告说，否则“文本块级别的引用不会被过滤”。托管式存储对此提供支持：OpenAI file search 的 `attributes`（每个文件最多 16 个）、Gemini API File Search 的 `custom_metadata`。OpenAI 的 attributes 是按文件设置的，所以敏感程度混杂的内容要拆成不同的文件。

### 预过滤与后过滤

预过滤在最近邻检索之前或检索过程中缩小候选范围，给出的是符合条件的最佳 k 个文本块。后过滤则在检索之后丢掉不符合条件的结果，这可能悄无声息地让结果少于 k 个，甚至一个都不剩。pgvector 的文档里就有演示：使用 HNSW 默认设置时，匹配 10% 数据行的过滤条件只会返回约 4 行（0.8.0 版为此增加了迭代扫描）。Azure AI Search 推荐使用 `preFilter`。

### 访问过滤要放在查询里

文本块一旦到了模型手里，就可能泄露。OWASP 2026 年的 LLM Top 10 指出“生成之后再过滤，无法撤销已经提供给模型的文本块”，并在 LLM09:2026 Vector and Embedding Weaknesses 一条下建议，在索引查询内部强制按租户限定访问范围。过滤条件的取值要在服务端从已登录的会话中获取，绝不能来自提示词。给敏感的客户单独分配命名空间或索引。索引里的权限是一份同步过来的副本，只和最近一次同步一样新。

### 新鲜度：主动下线，别靠碰运气

上传新版本很少会替换旧版本。Azure 的文档说，索引器默认具备变更检测，但“删除检测则不然”。如果新版本的文本块变少了，除非按 `doc_id` 删除，否则会留下残留文本块：

```python
def reindex(doc):                       # 每次上传时调用
    index.delete(where={"doc_id": doc.id})
    index.add([label(c, doc) for c in chunk(doc)])

hits = index.search(query, k=8, where={
    "status": "current", "effective_from": {"lte": today},
    "audience": {"in": session.audiences}})  # 来自登录会话
```

每晚运行一个任务，移除来源已经不存在的文本块。新近度加权不等于下线：Azure 把它预览中的新鲜度功能称为“一种排序倾向，而不是硬过滤”。把 `last_updated` 一路传递下去，让用户看到“政策最后更新于 2026 年 7 月 1 日”。和任何缓存一样，索引除非每次变更都同步更新，否则就会过期。

## 常见误区

- **“告诉模型使用最新的文档，就能处理旧版本问题。”** 模型只能看到检索返回的内容，而返回的结果里可能没有新版本，文本块也很少带日期。应当改为按 `status` 和 `effective_from` 过滤。
- **“全部检索出来，让模型跳过这个用户看不到的内容。”** 进了上下文的文本块就可能泄露。要在查询内部过滤。
- **“上传新版本就会替换旧版本。”** 通常不会。要按 `doc_id` 删除旧文本块，或把它们标记为已被取代。

## 典型面试题

<details>
<summary>什么是文本块元数据？过滤能做到哪些相似度做不到的事？</summary>

元数据是随每个文本块一起存储的标签，比如版本、状态和受众。相似度只按含义排序，所以两个版本的政策看起来同样相关。过滤条件则施加硬性规则，比如“status 为 current”，不符合条件的文本块就根本不会成为候选。

</details>

<details>
<summary>预过滤和后过滤有什么区别？</summary>

预过滤在检索过程中限定候选范围，返回符合条件的最佳 k 个文本块。后过滤在检索之后才丢弃结果，可能剩得太少甚至一个不剩。永远不要把后过滤当作访问控制。

</details>

<details>
<summary>一个助手通过共享索引服务 40 家客户公司。你怎么让它们的文档彼此隔开？</summary>

给每个文本块打上租户 id，并在查询内部按它过滤，取值来自服务端已认证的会话。敏感的客户使用自己单独的命名空间或索引。我还会加上跨租户测试，并隐藏原始的相似度分数。

</details>

<details>
<summary>退款政策已经改了，助手却仍然引用旧条款。你怎么排查？</summary>

检查检索到的文本块及其元数据。确认新版本已经建立索引，旧文本块已被移除或标记为已被取代，并且查询按 `status = current` 过滤。然后在更新时按 `doc_id` 删除旧内容，并加一个回归用例。

</details>

## 延伸阅读

- 文章：[RAG is more than just embedding search](https://jxnl.co/writing/2023/09/17/rag-is-more-than-embeddings/)（Jason Liu，约 12 分钟）
- 参考：[Add a filter to a vector query in Azure AI Search](https://learn.microsoft.com/en-us/azure/search/vector-search-filters)（Microsoft Learn，约 15 分钟）
- 参考：[LLM09:2026 Vector and Embedding Weaknesses](https://github.com/GenAI-Security-Project/GenAI-LLM-Top10/blob/main/2026/final/LLM09_VectorAndEmbeddingWeaknesses.md)（OWASP GenAI Security Project，约 15 分钟）

## 相关页面

- [知识库准备（来源选择、解析、清洗）](./02-knowledge-base-preparation.md)
- [Embedding 与向量检索](./04-embeddings-and-vector-search.md)
- [混合检索、重排序与查询改写](./06-hybrid-search-and-reranking.md)
- [缓存](../../m1/06-reliability-scale/08-caching.md)
- [未授权请求、按用户的访问权限与操作 gate](../12-safety-guardrails-hitl/05-action-gates.md)
