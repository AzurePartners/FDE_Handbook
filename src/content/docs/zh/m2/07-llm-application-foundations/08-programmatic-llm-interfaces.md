---
title: 程序化 LLM 接口（输入、输出、错误、重试、日志）
row: M2-L1.8
---
**一句话：** 程序化 LLM 接口把一个用自然语言描述的任务（比如“给这封邮件分类”）变成一个普通函数：输入经过检查，输出只有一种结构，错误都有名字，重试有上限，每次调用留下一条日志记录。

## 是什么

原型阶段的模型调用只是文本进、文本出，其他软件没法依赖它。程序化接口把它包进一个普通函数，比如 `triage_request(req) -> TriageResult`，调用方把它当作任何其他代码来用。

打个比方，一位受理员退回有问题的表格时，会附一张便条指明哪一栏填错了，而不是只写一句“请做得更好”；退回两次之后，就把它转进“需要有人处理”的托盘；每一张表格都登记在台账里。

准确地说，它由五个部分组成：经过检查的输入、一种输出类型、有名字的错误、修复循环（把校验错误反馈给模型，限制尝试次数，最后返回一个明确的兜底结果）以及每次调用一条的日志记录。

## FDE 为什么需要

一家物业管理公司希望把租户的报修邮件分诊（紧急程度、工种、房号）后录入自己的工单系统。原型对回复执行 `json.loads`，然后插入一行。第一周，一封带着很长转发记录的邮件撞上了输出上限，被截断的 JSON 让夜间批处理崩溃了。一个捕获一切异常的处理器把紧急程度设成了“routine”，于是一次真正的紧急情况只能干等。没人知道这种事发生得有多频繁：唯一的日志只有一行“已处理 212 封邮件”。

FDE 用有名字的错误、两次修复和 `needs_review` 兜底把它重建了一遍。一周之内，调用记录就把大部分兜底追溯到了同一个提示词版本和被截断的邮件上，这是盲目重试发现不了的。

## 核心概念

### 输入、输出与有名字的错误

Python 在运行时会忽略类型标注，所以要显式校验输入（用 Pydantic 模型或 `validate_call`）。返回一种带 `status` 字段的类型。给每种失败起个名字：

- `InputInvalid`：在花掉任何 token 之前就被拒绝。
- `ModelUnavailable`：SDK 自带的重试用尽之后，连接错误、429 或 5xx 错误依然存在。
- `OutputTruncated`：停止原因为 `max_tokens`；调高 token 预算，或缩短输入。
- `ModelRefused`：模型拒答，以 HTTP 200 返回；转给另一个模型，或转人工。

按类型捕获 SDK 异常，而不是匹配消息字符串。截断和拒答不走修复；Anthropic 指出，被拒答的请求原样重发给同一个模型，通常还会被拒答。

### 修复循环

```python
MAX_REPAIRS = 2  # 校验失败后的重试次数，不是 SDK 的 max_retries

def triage_request(req: MaintenanceRequest) -> TriageResult:
    msgs = [{"role": "user", "content": render_prompt(req)}]
    for attempt in range(1 + MAX_REPAIRS):
        resp = client.messages.create(model=os.environ["LLM_MODEL"], max_tokens=800,
                                      messages=msgs, output_config=OUTPUT_CONFIG)
        check_stop_reason(resp)         # 抛出 OutputTruncated 或 ModelRefused
        result, error = validate(resp)  # 结构化输出的校验器
        if result:
            return result
        msgs += [{"role": "assistant", "content": resp.content},  # 原样放回，不做修改
                 {"role": "user", "content": f"校验失败：{error}。请修正。"}]
    return TriageResult(status="fallback", urgency="needs_review")
```

自我纠错在有具体的外部反馈时效果最好（Kamoi 等人，TACL 2024），比如校验器给出的信息。把修复次数限制在一到三次，因为重试会成倍放大：Anthropic 和 OpenAI 的 Python SDK 默认会对暂时性错误重试两次（Google 的 `google-genai` 只有在配置后才会重试），所以三次尝试可能意味着九个 HTTP 请求。

