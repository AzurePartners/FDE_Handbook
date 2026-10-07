---
title: FDE 头衔的差异
row: M0-L2.1
---
**一句话：** FDE 这个角色没有行业公认的边界；不同公司用同一个头衔指代做模型优化的工程师、同时服务多个客户的交付工程师和驻场做原型的人，所以要按一个岗位负责什么来判断它，而不是按名字。

## 是什么

看三个名片上都写着"Forward Deployed Engineer"的人：

- 一个在模型基础设施公司，一周大部分时间都在优化客户模型的运行：延迟、吞吐、成本。
- 一个同时照看十个客户，一周的时间一半开会一半开发，还要随时处理生产事故。
- 一个坐在客户办公室里收集需求，当天就用 AI 编程工具做出可点击的原型，再把确认好的设计交给后端团队正式实现。

同一个头衔，三种不同的工作。反过来也成立：很多人在做完整的 FDE 工作，头衔却是解决方案工程师、交付工程师、应用 AI 工程师、部署策略师或技术客户经理。

这不是命名错误。这个角色先在具体公司里形成，再扩散到其他公司，每家都按自己的产品和商业模式做了调整。

## FDE 为什么需要

你会读到很多 JD。如果你期望每个"FDE"岗位都符合同一个定义，你要么会觉得这本手册写错了，要么会投递并不适合自己的岗位。按责任去读，才能公平地比较不同岗位，并在面试中问对问题。

## 核心概念

### 按责任读 JD

对任何一份岗位描述问六个问题：

1. 你写的代码最终在哪里运行，之后由谁维护？
2. 你的考核指标是什么：人力利用率、成交、客户结果还是采用率？
3. 你同时服务几个客户？
4. 有没有一个产品，你的工作建立在它之上，并回流到它里面？
5. 谁决定做什么：你、分析师、销售团队还是客户？
6. 有多少时间在现场或直接面对客户？

### 常见的几种形态

| 形态 | 偏重 | JD 里的信号 |
|---|---|---|
| 平台/基础设施型 FDE | Production | "optimize inference"、"SDK"、"performance"、"integration" |
| 多客户交付型 FDE | 四类责任都有，但都较薄 | "own N accounts"、"on-call"、"end-to-end delivery" |
| 驻场原型型 | Discovery | "gather requirements"、"rapid prototyping"、"hand off to engineering" |
| Echo 式策略型 | Discovery 和 Adoption | "domain expertise"、"executive stakeholders"、"change management" |

## 常见误区

- **"头衔告诉你工作内容。"** 头衔告诉你的是这家公司的用词习惯。责任才告诉你工作内容。
- **"'FDE'头衔比'解决方案工程师'更资深。"** 不一定。比较的应该是范围、责任和薪酬，而不是标签。
- **"JD 里没写 FDE，就不是 FDE 的工作。"** 很多完整的 FDE 岗位用的是更老的头衔。

## 典型面试题

<details>
<summary>你觉得 FDE 在我们公司做什么？</summary>

表现出你是按责任读这份 JD 的：概括它看起来负责什么（例如"为少数几个企业客户负责生产集成，并对路线图有发言权"），再问一个能检验你理解的问题，比如部署结束后代码由谁维护。

</details>

<details>
<summary>你会问 hiring manager 什么来理解这个岗位？</summary>

问上一个部署：那份代码现在还在跑吗、谁负责；在那里做的东西有没有进入产品；FDE 是按什么指标被考核的。这些答案比 JD 更快揭示岗位的真实样子。

</details>

## 延伸阅读

- 文章：[What are Forward Deployed Engineers?](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers)（The Pragmatic Engineer，讲各公司如何定义这个角色的部分约 10 分钟）— 这个角色在 Palantir、OpenAI 和 AI 创业公司之间有何不同
- 练习：打开三份来自不同公司的在招 FDE 岗位，为每一份写一行"它负责什么"（约 20 分钟）

## 相关页面

- [角色判据](./02-role-tests.md)
- [FDE 的四类责任](../01-what-is-an-fde/03-four-fde-responsibilities.md)
- [Echo 与 Delta 分工](../01-what-is-an-fde/04-echo-and-delta-roles.md)
