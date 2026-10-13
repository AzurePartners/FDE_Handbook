---
title: RAG 评测（检索质量、groundedness、来源支持度）
row: M2-L5.5
---
**一句话：** RAG 评测在整个评测集上分阶段为基于检索的助手打分：检索有没有找到正确的来源，每条陈述是否都有来源支撑，以及每个引用是否真的支持它所对应的那条陈述。

## 是什么

RAG 助手会在两个地方出错：检索漏掉了正确的段落，或者模型错用了交给它的段落。一个端到端的分数分不清是哪一种，所以 Anthropic 和 OpenAI 的 cookbook 以及 promptfoo 都把各个阶段分开衡量。

设想一场开卷考试，按三个标准打分：翻开的页码对不对，答卷里的每句话能不能在这些页上找到，每条脚注是否指向真正写着那句话的那一页。一份答卷可以三项全部通过，但只要手边的活页夹是去年的版本，答案照样是错的。

准确地说，**检索质量** 问的是标准来源（gold source，即被标注为包含答案的段落）有没有进入送给模型的前 k 个文本块。**Groundedness**（回答被来源支撑的程度；Ragas 中称为 faithfulness，忠实度）问的是检索到的文本是否支撑每一条陈述。**来源支持度** 问的是每个引用是否支持它自己对应的那条陈述。

## FDE 为什么需要

一家移动运营商的客服助手依据约 1,200 份文档回答套餐问题，并附带引用。在某个开源框架的默认设置下，它的“faithfulness”平均得分是 0.91，可合规部门问：凭什么能确定它没有在编造内容？

FDE 从真实聊天记录里整理出 200 个问题，请一位专家标注标准来源章节和参考答案，并记录检索到的文本块 ID。示例结果：多数失败用例根本没有检索到标准来源章节，因为语义检索漏掉了 `UNL-55` 这类套餐代码（这要靠改进检索来解决，而不是换更大的模型）。少数用例把两个套餐的价格混在了一起。还有几个答案有来源支撑、带引用，却是错的：它们引用的是去年的套餐，这些套餐仍留在索引里，而 0.91 这个分数从没标出过这个问题。

## 核心概念

### 检索质量

按文档章节标注标准来源，而不是按原始的文本块 ID，因为只要切分方式一变，文本块 ID 就会跟着变。

| 指标 | 对所有问题取平均 |
|---|---|
| 命中率@k | 前 k 个里有没有任何一个标准来源？ |
| 召回率@k | 所有标准来源中，有多大比例出现在前 k 个里？ |
| MRR（平均倒数排名） | 1 / 第一个标准来源的排名（1、1/2、1/3） |

要写明 k 是多少，并且按实际送给模型的那个 k 来衡量。Ragas 和 promptfoo 中的“context recall”是 LLM 根据参考答案做出的估计，并不是 recall@k。

### Groundedness

把答案拆成若干条陈述，再用 LLM 裁判或 NLI（自然语言推断）模型（一种判断某段文字是否蕴含某条陈述的分类器），逐条对照检索到的文本进行核对。promptfoo 拿“Paris, with 2.2 million residents, is France's capital”去对照“Paris is the capital of France”，给出的分数是 0.5。发布时，只要答案里有一条陈述没有来源支撑，就判为失败，Google DeepMind 的 FACTS Grounding 基准就是这样做的。它还会取消回避式回答的资格，因为这类回答很容易通过来源支撑的检查。

### 来源支持度

引用可能指向真实存在的文本，但这段文本并不支持它所标注的那句话。Claude 的 citations API 保证给出指向你文档的有效指针，但不保证内容真的支持这句话。评测时，由裁判或人工对每一组“陈述与引用”打分：完全支持、部分支持或不支持。

### 在整个评测集上归因

对每个用例记录两件事：模型收到的前 k 个文本块里有没有标准来源，以及答案是否通过。然后统计每个格子里的用例数。

