---
title: 检索增强生成（RAG）
row: M2-L3.1
---
**一句话：** 检索增强生成（RAG）是一种模式：对每个问题，应用先在你的文档索引中检索，把最相关的段落放进提示词，再让模型依据这些段落作答并给出来源。

## 是什么

语言模型只知道它的训练数据，而训练数据截止于某个日期，也从未包含你客户的私有文档。被问到更新的内容或私有内容时，它会给出看似合理的猜测。RAG 改变的是输入，而不是模型：先查出相关的页面，再连同问题一起交给模型。

RAG 把闭卷考试变成了开卷考试。它的局限恰恰是这一课的要点：交过去的页面不对，或者正确的那一页没放进活页夹，学生照样会自信地答错。

RAG 有两条路径。离线时，导入环节会清洗文档，把它们切成文本块，再把每个文本块转成 embedding（嵌入向量，即一串捕捉其含义的数字）存入索引。每次提问时，应用把匹配度最高的文本块检索出来放进提示词，模型引用它们作答。更新索引，下一次的回答就会改变。这个术语出自 Lewis 等人（NeurIPS 2020）。

## FDE 为什么需要

一家在线教育客户的学生助手依据一本手册、若干 FAQ 和约 300 份政策 PDF 作答，并为每个请求记录检索到的文本块 ID。有学生被告知逾期提交的作业每天扣 5%，但本学期的政策写的是 10%。客户想“修改提示词”或“换个更聪明的模型”。FDE 转而去读日志里的文本块：全部来自去年的手册，而新的政策 PDF 是一份没有文字层的扫描件，从未被建进索引。

修复在导入环节：对扫描件做 OCR（文字识别），让旧版本下线，重建索引，并把这个问题加入评测集。任何提示词都修不好它。

## 核心概念

### 流水线与最小实现

```text
离线（来源变化时重新运行）
文档 -> 干净文本 -> 文本块 -> embedding -> 索引 + 元数据

每个问题
问题 -> top-k 文本块 -> 带文本块 ID 的提示词 -> 带引用的回答 -> 日志
```

“Top-k”指得分最高的 k 个文本块。代码如下：

```python
# embed()、index 和 log() 都是占位符
hits = index.search(embed(question), k=5)
context = "\n".join(f'<chunk id="{h.id}">{h.text}</chunk>' for h in hits)
resp = client.messages.create(  # Anthropic Python SDK
    model=os.environ["LLM_MODEL"], max_tokens=1024,
    system="只依据这些文本块作答，并引用它们的 id。",
    messages=[{"role": "user", "content": f"{context}\n\n问题：{question}"}],
)
answer = "".join(b.text for b in resp.content if b.type == "text")
log(question, [h.id for h in hits], answer)
```

各主要供应商都提供托管式 RAG（OpenAI 的 `file_search`、Gemini API File Search、Amazon Bedrock Knowledge Bases、Azure AI Search），FDE 往往是配置这些服务，而不是从头自建。

### 回答错了？先读检索到的文本块

某个回答出错时，先读这次请求检索到的文本块，再去动提示词或模型。

| 日志显示 | 所在层 | 修复办法 |
|---|---|---|
| 正确的内容不在索引里 | 导入 | 补充来源，或重新解析来源 |
| 已建立索引但没被检索到 | 检索 | 切分、embedding、检索设置 |
| 检索到了，回答仍然错 | 生成 | 指令、基于来源（grounding）、模型 |

Barnett 等人（CAIN 2024）指出，七个 RAG 失败点中有三个发生在模型写出第一个字之前：内容缺失、排名靠前的文档被漏掉，以及上下文组装时内容被丢弃。

## 常见误区

- **“RAG 意味着模型是用我们的文档训练出来的。”** 模型本身没有任何变化。每次提问时，相关内容会被贴进提示词。修改权重的做法才叫微调。
- **“加上 RAG 之后，助手就不再产生幻觉了。”** 它能减少幻觉，但不能消除。斯坦福的一项审计发现，2024 年的法律类 RAG 工具有 17% 到 33% 的情况下出现幻觉。
- **“RAG 基本上就是个向量库。”** 索引只是其中一部分。回答同样取决于导入了什么内容，以及它是怎么切分的。

## 典型面试题

<details>
<summary>什么是 RAG？为什么要用它，而不是靠模型自身的知识？</summary>

RAG 对每个问题先从索引中检索出相关段落放进提示词，模型再依据这些段落作答并给出来源。模型自身的知识止于训练截止时间，也不包含私有文档；检索则能在不重新训练的情况下补上最新的、私有的事实。

</details>

<details>
<summary>导入路径和查询路径有什么区别？</summary>

导入路径提前运行，来源有变化时也要再运行：清洗、切分、向量化、建索引。查询路径则对每个问题运行：检索排名靠前的文本块，构建提示词，生成带引用的回答。导入环节的错误，之后会表现为检索未命中。

</details>

<details>
<summary>客户想要一个基于 2,000 篇帮助文章的助手。你会先搭建什么？</summary>

提取文本并保留标题，按章节切分，带上来源和日期建立索引。每个问题检索几个文本块，让模型只依据它们作答并附上引用，同时记录文本块 ID。在加入重排序之前，先用真实问题分别测试检索和回答。

</details>

<details>
<summary>你的 RAG 助手给出了一个自信但错误的回答。你怎么排查？</summary>

先读这次请求检索到的文本块，再去动提示词。没建进索引就修导入；没检索到就修检索；检索到了却没用好就修生成。最后把这个问题加入评测集。

</details>

## 延伸阅读

- 视频：[What is Retrieval-Augmented Generation (RAG)?](https://www.youtube.com/watch?v=T-D1OfcDW1M)（IBM Technology，约 7 分钟）
- 练习：[Retrieval Augmented Generation with Claude](https://platform.claude.com/cookbook/capabilities-retrieval-augmented-generation-guide)（Anthropic Claude Cookbook，约 90 分钟）
- 文章：[Seven Failure Points When Engineering a Retrieval Augmented Generation System](https://arxiv.org/abs/2401.05856)（Barnett et al., CAIN 2024，约 30 分钟）

## 相关页面

- [幻觉与其他模型输出失败](../07-llm-application-foundations/06-hallucinations-and-output-failures.md)
- [上下文工程](../08-prompting-context-structured-output/04-context-engineering.md)
- [文本块切分](./03-chunking.md)
- [Embedding 与向量检索](./04-embeddings-and-vector-search.md)
- [基于来源与引用](./07-grounding-and-citations.md)
