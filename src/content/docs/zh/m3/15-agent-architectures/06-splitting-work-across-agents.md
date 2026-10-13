---
title: 在 agent 之间拆分工作
row: M3-L3.6
---
**一句话：** 在 agent 之间拆分工作，是指只有当某项职责需要隔离的上下文、不同的工具或权限、独立审核或并行运行时，才给它单独配一个 agent；否则它就留作 Skill 或函数。

## 是什么

独立的 agent 有自己的 profile（岗位定义）、上下文窗口（模型每次调用时看到的文本）、工具和循环；两个 agent 之间的分界线就是一道边界。

打个比方，以新闻编辑部为例。拟定报道提纲的记者也负责写稿，因为换一个写手，就得把前一位脑子里想的一切都交代给他。事实核查员则是有意分开的，这样记者的先入之见就不会蒙蔽核查。

准确地说，只在子任务的需求与其余工作不同的地方划边界，而不是给流程图里的每个方框都划一道。每道边界都会增加一次交接、若干次模型调用，以及一个会丢信息的地方，所以每一次拆分都必须证明自己值得。

## FDE 为什么需要

一家旅游公司的内容系统串联了七个 agent：Research、Outline、Draft、SEO、Fact-check、Format 和 Publish。草稿无视 Outline agent 选定的切入角度，SEO agent 改写了已经过事实核查的句子，Format agent（一个干模板活儿的模型）还改了一个酒店价格。没人说得清某个错误是哪个 agent 造成的。

FDE 把每一道边界都拿下面的四个理由检验了一遍。Research 保持独立：它并行搜索，返回带来源的简报，而且不能发布。Fact-check 变成只读的 Reviewer。Outline、Draft 和 SEO 合并成一个 Writer，各自成为它的一个 Skill；Format 和 Publish 变成代码，放在编辑审批之后。在同一份评测集上，三个 agent 在错误、成本和速度上都胜过七个。（示例场景。）

## 核心概念

### 拆分的四个理由

| 理由 | 检验方法 | 示例 |
|---|---|---|
| 隔离的上下文 | 读入的内容远多于返回的内容 | 读入 40 页，产出 1 页简报 |
| 不同的工具或权限 | 需要其他角色不该拥有的访问权限 | 能浏览网页，不能发布 |
| [独立审核](./08-review-and-critic-patterns.md) | 作者的推理会让检查产生偏差 | 只看到草稿和来源 |
| 并行运行 | 各部分同时运行，彼此无需沟通 | 五份竞品资料 |

Claude Code 的文档也是同样的看法：适合委派的是这样一些工作，它们会产生你用不上的冗长输出，或者需要特定的工具限制或权限，或者自成一体、只需返回一份摘要。

### 不该拆分的理由

- **共享的决策。** 当一个步骤做出的选择，下一个步骤必须遵守（切入角度、读者、结构）时，摘要会丢掉其中的推理。Anthropic 称那些要求 agent 共享上下文、或彼此高度依赖的领域“目前不太适合用多 agent 系统”。
- **过小的步骤。** 只需一次调用的步骤，抵不上一道边界带来的[契约](./07-handoffs-and-agent-contracts.md)、额外调用和等待。
- **新的失败。** 每道边界都是 payload 可能残缺或被误读的又一个地方；MAST 研究把 agent 之间的错位（inter-agent misalignment）列为多 agent 失败的三个类别之一。

### Agent、Skill 还是函数

把每个步骤都做成 agent，是典型的过度设计。对每个步骤逐一判断：

```text
1. 有一个由规则定义的正确答案吗？  -> 代码里的函数
2. 需要自己的上下文、工具或
   权限、独立审核或并行运行吗？    -> 单独的 agent
3. 其他情况                        -> 放进持有该上下文的
                                      agent 里的 Skill
```

LangChain 的文档展示了两面：一个请求通过子 agent（subagent，即被另一个 agent 调用的 agent）要花四次模型调用，通过 [Skill](../14-agent-skills/01-agent-skills.md) 则是三次；但一次三种语言的对比，用子 agent 约耗 9,000 个 token，用 Skill 却要 15,000 个，因为隔离让每个上下文都保持很小。

### 把 agent 合并回去

拆分只是一个假设。警示信号有：下游 agent 在重新推导上游本来就知道的内容，payload 越来越接近整段历史，错误集中出现在边界上。把这些角色合并为一个 agent 里的多个 Skill，重跑[评测集](../../m2/11-ai-evaluation/02-evaluation-sets.md)，留下表现更好的那个方案。

## 常见误区

- **“团队里的每个角色都该是一个独立的 agent。”** 人之所以要分工，是因为时间和培训有限；agent 几秒钟就能加载另一个 Skill。
- **“agent 越小，系统越容易调试。”** 失败转移到了边界上，而且你得先找出是哪个 agent 失败了。
- **“把 agent 合并回去，说明设计失败了。”** 这说明评测起到了它该起的作用。

## 典型面试题

<details>
<summary>一项职责什么时候值得拥有自己的 agent？</summary>

当它需要隔离的上下文、其他角色不该拥有的工具或权限、独立审核，或者并行运行时。否则它就留作 Skill 或函数：每道边界都会增加调用、延迟，以及一次有损的交接。

</details>

<details>
<summary>按流程步骤拆分与按需求拆分有什么区别？</summary>

按步骤拆分，是给流程图里的每个方框都配一个 agent，于是每条箭头都成了一次交接。按需求拆分，只在上下文、权限、独立性或并行性不同的地方划边界；多数步骤会变成 Skill 或函数。

</details>

<details>
<summary>为 Content Operations 设计 agent：Research、Plan、Draft、Review。</summary>

一个并行搜索、返回带来源简报的 Research agent；一个同时负责规划和起草的 Writer，因为规划决定草稿；一个只读的 Reviewer。发布仍然是代码，放在审批之后。

</details>

<details>
<summary>一条六个 agent 的流水线又慢又难调试。你怎么办？</summary>

用 trace 找出错误是从哪里混进来的，拿四个理由逐道检验每条边界，把通不过的 agent 合并掉，把规则挪进代码，再在同一份评测集上比较两个版本。

</details>

## 延伸阅读

- 参考：[Create custom subagents](https://code.claude.com/docs/en/sub-agents)（Claude Code Docs，“Choose between subagents and main conversation”一节，约 5 分钟）
- 文档：[Multi-agent](https://docs.langchain.com/oss/python/langchain/multi-agent)（LangChain docs，约 10 分钟）
- 文章：[How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)（Anthropic，约 20 分钟）

## 相关页面

- [多 agent 系统](./04-multi-agent-systems.md)
- [Skill 拆分](../14-agent-skills/03-skill-decomposition.md)
- [Agent 职责与禁止操作](../13-agent-profiles/04-responsibilities-and-prohibited-actions.md)
- [交接与 agent 契约](./07-handoffs-and-agent-contracts.md)
- [选择 agent 架构](./05-choosing-an-agent-architecture.md)