### 每次调用一条日志记录

拒答、截断和校验失败都以 HTTP 200 的形式到达，错误率监控看不到它们。每次调用留一条记录，才能把它们数出来：

```json
{"fn": "triage_request", "prompt_version": "triage-v7",
 "model_requested": "<LLM_MODEL>", "model_served": "<response.model>",
 "request_ids": ["req_01...", "req_01..."], "input_tokens": 3120, "output_tokens": 180,
 "latency_ms": 6400, "stop_reasons": ["end_turn", "end_turn"],
 "validation": ["trade_not_allowed", "pass"], "repairs": 1, "fallback": false}
```

要记录实际提供服务的模型（别名和兜底可能让它与请求的模型不同）、每次尝试的请求 ID，以及包含重试在内的端到端延迟；未知的值记为 null，而不是 0。OpenTelemetry 的 GenAI 约定（仍处于 Development 阶段）提供了 `gen_ai.request.model` 这样的标准名称，并建议默认不要记录提示词文本。

## 常见误区

- **“开了严格模式就可以跳过校验。”** Anthropic 只保证“在大多数情况下”符合 schema，而且没有任何机制会检查房号是不是真的。
- **“校验失败了，就把同一条提示词再发一遍。”** 完全相同的请求往往会以同样的方式失败；要把具体的错误反馈给模型。
- **“重试越多越可靠。”** 每次修复都要把整段对话重发一遍，增加成本和延迟；频繁修复说明提示词有 bug。
- **“一个合理的默认值就是个不错的兜底。”** 看起来像真的值（“routine”、0）会被当作模型的答案流向下游。要让兜底明确可见，并记入日志。

## 典型面试题

<details>
<summary>什么是程序化 LLM 接口？</summary>

它是包住模型调用的一个普通函数，比如 `classify_ticket(text) -> TicketLabel`：输入经过检查，输出只有一种类型，错误都有名字，修复循环有次数上限并以兜底收尾，每次调用都有一条日志记录。

</details>

<details>
<summary>传输层重试与修复重试有什么区别？</summary>

传输层重试是在调用失败（比如 429）之后把同一个请求重发一遍，通常发生在 SDK 内部。修复重试发生在调用成功、但输出无效之后，会把那条回复连同错误一起发回给模型。

</details>

<details>
<summary>为客户的财务收件箱设计一个邮件分类器。</summary>

输入经过校验（发件人、主题、正文）；输出包含 `status`、一份封闭的类别列表，以及对照供应商主数据校验过的供应商 ID；前面那四种有名字的错误；两次修复，之后返回 `needs_review`，绝不返回“other”；每次调用一条日志记录。

</details>

<details>
<summary>部署之后，每十次调用就有一次返回兜底结果。你会怎么排查？</summary>

把兜底记录按提示词版本、实际提供服务的模型、停止原因和校验错误分组，再与上周对比：如果大多是 `max_tokens`，说明回复变长了；如果集中在某一条规则上，说明某个字段坏了；如果出现了新的服务模型，说明别名指向了别的模型。

</details>

## 延伸阅读

- 文章：[Factor 9: Compact Errors into Context Window](https://github.com/humanlayer/12-factor-agents/blob/main/content/factor-09-compact-errors.md)（HumanLayer，约 5 分钟）
- 参考：[Validation and Reasking](https://python.useinstructor.com/concepts/reask_validation/)（Instructor，约 15 分钟）
- 参考：[Python SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python)（Anthropic，约 15 分钟）

## 相关页面

- [Schema 与数据契约](../../m1/03-apis-data-integration/10-schema-and-data-contracts.md)
- [重试与退避](../../m1/06-reliability-scale/03-retries-and-backoff.md)
- [结构化输出与 JSON Schema](../08-prompting-context-structured-output/06-structured-output.md)
- [为现有服务添加 LLM 端点](./09-adding-an-llm-endpoint.md)
- [日志与堆栈跟踪](../../m1/04-git-debugging-testing-security/05-logs-and-stack-traces.md)
