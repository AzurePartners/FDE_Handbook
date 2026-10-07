---
title: 基于证据的简历条目
row: M8-L1.2
---
**一句话：** 一条简历 bullet 要写出范围、数据、接口、评估和结果——五个审阅者可以核验的具体事实——而不是"Built an AI agent"这种动词加流行词。

## 是什么

基于证据的 bullet 用一两行描述一项工作触碰了什么、改变了什么。五个要素是：**范围**（做了什么、没做什么）、**数据**（系统读了什么、多少、多脏）、**接口**（连接了什么：API、数据库、MCP 工具、CRM）、**评估**（你怎么衡量的）、**结果**（改变了什么，并说明证据强度）。不是每条都需要五个要素，但一个都没有的 bullet 就是噪音。

## FDE 为什么需要

读 FDE 简历的人都在客户环境里交付过东西，几秒钟就能判断一条 bullet 描述的是不是真实工作。"Built an AI agent"可能是一个周末的 prompt，也可能是一年的部署。"基于 1,200 份政策文档构建支持助手，接入工单 API，40 条 eval 集在试点前捕获了一次检索回退"则准确告诉读者你做了什么，并引出你能回答的追问。简历还决定了 hiring-manager screen 的走向：每条 bullet 都可能被深挖，所以每条都应指向一个你能讲五分钟的故事。

## 核心概念

### 改写前后

| 弱 | 为什么不行 | 改写后 |
|---|---|---|
| Built an AI agent for customer support | 无范围、无数据、无 eval、无结果 | 基于 1,200 份政策 PDF 构建支持助手（RAG + 3 个只读工单工具）；40 条 eval 集，groundedness 92% vs baseline 61%；6 名客服试点 3 周 |
| Used LLMs to automate research | 哪一步？哪个来源？怎么衡量？ | 用 NPI Registry API 自动补全医生名单；按书面匹配策略将 9,400 行去重为 6,100 行；专科校验保留人工审核 |
| Improved model accuracy | 什么指标、什么 baseline、改了什么 | 把政策查询（确定性代码）与答案起草（模型）分离后，120 条 eval 上的误拒率从 18% 降到 4% |

### 尽量每条两个指标

一个技术指标（eval 分数、延迟、单任务成本）加一个业务或流程指标（节省工时、处理案例数、工单分流率）。只有技术指标就如实写，不要编业务指标。

### Ownership 语言

自己做的写"I"，团队做的写"we"，界限分明。Hiring manager 专门筛选能说清自己贡献的人；每行都写"we built"会把贡献藏起来。

### 范围诚实

side project、课程项目、只有三个用户的试点，都在 bullet 里说明。在小项目上夸大，比一条克制、准确的 bullet 更快摧毁信任。见[成熟度标注](./03-maturity-labeling.md)。

## 常见误区

- **"有数字的 bullet 就是强的。"** 没有 baseline、没有来源的数字（"准确率提升 40%"）带来的问题比回答的多。写清衡量了什么、对比什么、多少条用例。
- **"工具就是内容。"** 一串框架名是关键词匹配，不是证据。精确写一次技术栈，其余篇幅讲它做了什么。
- **"每条都必须有业务结果。"** 有时诚实的结果是"eval 集已建，试点待定"。就这么写。编造的影响是深挖时最快挂掉的方式。

## 典型面试题

<details>
<summary>简历说准确率从 61% 提到 92%，eval 集是什么？</summary>

给出规模、用例怎么选的（真实工单、合成边界用例、对抗用例）、谁标注的、"正确"的定义。然后说出这个集合没覆盖的部分。答不上来的话，这条 bullet 就不该出现在简历上。

</details>

<details>
<summary>这里面哪部分是你做的？</summary>

说出你设计和编写的组件、你做的决策，以及队友负责的部分。面试官更尊重清晰的边界，而不是被放大的边界。

</details>

<details>
<summary>这条说"接入了 CRM"。哪个 API、什么认证、哪里坏过？</summary>

准备好细节：endpoint 家族、认证机制（API key、OAuth、service account）、碰到的 rate limit、处理过的失败（超时、分页、过期数据）。接口是 FDE 工作变难的地方，面试官心里清楚。

</details>

## 延伸阅读

- 参考：[Resume guide](https://www.techinterviewhandbook.org/resume/)（Tech Interview Handbook）— action + result、量化影响、一页
- 文章：[Forward Deployed Engineer Resume: Examples & Skills](https://www.tryexponent.com/blog/forward-deployed-engineer-resume)（Aced）— FDE 经理会响应的 bullet 结构
- 文章：[AI Engineer Resume Examples: LLM, RAG, Agents](https://resumeoptimizerpro.com/blog/ai-engineer-resume-examples) — 把工具和可衡量结果配对的前后对比
- 文章：[AI Engineer Resume Examples (annotated)](https://www.rejectless.app/ai-engineer-resume-examples) — side project 与初级简历的范围诚实

## 相关页面

- [Case Study 结构](./01-case-study-structure.md)
- [成熟度标注](./03-maturity-labeling.md)
- [基于背景的叙事](../04-role-matching-narrative-job-search/02-background-based-narratives.md)
