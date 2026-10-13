---
title: 纯指令 Skill 与代码支撑的 Skill
row: M3-L2.5
---
**一句话：** 纯指令 Skill 是模型凭自己的判断去遵循的 Markdown 指引；代码支撑的 Skill 还会打包脚本，供 agent 运行那些必须每次完全一致的步骤，比如解析或计算。

## 是什么

很多 Skill 是纯文本：步骤、评分标准（rubric）、一个示例。由模型运用判断，这适合调研、写作和审核。只有一个正确答案的步骤就不同了，比如给发票求和：由模型自己做，可能出错。代码支撑的 Skill 把这类步骤交给脚本。

会计师也是这样工作的：客户的哪些支出可以申报扣除，靠自己的判断；算术则交给报税软件。

准确地说，在开放的 Agent Skills 格式里，脚本放在 Skill 的 `scripts/` 文件夹中。agent 用 shell 或代码执行工具运行它们，只有脚本的输出会进入上下文。Anthropic 的编写指南把这种选择称为自由度（degrees of freedom）：“有多种做法都可行”时用文字，“一致性至关重要”时用具体的脚本。

## FDE 为什么需要

设想一家货运公司的 agent，它有一个纯指令 Skill 用来审计承运商发票：读取 PDF、汇总费用、核对合同费率、起草争议说明。试点期间，同一张发票每次运行得到的合计都不一样，长 PDF 深处的明细行被漏掉，而且因为拿不到费率表，模型有时把发票上的价格当成合同价格。整份 PDF 都放进上下文，使每次审计既慢又贵。

FDE 把判断留在 Markdown 里：哪些差异需要提出争议，以及说明的措辞。现在由打包在内的 `scripts/extract_invoice.py` 以 JSON 输出明细行和合计。费率核对改成了一个应用工具，读取客户的费率表，因为 Claude API 上的 Skill 运行在没有网络访问的沙箱里。

## 核心概念

### 每个步骤放在哪里

一般规则见[模型判断与确定性代码](../../m2/10-tool-calling-deterministic-logic/03-model-vs-code.md)。在一个 Skill 内部：

| 步骤 | 放在哪里 | 原因 |
|---|---|---|
| 判断相关性、起草、对照评分标准审核 | 指令（评分标准作为参考文件） | 需要判断的环节 |
| 解析或转换文件、计算合计、校验格式 | 随 Skill 打包的脚本 | 结果精确；文件不进上下文 |
| 查询实时数据、修改记录 | 应用工具 | 需要网络、凭证和审批 |

脚本随 Skill 一起走；应用工具（[工具 schema 与工具设计](../../m2/10-tool-calling-deterministic-logic/05-tool-design.md)）则运行在你的应用里，应用持有凭证，可以校验参数、要求审批并记录调用。步骤里可以同时点名两者：

```text
1. 运行：python scripts/extract_invoice.py invoice.pdf
   原样使用它输出的 JSON 明细行和合计。
2. 把这些明细行发给 compare_to_contract 工具。
3. 判断哪些差异值得提出争议，并起草说明。
```

### Skill 该加代码的信号

- 同样的机械性错误反复出现在 trace 或评测里，比如合计算错。
- agent 每次运行都重写同样的辅助代码，Agent Skills 指南把这称为应该“一次写好一个经过测试的脚本”的信号。
- 这项工作很耗 token。Anthropic 的说法是：“通过生成 token 来给列表排序，比直接运行排序算法要昂贵得多。”

### 脚本运行需要什么

- **运行环境。** 在 Claude API 上，Skill 运行在代码执行工具的容器里：没有互联网，只有预装的库，比如 pandas。在 Claude Code 里，脚本运行在用户自己的机器上，可以使用那台机器的网络；在 claude.ai 上，能否联网取决于设置。
- **声明依赖，** 写在 `SKILL.md` 里，或写在该格式可选的 `compatibility` 字段里。
- **不要有交互式输入提示。** 等待输入的脚本会“无限期挂起”。用 flag 接收参数，输出 JSON，错误要解释清楚。

## 常见误区

- **“很长的脚本会让提示词膨胀。”** 被执行的脚本不会进入上下文，进入上下文的只有它的输出。
- **“带脚本的 Skill 就是确定性的。”** 只有脚本那一步是。agent 仍然要自己决定是否运行脚本、怎么使用输出，所以要检查结果（[Skill 输入、输出与检查](./04-skill-inputs-outputs-and-checks.md)）。
- **“Skill 脚本可以调用任何 API。”** 在 Claude API 上不行，它不给 Skill 开放网络访问。客户的系统应该放在应用工具后面。
- **“代码更可靠，所以什么都写成脚本。”** 用关键词规则判断语气，效果不如评分标准；只把脆弱、要求精确的步骤写成脚本。

## 典型面试题

<details>
<summary>什么是代码支撑的 Skill？</summary>

除了指令，还打包了脚本的 Skill：agent 用这些脚本运行只有一个正确答案的步骤，比如解析或计算，而判断类的环节仍留在指令里。

</details>

<details>
<summary>随 Skill 打包的脚本和你的应用提供的工具有什么区别？</summary>

脚本随 Skill 一起分发，适合自成一体的文件处理，不涉及密钥或副作用。接入实时系统、使用凭证以及写入操作，则放在应用工具里，由你的代码来校验、要求审批并记录日志。

</details>

<details>
<summary>你会怎样把一个 Content Creation 的调研 Skill 拆成文本、脚本和工具？</summary>

评判可信度和做总结仍然用文本。搜索和抓取网页需要联网，所以做成工具。PDF 转换、去除重复来源和校验笔记文件则是脚本。

</details>

<details>
<summary>agent 每次运行都新写一个 CSV 解析器，还把列读错了。你会改什么？</summary>

我会打包一个经过测试的解析器，让 Skill 去运行它并如实引用它的输出，确认目标运行环境里有它所需的库，并把出错的文件加入评测用例。

</details>

## 延伸阅读

- 文章：[Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)（Anthropic Engineering，约 8 分钟）
- 参考：[Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)（Anthropic Claude Docs，约 12 分钟）
- 参考：[Using scripts in skills](https://agentskills.io/skill-creation/using-scripts)（Agent Skills，约 10 分钟）

## 相关页面

- [模型判断与确定性代码](../../m2/10-tool-calling-deterministic-logic/03-model-vs-code.md)
- [SKILL.md 文件与渐进式披露](./02-skill-md-and-progressive-disclosure.md)
- [Skill 输入、输出与检查](./04-skill-inputs-outputs-and-checks.md)
- [Tool calling（函数调用）](../../m2/10-tool-calling-deterministic-logic/01-tool-calling.md)
- [开发环境：终端、项目结构、依赖、环境变量](../../m1/01-ai-assisted-development/03-dev-environment.md)
