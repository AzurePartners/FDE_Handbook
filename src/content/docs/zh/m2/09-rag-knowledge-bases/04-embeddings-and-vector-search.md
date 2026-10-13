---
title: Embedding 与向量检索
row: M2-L3.4
---
**一句话：** embedding（嵌入向量）是一串按含义给一段文本定位的数字，向量检索则找出与问题的 embedding 最接近的已存 embedding。

## 是什么

embedding 模型把文本转成向量，即一串固定长度的数字。关键是距离：含义相近的文本会落在相近的位置，所以“怎么把钱拿回来”会靠近“退款政策”，哪怕两者没有一个共同的词。

设想一张含义的地图。每个文本块都有一枚图钉，问题也有一枚，向量检索就是找出离它最近的那些图钉。每个模型画的是它自己的地图，所以两个模型的图钉无法比较。

准确地说，导入时你把每个文本块向量化，存入向量索引。查询时你用同一个模型把问题向量化，返回最近的 k 个向量及其文本。Anthropic 没有自己的 embedding 模型，其文档推荐使用 Voyage AI。

## FDE 为什么需要

一家保险公司的理赔助手通过 pgvector 扩展，在 Postgres 里检索 40,000 个保单文本块。旧保单的回答悄悄变差了。几个月前，IT 部门把新文档和查询从 `text-embedding-ada-002` 换成了 `text-embedding-3-small`，却没有把旧文本块重新向量化。两个模型都输出 1,536 个数字，所以没有任何报错，但现在的查询碰到的是另一张地图上的图钉。

FDE 读了检索到的文本块，发现了这个不匹配，把所有内容重新向量化到一个新列里，一次性切换，并为每个向量记录所用的模型名。

## 核心概念

### 相似度分数

余弦相似度衡量向量之间的夹角，不考虑长度；点积同时反映夹角和长度；欧氏（L2）距离是两点之间的直线距离。对于长度为 1 的向量（Voyage 和许多模型供应商返回的就是这种），点积等于余弦（而且更快），欧氏距离给出的排序也完全相同。不同引擎的分数各不相同：Azure AI Search 把余弦报告为 1 / (1 + 余弦距离)，范围从 0.333 到 1.00，所以没有哪个阈值在所有地方都适用。

### 索引里存什么

每条记录包含一个 ID、向量、文本块的文字，以及来源等元数据。过滤条件作用于元数据，从不作用于向量。在 pgvector 中，`<=>` 表示余弦距离：

```sql
CREATE TABLE chunks (id bigserial PRIMARY KEY, body text,
  embed_model text, embedding vector(1024));
SELECT id, body FROM chunks ORDER BY embedding <=> $1 LIMIT 5;
```

### 精确检索与近似检索

精确的 k 最近邻（kNN）检索把查询与每一个向量逐一比较：结果永远正确，对几万条向量来说也够快。近似最近邻（ANN）索引用少量召回率（找到的真实最近邻所占的比例）换取大幅提速。最常用的 HNSW 是一张分层的图：先走高速公路，再走主干道，最后走街巷，`hnsw.ef_search` 设置它在局部检索时有多仔细。pgvector 提醒说，加上近似索引会改变结果，而且它的 `vector` 索引最多支持 2,000 维（3,072 维的向量需要用 `halfvec` 或缩短维度）。

### 扩展还是专用数据库

客户已经在运行的数据库自带的向量功能（带 pgvector 的 Postgres、Azure SQL、Cosmos DB），可以把事务、连接查询和备份放在一处。专用的向量库（Pinecone、Qdrant、Milvus）主要在大规模下才划算。

### 一个索引只用一个模型

文档和查询用同一个模型，或者用供应商明确说明共享同一向量空间的模型系列（Voyage 称 Voyage 4 属于这种）。换模型就意味着全部重新向量化；OWASP 的 Vector and Embedding Weaknesses 条目（LLM09:2026）告诫不要混用新旧向量。

### 语义检索在哪里会失效

编码和罕见的名称携带的语义很少。Anthropic 举的例子是：检索“错误码 TS-999”，找到的是一般性的错误码内容，却漏掉了精确匹配的那一条。在 NevIR 基准上，对于只在是否含有否定词上不同的文档，大多数神经检索器的表现并不比随机好。关键词检索可以弥补这些缺口。

## 常见误区

- **“如果索引里没有相关内容，向量检索就什么都不返回。”** 它总会返回最接近的 k 个向量，不管相关与否。
- **“新模型只用在新文档上就行。”** 两个向量空间互不兼容，而且维度相同时不会有任何报错。
- **“分数 0.8 就表示 80% 相关。”** 分数的范围取决于模型和引擎；要用你自己的数据来校准。
- **“embedding 只是一堆数字，所以可以放心共享。”** OWASP 引用了 Vec2Text 的结果：对 32 个 token 的短输入，它能精确还原其中 92%。要像保护源文档一样保护向量库。

## 典型面试题

<details>
<summary>什么是 embedding？向量检索怎么使用它？</summary>

模型为文本生成的一个固定长度的向量，含义相近的文本在空间中的位置也相近。导入时你把文本块向量化并存储，查询时用同一个模型把每个问题向量化，再返回最近的 k 个向量及其文本。

</details>

<details>
<summary>精确 kNN 检索和 HNSW 检索有什么区别？</summary>

精确 kNN 会检查每一个向量：结果永远正确，但数据越多越慢。HNSW 在分层的图上行走，只碰少数向量：快得多，但可能漏掉真正的近邻。`ef_search` 在召回率和延迟之间做取舍。

</details>

<details>
<summary>一位使用 Postgres 的客户想对 200 万篇文章做语义检索。用 pgvector 还是专用向量库？</summary>

先用 pgvector：向量和已有的数据行、备份、访问控制放在一起，内存够的话，HNSW 能应付数百万条数据。要先检查 2,000 维的索引上限，以及带过滤条件时查询的召回率。

</details>

<details>
<summary>embedding 模型升级之后，旧文档的检索效果变差了，却没有任何报错。你怎么排查？</summary>

先读检索到的文本块，再比较生成已存向量的模型与给查询做向量化的模型。如果两者不同，就重新向量化到一个新列里，一次性切换，并为每个向量记录所用的模型。

</details>

## 延伸阅读

- 视频：[What is a Vector Database? Powering Semantic Search & AI Applications](https://www.youtube.com/watch?v=gl1r1XV0SLw)（IBM Technology，约 10 分钟）
- 参考：[Embeddings](https://platform.claude.com/docs/en/build-with-claude/embeddings)（Anthropic Claude Docs，约 15 分钟）
- 参考：[pgvector](https://github.com/pgvector/pgvector)（GitHub，约 20 分钟）

## 相关页面

- [检索增强生成（RAG）](./01-retrieval-augmented-generation.md)
- [文本块切分](./03-chunking.md)
- [元数据、过滤与新鲜度](./05-metadata-filtering-and-freshness.md)
- [混合检索、重排序与查询改写](./06-hybrid-search-and-reranking.md)
- [SQL 基础：SELECT、INSERT、JOIN](../../m1/03-apis-data-integration/11-sql-basics.md)
