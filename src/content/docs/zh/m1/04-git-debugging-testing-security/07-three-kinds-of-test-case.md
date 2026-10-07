---
title: 测试用例类型
row: M1-L4.3
---
**一句话：** 测试就是用已知输入运行程序并检查结果的代码；完整的测试要覆盖正常输入、不寻常的输入，以及应该被拒绝的输入。

## 是什么

测试就是写代码去检查别的代码。你不必每次改完都手动运行应用、用眼睛核对结果，而是写一次测试，让它每次都自动做同样的检查。测试通过，说明行为依然正常；测试失败，说明有东西坏了，而且你几秒钟内就能知道，不用等到客户来报告。

测试思维意味着按三类输入来思考，而不只是最容易想到的那一种：

- **正常路径**（happy path）：正常、符合预期的输入，能正确工作。
- **边界情况**（edge case）：不寻常但合法的输入，处在代码预期范围的边界上。
- **失败情况**（failure case）：应该被拒绝的输入或条件，这类输入本就不应该成功。

大多数人，以及在没有明确要求时的大多数 AI 工具，都只会写正常路径的测试。初级工程师有没有成长，就看他是否也会考虑边界情况和失败情况。

## FDE 为什么需要

客户的真实数据比演示数据乱得多。带重音符号的名字、空字段、外部 API 不支持的值：这些在正常路径的演示里不会出现，但上线第一周就会在生产环境里冒出来。提前为它们写好测试，决定了你看起来是早有准备，还是措手不及。

## 核心概念

### 示例：一个 `/lookup?city=` 端点

| 类别 | 示例输入 | 预期行为 |
|---|---|---|
| 正常路径 | `city=Tokyo` | 返回天气数据和 200 状态码 |
| 边界情况 | `city=são paulo`（带重音符号、小写） | 仍然能找到这个城市 |
| 失败情况 | `city=`（空字符串） | 返回 400 和清晰的提示信息，而不是崩溃 |
| 失败情况 | `city=Nowhereville`（不存在） | 返回 404，而不是 500 |

### 先写会失败的测试

1. 写一个描述你想要的行为的测试，用一个你知道目前会失败的输入。
2. 运行它，看着它失败。这证明这个测试确实在检查真实的东西。
3. 编写或修复代码，直到测试通过。
4. 把测试留在代码库里，防止同一个 bug 悄悄卷土重来。

在使用 AI 工具时，这个顺序很重要：事先写好的测试能证明 AI 声称的修复确实有效，而不是只能相信 AI 自己的说法。

### 一个简短的 pytest 示例

```python
def test_missing_city_returns_400():
    response = client.get("/lookup?city=")
    assert response.status_code == 400

def test_unknown_city_returns_404():
    response = client.get("/lookup?city=Nowhereville")
    assert response.status_code == 404

def test_valid_city_returns_weather():
    response = client.get("/lookup?city=Tokyo")
    assert response.status_code == 200
    assert "weather" in response.json()
```

每个以 `test_` 开头的函数就是一个测试。`pytest` 会逐个运行，并报告哪些通过、哪些失败，以及具体是哪条断言没通过。

## 常见误区

- **“演示能跑通，测正常路径就够了。”** 演示只能证明你试过的那一个输入没问题。真实的客户数据碰到的恰恰是边界情况和失败情况。
- **“测试失败就说明代码坏了。”** 也可能是测试本身写错了，比如检查了错误的状态码。在认定是代码的问题之前，先读一读断言。
- **“AI 写的测试自然很全面。”** 让 AI “写测试”，它往往只会写正常路径的测试，除非你明确要求它也覆盖边界情况和失败情况。

## 典型面试题

<details>
<summary>测试用例分哪三类？为什么三类都重要？</summary>

正常路径（正常输入）、边界情况（不寻常但合法的输入）和失败情况（应该被拒绝的输入）。三类都重要，因为真实使用中会有各种杂乱的输入，只测正常路径的测试永远发现不了这些问题。

</details>

<details>
<summary>“先写会失败的测试”是什么意思？为什么要这样做？</summary>

在修复之前，先写一个描述期望行为的测试，运行它确认它会失败，然后编写代码直到它通过。这能证明测试确实在检查真实的东西，也提供了一种确认修复有效的方法。

</details>

<details>
<summary>针对一个接收邮箱地址的表单，举一个边界情况和一个失败情况的例子。</summary>

边界情况：带加号或者使用不常见域名的邮箱，仍应被接受。失败情况：不含 `@` 的字符串，应被拒绝并给出清晰的错误提示，而不是被悄悄接受。

</details>

## 延伸阅读

- 文章：[Ranorex, positive testing vs negative testing](https://www.ranorex.com/blog/positive-testing-vs-negative-testing-key-differences/)（Ranorex，正向测试与负向测试的区别）
- 文章：[softwaretestinghelp, What is negative testing](https://www.softwaretestinghelp.com/what-is-negative-testing/)（Software Testing Help，什么是负向测试）

## 相关页面

- [复现、缩小范围、最小化](./06-reproduce-narrow-minimize.md)
- [单元测试与集成测试](./08-unit-vs-integration-tests.md)
