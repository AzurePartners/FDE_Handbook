---
title: 导言
---
**一句话：** 本手册列出前线部署工程师（FDE）应当掌握的软件系统知识，每页一个主题，帮你看清全貌、补上短板，并在面试前把所有内容过一遍。

## FDE 是什么

模块 0 介绍了这个岗位；如果还没读过，请先看 [前线部署工程师](../../m0/01-what-is-an-fde/01-forward-deployed-engineer.md)。

AI 公司纷纷设立这个岗位，原因很简单：模型本身对银行或医院毫无用处，除非有人把它接入对方的数据、工具、权限和工作流。最近的招聘启事里反复出现同样的说法：

| 公司 | 岗位职责（摘自招聘启事） |
|---|---|
| Anthropic | “在客户系统内部工作，基于 Claude 模型构建生产级应用” |
| OpenAI | 负责“需求发现、技术范围界定、系统设计、构建以及生产上线” |
| Palantir | 数据集成、代码审查，以及“生产系统的维护与监控” |

2026 年 7 月，Microsoft 成立了 Frontier Company，这是一个投入 25 亿美元、拥有 6,000 名专家的部门，专家们直接驻扎在客户组织内部工作。Microsoft 称这种做法比 FDE 模式走得更远。

## 模块 1 的定位

模块 0 讲的是岗位本身，需要最先读。模块 1 是第一个技术模块。客户环境往往一团乱：数据躺在老旧的数据库里，API 会超时，权限会挡住访问，在笔记本上跑得好好的演示，到了客户服务器上就出问题。你脑子里没有画面，就修不好问题。模块 1 给你这幅画面：一个请求如何穿过系统，系统之间如何交换数据，代码如何被追踪和测试，如何部署，以及在真实使用中哪里会出问题。有了这幅画面，AI 编程工具的价值会大得多，因为你能告诉 AI 要做什么，也能检查它做得对不对。

## 如何使用本手册

这是一本参考手册，不是课程。没有进度安排，也没有项目。打开任意一页就可以开始读。左侧边栏就是路线图：每一课是一个领域，每一页是一个知识点。

**如果你刚接触软件（“先看全貌”）。** 浏览侧边栏，记下从没听说过的内容。每一页读 **一句话** 和 **FDE 为什么需要** 两部分，每页大约两分钟。然后对你想做的工作相关的主题深入阅读。

**如果你在准备面试（“全部过一遍”）。** 按顺序读，每一课都建立在前面几课的基础上。先读 **常见误区**，再把每道 **典型面试题** 大声答一遍，然后才展开参考答案。

页面长短取决于概念本身。端口映射这种小概念，页面就短；状态码这种大主题，页面就长，还会配一张表。不熟悉的术语统一收录在 [术语表](../07-glossary/01-glossary.md) 中。

## 各课内容

| 课 | 内容 |
|---|---|
| 1. AI 辅助开发 | 使用 AI 编程工具、读懂代码、检查 AI 写的代码 |
| 2. Web 应用如何运行 | 客户端与服务器、HTTP、会话、HTTPS，以及一个请求的完整路径 |
| 3. API、数据与集成 | 调用其他系统、认证、失败处理、数据格式、SQL 和数据契约 |
| 4. Git、调试、测试与安全 | 可以撤销的历史记录、定位 bug、测试，以及保障安全 |
| 5. 容器与部署 | Docker、环境、计算资源选择、配置和部署 |
| 6. 可靠性与规模 | 演示遇到真实用户时会出什么问题：队列、重试、重复、缓存、负载 |

当前第一版只有文字。视频、测验、演示和实验之后会陆续加到这些页面中。

## 延伸阅读

- 文章：[Forward Deployed Engineers](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers)（The Pragmatic Engineer，部分内容需付费）
- 文章：[A Day in the Life of a Palantir Forward Deployed Software Engineer](https://blog.palantir.com/a-day-in-the-life-of-a-palantir-forward-deployed-software-engineer-45ef2de257b1)（Palantir，FDE 的一天）
- 文章：[Microsoft Frontier Company announcement](https://blogs.microsoft.com/blog/2026/07/02/microsoft-frontier-company-ai-engineering-that-amplifies-and-protects-your-intelligence/)（Microsoft，2026 年 7 月发布；[CNBC](https://www.cnbc.com/2026/07/02/microsoft-commits-2point5-billion-6000-employees-ai-implementation-unit.html) 也有报道）

## 相关页面

- [AI 编程工作流](../01-ai-assisted-development/01-ai-coding-workflow.md)
- [客户端-服务器模型](../02-how-web-apps-run/01-client-server-model.md)
