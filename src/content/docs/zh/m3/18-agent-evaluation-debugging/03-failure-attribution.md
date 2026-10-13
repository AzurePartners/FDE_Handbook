---
title: Agent 系统中的失败归因
row: M3-L6.3
---
**一句话：** 失败归因是指找出 agent 一次运行中第一个出错的步骤，并指明是哪个部分造成的：数据、指令、模型、工具、交接、业务规则、权限或限制。

## 是什么

agent 的失败会在最后才暴露，比如一份错误的备忘录或一次错误的审批，但通常从更早的步骤就开始了。接力队在第二棒掉了接力棒而输掉比赛，再去指导最后一棒的选手也无济于事。

准确地说，一次运行的每一步都建立在上一步的基础上。归因要指出决定性的步骤（纠正了它就能挽救这次运行的最早一步），以及它背后的组件。[错误分析](../../m2/11-ai-evaluation/03-error-analysis.md)把许多失败归成不同的类型；归因则在一次运行的 [trace 内部](./02-agent-traces.md)展开。

## FDE 为什么需要

一家财富管理公司的 Finance research agent 会记住客户已确认的约束，一个月里有 14 份备忘录推荐了本应排除的股票。团队把它当成同一个 bug，把 profile 重写了三遍（“必须始终遵守客户约束”），毫无效果。

FDE 根据 trace 逐份备忘录做了归因。8 份是因为约束查询所用的服务账号（service account）读不了一张新表（权限）。4 份是因为运行在做约束检查之前就触到了 30 步的上限（预算）。只有 2 份是约束已经在上下文里却被忽略了（模型）。她把访问权限的缺口交给客户的 IT 团队去处理，让触到上限的运行返回“partial”，并把每一种原因都记录下来。（示例场景。）

## 核心概念

### 八类原因及其证据

| 原因 | Trace 中的证据 |
|---|---|
| 数据 | 工具结果与来源矛盾，或者已过期 |
| 提示词或 profile | 这一步完全按字面执行了一条含糊或相互冲突的指令 |
| 模型 | 输入正确、指令清晰，却仍然做出了错误的选择 |
| 工具 | 参数有效，却返回了错误或格式错误的结果 |
| 交接 | 接收方的输入缺少或扭曲了发送方的输出 |
| 业务规则 | 代码照规则原文执行了，而规则本身是错的 |
| 权限 | 出现 401 或 403、gate 拒绝放行，或者部分用户的数据缺失 |
| 超时或预算 | 触发了超时或步数上限；只完成一部分的工作被标记为已完成 |

### 暴露处与起点

顺着 trace 往前走。第一个输入正确而输出错误的步骤，就是失败的起点；后面的步骤只是把它带了下去。从那里用修正后的值重放，加以确认（[可重放测试](./06-replayable-tests.md)）。

```text
trace 7d21f0  备忘录，客户 K-88
step 2  tool   get_constraints  http 403, returned []   <- 起点
step 5  model  加入一只烟草股票  (在没有约束的情况下，这是对的)
step 9  send   备忘录已送达                              <- 暴露处
```

第 5 步看起来像是模型无视了一条规则，但它的输入里根本没有这条规则。原因是权限；此外，工具返回的是 `[]`，而不是[错误](../../m2/10-tool-calling-deterministic-logic/07-tool-results-and-error-returns.md)，这是一个促成原因。两者都要记录。

### 关于自动归因，研究怎么说

MAST（Cemri et al.，UC Berkeley，2025）是一份实用的检查清单，它把多 agent trace 中出现的 14 种失败模式分成三组：系统设计与规格、agent 之间的错位（比如隐瞒信息）和任务验证（比如过早结束）。

自动归因更难：在 Who&When 基准（ICML 2025）上，最好的结果是责任 agent 53.5%、决定性步骤 14.2%。让模型先列出嫌疑名单，再由人来确认。

### 记录归因结果

把归因结果写进失败用例记录：trace ID、暴露处、决定性步骤和 agent、原因、促成原因、证据、重放结果、提示词和模型版本，以及修复负责人。修复按[调试循环](./07-debugging-agents.md)进行。

## 常见误区

- **“症状相同的失败，原因也相同。”** Anthropic 的研究 agent“找不到显而易见的信息”时，原因可能是查询语句不好、来源质量差，也可能是工具失败。
- **“trace 里的第一个错误就是原因。”** 决定性的错误往往是静默的，比如一条过期的记录；后面出现的超时可能只是症状。要检查每一步的输入，而不是它的状态。
- **“让 LLM 读一遍 trace，就能指出元凶。”** 在 Who&When 上，步骤层面的最佳准确率只有 14.2%。把它的回答当作线索。

## 典型面试题

<details>
<summary>agent 系统中的失败归因是什么？</summary>

找出一次失败运行中的决定性步骤，并指明它背后的组件。错误分析把许多失败归成类型；归因则为每个失败用例给出已确认的原因。

</details>

<details>
<summary>失败暴露的位置和失败起源的位置有什么区别？</summary>

暴露的位置是有人发现问题的地方，比如客户读到了一份有问题的备忘录。起源的位置是最早出现“输入正确、输出错误”的那一步，要通过重放来确认。

</details>

<details>
<summary>一个 Research、Draft、Review 的工作流发布了一个错误的数字。你怎样归因？</summary>

把 Research 的工具结果和来源对照（数据），把它的输出和 Draft 的输入对照（交接），再把 Draft 的上下文和它写出的文字对照（模型）。Review 放行的那一步只是问题暴露的地方，最多算促成原因。

</details>

<details>
<summary>工程师们怪模型，你怀疑是工具。怎么判定？</summary>

用正确的工具结果把这一步重放几次：如果运行成功了，原因就在工具或它的数据；如果模型依然出错，原因就在模型。

</details>

## 延伸阅读

- 文章：[How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)（Anthropic，约 20 分钟）
- 文章：[Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/abs/2503.13657)（Cemri et al.，约 40 分钟）
- 文章：[Which Agent Causes Task Failures and When?](https://arxiv.org/abs/2505.00212)（Zhang et al., ICML 2025，约 40 分钟）

## 相关页面

- [错误分析与失败用例记录](../../m2/11-ai-evaluation/03-error-analysis.md)
- [Agent trace（步骤、工具调用、交接、状态变化）](./02-agent-traces.md)
- [用 trace 和评测调试 agent](./07-debugging-agents.md)
- [多 agent 系统](../15-agent-architectures/04-multi-agent-systems.md)
- [复现、缩小范围、最小化](../../m1/04-git-debugging-testing-security/06-reproduce-narrow-minimize.md)
