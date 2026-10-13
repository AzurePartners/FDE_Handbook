---
title: 工具参数校验
row: M2-L4.6
---
**一句话：** 工具参数校验，是工具代码对模型提出的每个参数运行的一组检查：在改动任何东西之前，对照真实数据和业务规则，确认这些取值说得通。

## 是什么

Anthropic 说得很直白：“模型自己从不执行任何东西。”它只是发出一个请求，由你的代码去执行，所以模型提出的每一次调用都是不可信的输入。OWASP GenAI 的 2026 版 LLM Top 10（LLM10）建议“像对待任何其他用户一样对待模型，采用零信任的做法”。

银行柜员即使面对一张填得无可挑剔的取款单，也要核对：账户存在吗？余额够吗？每一项检查都通过之后，才会付出现金。

OWASP 把语法层面的校验（结构和格式）与语义层面的校验（取值“在具体的业务场景中”是否正确）区分开。schema 能覆盖前者的一部分，其余由工具代码完成。提示词和 schema 就像网页表单在浏览器里做的检查：有帮助，但真正算数的只有代码里的检查。

## FDE 为什么需要

一家零售商的助手有 `cancel_order` 和 `issue_refund` 两个工具，提示词把退款上限定为 200 美元。试点期间的 trace 里出现了三次错误调用：一个订单 ID 被抄错了一个字符；一位客户写了“被扣了 15000”（指的是美分）之后，助手发起了一笔 15,000 美元的退款；还有一次对已发货的订单发起取消，而仓库 API 竟然接受了。

严格模式是开着的，所以每次调用都符合 schema。FDE 没有去动提示词，而是找出真实的规则（一份财务 PDF 和订单系统里的两条规则），把它们写进每个工具，并把每次失败都加成一条回归测试。

## 核心概念

### 形状不等于含义

严格模式（schema 强制约束的生成，[2.6](../08-prompting-context-structured-output/06-structured-output.md)）保证类型、必填字段和枚举，不保证订单真的存在，也不保证 5,000 美元符合政策。Anthropic 的严格模式所支持的 schema 子集无法表达 `minimum` 或 `maxLength`，而且它的文档只承诺“在大多数情况下”会合规，所以要先重新检查形状，再检查含义。

### 检查的顺序

工具设计（[4.5](./05-tool-design.md)）能预防一部分错误调用；其余的由校验拦下，按代价从低到高依次检查：

1. **形状：** 类型和必填字段（`"150"` 不是数字）。
2. **规范化：** 去掉首尾空白，枚举值转小写，把金额换算成整数美分。
3. **格式：** 匹配模式和校验和（[4.4](./04-regular-expressions.md)），能抓出 ID 里错了一位数字的笔误。
4. **范围：** 金额在上限以内（不会出现 15,000 美元的退款）。
5. **跨字段：** 退款金额不超过尚未退还的余额。
6. **存在性：** 订单确实存在，而不是编出来的 ID。
7. **状态：** 这次状态变更是允许的（已发货的订单不能取消）。

这个用户是否有权这样做，是操作 gate 的事（[6.5](../12-safety-guardrails-hitl/05-action-gates.md)）；审批见 [6.6](../12-safety-guardrails-hitl/06-human-in-the-loop-approval.md)。

### 先完成所有检查，再产生任何副作用

支付和邮件无法撤销，所以所有检查必须在第一个副作用之前全部通过，被拒绝的调用不会改变任何东西（fail closed）。

```python
CAP_CENTS = 20_000  # 政策规定的 200 美元上限

def issue_refund(order_id: str, amount_cents: int) -> dict:
    if not 0 < amount_cents <= CAP_CENTS:
        raise ToolRejected("amount_cents must be 1 to 20000")
    with db.transaction():
        order = db.lock_order(order_id)  # 行锁
        if order is None:
            raise ToolRejected("Order not found")
        if order.status != "delivered":
            raise ToolRejected("Order not delivered")
        if amount_cents > order.paid_cents - order.refunded_cents:
            raise ToolRejected("Exceeds refundable balance")
        return payments.refund(order_id, amount_cents)  # 第一个副作用
```

`ToolRejected` 是你自己定义的异常，它会作为错误结果返回（在 Claude 上是 `is_error: true`），这样模型就能修正参数，或者去问用户。措辞放在 [4.7](./07-tool-results-and-error-returns.md) 里讲；把结果记录在 trace 里（[4.2](./02-tool-call-loop.md)）。

### 检查与写入要一起完成

一条记录可能在检查和写入之间发生变化，比如两次取消调用同时竞争。可以像上面那样给这一行加锁，让其他写入者等待；也可以做条件写入（`WHERE status = 'open'`），并把“零行被修改”当作一次拒绝。[幂等键](../../m1/06-reliability-scale/05-idempotency.md)能防止一次重试让同一操作执行两遍。

## 常见误区

- **“开了严格模式，参数就算校验过了。”** 它保证的是形状，不保证订单存在，也不保证金额符合政策。
- **“提示词里已经限定了退款上限，所以模型不会要求更多。”** 提示词里的规则只是指导，不是控制手段。这个上限必须是工具里的一个 `if`。
- **“我们的用户是可信的，所以校验可有可无。”** 大多数错误参数都是无心之失：ID 敲错了，把美分当成了美元，年份弄错了。
- **“后面的检查要是失败了，我们回滚就行。”** 支付和第三方调用往往无法撤回。

## 典型面试题

<details>
<summary>什么是工具参数校验？为什么不能信任模型给出的参数？</summary>

它是在工具代码里，对模型提出的每个参数做的确定性检查，发生在任何副作用之前。参数可能格式正确却是错的，也可能被注入的文本带偏。

</details>

<details>
<summary>schema 校验和参数校验有什么区别？</summary>

schema 校验检查形状；严格模式会在生成过程中强制保证它。参数校验则对照实时数据检查含义：只有能访问数据库的代码，才知道订单 A-1042 昨天已经发货。

</details>

<details>
<summary>为 `issue_refund(order_id, amount, reason)` 设计校验。</summary>

把金额规范化为整数美分，把原因规范化为枚举。检查金额为正且在上限以内，订单存在且可退款，金额不超过尚未退还的余额，这些都在同一个事务里完成，并带上幂等键。

</details>

<details>
<summary>一个预订工具接受了过去的日期，尽管提示词里写着“只接受未来的日期”。哪里出了问题？</summary>

这条规则只存在于提示词里，而模型把“下周五”解析成了错误的年份。我会在代码里用服务器时钟校验日期，返回一个带有今天日期的错误，并加一条回归用例。

</details>

## 延伸阅读

- 文章：[Input Validation Cheat Sheet](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Input_Validation_Cheat_Sheet.md)（OWASP，约 20 分钟）
- 参考：[Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls)（Anthropic Claude Docs，约 15 分钟）

## 相关页面

- [结构化输出与 JSON Schema](../08-prompting-context-structured-output/06-structured-output.md)
- [正则表达式（regex）与校验和](./04-regular-expressions.md)
- [工具 schema 与工具设计](./05-tool-design.md)
- [工具结果与错误返回](./07-tool-results-and-error-returns.md)
- [未授权请求、按用户的访问权限与操作 gate](../12-safety-guardrails-hitl/05-action-gates.md)
