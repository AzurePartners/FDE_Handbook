---
title: Skill 组合与版本管理
row: M3-L2.6
---
**一句话：** Skill 组合是把多个 Skill 串成一条流程运行，每个 Skill 的输出交给下一个；Skill 版本管理则给每次改动一个永久的 ID，让生产环境运行经过测试的版本，并且可以回滚。

## 是什么

agent 一旦拆成了多个 Skill（见 [Skill 拆分](./03-skill-decomposition.md)），还剩两件事要做。组合是把它们串成一条流程，每个 Skill 使用上一个的输出：调研、列提纲、起草、审核、修改。版本管理则让一个 Skill 可以改动，而不会悄悄改变所有使用它的流程。

打个比方，汽车工厂会记录每辆车装的是哪一版零件，这样有问题的版本可以被追查出来，并换回上一版。

准确地说，版本是整个 Skill 文件夹（指令、脚本、参考文件）的一份不可变、带 ID 标记的快照；固定（pinning）是指生产环境写明要用的确切版本。每个 Skill 声明的输出（[Skill 输入、输出与检查](./04-skill-inputs-outputs-and-checks.md)）就是给下一个 Skill 的[契约](../../m1/03-apis-data-integration/10-schema-and-data-contracts.md)。

## FDE 为什么需要

一家零售商的营销流程和客服流程共用一个 `summarize-sources` Skill。一位营销人员为了让摘要更抓人而重写了它，用三段产品简介测试后上传。两个流程都加载每个 Skill 的最新版本，于是它在所有地方同时生效。一周后，客服主管发现一些回答承诺“两年保修”，而政策写的是“两年，电池除外”，没人知道哪些回答用的是哪个版本。与此同时，法务禁止承诺送达日期的规定散落在四个 Skill 里，措辞有三种写法。（示例场景。）

FDE 把这些 Skill 迁入客户的 Git 仓库，配上版本、变更日志和负责人；每条流程固定确切的版本，并在每次运行时记录下来。法务的规定移到 profile 里，抓人的摘要单独做成营销专用的 Skill，现在任何 Skill 改动都会运行两个流程的评测。

## 核心概念

### 谁来决定顺序

可以由代码固定顺序，这就是提示词链（prompt chaining，见[工作流模式](../15-agent-architectures/02-workflow-patterns.md)）：可预测，也便于测试。也可以让 agent 加载描述与任务相符的 Skill：Anthropic 在 2025 年 10 月的发布中说，Skill 能“叠加使用”，Claude 会“协调它们的使用”。这样一来，描述得很宽泛的新 Skill 可能抢走别的 Skill 的任务，所以要测试整套 Skill。

### 防止超长提示词重新长回来

- **一个 Skill 只做一件事。** 新需求交给负责那件事的 Skill，或者新建一个，绝不要为了“保险起见”塞进好几个 Skill。
- **共用规则只放一处，** 放在 [agent profile](../13-agent-profiles/02-agent-profiles.md) 或某个共享文件里。
- **留意大小和数量。** Anthropic 建议 `SKILL.md` 正文不超过 500 行，并提醒用不上的 Skill 会拖累性能。

### 版本号与固定版本

按语义化版本（Semantic Versioning）的约定，把 Skill 的输入和输出格式当作它的公开 API：MAJOR 用于不兼容的变更，MINOR 用于向后兼容的新增，PATCH 用于修复。Agent Skills 标准没有版本字段；各团队使用自由格式的 `metadata`（规范里的例子：`version: "1.0"`）或 Git tag。

```text
# flows/support-answers.yaml：固定的版本只能通过 pull request 修改
find: find-policy-clauses@2.3.1
summarize: summarize-sources@1.4.0   # 1.5.0 在客服评测中丢了除外条款
reply: draft-reply@3.0.2
```

Anthropic 的 Skills API 给每次上传一个版本 ID；其文档建议在生产环境固定版本，因为用 `latest` 或不指定 `version` 时，“工作区中任何人上传的版本，都会立刻改变你的生产 agent 运行的内容。”OpenAI 的 Skills API 同样保留不可变的编号版本，外加一个可以移动的默认版本。记录每次运行用到的版本并保留变更日志，做法同[提示词版本管理](../../m2/08-prompting-context-structured-output/08-prompt-versioning.md)。

### 负责人与依赖它的流程

Anthropic 的企业指南建议为每个 Skill 登记用途、负责人、版本、依赖和评测状态，并指出作者不应该审核自己写的 Skill。`CODEOWNERS` 文件会让 GitHub 在 pull request 涉及某个 Skill 时，请求它的负责人审核。再维护一份“被哪些流程使用”的清单：改动 `summarize-sources` 时，重新运行所有依赖它的流程的评测，全部通过后才移动固定的版本，旧版本则保留下来以便回滚（见[回归测试](../../m2/11-ai-evaluation/08-regression-testing.md)）。

## 常见误区

- **“超长提示词拆成 Skill 之后，就一直是拆开的。”** 如果没有每项工作各自的负责人，也没有一个存放共用规则的地方，需求就会落到好几个 Skill 里，提示词会分散着重新长回来。
- **“用 `latest` 能让生产环境保持最新。”** 它会把每一次上传都未经测试地推到生产环境。生产环境要固定版本，`latest` 只在开发时用。
- **“Skill 通过了自己的测试，就可以放心发布。”** 每个使用它的流程都依赖它的输出，要把这些流程全部重跑一遍。
- **“Skill 的版本就是 `SKILL.md` 的文字。”** 脚本和参考文件同样会改变行为，所以要给整个文件夹做版本管理。

## 典型面试题

<details>
<summary>什么是 Skill 组合，由谁来决定顺序？</summary>

把多个 Skill 作为一条流程来运行，每个的输出交给下一个。可以由代码固定顺序，可预测、便于测试；也可以由 agent 按描述挑选 Skill，灵活，但需要测试整套 Skill。

</details>

<details>
<summary>固定 Skill 版本和使用 latest 有什么区别？</summary>

固定是指明一个确切的、不可变的版本，所以只有在评测通过后有人去移动它，行为才会变化。`latest` 会跟随每一次上传，所以任何一次编辑都会未经测试就到达生产环境。

</details>

<details>
<summary>怎样让团队改进共用的 Skill，又不弄坏生产环境？</summary>

Skill 放在 Git 里，配上语义化版本、变更日志和代码负责人；流程固定确切的版本。每次改动都运行所有依赖它的流程的评测；评测通过才移动固定的版本，旧版本保留下来以便回滚。

</details>

<details>
<summary>审核 Skill 更新之后，草稿不再被修改了。你会去看哪里？</summary>

看交接处：trace 会显示运行的是审核 Skill 的哪个版本，以及它的原始输出。如果格式变了，修改 Skill 就读不懂它，所以我会先固定最近一次已知正常的版本，再修复格式，或者把两个 Skill 一起更新。

</details>

## 延伸阅读

- 参考：[Semantic Versioning 2.0.0](https://semver.org/)（semver.org，约 10 分钟）
- 参考：[Skills for enterprise](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/enterprise)（Anthropic Claude Docs，约 10 分钟）

## 相关页面

- [Skill 拆分](./03-skill-decomposition.md)
- [提示词版本管理与实验](../../m2/08-prompting-context-structured-output/08-prompt-versioning.md)
- [提示词、模型、工具与数据的回归测试](../../m2/11-ai-evaluation/08-regression-testing.md)
- [工作流模式（提示词链、路由、并行化）](../15-agent-architectures/02-workflow-patterns.md)
- [Agent Skills](./01-agent-skills.md)
