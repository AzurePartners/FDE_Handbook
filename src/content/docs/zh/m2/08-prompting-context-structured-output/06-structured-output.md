---
title: 结构化输出与 JSON Schema
row: M2-L2.6
---
**一句话：** 结构化输出是指模型按你的代码事先定义好的形状返回数据，通常是由字段、类型和允许取值组成的 JSON Schema，这样软件就能直接使用这份回复。

## 是什么

模型写出来的是文本，而代码需要的是有名字、类型已知的字段。结构化输出会事先定义回复的形状，通常用 JSON Schema，也就是“一套可以用来标注和校验 JSON 文档的词汇”。

打个比方，想想一张纸质表格。在提示词里要求输出 JSON，就像递给对方一张白纸；schema 是印好的、带标注方框的表格；严格模式则是一支无法写到方框之外的笔。填错的日期照样能写进日期栏，所以你的代码还得检查。

准确地说，严格模式（约束解码，constrained decoding）会把你的 schema 编译成一套语法，任何违反它的 token 都会被拦住：形状有保证，真实性没有。

## FDE 为什么需要

一家物流客户希望把供应商发票转成应付账款记录。在提示词里要求输出 JSON，演示时没问题，但夜间批处理随后崩溃：有的回复包在代码围栏里，有的前面带着“以下是提取出的数据：”，有的字段名写成了 `dueDate`，有的多出一个 ERP 不接受的 `notes` 键。

FDE 改用带 schema 的严格模式。解析错误消失了，随后出现了更隐蔽的失败：一张 40 页的发票在 JSON 写到一半时撞上了 token 上限，一张欧元发票被当成 `USD` 放行。只有代码里的分层校验，才能把坏记录挡在 ERP 之外。

## 核心概念

### Schema 就是契约

五个关键字承担了大部分工作：`type`、`properties`、`required`、`enum`（允许的取值）和 `additionalProperties`。有两个默认行为常让人意外：属性除非列在 `required` 里，否则就是可选的；额外的键除非把 `additionalProperties` 设为 `false`，否则是允许的。

```json
{
  "type": "object",
  "properties": {
    "vendor_id": {"type": "string"},
    "currency": {"type": "string", "enum": ["USD", "EUR", "GBP"]},
    "due_date": {"type": "string", "format": "date"}
  },
  "required": ["vendor_id", "currency", "due_date"],
  "additionalProperties": false
}
```

Pydantic（Python）或 Zod（TypeScript）可以从同一个模型生成这样的 schema，这个模型同时还能校验回复。

### 要求输出 JSON 的三种方式

| 方式 | 保证什么 |
|---|---|
| 提示词指令 | 什么都不保证；回复格式会漂移 |
| JSON 模式（OpenAI `json_object`） | 保证是合法的 JSON，字段不限 |
| 严格模式（Anthropic `output_config.format`，OpenAI 带 `strict: true` 的 `text.format`，Gemini `response_json_schema`） | 符合你的 schema 的形状 |

OpenAI 把 JSON 模式称为较老的方法；在 Claude 4.6 及之后的版本上，预填充 `{` 会失败。严格模式的工具对参数提供同样的保证。

### 严格模式不保证什么

- **拒答：** 可能不符合 schema（Anthropic 的 `stop_reason: "refusal"`，OpenAI 的 `refusal` 字段）。
- **截断：** `max_tokens` 可能把 JSON 截断；流式输出在结束之前无法校验。
- **枚举的大小写：** Anthropic 说明，取值的大小写可能不一致。
- **真实性：** OpenAI 和 Google 都说明，形状合法不等于内容正确。

各家支持的 schema 子集不同。Anthropic 不接受递归，也不接受 `minimum` 和 `minLength` 这类关键字（它的 SDK 会先去掉这些关键字，事后再检查）。OpenAI 的严格模式要求每个字段都列在 `required` 里。Gemini 接受 `minimum`。Anthropic 会把编译后的 schema 与消息分开缓存，所以别把个人信息放进枚举值里。

### 分层校验

顺序是：停止原因、解析、schema、业务规则。

