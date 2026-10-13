---
title: 文本块切分
row: M2-L3.3
---
**一句话：** 切分就是把每份文档拆成更小、自成一体的片段，这些片段叫文本块；文本块分别做向量化并单独检索，这样检索就能只把能回答问题的段落交给模型。

## 是什么

RAG 助手检索的是文本块，而不是整份文档：一个章节，或一条 FAQ 回答，各自单独建立索引。切分决定在哪里下刀，它在导入时进行一次，位于解析和向量化之间。

打个比方，把一本手册做成索引卡片。切错了地方，一张卡片写着“30 天内可退货”，下一张却写着“清仓商品除外”。好卡片只装一个完整的想法，所属章节写在最上面。

之所以要切分，一是因为模型有输入上限（Azure OpenAI 的 `text-embedding-3-small` 最多接收 8,191 个 token），二是因为一个涉及多个主题的页面只对应一个向量，哪个主题都表示不好。大小是一种取舍：小文本块的 embedding（嵌入向量）很精准，但会丢失上下文，比如“它”指什么；大文本块则会让 embedding 变模糊，还把无关的文字拖进提示词。

## FDE 为什么需要

一家零售商的客服助手依据退货政策、FAQ 和保修条款作答，这些内容被切成每块 500 字符。被问到清仓夹克能不能退时，它回答可以，30 天内。FDE 去读检索到的文本块。其中一块以“顾客可在 30 天内退货。”结尾。例外条款“本条不适用于清仓商品。”却在下一个文本块的开头，而那一块排名太低，没有被检索到。保修表也被拆开了，留下 `Gold | 24 | Yes` 这样没有表头的行。

修复办法：按标题切分，每个 FAQ 问答对一个文本块，表格保持完整，每个文本块加一个上下文标题，然后重建索引，并用工单日志里的 40 个真实问题重新检查。

## 核心概念

### 切分策略

| 策略 | 在哪里下刀 |
|---|---|
| 固定长度切分 | 每 N 个 token 或字符切一次 |
| 递归切分 | 先按段落，再按行，再按词，仅在片段仍然过大时才继续往下切 |
| 结构感知切分 | 标题、带编号的条款、问答对 |
| 语义切分 | 在 embedding 相似度下降的地方，或由 LLM 决定的地方 |

先从结构感知切分入手，对过长的章节再用递归切分兜底。Vectara 的一项研究（Findings of NAACL 2025）发现，语义切分的收益并不稳定，与它额外的计算开销不相称。

```python
from langchain_text_splitters import (
    MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter)

by_heading = MarkdownHeaderTextSplitter(
    headers_to_split_on=[("#", "doc"), ("##", "section")])
fallback = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=200)

sections = by_heading.split_text(policy_markdown)  # 标题进入元数据
chunks = fallback.split_documents(sections)
for c in chunks:  # 上下文标题
    c.page_content = " > ".join(c.metadata.values()) + "\n" + c.page_content
```

这里的 `chunk_size` 数的是字符数，不是 token 数：1,500 个字符大约相当于 375 个英文 token。

### 大小与重叠

重叠是在每个切口两边重复一小段文字，让处在边缘的句子能完整保留，代价是文本块变多。不同工具给出的起点各不相同（截至 2026 年 9 月）：

| 工具 | 默认值或推荐起点 |
|---|---|
| OpenAI file search，`auto` | 800 个 token，重叠 400 个 |
| Azure AI Search 的指南 | 512 个 token，重叠 25% |
| LlamaIndex `SentenceSplitter` | 1,024 个 token，重叠 200 个 |

父子检索可以缓解这个取舍：检索小文本块，再把它们所属的父章节交给模型。

### 让完整的想法留在一起

把规则和它的例外放在一起，把每个 FAQ 问题和它的回答放在一起。表格放得下就保持完整；放不下就按行拆分，并在每一块里重复表头行。

### 上下文标题

文本块“公司收入比上一季度增长了 3%”没有写明是哪家公司、哪个季度。给它前置一个针对该文本块的标题，比如 `Returns Policy > Clearance items`，并和正文一起做向量化。在 Anthropic 的 Contextual Retrieval（2024）中，由 LLM 为每个文本块写出上下文，使检索失败减少了 35%；而通用的文档摘要只带来“非常有限的收益”。标题是参与向量化的文字，元数据则放在文本块旁边，用于过滤。

### 测试切分方案

Microsoft 把切分称为“半永久性的选择”：改动它就意味着全部重建索引。上线之前，取 20 到 50 个真实问题，记下每个问题的答案段落，并检查它是否出现在排名靠前的结果里。

## 常见误区

- **“文本块越小越精确。”** 它们会丢掉“它”或“该方案”指代什么的信息，所以能被检索到，却答不了问题。
- **“正确的文本块大小是 512 个 token。”** 各家供应商给出的起点从 512 到 1,024 个 token 不等。要用你自己的问题来测试不同的大小。
- **“重叠越多，就越能解决边界问题。”** 重叠保护的是切口附近的句子，保护不了与例外条款相隔三段的规则，而且还会增加近乎重复的文本块。

## 典型面试题

<details>
<summary>什么是切分？RAG 为什么需要它？</summary>

把文档拆成片段，分别做向量化并建立索引。模型有输入上限；一份涉及多个主题的文档只有一个向量，和哪个问题都匹配不好；而聚焦的段落能让提示词既便宜又相关。

</details>

<details>
<summary>固定长度切分、递归切分和结构感知切分有什么区别？</summary>

固定长度切分每隔 N 个 token 切一刀，不管句子是否完整。递归切分先尝试在段落处断开，再试行，再试词。结构感知切分按文档本身的单元来切，比如标题或 FAQ 问答对，所以每个文本块只装一个想法。

</details>

<details>
<summary>一本 200 页的人事手册里满是表格和“除非……”条款，你会怎么切分？</summary>

按标题切分，让规则和它的例外留在一起，对过长的章节用递归切分兜底。表格保持完整，或在每块里重复表头行，并前置“休假 > 育儿假”这样的路径，再用 30 到 50 个真实问题测试。

</details>

<details>
<summary>同事想改用基于 LLM 的切分。你怎么判断？</summary>

用答案段落已知的真实问题，对两种方式做比较。语义切分的收益往往抵不上它的成本，而且换方案就意味着全部重建索引。

</details>

## 延伸阅读

- 练习：[5 Levels Of Text Splitting](https://github.com/FullStackRetrieval-com/RetrievalTutorials/blob/main/tutorials/LevelsOfTextSplitting/5_Levels_Of_Text_Splitting.ipynb)（Greg Kamradt，GitHub 上的 notebook，约 45 分钟）
- 文章：[Introducing Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval)（Anthropic Engineering，约 20 分钟）
- 参考：[Chunk large documents for RAG and vector search in Azure AI Search](https://learn.microsoft.com/en-us/azure/search/vector-search-how-to-chunk-documents)（Microsoft Learn，约 12 分钟）

## 相关页面

- [知识库准备（来源选择、解析、清洗）](./02-knowledge-base-preparation.md)
- [Embedding 与向量检索](./04-embeddings-and-vector-search.md)
- [元数据、过滤与新鲜度](./05-metadata-filtering-and-freshness.md)
- [RAG 评测（检索质量、groundedness、来源支持度）](../11-ai-evaluation/05-rag-evaluation.md)
