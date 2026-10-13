---
title: 基于来源与引用
row: M2-L3.7
---
**一句话：** 基于来源（grounding）是指答案只能使用随请求提供的来源，引用则把每条陈述对应到它所出自的那个文本块，这样人或程序都能核对。

## 是什么

检索会把相关的文本块（从客户文档中切出来的段落）放进提示词，但模型仍然可能掺入训练记忆里的事实、对空白处靠猜测补全，或者与这些文本块相矛盾。基于来源就是加在检索之上的规则：只使用本次请求中提供的来源。引用则是证据链，把每条陈述指向它背后的文本块、页码或原文摘录。

打个比方，报销单上每一行条目都要订着一张收据，职员先核对收据是否存在、金额是否对得上，然后才有人判断这笔开销是否允许报销。基于来源也是同样的做法：先下指令，再要求引用，然后在任何人看到之前，用代码检查这些引用。

## FDE 为什么需要

一家保险公司的理赔助手，依据约 300 份保单 PDF 回答理赔员的提问，每个回答末尾都带一个形如“[文档 12，第 4 页]”的来源。但检索到的 8 个文本块里没有一个是文档 12：模型照搬了格式，编出了这个编号。另一个回答说理赔申请要在 90 天内提交，而被引用的文本块写的是 60 天。理赔员只好回头手动翻 PDF。（示例场景。）

FDE 加上了稳定的文本块 ID、每条陈述一段原文摘录，以及一道能先把这两种失败拦下来的代码检查。OWASP 的 Top 10 for LLM Applications 2026 把基于来源做得不扎实，列为 Misinformation（LLM07:2026）的成因之一。

## 核心概念

### 用指令要求基于来源

给每个文本块加上一个稳定的 ID 标签。OpenAI 的提示词指南发现，XML 风格的标签在长上下文中效果好，JSON 则效果差。

```text
<doc id="policy-HO3-2026#s4.2" page="4">理赔申请必须在 60 天内提交……</doc>
只依据这些文档作答。对每条陈述，给出文档的 id 和一小段
逐字摘录的原文。
```

严格到什么程度是一个设计选择（只允许用文档，还是允许用基本常识）。对于篇幅很长的材料，Anthropic 建议先引用再回答：先提取原文摘录，再依据它们作答。指令能减少没有来源依据的陈述，却不能消除它们。

### 基于提示词的引用与原生引用

基于提示词的引用适用于任何模型，也适用于 JSON 输出（每条陈述一个 `chunk_id` 和一个 `quote`），但这两个字段都可能被编造。原生功能各有不同：

| 功能 | 返回内容 | 注意事项 |
|---|---|---|
| Anthropic Citations | 精确的 `cited_text`，以及字符、页码或内容块位置 | 要么所有文档都启用，要么都不启用；不能与结构化输出同时使用 |
| OpenAI `file_search` | 带 `file_id` 和 `filename` 的 `file_citation` | 指向的是文件，而不是段落 |
| Gemini grounding metadata | `grounding_supports`，把答案片段与文本块关联起来 | 偏移量以字节而不是字符计 |

Anthropic 保证“指向所提供文档的有效指针”：段落确实存在，但不保证它支持这条陈述。

### 用代码检查引用

```python
import re, unicodedata

def norm(s):
    s = unicodedata.normalize("NFKC", s).replace("\u2019", "'")
    s = s.replace("\u201c", '"').replace("\u201d", '"')
    return re.sub(r"\s+", " ", s).strip().lower()

def check(claims, retrieved):  # retrieved = {chunk_id: text}
    fails = []
    for c in claims:
        if c["chunk_id"] not in retrieved:
            fails.append((c["chunk_id"], "not_retrieved"))
        elif norm(c["quote"]) not in norm(retrieved[c["chunk_id"]]):
            fails.append((c["chunk_id"], "quote_not_found"))
    return fails
```

规范化可以避免因空格、大小写或弯引号不同而造成误判失败；模糊匹配则会让“90 天”被当成“60 天”而通过。还要标出没有引用的数字、日期和金额。检查失败时，重新生成一次，之后展示这些段落而不给出答案，并记录日志。把真实的原文摘录挂在错误的陈述上，仍然能通过检查；陈述是否得到支持，要到评测时再判断。

### 向用户展示来源

Ding 等人（2025）发现，即使引用是随机给的，也会提高用户的信任，所以要让引用可以核对：给每条陈述一个带编号的标记，点开就是对应的那段原文，并且只列出被引用的来源。

## 常见误区

- **“我们用了 RAG，所以答案是基于来源的。”** 检索只负责提供来源；模型仍然可能掺入记忆，或者与来源相矛盾。
- **“答案带了引用，说明这条陈述有依据。”** 引用的段落可能是真的，却并不支持这条陈述；2024 年斯坦福的一项研究把这类答案称为“基于来源有误”（misgrounded）。
- **“供应商的引用功能让我自己的检查变得多余。”** OpenAI 的 `file_citation` 只指明一个文件，而且没有任何原生功能会标出没有引用的陈述。
- **“把检索到的每份文档都列出来，就算引用了来源。”** 这样看不出哪句话出自哪里，还会列进根本没用到的文本块。

## 典型面试题

<details>
<summary>什么是基于来源，它和检索有什么区别？</summary>

检索是把相关的文本块放进上下文。基于来源则要求答案只使用这些文本块，而且每条陈述都能追溯到其中某一块。我会通过指令引导模型基于来源作答，要求给出引用，并用代码检查这些引用。

</details>

<details>
<summary>基于提示词的引用和原生引用有什么区别？</summary>

基于提示词的引用，是要求模型为每条陈述给出一个文本块 ID 和一段原文摘录：它适用于任何模型，也适用于 JSON，但 ID 和摘录都可能是编造的。原生功能返回精确的被引用文本和有效的指针，但这并不能证明陈述得到了支持。

</details>

<details>
<summary>客户既想要 JSON 输出，又想用 Claude 的原生 Citations。你会怎么对他们说？</summary>

这两者不能同时使用，API 会返回 400 错误。我会在 schema 里放 `chunk_id` 和 `quote` 字段，再用代码校验它们；或者分两次调用：先生成带引用的文字回答，再提取成 JSON。

</details>

<details>
<summary>助手引用了第 4.2 节，但那一节写的却是别的内容。你怎么排查？</summary>

调出日志里记录的请求。如果这个文本块根本没被检索到，或者原文摘录不在其中，说明引用是编造的，我的检查有漏洞。如果摘录是真的，却不支持这条陈述，我就检查检索和切分，然后把这个用例加进评测集。

</details>

## 延伸阅读

- 参考：[Citations](https://platform.claude.com/docs/en/build-with-claude/citations)（Anthropic，Claude Docs，约 20 分钟）
- 练习：[Citations (Claude Cookbook)](https://platform.claude.com/cookbook/misc-using-citations)（Anthropic，Claude Cookbook，约 45 分钟）
- 互动练习：[Learn about Gemini Notebook (formerly NotebookLM)](https://support.google.com/gemininotebook/answer/16164461?hl=en&co=GENIE.Platform%3DDesktop)（Google，Gemini Notebook Help，约 20 分钟）

## 相关页面

- [检索增强生成（RAG）](./01-retrieval-augmented-generation.md)
- [结构化输出与 JSON Schema](../08-prompting-context-structured-output/06-structured-output.md)
- [知识缺口与证据不足](./08-knowledge-gaps.md)
- [RAG 评测（检索质量、groundedness、来源支持度）](../11-ai-evaluation/05-rag-evaluation.md)
