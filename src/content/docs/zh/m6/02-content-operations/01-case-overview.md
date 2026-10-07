---
title: 案例概览：内容运营
row: M6-L2.1
rows:
  - M6-L2.1
  - M6-L2.2
  - M6-L2.3
---
**一句话：** 在 [Puffo](https://chat.puffo.ai) Marketing Studio 里，营销人员用自然语言提出海报、落地页或幻灯片需求，四个分工不同、模型也不同的 agent 把它变成一份经过审核、基于锁定模板构建的 HTML 素材；营销人员在本地浏览器编辑器中修改并导出 PNG，小改动不调用模型。

## 业务场景

Azure Partners 的营销团队要持续为自己的课程产出营销素材：社交媒体海报、落地页、宣讲会用的幻灯片。把课程换成任何产品或服务，流程都是一样的。素材背后的事实早已存放在一个 Git 仓库里：每门课的日期、价格、早鸟条款和 CTA，共享的师资与政策文件，可复用的文案块，合规规则，以及参考海报。

仍有三类摩擦。营销人员不该需要会用 Claude Code、Git、Markdown 或 HTML；改一个字不该再发一次 agent 请求；把做好的 HTML 转成 PowerPoint 会破坏设计。Studio 保留仓库作为事实来源，在它前面放一个 Puffo space，并让 HTML 成为唯一可编辑的母版。

## 为什么需要的不止是 RAG

输出是一件产出物，要经过几个不应由同一个执行者完成的阶段：理解需求、依据标准事实撰写文案、核查事实与合规、构建视觉。拆成多个 agent 的关键原因在审核阶段：**写的人永远不能审批自己的作品。** 多 agent 的价值来自这种独立性，而不是 agent 的数量。

这里没有 RAG，也没有向量数据库。知识量小而且经过整理，每个事实一个文件，agent 直接读文件。任何文件中都没有的事实从不去猜，而是标为 `[NEEDS CONFIRMATION]` 并上报。

## 团队

四个 agent 运行在各自独立的 Puffo space 中，都使用 Claude Code harness。

| Agent | 模型 | 负责 | 绝不做 |
|---|---|---|---|
| Marketing Lead | Sonnet，高推理强度 | 一条消息完成需求受理、Job ID 和简报、路由、任务状态机、operator 唯一的收件入口、审批日志 | 写文案、做设计、判定合规 |
| Campaign Copywriter | Sonnet，超高推理强度 | `content.json`：按区域 ID 组织、符合渠道特点的文案，事实全部通过 `_meta/` 查得 | 猜测事实，或审批自己的作品 |
| Fact & Compliance Reviewer | Opus，超高推理强度 | `review.md`，以 `PASS` 或 `BLOCKED` 结尾，每个事实都和对应文件比对 | 根据别人的总结做审核，而不读文件 |
| Visual Designer | Sonnet，超高推理强度 | `material.html` 及其 `template.json`、版式审计、PNG 导出 | 修改文案，或生成 PPTX、PDF |

审核者是唯一使用更强模型的 agent，这是刻意的：它的职责是比产出作品的 agent 更难被说服。

## 频道与消息

| 位置 | 参与者 | 用途 |
|---|---|---|
| `#requests` | 营销人员和 Lead | 提需求，每个任务一个独立的 thread |
| `#studio-floor` | 四个 agent | agent 之间的交接，对人隐藏 |
| 发给 operator 的私信 | 只有 Lead | 每个任务两条（开始、完成），外加需要决策的上报 |

Lead 只在需要决策时给 operator 发消息：某个事实在所有文件里都没有、同一份素材被拦截两次、有人要求推翻合规硬性拦截、编辑器宕机或导出连续失败两次、用量达到上限、需要新模板或偏离品牌规范、请求不属于营销工作，或者某个任务闲置超过 24 小时。每条消息最多四行，只问一个问题，并给出带字母的选项。每个决定都写进只追加的审批日志，记录日期、任务、问题、答复以及答复人。

## 一个任务怎么跑

```text
intake → briefed → copy-draft → review ──PASS──► design → ready → editing → complete → archived
                        ▲          │
                        └─BLOCKED──┘   （最多两次；第三次由 operator 决定）
```

两道联锁保护这个流程。**没有 PASS 就没有链接：** `review.md` 以 `PASS` 结尾之前，设计不能开始。**服务不在就不许诺：** 只有编辑器通过健康检查、素材文件确实存在，任务才算就绪；链接由一个会先做验证的脚本生成，从不手写。每次推进状态之前，Lead 都会检查证明这一阶段完成的文件，因为 agent 说"做完了"只是一种声明。

## 构建素材的三种方式

| 方式 | 适用场景 | 做法 |
|---|---|---|
| 模板 | 有模板符合规格 | `new_job.py` 用 `content.json` 填充一个验证过的模板，内联 CSS，写出 AI 初稿快照 |
| 定制 | 没有合适的模板 | 设计 agent 手写 HTML 和 CSS，但必须遵守模板契约：每个可编辑元素都要标记，文字预算写进 `template.json` |
| 幻灯片 | 所有 16:9 幻灯片 | 幻灯片 skill 写出一份幻灯片计划；`new_deck.py` 从 20 种版式原型中组装 |

然后，版式审计在 headless Chrome 中加载真实文档，测量溢出、重叠、行数和预算。审计不通过的素材就不算就绪，无论它看起来多好。

## Skills

仓库中有六个自定义 skill：公司背景、目标买家的决策心理、各社交渠道的海报规格、产品宣讲幻灯片、限时限额类转化文案，以及禁用语合规清单。通用营销 skill（文案、广告创意、落地页等）来自一个安装好的第三方 skill 库。规则手册中有一张路由表，把每类需求对应到处理它的 skill。

合规分两级。第一级是真正具有欺骗性的说法，例如保证结果或虚假稀缺，在任何地方都被拦截。第二级是只有特定平台或市场才有的规则，例如禁止绝对化用语，只在适用的渠道上拦截。决定适用哪一级的是发布渠道，而不是公司所在地，所以 Lead 从不猜测渠道。

## 逐层搭建

Studio 遵循 syllabus 描述的搭建顺序，每一层都对应仓库中具体的东西：

| 层 | 在仓库中 |
|---|---|
| 1. 每个 agent 一份 profile | `agents/` 中每个角色一份 brief，同步到每个 agent 的 Puffo profile |
| 2. Skills | 六个自定义 skill，加上一个第三方营销 skill 库 |
| 3. 结构化交接 | Job ID、`brief.md`、按区域组织的 `content.json`、结论单独占一行的 `review.md` |
| 4. 确定性检查 | 事实文件检查器（关键字段仍是 `[TBD]` 时直接失败）、版式审计，以及对编辑器服务的端到端自检 |
| 5. 集成 | 本地编辑器和 PNG 导出。发布连接器被刻意排除在范围之外，由人手动发布 |

## 编辑器

一个本地 FastAPI 服务在 localhost 和局域网上提供每个任务，由一个无法猜到的任务令牌保护。页面打开即可编辑文字；版式、标签、CSS 和脚本都无法触及。文字溢出时在模板限定范围内缩小字号，到下限后停止并指出超出的部分。图片和二维码只能放进声明好的占位符，并先预览；非正方形的二维码会被拒绝。自动保存在一秒内完成，同一时间只有一个会话持有写锁，失效的锁 45 秒后自动释放。PNG 导出在 headless Chrome 中渲染同一份 HTML，所以导出结果与预览一致。

## 值得注意的地方

- **关键的地方用确定性代码。** 模板、预算、组装、版式审计和导出都是代码。模型负责写文案、判断事实与合规、选择版式。
- **先验证，再推进。** 每次状态变化都以磁盘上的文件为准，而不是以 agent 的消息为准。
- **缺图片从不阻塞生产。** 有占位符，素材照样可以构建；就绪消息会写明哪些占位符还空着，免得有人发出一张二维码空白的海报。
- **operator 的注意力是一种预算。** 消息简短，一次只问一件事，日志能让外部评审在几分钟内复原每个决定。

## 常见误区

- **"用四个 agent 是因为四个比一个能干。"** 拆分是为了让创作和审核由不同的执行者、基于不同的输入、使用不同的模型完成。
- **"审核者检查需求简报就行。"** 必须检查真正的成品。错误是在写作和设计阶段引入的，发生在简报之后。
- **"设计 agent 每张海报都是手写的。"** 只要能用模板就用模板填充或组装，因为验证过的模板带着正确的预算。手写 HTML 是例外。

## 典型面试题

<details>
<summary>为什么只有审核者用更强的模型？</summary>

因为它的工作是对抗性的：必须发现文案 agent 遗漏的问题，并且不被说服放行。把成本花在守门的模型上，比花在反正会被检查的草稿模型上，换来的质量更多。

</details>

<details>
<summary>为什么 Lead 要在一条消息里问完所有缺失信息？</summary>

因为每一次来回都消耗营销人员的注意力，也拖慢任务。Lead 知道一个任务需要的七个字段，能用默认值的就用默认值，其余的一次问完。一次只问一个问题，会把一次简短的需求受理拖成一段漫长的对话。

</details>

<details>
<summary>怎么保证营销人员不会收到一个指向并不存在的素材的链接？</summary>

靠第二道联锁。链接由一个脚本生成，它在打印链接之前先检查编辑器的健康状态和磁盘上的文件，Lead 只发布这个脚本打印出来的链接。

</details>

## 延伸阅读

- 文章：[Building effective agents，prompt chaining 与 evaluator-optimizer](https://www.anthropic.com/engineering/building-effective-agents)（Anthropic）
- 文档：[Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) 与 [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)（Claude 文档）
- 文档：[Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)（Claude 文档），用于类型化交接
- 文档：[LangGraph interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts)（LangChain），用于发布前的人工审批
- 指南：[Google developer documentation style guide](https://developers.google.com/style)（Google），品牌与风格知识来源的一个示例

## 相关页面

- [PRD：Marketing Studio](./02-prd.md)
- [Technical Design：Marketing Studio](./03-technical-design.md)
- [案例概览：辅导 / 客服 RAG](../01-education-rag/01-case-overview.md)，下一级阶梯

*Syllabus 行：M6-L2.1、M6-L2.2、M6-L2.3*
