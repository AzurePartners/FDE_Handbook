---
title: 运行日志与失败分诊
row: M7-L3.3
---
**一句话：** 运行日志记录系统在每次测试运行中每一步做了什么；分诊是指优先修复那些阻断真实工作流的失败。

## 是什么

每次运行 Alpha，都记下输入、中间输出（检索到了什么、调用了哪个工具、模型返回了什么）、最终输出，以及是否成功。这样一次运行失败时，你能看出它在哪里出了错，而不用去猜。

trace（追踪）是这件事的自动化版本：它记录一次运行内部的各个步骤。trace 包含哪些内容，见 [Agent Trace](../../m3/18-agent-evaluation-debugging/02-agent-traces.md)（M3）。OpenTelemetry 入门文档针对普通软件讲的也是同一个思路。对 Alpha 来说，一个简单的日志文件或表格就够了。

## FDE 为什么需要

没有日志，你修的只是你最后看到的那个问题。一个把退款问题答错的客服助手，可能是检索到了错误的段落，可能是忽略了正确的段落，也可能是拿到了一份过时的文件。这些需要不同的修法。日志还能向客户证明你尝试过什么，当利益相关方问“为什么这个还是坏的”时，这一点很重要。

## 核心概念

分诊就是排优先级。阻断正常路径的失败（应用崩溃、检索什么都没返回），优先级高于让回答略显笨拙的失败。先修阻断问题，再修错误答案，最后做打磨。面向生产环境的可观测性工具见 [日志、指标与 trace](../../m4/05-deployment-ci-cd-observability-and-production-readiness/02-logs-metrics-traces-health-checks-and-alerts.md)（M4）；Alpha 只需要能解释每次失败的最低限度记录。

### 你要交付什么

一份运行日志，每次运行一行：

| 运行 | 输入 | 检索到的来源 | 模型输出（摘要） | 结果 | 失败说明 | 严重程度 |
|---|---|---|---|---|---|---|
| 007 | “Data Analysis Bootcamp 的退款期限？” | refund-policy.pdf，第 2 节 | “开课后 14 天内” | 通过 | 无 | 无 |
| 008 | “我可以延期入学吗？” | （未检索到内容） | “我不知道” | 失败 | 延期政策未加载 | 阻断 |
| 009 | “Python 课程还在开吗？” | old-catalog.pdf | “是的，正在招生” | 失败 | 使用了过时的课程目录 | 错误答案 |
| 010 | “转课政策是什么？” | transfer-policy.pdf（扫描件，无文本） | “我不知道” | 失败 | 扫描版 PDF 未被解析 | 错误答案 |

严重程度分级：阻断（Blocker，路径跑不通）、错误答案（Wrong answer）、打磨（Polish）。

### 通过标准

- 每次测试运行都有一行记录，包括通过的运行。
- 每条失败记录都写明在哪一步出了问题，并有记录下来的中间输出作为依据。
- 宣布 Alpha 完成时，没有遗留未解决的阻断问题。
- 每个修复都记录了确认它生效的那次运行编号。

## 常见误区

- **“只记录最终答案就够了。”** 最终答案告诉不了你是哪一步出了问题。要记录中间输出。
- **“先修最有意思的失败。”** 先修阻断真实工作流的问题。有意思的边界情况可以等。
- **“Alpha 之前我得先有一个 tracing 平台。”** 一个满足通过标准的文本文件或电子表格就可以。等数据量真的需要时再加工具。

## 典型面试题

<details>
<summary>你是怎么决定先修哪个失败的？</summary>

我按是否阻断工作流来排序。缺失的延期政策让一整类问题都答不了，所以它排在过时课程目录导致的错误答案之前，而后者又排在措辞问题之前。

</details>

<details>
<summary>每次运行你记录了什么，为什么？</summary>

输入、检索到的来源、模型输出、结果和失败说明。有了中间输出，我能指出是哪一步出了问题，而不是把锅甩给模型。

</details>

<details>
<summary>运行日志和 trace 有什么区别？</summary>

trace 是对一次运行逐步自动生成的记录。运行日志是我跨多次运行整理的表格。在 Alpha 阶段，日志既可以根据 trace 输出填写，也可以手工填写。

</details>

## 延伸阅读

- 文章：[OpenTelemetry Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/)（OpenTelemetry 官方文档，可观测性入门，约 10 分钟）。

## 相关页面

- [可复现的环境搭建](./02-reproducible-setup.md)
- [Alpha 通过条件](./04-alpha-pass-condition.md)
- [失败归因报告](../04-evaluation-hardening/02-failure-attribution-report.md)
- [Agent Trace](../../m3/18-agent-evaluation-debugging/02-agent-traces.md)（M3）
