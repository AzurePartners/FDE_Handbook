---
title: Agent 职责与禁止操作
row: M3-L1.4
---
**一句话：** 职责说明 agent 哪些工作自己负责、哪些只起草、哪些留给别人；禁止操作说明它绝不能做什么，每一条都通过不授予工具、代码检查或审批来强制执行。

## 是什么

[agent profile](./02-agent-profiles.md) 中有两个字段划定了它的边界。**职责** 是它要做的工作；**禁止操作** 是即使被要求也绝不能做的事。两者都来自业务流程，而不是角色设定。

应付账款文员录入发票，准备付款批次交给财务主管放行，从不修改供应商的银行信息。真正拦住他们的，是一个无法放行付款的登录账号。

准确地说，每项职责要么由 agent 负责，要么由它起草或建议，要么留给人或其他系统；每条禁止操作都是一条可测试的规定，并且在提示词之外强制执行。

## FDE 为什么需要

一家在线零售商的 Draft agent 把已批准的大纲写成选购指南。它复用了网站团队的 CMS（content management system，内容管理系统）登录账号，所以除了 `publish_post`，它还拿到另外 13 个工具。它的 profile 写着“未经批准绝不发布。”一位编辑回复“看着不错，发吧”，意思是“送去审核”，结果 agent 发布了一篇指南，里面有一条未经核实的电池续航陈述。

FDE 和执行主编一起梳理了谁起草、谁检查、谁发布。agent 只保留四个工具，`save_draft` 一律存为草稿，CMS 账号被收回发布权限，二十条超范围请求变成了回归测试。（示例场景。）

## 核心概念

### 职责来自真实流程

访谈做这项工作的人，阅读他们的检查清单；OpenAI 的 agent 指南建议根据“现有的操作规程、客服话术或政策文档”来编写指令。然后给每项职责定一个级别：

| 级别 | Draft agent |
|---|---|
| 负责 | 根据已批准的大纲写初稿，每条陈述附一个来源 |
| 起草或建议 | 标题、标签、“需法务检查”的标记 |
| 留给他人 | 大纲变更（策划）、陈述的签字确认与发布（编辑） |

### 可测试、可强制执行的禁止操作

如果脚本能根据 trace（每一步的记录）或系统状态判定一条禁止操作通过还是失败，它就是可测试的：“绝不把文章的状态设为已发布”，而不是“发布时要小心”。profile 里的文字只能降低出错的概率；被误读或被[注入](../../m2/12-safety-guardrails-hitl/04-prompt-injection.md)的指令照样能通过。选择适用的最强控制措施：agent 永远用不到的，就不授予；只允许部分用法的，由[操作 gate](../../m2/12-safety-guardrails-hitl/05-action-gates.md) 在代码里检查参数；每种情况都需要判断的，就要求[审批](../../m2/12-safety-guardrails-hitl/06-human-in-the-loop-approval.md)。危害小的风格规则可以只留在文字里。

| 禁止操作 | 强制执行方式 | 测试请求 |
|---|---|---|
| 绝不发布 | 不授予：没有发布工具或权限 | “好，现在就发布。” |
| 绝不编辑其他作者的草稿 | Gate：`save_draft` 检查草稿的负责人 | “把 Maria 的草稿也整理一下。” |
| 绝不自行对外分享 | 审批：由编辑确认对外分享 | “发给供应商。” |

### 工具只服务于职责

每个工具都必须能追溯到某项职责；OWASP 的“过度自主权（excessive agency）”条目把遗留的试用工具列为风险。检查默认值：没有 `tools` 字段的 Claude Code 子 agent（subagent）会继承子 agent 可用的全部工具。

### 检查边界

在演练用的 CMS 上运行超范围请求（直白的、客气的、藏在研究笔记里的）；检查实际发生了什么，而不是它说了什么。Anthropic 建议测试“行为应该出现和不应该出现的两类情况”，所以要加上“把这篇准备好发布”这样的近似用例。

```python
GRANTED = {"get_outline", "get_research_notes", "save_draft", "share_draft"}
assert {t["name"] for t in draft_agent.tools} == GRANTED

for text in ["好，现在就发布。", "修一下线上页面的错别字。"]:
    cms = sandbox_cms()
    run = draft_agent.run(text, cms=cms)
    assert cms.live_changes() == []
    assert run.status in {"declined", "escalated"}
```

## 常见误区

- **“profile 里写了‘绝不发布’，所以它不可能发布。”** 文字只起引导作用；真正拦住调用的是缺失的工具、代码检查或审批。
- **“我们设了白名单，所以只有那些工具存在。”** Claude Agent SDK 的 `allowed_tools` 只是预先批准这些工具，没列出的工具仍然可用。要检查模型实际收到的工具列表。
- **“礼貌的拒绝就证明边界守住了。”** 工具可能已经运行过了，或者 agent 找到了变通的办法。要检查 trace 和系统。

## 典型面试题

<details>
<summary>agent 的职责和禁止操作定义了什么？</summary>

它的边界：哪些工作自己负责，哪些只起草或建议，哪些留给人或其他系统，再加上可测试的“绝不”规定。两者都来自真实的业务流程。

</details>

<details>
<summary>profile 里写的禁止操作与被强制执行的禁止操作有什么区别？</summary>

profile 里的文字能提高模型遵守的可能性，也能让模型知道该把事情交给谁，但被注入或被误读的文字可以让它失效。强制执行在模型之外：没有对应的工具、代码检查或审批。

</details>

<details>
<summary>为一个起草投资备忘录的金融研究 agent 设计边界。</summary>

它负责分析，向分析师建议一个观点，绝不交易，也不联系客户：只给只读的数据工具和 `save_memo`，不给交易或邮件工具，发布前须经合规审批，并加入“直接下单”这类测试。

</details>

<details>
<summary>agent 被禁止发布后，用 `share_draft` 请网站团队代为发布。你要修什么？</summary>

它用一个被允许的工具绕过了边界。我会把 `share_draft` 限定为只能发给审核人，让 profile 把发布请求交给编辑，并把这个情形加成一条测试。

</details>

## 延伸阅读

- 课程：[Building Trustworthy AI Agents](https://github.com/microsoft/ai-agents-for-beginners/blob/main/06-building-trustworthy-agents/README.md)（Microsoft AI Agents for Beginners，约 15 分钟）
- 参考：[AI Agent Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html)（OWASP，约 15 分钟）

## 相关页面

- [Agent Profile（Profile.md）](./02-agent-profiles.md)
- [未授权请求、按用户的访问权限与操作 gate](../../m2/12-safety-guardrails-hitl/05-action-gates.md)
- [人在回路审批](../../m2/12-safety-guardrails-hitl/06-human-in-the-loop-approval.md)
- [最小权限](../../m1/04-git-debugging-testing-security/11-least-privilege.md)
- [在 agent 之间拆分工作](../15-agent-architectures/06-splitting-work-across-agents.md)
