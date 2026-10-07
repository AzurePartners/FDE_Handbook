---
title: 实用型 Coding 与 Debugging 轮
row: M8-L2.1
---
**一句话：** FDE coding 轮测的是你能否读懂陌生代码、找到并修复 bug、带着正确的错误处理接入 API，并解释每一个决策——包括你和 AI 编码工具一起做的那些——而不是你能否背出算法套路。

## 是什么

FDE coding 轮有三种形态。**共享编辑器里的 live 实用题**：解析脏文件、实现 rate limiter 或带退避的重试、写一个小 CLI、写 tool-calling 模型外层的循环。**Re-engineering 或 debugging 轮**：把你丢进一个从没见过的代码库，给一个失败行为，让你找到并修复。**三到八小时的 take-home**：按客户 brief 构建一个小型端到端系统，然后现场答辩。Palantir 的 re-engineering 和 learning 轮、Anthropic 的 rate-limiter 和 streaming 题、OpenAI 的 take-home walkthrough 是广为人知的实例。

## FDE 为什么需要

到客户那里的第一天，你拿到的是别人的代码、别人的 API 和一份 bug 报告。面试复现的就是这个场景。面试官评分的是：动手前是否澄清边界情况、是否持续口述思路、是否能自己发现自己的 bug、代码是否处理了真实集成工作中占主导的失败路径（超时、畸形输入、rate limit）。沉默会被解读为卡住；口述的取舍（"主路径跑通后我再处理畸形行的情况"）会被解读为务实。

## 核心概念

### 大声说出来的 debugging 循环

Julia Evans 的 manifesto 就是正确脚本：先理解再修、复现、检查假设、缩小范围、最小化输入。面试中每一步都要边做边说："我先用能失败的最小输入复现，然后在流水线里二分定位。"

### 十分钟读懂陌生代码库

入口 → 配置 → 请求或任务路径 → 数据写在哪 → 测试。说出你在找什么、找到了什么。Palantir 的 learning 轮明确考核你怎么提问；面试官是资源，要用起来。

### 错误处理是内容，不是润色

任何集成题，面试官都在等：超时、有上限的退避重试、重试可能重复副作用时的幂等性、401/404/429 各自不同的错误、每次调用一行日志。先写 happy path，然后说出你会按什么顺序加哪些失败路径。

### 解释 AI 辅助编码

是否允许用工具因公司和阶段而异。Anthropic 和 Palantir 在 live 轮中禁止 AI 辅助，除非另行说明；有些 take-home 允许并要求记录使用情况。无论如何有两条规则：知道你所在阶段的政策；能解释工具写的每一行。"这段是 Claude 生成的，我用这个测试验证过"是可以接受的句子；"我不确定它为什么这么做"不是。模块一第 1 课（验证，不要信任）就是你会被要求的标准。

### 练习集

Rate limiter（按用户和全局）、带边界情况的脏 CSV/JSON 解析器、面向不稳定 API 的带抖动指数退避、带背压的流式消费者、一个文件夹文档上的最小 RAG 流水线、在脏 join 上使用窗口函数的 SQL 查询。

## 常见误区

- **"我应该刷算法题。"** 据多数反馈，FDE coding 轮在算法上比大厂简单，在真实感上更难。为脏输入和失败路径做准备，而不是树遍历。
- **"做完最重要。"** 一个结构清晰、有测试、口述了下一步的部分解，通常比一个沉默写完的完整解得分高。
- **"take-home 里用 AI 工具没问题，只要结果好。"** 只有在政策允许、并且你能把每个决策当作自己的来辩护时才行。评审者会问。

## 典型面试题

<details>
<summary>这个服务间歇性返回过期数据。你从哪开始？</summary>

先复现：找到返回过期数据的最小请求和一个不过期的请求。然后按顺序检查明显的过期来源——带 TTL 的缓存、落后于写入的只读副本、按计划更新的后台任务、客户端缓存。在每一跳加一行带数据时间戳的日志，看新鲜度在哪里丢失。修复根因，然后加一个本该捕获它的测试。

</details>

<details>
<summary>给这个 API 调用实现重试。</summary>

先问哪些错误可重试（5xx 和 429，不是 4xx）、调用是否幂等（不是就加 idempotency key）、上限是多少。然后实现带抖动的指数退避、最大尝试次数、每次尝试一行日志。说出超过上限后会怎样：向调用方抛出有名字的错误，而不是静默失败。

</details>

<details>
<summary>讲讲这个函数做什么，它哪里有问题。</summary>

从上到下大声读：输入、变换、输出、副作用。然后说出缺陷类型——差一错误、未处理的空情况、被吞掉的异常、共享的可变默认值。提出最小修复和钉住它的测试。

</details>

## 延伸阅读

- 文章：[A debugging manifesto](https://jvns.ca/blog/2022/12/08/a-debugging-manifesto/)（Julia Evans）— 任何 debugging 轮前一天重读
- 文章：[Forward Deployed Engineer Interview: The Definitive 2026 Guide](https://www.tryexponent.com/blog/forward-deployed-engineer-interview-the-definitive-2026-guide-fde)（Aced）— coding 轮题型与面试官关注点
- 文章：[Palantir Forward Deployed Engineer Interview Guide](https://www.tryexponent.com/guides/palantir-forward-deployed-engineer-interview)（Aced）— re-engineering 与 learning 轮
- 参考：[Anthropic 候选人 AI 使用指引](https://www.anthropic.com/careers) — 各阶段什么允许、什么不允许
- 参考：[Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) — 面试官期待你描述的验证习惯

## 相关页面

- [端到端 AI 系统设计](./02-end-to-end-ai-system-design.md)
- [技术债与架构变更故事](./04-technical-debt-and-architecture-change-stories.md)