| | 答案通过 | 答案失败 |
|---|---|---|
| 检索到标准来源 | 正常工作 | 生成失败 |
| 漏掉标准来源 | 危险信号：凭记忆作答，或标注不完整 | 检索失败（若文档从未进入索引，则是导入缺口） |

先修失败最多的那个格子。即使答案有来源支撑，只要来源已经过时，或者检索到了错误的套餐或地区，或者漏掉了某个例外条款，答案照样会失败。

## 常见误区

- **“答案有来源支撑，就是正确的。”** 有来源支撑只表示答案与检索到的内容一致。过时的政策会产生有来源支撑却错误的答案，所以还要检查准确率。
- **“带引用的句子，就是有支撑的句子。”** 引用只能证明那段文本存在。2023 年一项针对生成式搜索引擎的研究发现，只有约四分之三的引用真正支持它所对应的那句话。
- **“我们的召回率是 95%，所以检索没问题。”** 这是在多大的 k 下？k 为 20 时召回率可以很漂亮，而模型实际收到的 5 个文本块却把标准来源漏掉了。
- **“框架给出的 faithfulness 是 0.9，所以可以信任。”** 这只是裁判的估计，而且默认设置很宽松（promptfoo 在 0.5 就判通过，Microsoft 在 5 分中拿到 3 分就判通过）。要对照人工标注来校准裁判。

## 典型面试题

<details>
<summary>什么是 groundedness，你怎么衡量它？</summary>

答案里的每一条陈述都有检索到的来源支撑。我会把答案拆成若干条陈述，用校准过的裁判或 NLI 模型逐条核对，只要有一条陈述没有支撑，这个答案就判为失败。

</details>

<details>
<summary>groundedness、来源支持度和准确率有什么区别？</summary>

Groundedness：每条陈述都能在检索到的内容里找到依据。来源支持度：每条陈述自己的引用确实支持它。准确率：答案与参考答案一致。来源已经过时的时候，即使答案有来源支撑、引用也得当，准确率照样不合格。

</details>

<details>
<summary>准确率是 70%，客户想换更大的模型。你怎么办？</summary>

先做失败归因。如果多数失败用例的前 k 个文本块里压根没有标准来源，换更大的模型也帮不上忙：该修的是检索或导入。如果标准来源在里面，那就是生成问题。改完之后，在同一个评测集上重跑。

</details>

<details>
<summary>Groundedness 是 96%，但人工客服说很多答案是错的。为什么？</summary>

有来源支撑只表示忠实于检索到的内容。我会检查那些错误答案所用的来源，看是不是用了已被取代的文档或选错了文档，同时加上准确率检查，并解决索引的新鲜度问题。

</details>

## 延伸阅读

- 文章：[Q: How should I approach evaluating my RAG system? (AI Evals FAQ)](https://hamel.dev/blog/posts/evals-faq/how-should-i-approach-evaluating-my-rag-system.html)（hamel.dev，约 10 分钟）
- 练习：[Retrieval Augmented Generation with Claude](https://platform.claude.com/cookbook/capabilities-retrieval-augmented-generation-guide)（Anthropic Claude Cookbook，约 90 分钟）
- 文章：[The FACTS Grounding Leaderboard](https://storage.googleapis.com/deepmind-media/FACTS/FACTS_grounding_paper.pdf)（Google DeepMind，约 40 分钟）

## 相关页面

- [基于来源与引用](../09-rag-knowledge-bases/07-grounding-and-citations.md)
- [混合检索、重排序与查询改写](../09-rag-knowledge-bases/06-hybrid-search-and-reranking.md)
- [核心评测指标（准确率、完整性、格式合规、拒答、延迟、成本）](./04-core-metrics.md)
- [LLM 裁判](./07-llm-as-judge.md)
- [知识缺口与证据不足](../09-rag-knowledge-bases/08-knowledge-gaps.md)
