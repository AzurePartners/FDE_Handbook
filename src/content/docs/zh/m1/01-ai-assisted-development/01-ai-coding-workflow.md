---
title: AI 编程工作流
row: M1-L1.1
---
**一句话：** AI 编程工作流是一个反复执行的循环：说明需求、拆分任务、让 AI 生成代码、运行、检查结果、修改。做什么、结果对不对，始终由人来判断。

## 是什么

“用 AI 写代码”可以有两种意思。弱的做法是：输入一个请求，拿到代码，粘贴进去，然后祈祷没问题。在实际工作中行得通的做法，是有意识地跑一个循环：需求、任务拆分、生成、执行、验证、修改。

先用直白的话说明需求。把它拆成 AI 一次就能完成的小任务。AI 生成代码。你来执行，也就是真正运行它，而不只是看一眼。对照需求验证结果。如果不符合，就修改：告诉 AI 哪里不对，或者自己动手改，然后再走一轮。

打个比方：这就像给一个速度极快、只按字面理解的承包商交代任务。你描述什么，他就做什么，从不问你本意是什么。验收之前，你得亲自检查。这一步检查最常被跳过，也恰恰最重要。

## FDE 为什么需要

设想一位工程师让 AI 工具清理客户导出的电子表格，跑了一次，没看到报错，就交付了。结果脚本悄悄丢掉了日期字段格式和预期不一致的那些行。直到客户问起上季度的数字为什么对不上，才有人发现。FDE 在客户的系统里工作，前面往往没有 QA 团队替你兜底。

使用 AI 还会影响你学到多少东西。Anthropic 在 2026 年 1 月做过一项研究，让 52 名工程师（大多是初级）学习一个新的 Python 库：使用 AI 的一组在随后的测验中得分 50%，手写代码的一组得分 67%；完全交给 AI 的人得分最低，会提概念性问题的人得分最高（[AI assistance and coding skills](https://www.anthropic.com/research/AI-assistance-coding-skills)）。

## 核心概念

### 六个步骤

| 步骤 | 做什么 |
|---|---|
| 需求 | 直白地说清楚你要什么 |
| 任务拆分 | 拆成 AI 一次就能完成的小块 |
| 生成 | AI 编写或修改代码 |
| 执行 | 运行代码 |
| 验证 | 把实际结果和需求对照 |
| 修改 | 指出哪里不对或自己修好，然后重复 |

### 给 AI 一个它能运行的检查

这个循环里最有用的习惯，是交给 AI 一个它自己能运行的检查，而不是只说“让它能用”。对比一下：

```
Weak:   Add error handling to the export script.
Better: Add error handling for a missing date field, then run
        pytest tests/test_export.py -k missing_date
        and show me the output.
```

第二种写法让你有一个具体的办法确认改动是否生效。跳过验证，只是把出错的代价转嫁给之后发现问题的人，而这个人通常是客户。

## 常见误区

- **“AI 写的代码运行不报错，就是对的。”** 运行不报错只能排除崩溃。它照样可能丢数据行，或者返回错误的结果。
- **“写好提示词是最难的部分。”** 任务拆分和验证更需要功力。提示词写得含糊但检查仔细，胜过提示词写得完美却没人验证。
- **“跳过这个循环能省时间。”** 这是用眼下省下的一点时间，换来之后更多的调试，而且是在客户面前调试，而不是在交付之前。

## 典型面试题

<details>
<summary>AI 编程循环的六个步骤是什么？哪一步最常被跳过？</summary>

需求、任务拆分、生成、执行、验证、修改。最常被跳过的是验证：很多人代码跑一次，就默认它是对的。

</details>

<details>
<summary>“给 AI 一个它能运行的检查”是什么意思？</summary>

要求一个可验证的东西，比如一个测试或预期输出，这样你和 AI 都有办法确认改动确实生效。

</details>

<details>
<summary>Anthropic 2026 年 1 月的研究发现了什么？FDE 应该因此怎么做？</summary>

使用 AI 的一组测验得分 50%，手写代码的一组得分 67%，完全交给 AI 的人表现最差。所以要持续追问“为什么”，并通过运行代码来验证。

</details>

<details>
<summary>你会如何把“添加搜索历史功能”拆分给 AI？</summary>

带时间戳保存每次搜索，添加一个返回最近搜索记录的端点，添加一种展示方式，然后测试保存的搜索能否正确取回。每一块都足够小，可以单独生成、运行和检查。

</details>

## 延伸阅读

- 文章：[Claude Code common workflows](https://code.claude.com/docs/en/common-workflows)（Anthropic 文档，Claude Code 常用工作流，约 30 分钟）
- 文章：[AI assistance and coding skills](https://www.anthropic.com/research/AI-assistance-coding-skills)（Anthropic 研究，AI 辅助对编程能力的影响）

## 相关页面

- [AI 编程工具](./02-tool-forms.md)
- [AI 代码审查](./06-verify-dont-trust.md)
- [上下文管理](./05-context-management.md)
- [Git 心智模型](../04-git-debugging-testing-security/01-git-mental-model.md)
- [测试用例类型](../04-git-debugging-testing-security/07-three-kinds-of-test-case.md)
