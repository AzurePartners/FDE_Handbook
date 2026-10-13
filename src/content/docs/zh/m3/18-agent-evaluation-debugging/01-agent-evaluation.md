---
title: Agent 评测（任务、环境、结果）
row: M3-L6.1
---
**一句话：** agent 评测让 agent 在其系统的测试副本里完成完整、真实的任务，评的是那里发生了什么变化，而不是它说了什么，并且每个任务都要重复运行，因为每次运行的结果会有波动。

## 是什么

agent 会在许多步骤里提问、调用工具、修改记录。只看它的最后一条消息来评判它，就像只凭水管工发来的一条“都修好了”的短信来评判他：你要确认漏水止住了，没有别的地方被淹，而且这个修复每次都管用。

Anthropic 的 agent 评测指南（2026 年 1 月）把**任务**（task）定义为带有输入和成功标准的一次测试，把**试验**（trial）定义为一次尝试，把**结果**（outcome）定义为“试验结束时环境中的最终状态”。**环境**（environment）是一个沙箱：agent 的真实工具接在预置了已知数据的测试系统上。订票 agent 可能会说“你的航班已预订”；而结果要看系统里是否真的存在这条预订记录。

## FDE 为什么需要

一家差旅管理公司的 agent 负责在航班取消后，按差旅政策为出差人员改签。它的评测把最终消息与参考答案做比对：50 个里有 46 个通过。到了试点阶段，出差人员读到“已为你确认 18:40 的航班”，实际上并没有出票；还有一次运行取消了一位出差人员的返程航班。

FDE 把评测改成围绕结果来做：每个任务都预置一个全新的订票系统沙箱，由另一个模型扮演出差人员，再由代码检查最终状态（一张符合政策的机票、返程段原封不动、一条通知）。每个任务运行五次，只有 31 个每次都通过：这才是上线时该看的真实数字。（示例场景。）

## 核心概念

### 只看最终回答会漏掉什么

| 被掩盖的失败 | 示例 | 由什么发现 |
|---|---|---|
| 说了没做 | “已为你改签”，但没有出票 | 最终状态检查 |
| 靠运气答对 | 猜对了票价上限，没有查政策 | 重复试验、步骤检查 |
| 有害的步骤 | 打开了另一位出差人员的订单 | 步骤检查 |
| 浪费成本 | 调用了 40 次工具才得到正确结果 | [Agent 级指标](./04-agent-level-metrics.md) |

### 任务、环境与重复试验

每个任务把一个真实的请求，和取自该 agent [成功标准](../13-agent-profiles/06-agent-success-criteria.md)的最终状态检查配成一对：

```python
import os

def run_task(task, k=5):
    passes = 0
    for _ in range(k):
        env = Sandbox(seed=task["seed"])   # 测试数据的全新副本
        run_agent(env, task["request"], model=os.environ["LLM_MODEL"])
        state = env.snapshot()             # 最终状态，而不是回复
        passes += all(check(state) for check in task["checks"])
    return {"passed": passes, "pass@k": passes > 0, "pass^k": passes == k}
```

每次试验都应该“从干净的环境开始”：Anthropic 发现，Claude 曾借助之前试验留下的 git 历史获得不公平的优势。能通过所有检查的参考解法，则证明这个任务是可解的。

`pass@k`（k 次试验中任意一次通过）适合由人从中挑选的草稿；`pass^k`（k 次全部通过）适合面向客户的 agent（[背后的计算](../../m2/07-llm-application-foundations/07-chat-vs-system-reliability.md)）。Sierra 的客服基准 τ-bench（2024）提出了 `pass^k`；在它的航空任务上，榜单上最好的 agent 在 `pass^1` 的得分是 46%，在 `pass^4` 只有 22.5%。

### 多轮任务中的模拟用户

agent 会提出澄清问题，所以固定脚本行不通。对话式评测“往往需要第二个 LLM 来模拟用户”（Anthropic），并给它一个隐藏的目标和角色。τ-bench 在零售和航空客服场景里就是这样做的，把“对话结束时的数据库状态”和目标状态做比较。Google 的 ADK 用 `ConversationScenario`（起始提示词、计划、角色）来构建用户。模拟器也会出错；在归咎于 agent 之前，先读对话记录（完整的运行记录）。

### 先看结果，再加步骤检查

Anthropic 认为，检查工具调用序列是否与预期完全一致“过于死板”，应当“评 agent 产出了什么，而不是它走了哪条路径”。评分器也可能拒绝更好的答案：Claude Opus 4.5 在一个 τ2-bench 航班任务上被判“失败”，只因为它找到了政策里一个对用户更有利的漏洞。只在最终状态察觉不到问题的地方才加步骤检查：绝不能做的操作，以及写入之前的审批（[轨迹评测](./05-trajectory-evaluation.md)）。

## 常见误区

- **“最终答案对了，agent 就是成功的。”** 它可能声称做了一个其实没做的操作，可能只是运气好，也可能造成了损害。
- **“它通过了一次，说明它能完成这个任务。”** 一次试验只是一个样本，而客户需要每次运行都成功。
- **“总是失败的任务，说明 agent 很弱。”** Anthropic 把 100 次试验通过率为 0% 称为“多半是任务本身有问题的信号”。

## 典型面试题

<details>
<summary>什么是基于任务的 agent 评测？</summary>

在沙箱里，用 agent 的工具和预置的数据运行一个真实的任务，按最终状态（改动的记录、生成的文件）而不是回复来评分，并且要进行多次试验。

</details>

<details>
<summary>`pass@k` 和 `pass^k` 有什么区别？</summary>

`pass@k` 表示 k 次试验中至少有一次成功；`pass^k` 表示全部成功。面向客户的 agent 需要看 `pass^k`，因为每个客户只有一次机会。

</details>

<details>
<summary>你会怎样评测一个根据通话笔记更新 CRM 记录的 agent？</summary>

用真实的笔记整理出 20 到 50 个任务，每个任务配一个预置了数据的沙箱 CRM 和一个参考解法。由代码检查该改的字段改对了、别的字段没有被动过，每个任务做五次试验。

</details>

<details>
<summary>有一个任务 20 次试验全部失败，而类似的任务都能通过。你会检查什么？</summary>

先查任务本身：任务说明是否写清了评分器检查的全部内容，参考解法能不能通过？再看对话记录，判断是谁出了错：agent 还是评分器。

</details>

## 延伸阅读

- 文章：[Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)（Anthropic Engineering，约 30 分钟）
- 参考：[User Simulation](https://adk.dev/evaluate/user-sim/)（Google ADK docs，约 10 分钟）
- 论文：[τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045)（Yao et al., ICLR 2025，约 40 分钟）

## 相关页面

- [AI 评测](../../m2/11-ai-evaluation/01-ai-evaluation.md)
- [轨迹评测](./05-trajectory-evaluation.md)
- [Agent 级指标（任务完成率、交接、工具调用、循环、成本、延迟）](./04-agent-level-metrics.md)
- [Agent 成功标准与完成标准](../13-agent-profiles/06-agent-success-criteria.md)
- [评测集（正常、边界、失败、对抗性用例）](../../m2/11-ai-evaluation/02-evaluation-sets.md)
