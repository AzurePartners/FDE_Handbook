---
title: 工具调用循环与工具 trace
row: M2-L4.2
---
**一句话：** 工具调用循环是一种反复进行的往返：模型请求一个工具，你的代码运行它，并以该调用的 ID 返回结果，同时由 trace 记录每一步。

## 是什么

模型自己从不运行任何东西。它像一位不会做菜的服务员：需要数据时，就给你的代码（厨房）递上一张编了号的单子，上面写着工具名、JSON 参数和调用 ID。调用什么由模型决定；执行任务的是确定性的软件。

一个**回合**（round）是一次模型调用，加上它请求的那些工具调用。回合会反复进行，每次都把整段对话和新的结果重新发送一遍，直到模型给出答案，或者你的代码把它停下。**工具 trace** 会记录每一个回合，因此工具调用不会是黑箱。

## FDE 为什么需要

一家零售商的客服助手通过一个教程里的循环来运行 `get_order` 和 `get_refund_status`，而这个循环只处理第一次工具调用。涉及两个订单的问题会以 400 失败：请求的两次查询里有一次没有得到回应。订单号输错时，模型会不停重试，没有上限，token 越烧越多，而日志里只有最终回复。FDE 把循环重写成回应每一次调用，把回合上限设为 6，并配上转人工客服的兜底，同时给每次对话加上 trace。

## 核心概念

### 代码里的一个回合

```python
for rnd in range(1, MAX_ROUNDS + 1):
    resp = client.messages.create(model=os.environ["LLM_MODEL"], max_tokens=2048,
                                  tools=TOOLS, messages=messages)
    trace.model_step(rnd, resp)
    if resp.stop_reason != "tool_use":
        return resp                          # 最终答案或其他停止原因
    messages.append({"role": "assistant", "content": resp.content})  # 保持原样
    results = []
    for call in [b for b in resp.content if b.type == "tool_use"]:  # 每一次调用
        out, ok = run_tool(call, trace, rnd)  # 校验、运行、记日志
        results.append({"type": "tool_result", "tool_use_id": call.id,
                        "content": out, "is_error": not ok})
    messages.append({"role": "user", "content": results})  # 合并成一条消息
return fallback(trace)                       # 触及上限：标记这条 trace
```

### 并行工具调用

模型可能在一次响应里请求多个调用。“API 不规定执行顺序”：相互独立的读取可以并发运行，有依赖或有副作用的则按顺序运行。每个调用 ID 在下一条消息里都必须有对应的结果，否则 Anthropic 会返回 400（“tool_use ids were found without tool_result blocks immediately after”），所以被跳过的调用也要给一个错误结果，比如“未执行：前面的更新失败了。”Anthropic 警告说，把结果拆到多条消息里，会让模型学会不再并行调用。

### 回合上限

模型卡在重试里，会白白烧钱耗时，因为每个回合都要把越来越长的历史重新发送一遍。设一个上限能约束这一点，同时也是一道支出上限，用来防范 OWASP 提出的 Unbounded Consumption 风险（见[为现有服务添加 LLM 端点](../07-llm-application-foundations/09-adding-an-llm-endpoint.md)）。各家默认值不同：Anthropic 的 SDK tool runner 除非你设置 `max_iterations`，否则没有上限；OpenAI 的 Agents SDK 在 10 个回合（模型调用）后停止；Microsoft.Extensions.AI 是 40 次迭代。把自己的上限设得比最长的合法路径略高一点。

### 工具 trace

一个 trace ID 把一次用户请求的所有步骤串在一起。模型步骤带有常规的每次调用日志记录；工具步骤则额外记录回合、调用 ID、工具名、参数、校验结果、结果或错误，以及耗时。OpenTelemetry 新兴的 GenAI 约定把这称为 `execute_tool` span，并把参数和结果设为需主动开启才会记录，因为它们可能是敏感数据。请按客户的政策对它们脱敏。

一次退款投诉的 trace：

```text
trace 7f3c9a  user: “A-1043 有退款还在处理吗？”
round 1  model  stop=tool_use  get_order(order_id="A-1034")
round 1  tool   get_order  validation=passed  result={status: delivered, refund: null}
round 2  model  stop=end_turn  “目前没有待处理的退款。”
```

按顺序检查每一步：工具对吗？参数对吗？校验结果如何？数据对吗？答案忠实于数据吗？第一个出现偏差的地方就是失败的那一步：回合 1 的参数（A-1034 是这位客户较早的一笔订单）。FDE 修改工具描述，并增加一条评测用例；更深入的失败归因在模块三。

## 常见误区

- **“模型自己查询数据库。”** 它只发出一个请求，是否运行由你的代码决定。
- **“并行调用意味着供应商会同时运行我的工具。”** API 只返回多个请求，执行顺序由你的代码决定。
- **“循环总会自己结束。”** 模型可能无限期地重试一个失败的调用，每个回合都重新发送历史。
- **“最终答案看起来对，就证明工具运行正常。”** 回复可以声称某件根本没有任何工具做过的事：“已为你订好航班”，却没有任何预订记录。

## 典型面试题

<details>
<summary>模型使用工具时，逐条消息看会发生什么？</summary>

我发送对话和工具列表；回复因要使用工具而停下，带着标有 ID 的调用。我逐个校验并运行，把这条回复原样追加进去，再加一条按 ID 对应的结果消息，如此重复，直到完成或触及上限。

</details>

<details>
<summary>并行工具调用和多个回合有什么区别？</summary>

并行调用是彼此独立、一起得到回应的请求。需要先拿到前一个结果的调用，比如先找到客户再查订单，要等到下一个回合，而每个回合都要花一次模型调用。

</details>

<details>
<summary>为了以后能调试用到工具的助手，你会记录什么？</summary>

每个请求一条 trace，其 ID 对客服可见。每个工具步骤记录调用 ID、工具、参数、校验结果、结果或错误以及耗时，并对个人信息脱敏。

</details>

<details>
<summary>回合上限怎么定？触顶时会怎样？</summary>

定在 trace 里最长合法路径的略上方，而不是照搬框架默认值。触顶时我停止循环，返回兜底结果或转人工，并标记这条 trace。

</details>

## 延伸阅读

- 课程：[Understanding AI Agents through the Thought-Action-Observation Cycle](https://huggingface.co/learn/agents-course/unit1/agent-steps-and-structure)（Hugging Face，约 8 分钟）
- 参考：[Parallel tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use)（Anthropic Claude Docs，约 15 分钟）
- 文章：[LLM Observability & Application Tracing](https://langfuse.com/docs/observability/overview)（Langfuse，约 10 分钟）

## 相关页面

- [Tool calling（函数调用）](./01-tool-calling.md)
- [工具结果与错误返回](./07-tool-results-and-error-returns.md)
- [消息角色、系统提示词与对话历史](../07-llm-application-foundations/04-message-roles.md)
- [程序化 LLM 接口（输入、输出、错误、重试、日志）](../07-llm-application-foundations/08-programmatic-llm-interfaces.md)
- [完整的请求生命周期](../../m1/02-how-web-apps-run/11-full-request-lifecycle.md)
