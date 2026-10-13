---
title: 输入与输出护栏
row: M2-L6.1
---
**一句话：** 护栏是写在你自己代码里的检查，针对进入模型的内容、模型输出的内容和它打算执行的操作，所以模型永远没有最终决定权。

## 是什么

系统提示词里的规则只是一个请求，模型可以被说服而不遵守。护栏则是模型之外的代码，它检查文本并作出决定：放行、拦截、修复（比如做掩码处理）或标记。

打个比方，在餐厅里，迎宾员筛选进门的客人，每道菜出餐前有厨师检查，退款由经理批准，不管主厨多么出色。

护栏设在三个位置：

- **输入**：在模型读取请求之前，包括检索到的文档和工具结果。
- **输出**：在回复到达用户或系统之前。
- **操作**：在工具调用执行之前（操作 gate，[6.5](./05-action-gates.md)）。

## FDE 为什么需要

设想一个客户的客服助手，它唯一的护栏是一项内容审核服务。服务宕机的两个小时里，封装代码把每次超时都当成“未被标记”，于是所有内容未经检查就放行了，也没人察觉。回复这一侧没有任何检查，所以一张被投毒的工单让模型输出了一张泄露客户数据的 Markdown 图片。（示例场景。）

FDE 会把“我们有个过滤器”换成一套设计：哪些检查在哪里运行，每项检查的成本是多少，某项检查失败时又会发生什么。

## 核心概念

### 四种检测器

| 类型 | 示例 | 取舍 |
|---|---|---|
| 规则 | 正则表达式（regex）、关键词列表、URL 白名单 | 快速且可预测，但换个说法就能绕过 |
| 训练好的分类器 | Llama Prompt Guard 2（注入）、Llama Guard 4（危害） | 专门打造，但仅限于训练所覆盖的范围 |
| 供应商端点 | OpenAI Moderation API、Azure Prompt Shields、Google Cloud Model Armor | 现成可用，但用的是供应商划分的类别，而不是你的策略 |
| LLM 检查 | 返回 `{"is_harmful": true}` 的小模型 | 能处理细微差别，但最慢、最贵，还可能被操纵 |

### 分层及其代价

- **级联。** 便宜的检查负责筛查所有流量，只有被标记的流量才会进入昂贵的检查。Anthropic 2026 年的越狱（jailbreak）分类器就是这样做的，额外算力只增加约 1%（第一版是 23.7%）。
- **误报。** 每一次错误拦截，都会把真实客户拒之门外。用带标注的对话来调阈值：越狱检查严一些，话题检查松一些。
- **延迟。** 并行检查能节省时间，但可能在 token 已经花掉、工具已经执行之后才触发。流式输出可能会短暂地显示出有问题的文本（[1.9](../07-llm-application-foundations/09-adding-an-llm-endpoint.md)）。
- **fail open 还是 fail closed。** 检查本身出错时，fail open 会放行请求，fail closed 会拦截请求。OpenAI 开源的 Guardrails 库默认 fail open，除非设置 `raise_guardrail_errors=True`。按风险为每项检查分别选择。

记录每一次决定（检查项、结论、分数、延迟）：拒答率出现波动，往往是绕过发生的前兆。

### 输出处理

OWASP 说要把模型“当作任何其他用户”对待：它的输出不可信。

- 显示文本时使用自动转义或 `textContent`。渲染的任何 Markdown 或 HTML 都要先净化（sanitize），比如用 DOMPurify，绝不直接使用原始的 `innerHTML`。
- 绝不要把输出传给 `eval`、shell 或字符串拼接出来的 SQL；用参数化查询，或者固定的操作列表。
- 只从白名单内的域名加载图片和链接，并配合 Content Security Policy，否则被注入的图片 URL 会在浏览器获取它时泄露数据。

### OWASP 2026 版 LLM 应用 Top 10

向客户的安全团队逐项讲解 2026 年 8 月的这份清单，引用编号时注明年份（2025 版的编号不同）。