```python
class Invoice(BaseModel):
    model_config = ConfigDict(extra="forbid")   # additionalProperties: false
    vendor_id: str
    currency: Literal["USD", "EUR", "GBP"]      # 枚举
    total: float = Field(ge=0)                  # SDK 会去掉它，由 Pydantic 检查
    due_date: date

fmt = {"type": "json_schema", "schema": anthropic.transform_schema(Invoice)}
resp = client.messages.create(model=os.environ["LLM_MODEL"], max_tokens=4000,
                              messages=msgs, output_config={"format": fmt})
if resp.stop_reason in ("refusal", "max_tokens"):         # 0：不要解析
    raise OutputRejected(resp.stop_reason)
text = next(b.text for b in resp.content if b.type == "text")  # 跳过思考内容
inv = Invoice.model_validate_json(text)                  # 1、2：解析、schema
if inv.vendor_id not in erp_vendor_ids:                  # 3：业务规则
    raise OutputRejected("unknown vendor")
```

Pydantic 会给每种失败起名字（`json_invalid`、`literal_error`、`extra_forbidden`）；Zod 的 `safeParse` 是 TypeScript 里的对应做法。被拒绝的输出交给修复与兜底的包装层。

## 常见误区

- **“只要我在提示词里说‘只用 JSON 回答’，代码就一定能解析。”** 只靠提示词约束格式，回复会逐渐出现代码围栏、开场白和被改名的字段。
- **“JSON 模式和结构化输出是一回事。”** JSON 模式只保证语法合法，不保证出现哪些字段。
- **“开了严格模式，我就可以删掉校验代码。”** 拒答和截断会破坏形状，而形状合法的输出里也可能装着错误的币种。
- **“任何 JSON Schema 都能用于任何模型供应商。”** 每家只支持一个子集，所以被去掉的关键字要在你自己的校验器里强制执行。

## 典型面试题

<details>
<summary>什么是结构化输出？业务系统为什么需要它？</summary>

模型按预先定义好的形状返回数据，通常是 JSON Schema，而不是一大段文字。下游代码需要可预期的字段，所以 schema 就成了契约。

</details>

<details>
<summary>提示词指令、JSON 模式和严格模式有什么区别？</summary>

提示词指令是可以被违反的。JSON 模式保证 JSON 合法，但不保证有哪些字段。严格模式会拦住违反 schema 的 token：形状能保住，但取值仍可能出错。

</details>

<details>
<summary>设计一份把发票提取结果写入客户 ERP 的输出契约。</summary>

用 Pydantic 模型生成 schema：字段全部必填，币种用枚举，不允许多余的键。我先检查停止原因，再解析、校验，然后应用“供应商存在”“各明细行之和等于总额”这样的规则，把失败的结果送去人工审核。

</details>

<details>
<summary>严格模式已经打开，却仍出现解析失败和枚举被拒。你怎么排查？</summary>

我先看日志里记录的停止原因：`max_tokens` 意味着 JSON 被截断；`refusal` 需要单独的分支。我再确认没有在流式输出结束前就开始解析，并把枚举值的大小写规范化（Anthropic 的文档提到取值的大小写可能漂移）。

</details>

## 延伸阅读

- 参考：[Creating your first schema](https://json-schema.org/learn/getting-started-step-by-step)（JSON Schema，约 20 分钟）
- 参考：[Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)（Anthropic，约 20 分钟）
- 参考：[Structured model outputs](https://developers.openai.com/api/docs/guides/structured-outputs)（OpenAI，约 20 分钟）

## 相关页面

- [JSON](../../m1/02-how-web-apps-run/07-json.md)
- [Schema 与数据契约](../../m1/03-apis-data-integration/10-schema-and-data-contracts.md)
- [幻觉与其他模型输出失败](../07-llm-application-foundations/06-hallucinations-and-output-failures.md)
- [程序化 LLM 接口（输入、输出、错误、重试、日志）](../07-llm-application-foundations/08-programmatic-llm-interfaces.md)
- [工具 schema 与工具设计](../10-tool-calling-deterministic-logic/05-tool-design.md)
