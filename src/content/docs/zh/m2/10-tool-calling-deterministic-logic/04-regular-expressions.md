---
title: 正则表达式（regex）与校验和
row: M2-L4.4
---
**一句话：** 正则表达式（regex）是一个简短的模式，描述一个值必须具有的形状；校验和是对这个值的各位数字做的一个小计算，用来发现手误；因此，一个 ID 格式是否正确，由代码而不是模型来判断。

## 是什么

正则表达式（regex）是一种小型的模式语言，用来描述文本允许的形状。`^ORD-[0-9]{8}$` 的读法是：字符串开头（`^`），字面量 `ORD-`，恰好八个（`{8}`）取自 0 到 9 的字符（`[0-9]`），字符串结尾（`$`）。代码每次都得到同样的“是”或“否”，耗时不到一微秒。

正则表达式好比一个饼干模具：它只检查轮廓，所以轮廓对得上的假 ID 也能通过。因此你还要加上解析，把文本变成真正的值（日期库知道 2 月 30 日不存在），再加上校验和：一个由其他数字算出来的数字，就像收据上的合计，只要有一位抄错就对不上了。OWASP 把形状检查称为语法层面的校验；业务上是否说得通是语义层面的校验，而是否存在则需要一次查询。

## FDE 为什么需要

一家零售商的客服助手有一个 `get_order` 工具，处理形如 `ORD-12345674` 的 ID，其最后一位是 Luhn 校验位。第一版信任的是提示词，外加 `re.search(r"\d{8}", text)`。有位客户输入了九位数字，搜索取了前八位，助手于是描述了另一笔真实存在的订单。另一位客户调换了两位数字；模型觉得没问题，于是“未找到”变成了“你的订单不存在”。一个以换行符结尾的值通过了 `^...$` 检查。

FDE 把这些检查挪进工具代码里（规范化、完整匹配、Luhn，然后是 [4.6](./06-tool-argument-validation.md) 里的存在性检查）。错误的值会在几微秒内失败，并给出具体的错误；二十个应当通过和应当失败的用例变成了单元测试。

## 核心概念

### 锚定整个字符串

Python 的 `re.search` 在任意位置匹配，`re.match` 只在开头匹配。校验时请用 `re.fullmatch`。

- `re.search(r"\d{5}", "123456")` 会成功，所以六位数字也能通过。
- Python 的 `$` 也会匹配结尾换行符之前的位置，所以 `^\d{5}$` 会接受 `"12345\n"`。`fullmatch` 不会。
- `^cat|dog$` 会匹配“hotdog”。要加括号分组：`^(cat|dog)$`。
- 在 Python 和 .NET 里，`\d` 会匹配任何 Unicode 数字，比如阿拉伯-印度数字（Arabic-Indic）`١٢٣٤٥`。要只匹配 ASCII，请写 `[0-9]`。

OWASP 建议使用覆盖整个输入的白名单，不用 `.` 这样的通配符，并限定长度范围，比如 `{1,25}`。

### 让模式保持简单

过严的模式会把真实的人拒之门外，比如姓名里的撇号，或邮箱地址里的 `+`；对于邮箱，OWASP 建议只做轻量检查，然后发一个确认链接。过于取巧的模式则有风险：像 `(a+)+$` 这样的嵌套量词，遇到精心构造的输入可能耗费指数级时间（ReDoS），所以要限制输入长度，并且永远不要用用户输入或模型输出的文本来构造模式。

### 先匹配模式，再解析，最后校验和

`\d{4}-\d{2}-\d{2}` 会接受 `2026-02-30`；`date.fromisoformat` 会拒绝它，但也会接受 `20191204` 这样的形式，所以先做完整匹配，再解析。

Luhn 校验用来保护银行卡号和手机的 IMEI 编号：从最右边的数字开始向左，每隔一位把数字翻倍，结果大于 9 的减去 9，然后求和。总和能被 10 整除才算合法。

```python
ORDER_ID = re.compile(r"ORD-[0-9]{8}")

def luhn_ok(digits: str) -> bool:
    total = 0
    for i, ch in enumerate(reversed(digits)):
        d = int(ch) * (2 if i % 2 else 1)
        total += d - 9 if d > 9 else d
    return total % 10 == 0

value = raw.strip().upper().replace(" ", "")
valid = bool(ORDER_ID.fullmatch(value)) and luhn_ok(value[4:])
```

Luhn 能发现所有单个数字的错误，也能发现所有相邻数字互换，只有 09 与 90 互换例外。随机取一个数字，大约有十分之一能通过，而且任何人都能算出校验位，所以它只能防手误，防不了欺诈。对于 IBAN 或 ISBN，请使用经过测试的库，比如 `python-stdnum`。

### 不要让模型检查格式

模型读到的是 token，而不是字符，而且每次运行的回答可能不同；OWASP 的 LLM Top 10 2026（LLM10，Improper Output Handling）说，要“像对待任何其他用户一样”对待它。schema 里的 `pattern`（[2.6](../08-prompting-context-structured-output/06-structured-output.md)）只能收窄形状。AI 可以编写经过测试的正则表达式；但模型不得在运行时判断取值。

## 常见误区

- **“模式匹配上了，这个值就是合法的。”** search 只要在任意位置找到一小段就算数，而即使是完整匹配，证明的也只是形状，不是存在。
- **“YYYY-MM-DD 的正则表达式能证明它是真实的日期。”** 它会接受 `2026-13-01`。先匹配形状，再解析。
- **“通过了 Luhn 的数字就是真实账户。”** Luhn 只能发现手误。要确认存在，需要一次查询。

## 典型面试题

<details>
<summary>`^ORD-[0-9]{8}$` 接受什么？</summary>

只接受 `ORD-` 加恰好八个 ASCII 数字，别的都不行。在 Python 里请用 `re.fullmatch`，因为 `$` 能容忍结尾的换行符。

</details>

<details>
<summary>格式检查、校验和与查询有什么区别？</summary>

格式检查确认形状，校验和通过检验各位数字是否相互吻合来发现手误，查询则确认记录确实存在。按成本由低到高依次运行。

</details>

<details>
<summary>你的校验器接受了 `ORD-123456789` 和一个以换行符结尾的值。为什么？</summary>

`re.search` 在九位数字里找到了八位，而 Python 的 `$` 会匹配结尾换行符之前的位置。改用 `re.fullmatch` 搭配 `[0-9]`，并把这两个输入都加进回归测试。

</details>

<details>
<summary>客户建议让模型来确认每个 ID 是否合法。你怎么回应？</summary>

先婉拒，再解释：模型每次运行的结果可能不同，还要花钱，而正则表达式加校验和是确定性的，可以做单元测试。模型负责找出这个值；它是否合法，由代码来判断。

</details>

## 延伸阅读

- 文章：[Regular Expression HOWTO](https://docs.python.org/3/howto/regex.html)（Python Software Foundation，约 40 分钟）
- 参考：[Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)（OWASP，约 20 分钟）
- 文章：[Regular expression Denial of Service - ReDoS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)（OWASP，约 10 分钟）

## 相关页面

- [模型判断与确定性代码](./03-model-vs-code.md)
- [工具参数校验](./06-tool-argument-validation.md)
- [输入校验](../../m1/04-git-debugging-testing-security/10-input-validation.md)
- [测试用例类型](../../m1/04-git-debugging-testing-security/07-three-kinds-of-test-case.md)
- [敏感数据与 PII 保护](../12-safety-guardrails-hitl/03-sensitive-data-and-pii.md)
