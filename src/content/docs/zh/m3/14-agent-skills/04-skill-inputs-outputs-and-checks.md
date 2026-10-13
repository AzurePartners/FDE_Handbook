---
title: Skill 输入、输出与检查
row: M3-L2.4
---
**一句话：** Skill 的输入、输出和检查就是它的书面契约：开工前需要什么，交回的结果叫什么、结构怎样固定，以及这个结果在被任何人使用之前必须通过哪些测试。

## 是什么

只写着“提取关键条款”的 Skill（agent 在需要时才加载的可复用任务）没法测试：没人知道它需要什么、会返回什么，也不知道什么样才算好。补上四个书面部分就能解决：输入、步骤、输出（一个有名字的产物，即它交回的文件或记录），以及返回前要运行的检查。

菜谱卡也有同样的组成部分：食材、做法、成品照片，以及出菜前主厨的检查。

开放的 Agent Skills 格式没有为这些内容设专门的字段，所以它们只是正文里的普通小节，较长的模板放在 `assets/` 里，检查脚本放在 `scripts/` 里。

## FDE 为什么需要

一家制造企业的采购员借助 agent 的提取、对比、备忘录三个 Skill 审阅供应商合同。其中一份合同会以更高的价格自动续期三年。trace 显示，提取 Skill 把续期字段留空了，因为相关条款在一份它从未收到的补充协议里；对比 Skill 又把空白当成了“不自动续期”。每个 Skill 都严格照自己的文字做了。（示例场景。）

FDE 为每个 Skill 写明输入、输出和检查。提取 Skill 现在要求提供全部补充协议，并把每种条款类型要么返回为“已找到”（值、页码），要么返回为“未找到”，绝不留空，由一个脚本来验证。检查失败时重试一次，然后以 `needs_review` 交给采购员。每个 Skill 配三份示例合同，其中一份带补充协议。

## 核心概念

### 输入、步骤与输出

列出每个输入，写明它的形式和来源。缺了某个输入时，返回 `needs_input` 并指明缺的是哪一个，而不是靠猜。针对整个 agent 的做法，见 [Agent 输入、输出与升级条件](../13-agent-profiles/05-agent-inputs-outputs-escalation.md)。

给步骤编号；对复杂的 Skill，Anthropic 建议附一份检查清单，让 agent 逐项勾选，这样就不会漏掉任何校验。给输出定一个模板或 [schema](../../m2/08-prompting-context-structured-output/06-structured-output.md)、一个 `status`（`done`、`needs_input`、`needs_review`）和一份问题列表。模板胜过文字描述：“agent 很擅长对照具体的结构做模式匹配”（Agent Skills 指南）。提取 Skill 的写法如下：

```text
输入：contract.pdf、所有补充协议、clause_types.json
  （引用了某份补充协议但没收到：返回 needs_input）
输出：clauses.json，含一个状态，以及每种条款类型的
  found（值、页码）或 not_found
返回前的检查：
  1. 运行 python scripts/check_clauses.py clauses.json
  2. 把每个 found 的值对照它所在的页面重读一遍。
  3. 失败时修正并重跑一次，否则 needs_review。
```

### 机械检查与判断检查

检查涵盖完整性（必填的行都在且已填写）、来源（每个值都能追溯到某一页）、格式（有效的 JSON、真实存在的日期）和业务规则。机械性的检查适合放进[脚本](./05-instruction-only-vs-code-backed-skills.md)：通过时以退出码 0 结束，否则指出具体问题，这样重试时就知道该改什么。判断类的检查（比如第 2 步）仍写成指令，配上评分标准（rubric）。检查要看实质，而不是看标签：一个只查有没有“来源”标题的脚本，会放过一个空的小节。

### 检查失败时

Skill 指南的做法是修正后重跑，直到校验通过。在客户的系统里要设上限：带着检查给出的信息重试一次，然后把结果标为 `needs_review` 交回，并附上未通过的检查，绝不标为 `done`。一项检查连续失败两次，通常是上游有原因，比如缺了文档，重试解决不了。通用的修复循环见[程序化 LLM 接口](../../m2/07-llm-application-foundations/08-programmatic-llm-interfaces.md)。

### 每个 Skill 的示例用例

在每个 Skill 旁边保留几个用例：一个贴近真实的请求、输入文件、用文字写出的预期输出，以及断言（可检查的陈述，比如“status 是 needs_input”）。Agent Skills 指南把它们放在 `evals/evals.json` 里，起步 2 到 3 个；Anthropic 的指南要求至少三个。要包含一个缺少输入的用例；每个用例分别在有 Skill 和没有 Skill 的情况下各跑一遍，看 Skill 起了什么作用；还要给每项检查喂一个已知有问题的输出。工作流层面的测试见 [Agent 工作流的可重放测试](../18-agent-evaluation-debugging/06-replayable-tests.md)。

## 常见误区

- **“输出符合模板，就说明 Skill 起作用了。”** 每个字段都在，内容也可能是错的。结构检查要搭配内容检查。
- **“加一句‘请再检查一遍你的工作’，Skill 就有检查了。”** 模型给自己打分，带着自己的盲区。检查需要外部的标尺：脚本、来源或评分标准。
- **“通过 `skills-ref validate` 就说明 Skill 测试过了。”** 它只检查 frontmatter 和命名。输出质量要靠示例用例来保证。

## 典型面试题

<details>
<summary>一个 Skill 要声明什么，才能被测试？</summary>

输入以及输入缺失时的规则、编号的步骤、一个有名字且结构固定的输出（带状态）、返回前的检查，以及示例用例。

</details>

<details>
<summary>Skill 的检查和它的评测有什么区别？</summary>

检查在每次执行时都会运行，决定这份产物是继续往下走还是被标记出来。评测则是离线跑一组固定的用例，决定某个版本能不能发布。检查守护每一次运行，评测守护每一次变更。

</details>

<details>
<summary>为一个对比供应商报价的 Skill 设计契约。</summary>

输入：报价文件、币种和必需的明细项，缺了就返回 `needs_input`。输出：按供应商和明细行列出的表格，每个数字都标注所在页码，外加状态。由脚本重新计算合计；重试一次，然后 `needs_review`。用例：正常、币种混用、缺页。

</details>

<details>
<summary>某个 Skill 的检查总是通过，审核的人却发现了错误。为什么？</summary>

检查太弱，或者根本没有运行。trace 能看出脚本有没有运行、它的结论有没有被采纳；已知有问题的输出如果也能通过，就说明检查只看标签。每个发现都要变成一项检查或一个用例。

</details>

## 延伸阅读

- 参考：[Evaluating skill output quality](https://agentskills.io/skill-creation/evaluating-skills)（Agent Skills，约 12 分钟）
- 参考：[Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)（Anthropic Claude Docs，约 25 分钟）

## 相关页面

- [SKILL.md 文件与渐进式披露](./02-skill-md-and-progressive-disclosure.md)
- [结构化输出与 JSON Schema](../../m2/08-prompting-context-structured-output/06-structured-output.md)
- [评测集（正常、边界、失败、对抗性用例）](../../m2/11-ai-evaluation/02-evaluation-sets.md)
- [审核与 critic 模式](../15-agent-architectures/08-review-and-critic-patterns.md)
- [交接与 agent 契约](../15-agent-architectures/07-handoffs-and-agent-contracts.md)
