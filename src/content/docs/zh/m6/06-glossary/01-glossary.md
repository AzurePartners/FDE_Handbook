---
title: 术语表
---
**一句话：** Module 6 中所用术语的简短定义，每条都链接到讲解它的页面。

## A 至 D

- **Acceptance criteria（验收标准）：** 定义产品何时完成的编号检查清单。见 [PRD：交易研究台](../04-trading-desk/03-prd.md)。
- **ADR（架构决策记录）：** 对一项决策及其理由的简短记录。见 [PRD：Marketing Studio](../02-content-operations/02-prd.md)。
- **ATR（平均真实波幅）：** 股票典型的每日价格波动范围，用于设定失效价位。见 [Technical Design：交易研究台](../04-trading-desk/04-technical-design.md)。
- **Backtest（回测）：** 在历史数据上运行规则，看它当时会表现如何。见 [Technical Design：交易研究台](../04-trading-desk/04-technical-design.md)。
- **BuildManifest（构建记录）：** 一次构建的记录：数据源、记录数、覆盖率和已修复的缺陷，并与上一次运行对比。见 [Technical Design：医疗机构研究](../03-provider-research/03-technical-design.md)。
- **Canonical fact（标准事实）：** 某个事实唯一的权威存放位置，例如课程价格。见 [案例概览：内容运营](../02-content-operations/01-case-overview.md)。
- **Challenger（挑战者）：** Provider Research 中攻击已建数据集的角色：七个视角、每条问题三个复核者，以及一个在看不到答案的情况下重新推导代码集的 critic。见 [Technical Design：医疗机构研究](../03-provider-research/03-technical-design.md)。
- **Check mode（检查模式）：** 之后重新构建，报告自交付以来的变化，但不替换已交付的名单。见 [PRD：医疗机构研究](../03-provider-research/02-prd.md)。
- **Citation（引用）：** 从答案指向支持它的段落的链接。见 [案例概览：辅导 / 客服 RAG](../01-education-rag/01-case-overview.md)。
- **Contact sheet（联系方式说明）：** 针对每个联系渠道说明在所述用途下是否允许及理由的文档。见 [案例概览：医疗机构研究](../03-provider-research/01-case-overview.md)。
- **Conviction（信心等级）：** 研究台对一个判断的支持强度：Low、Medium 或 High。见 [Technical Design：交易研究台](../04-trading-desk/04-technical-design.md)。
- **Cutoff（截止时间）：** 一次运行的数据截止时刻，之后的任何数据都不能使用。见 [案例概览：交易研究台](../04-trading-desk/01-case-overview.md)。
- **Definition document（定义文档）：** 用平实语言说明数据集中包括谁、排除了谁以及原因的文档。见 [PRD：医疗机构研究](../03-provider-research/02-prd.md)。
- **Delivery Plan（交付计划）：** 列出任务、估算、负责人和里程碑的文档。见 [Delivery Plan：交易研究台](../04-trading-desk/05-delivery-plan.md)。
- **Deterministic（确定性）：** 由代码完成，相同输入总是得到相同输出。见 [案例概览：医疗机构研究](../03-provider-research/01-case-overview.md)。

## E 至 M

- **Escalation（升级转人工）：** 因为助手不应回答而把问题交给人。见 [案例概览：辅导 / 客服 RAG](../01-education-rag/01-case-overview.md)。
- **Evidence ID：** 把一个数字链接到其存储来源的标签。见 [Technical Design：交易研究台](../04-trading-desk/04-technical-design.md)。
- **Finished when（完成标准）：** 任务可核对的完成条件。见 [Delivery Plan：交易研究台](../04-trading-desk/05-delivery-plan.md)。
- **Fingerprint / Hash（指纹 / 哈希）：** 由文件计算出的短编码；文件任何改动都会改变它。见 [PRD：医疗机构研究](../03-provider-research/02-prd.md)。
- **Gate：** 一个停止点，在有人批准之前什么都不会继续。见 [跨案例对比](../05-cross-case/01-comparison.md)。
- **GATE R / GATE D：** Provider Research 的两道人工 gate：大文件下载前批准数据源和代码集，交付前批准交付物。见 [案例概览：医疗机构研究](../03-provider-research/01-case-overview.md)。
- **Grounding（基于来源）：** 让答案限制在检索到的来源之内。见 [案例概览：辅导 / 客服 RAG](../01-education-rag/01-case-overview.md)。
- **Guard test：** 故意尝试打破一条产品规则、并检查系统是否拒绝的测试。见 [Technical Design：交易研究台](../04-trading-desk/04-technical-design.md)。
- **Holdout：** 预留的一段历史数据，在规则冻结后只使用一次。见 [PRD：交易研究台](../04-trading-desk/03-prd.md)。
- **Idempotency（幂等性）：** 重复执行一个操作不会产生额外效果的性质。见 [延伸：从 RAG 到客服 Agent](../01-education-rag/06-extension.md)。
- **Invalidation level（失效价位）：** 判断被视为错误的价格。见 [PRD：交易研究台](../04-trading-desk/03-prd.md)。
- **Lookahead bias（前视偏差）：** 在过去的决策中使用了当时还不存在的信息。见 [案例概览：交易研究台](../04-trading-desk/01-case-overview.md)。

