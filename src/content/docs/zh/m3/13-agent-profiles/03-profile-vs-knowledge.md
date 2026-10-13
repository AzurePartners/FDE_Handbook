---
title: 将 agent 知识与 profile 分离
row: M3-L1.3
---
**一句话：** 将知识与 profile 分离，是指 agent 的 profile 定义它怎么做事、去哪里查东西，而价格、政策这类事实留在有人负责的来源里，由它在运行时读取。

## 是什么

[agent profile](./02-agent-profiles.md) 是 agent 的岗位描述。分离知识，就是把 agent 应该知道的内容（价目表、退款规则、产品规格）挪出 profile，放到有人负责、有人保持更新的来源里。

新员工的岗位说明书会写“按当前价目表报价”，但从不把价格列出来：价格每个季度都在变，工作内容却没变。

准确地说，profile 放的是行为：这份工作、运行规则，以及如何查找并引用每一类事实。知识来源放的是业务负责人按各自节奏修改的内容（政策、产品数据、价格、流程），在运行时通过检索、文件、查询工具或记忆来获取。如果改一句话都要定价团队或法务批准，这句话就是知识。对于系统提示词，Anthropic 建议使用“足以完整描述预期行为的最小信息集合”。

## FDE 为什么需要

一家 HR 软件供应商用 Research、Draft 和 Review 三个 agent 来写博客。试点期间，有人把套餐价格、可用性承诺和集成数量粘贴进了 Draft 和 Review 的 profile。价格调整之后，只改了 Draft 的 profile，于是 Review agent 又把草稿“纠正”回了旧价格。有两篇文章带着旧价格上线了；没人知道这个数字归谁负责。（示例场景。）

FDE 把两份 profile 里的数字全部删掉了。现在价格来自对计费目录的只读查询 `get_plan_prices`，产品宣称则来自产品市场团队负责的一份已批准宣称文档，并附带 ID 和生效日期。一份登记表写明了每个来源的负责人。

## 核心概念

### 事实放在 profile 里会出什么问题

- **过期的值：** 副本永远不会自己更新，来源变了也没有任何提示。
- **没有引用：** 提示词里的数字无法核对；检索到的段落或查询结果则带有 ID 和日期（[基于来源与引用](../../m2/09-rag-knowledge-bases/07-grounding-and-citations.md)）。
- **相互矛盾：** profile 里写 30 天、政策里写 14 天时，模型会任选其一，或者把两者混在一起。
- **臃肿：** 每次调用都带着所有事实。Claude Code 的文档建议每个 `CLAUDE.md` 指令文件控制在 200 行以内，因为更长的文件“会消耗更多上下文，并降低遵循度”。

### Agent 如何在运行时获取知识

profile 里放的是指针，而不是 payload 本身。Anthropic 描述过这样的 agent：它们保存“轻量级标识符（文件路径、已保存的查询、网页链接等）”，并“在运行时使用工具”加载数据。获取途径有[检索](../../m2/09-rag-knowledge-bases/01-retrieval-augmented-generation.md)、按需读取的文件（包括 [Skill 参考文件](../14-agent-skills/02-skill-md-and-progressive-disclosure.md)）、用于实时记录的[查询工具](../../m2/10-tool-calling-deterministic-logic/08-read-only-lookup-tools.md)，以及关于某个用户的[记忆](../16-agent-state-memory/05-long-term-and-user-memory.md)。现在 Draft 的 profile 是这样写的：

```text
价格：调用 get_plan_prices；注明数据截至的日期。
产品宣称：检索 approved_claims；引用 claim id。
数字没有来源，或来源之间不一致：标记 [NEEDS SOURCE]，并升级。
```

### 每个来源的负责人和更新节奏

在 profile 旁边维护一份登记表；没有负责人的来源，还没准备好交给 agent 使用。

| 来源 | 获取方式 | 负责人 | 更新 |
|---|---|---|---|
| 计费目录 | `get_plan_prices`，实时 | 定价团队 | 每次变更时 |
| 已批准宣称 | 检索，附生效日期 | 产品市场团队 | 每月一次，之后[重建索引](../../m2/09-rag-knowledge-bases/05-metadata-filtering-and-freshness.md) |

## 常见误区

- **“只要我们记得更新，把事实放在提示词里也没问题。”** 总会有人忘记，其他 agent 里的副本会逐渐偏离，而且每次修改都相当于一次要重新测试的提示词发布。
- **“把事实挪进 profile 导入的文件，就算分离了。”** 导入的文件会随 profile 一起加载；Claude Code 的文档指出，被导入的文件“仍然会在启动时加载并进入上下文窗口”。
- **“分离知识，就是事实绝不出现在提示词里。”** 事实会不断出现在提示词里，只是为本次任务从有人负责的来源加载进来，并带着 ID 和日期。
- **“事实一旦离开 profile，agent 就能一直保持最新。”** 来源有多新，取决于负责人维护得有多勤；没人负责的索引同样会过期。

## 典型面试题

<details>
<summary>为什么角色定义不是事实的来源？</summary>

角色说明的是 agent 如何工作；事实则按别人的节奏变化。一条事实一旦敲进 profile，就没有负责人、日期和引用，会悄悄过期。profile 应该指向事实所在的位置。

</details>

<details>
<summary>profile 里的规则与知识来源里的政策有什么区别？</summary>

profile 里的规则，比如“未经审核绝不发布”，约束的是 agent，会随它的工作而变。业务政策，比如退款期限，归财务或法务负责，所以 agent 应当检索并引用它。

</details>

<details>
<summary>一个金融行业的客户希望把基金费用和其客户的风险限额写进 agent 的 profile，你会怎么建议？</summary>

费用从基金数据查询里取，并带上截至日期；已确认的风险限额从每位客户的记录或记忆里取，绝不放在共用的 profile 里。profile 里只写：要引用费用、只使用已确认的限额、缺少某个限额时要询问。

</details>

<details>
<summary>Draft agent 仍在引用上个季度的价格，你怎么排查？</summary>

先打开 trace。没有价格查询，说明这个数字来自 profile、Skill、记忆或训练数据，那我就删掉写死的价格。查询返回的是旧价格，就是来源过期了，交给它的负责人去更新。然后我加一条评测用例：出现价格却没有查询时，用例失败。

</details>

## 延伸阅读

- 文章：[Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)（Anthropic Engineering，约 15 分钟）
- 参考：[How Claude remembers your project](https://code.claude.com/docs/en/memory)（Claude Code Docs，约 25 分钟）

## 相关页面

- [Agent Profile（Profile.md）](./02-agent-profiles.md)
- [检索增强生成（RAG）](../../m2/09-rag-knowledge-bases/01-retrieval-augmented-generation.md)
- [上下文工程](../../m2/08-prompting-context-structured-output/04-context-engineering.md)
- [只读查询工具](../../m2/10-tool-calling-deterministic-logic/08-read-only-lookup-tools.md)
- [长期记忆与用户记忆](../16-agent-state-memory/05-long-term-and-user-memory.md)