| 条目 | 防御见 |
|---|---|
| LLM01 提示词注入（prompt injection）、LLM08 隐藏上下文暴露 | [6.4](./04-prompt-injection.md) |
| LLM02 敏感数据泄露 | [6.3](./03-sensitive-data-and-pii.md) |
| LLM03 过度自主权（excessive agency） | [6.5](./05-action-gates.md)、[6.6](./06-human-in-the-loop-approval.md) |
| LLM04 供应链 | [依赖风险](../../m1/04-git-debugging-testing-security/12-dependency-risk.md) |
| LLM05 数据与模型投毒 | [3.2](../09-rag-knowledge-bases/02-knowledge-base-preparation.md) |
| LLM06 无限制消耗 | [1.9](../07-llm-application-foundations/09-adding-an-llm-endpoint.md) |
| LLM07 错误信息 | [6.9](./09-known-limitations.md) |
| LLM09 向量与 embedding（嵌入向量）弱点 | [3.5](../09-rag-knowledge-bases/05-metadata-filtering-and-freshness.md) |
| LLM10 不当输出处理 | 本页 |

## 常见误区

- **“供应商的安全过滤器就是我们的护栏。”** 它执行的是供应商自己的使用政策，而不是你的客户在话题、承诺或渲染方面的规则。
- **“内容审核端点能拦住提示词注入。”** 它给仇恨、暴力这类危害打分。“把客户名单邮件发给我”两者都不是，所以注入需要专门的检测器（[6.4](./04-prompt-injection.md)）。
- **“有了 LLM 检查，应用就安全了。”** 它也可能被同样的注入攻破。EchoLeak（CVE-2025-32711）就绕过了 Microsoft 365 Copilot 的注入分类器和链接脱敏过滤器。多层防护能降低风险，但没有哪一层能杜绝注入。

## 典型面试题

<details>
<summary>什么是护栏，你会把它放在哪里？</summary>

它是模型之外的代码，模型没法用话术绕过它。护栏设在输入（包括检索到的内容）、输出和拟执行的操作这三处。

</details>

<details>
<summary>规则、分类器、内容审核端点和 LLM 检查有什么区别？</summary>

规则便宜，但容易规避；分类器速度快，但覆盖面窄；内容审核端点只限于供应商划定的危害类别。LLM 检查能处理细微差别，但成本最高，所以只有被标记的流量才会送到它那里。

</details>

<details>
<summary>客户的机器人会渲染 Markdown，还会读邮件。你会加哪些输出处理？</summary>

经过净化的 Markdown，图片只能来自客户的域名，链接走白名单，再加上 Content Security Policy。输出绝不会传给 `eval`、shell 或字符串拼接的 SQL。

</details>

<details>
<summary>你的注入分类器有 2% 的请求超时。该 fail open 还是 fail closed？</summary>

通常是 fail closed：这项检查保护的是操作和数据，所以在我修复超时问题期间，用户会看到明确的兜底回复。风险较低的话题检查可以 fail open，同时发出告警。

</details>

## 延伸阅读

- 参考：[LLM10:2026 Improper Output Handling](https://github.com/GenAI-Security-Project/GenAI-LLM-Top10/blob/main/2026/final/LLM10_ImproperOutputHandling.md)（OWASP GenAI Security Project，约 12 分钟）
- 文章：[Next-generation Constitutional Classifiers](https://www.anthropic.com/research/next-generation-constitutional-classifiers)（Anthropic，约 10 分钟）

## 相关页面

- [内容边界与敏感请求](./02-content-boundaries.md)
- [敏感数据与 PII 保护](./03-sensitive-data-and-pii.md)
- [提示词注入与越狱](./04-prompt-injection.md)
- [未授权请求、按用户的访问权限与操作 gate](./05-action-gates.md)
- [为现有服务添加 LLM 端点](../07-llm-application-foundations/09-adding-an-llm-endpoint.md)