## N 至 R

- **n8n：** 工作流自动化工具，内置渠道、工单系统、向量库和 LLM 调用的现成节点，在 Lesson 1 中用作参考实现。见 [参考实现：n8n 版客服 RAG](../01-education-rag/04-reference-build-n8n.md)。
- **Non-goal（非目标）：** PRD 有意排除的内容。见 [PRD：Marketing Studio](../02-content-operations/02-prd.md)。
- **NPPES NPI Registry：** 美国政府公开的医疗执业者注册库。见 [案例概览：医疗机构研究](../03-provider-research/01-case-overview.md)。
- **Paper trading（模拟交易）：** 不使用真实资金的模拟交易。见 [PRD：交易研究台](../04-trading-desk/03-prd.md)。
- **Point-in-time data（时点数据）：** 某一时刻已知的数据，不包含之后的修订。见 [Technical Design：交易研究台](../04-trading-desk/04-technical-design.md)。
- **PRD（产品需求文档）：** 说明做什么、给谁用、为什么做、哪些不做的文档。见 [导读](../00-introduction/01-introduction.md)。
- **Provenance（溯源）：** 一个数值从哪里来、何时获得、是哪个版本。见 [案例概览：医疗机构研究](../03-provider-research/01-case-overview.md)。
- **Puffo：** Lesson 2 至 4 的系统所运行的团队协作 agent 平台：agent 位于 space 和频道中，收到消息时才行动。见 [chat.puffo.ai](https://chat.puffo.ai) 和 [puffo-agent daemon](https://github.com/puffo-ai/puffo-agent)。
- **Publishing check（发布检查）：** 会阻止一个判断发布的条件。见 [Technical Design：交易研究台](../04-trading-desk/04-technical-design.md)。
- **RAG（检索增强生成）：** 先检索相关段落，再基于它们生成回答。见 [案例概览：辅导 / 客服 RAG](../01-education-rag/01-case-overview.md)。
- **Reconcile（对账）：** 检查数据集的各部分能加回总数。见 [PRD：医疗机构研究](../03-provider-research/02-prd.md)。
- **Record vs. person（记录与人）：** 名单中的一行不等于现实中的一个人。见 [案例概览：医疗机构研究](../03-provider-research/01-case-overview.md)。
- **Restatement（重述）：** 对已报告数字的事后更正。见 [Technical Design：交易研究台](../04-trading-desk/04-technical-design.md)。
- **Run manager：** 保存每次运行状态、并告诉 Desk Lead 下一步发什么的后端组件。见 [逐层增加复杂度](../04-trading-desk/02-progressive-build.md)。

## S 至 Z

- **Snapshot（快照）：** 写入一次、之后永不修改的数据加载。见 [Technical Design：交易研究台](../04-trading-desk/04-technical-design.md)。
- **Stopping check（中止检查）：** 失败时直接中止构建而不是警告的检查。见 [PRD：医疗机构研究](../03-provider-research/02-prd.md)。
- **SUE（标准化意外盈利）：** 以自身近期波动为尺度衡量的盈利意外。见 [Technical Design：交易研究台](../04-trading-desk/04-technical-design.md)。
- **Taxonomy code（分类代码）：** 说明某人属于哪类医疗执业者的官方代码。见 [案例概览：医疗机构研究](../03-provider-research/01-case-overview.md)。
- **Technical Design / TDD（技术设计）：** 说明产品如何搭建的文档。见 [Technical Design：交易研究台](../04-trading-desk/04-technical-design.md)。
- **Variant log（变体日志）：** 所有测试过的规则变体的记录。见 [Technical Design：交易研究台](../04-trading-desk/04-technical-design.md)。
- **Visual master（视觉母版）：** 所有导出都由它生成的唯一可编辑文件。见 [PRD：Marketing Studio](../02-content-operations/02-prd.md)。
- **Wake（唤醒）：** [Puffo](https://chat.puffo.ai) agent 的一个回合，由其某个频道中的一条消息触发。见 [Technical Design：交易研究台](../04-trading-desk/04-technical-design.md)。
