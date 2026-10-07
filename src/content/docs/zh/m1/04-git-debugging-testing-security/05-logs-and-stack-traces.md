---
title: 日志与堆栈跟踪
row: M1-L4.2
---
**一句话：** 日志和堆栈跟踪是程序留下的证据：日志记录程序做了什么，堆栈跟踪告诉你它在哪里崩溃。

## 是什么

bug 就是代码“应该做的”和“实际做的”之间的差距。调试就是靠证据而不是猜测来消除这个差距，而最主要的证据就是日志和堆栈跟踪。

日志是程序运行时写出的一行行文本，描述它做了什么，比如 “connected to database”“received request for city=Lahore”。日志是开发者有意在特定位置写下的，所以它只能反映有人想到要记录的内容。

堆栈跟踪是程序因未处理的错误而崩溃时自动打印出来的信息。它列出崩溃那一刻正在运行的所有函数，从最先调用的那个一直到出错的那个。按正确的方向读懂堆栈跟踪，是任何接触代码的人最有用的技能之一，不管代码是自己写的，还是在审查 AI 写的代码。

## FDE 为什么需要

在客户现场，总会有东西出问题，而且往往就在演示之前。如果你分辨不出 AI 给的答案对不对，“我先问问 AI”就不是一个好的第一步。FDE 会先读错误信息、形成假设，然后才去求助。AI 工具有时会“修复”bug 的方式是直接删掉那个失败的检查，把真正的问题藏起来。能自己读懂堆栈跟踪的人，才能发现这种情况。

## 核心概念

### 自下而上阅读 Python traceback

```
Traceback (most recent call last):
  File "app/main.py", line 12, in <module>
    result = get_summary("Lahore")
  File "app/services.py", line 34, in get_summary
    rate = fetch_exchange_rate(city_currency)
  File "app/services.py", line 51, in fetch_exchange_rate
    return data["rates"][target]
KeyError: 'PKR'
```

Python 打印的顺序是 “most recent call last”（最近的调用在最后），所以最底部是崩溃发生的位置，往上的每一行是导致崩溃的调用链。要自下而上地读：

1. 最后一行 `KeyError: 'PKR'` 是真正的错误：代码查找名为 `'PKR'` 的键，但它不存在。
2. 上一行 `services.py, line 51` 指出了位置：`data["rates"][target]`。
3. 继续往上：`fetch_exchange_rate` 由 `get_summary` 调用，而 `get_summary` 是在 `main.py, line 12` 被调用的。

修复要从最底部开始：要么 `'PKR'` 本该存在，是上游传来了错误的货币代码；要么代码需要处理汇率缺失的情况，而不是假设它总会存在。

### 一行好日志应该包含什么

有用的日志要说明发生了什么以及涉及哪些值，而不是只写一句 “error occurred”。对比一下 `"failed"` 和 `"failed to fetch exchange rate for currency=PKR, status=404"`。后者不用复现 bug 就能告诉你什么失败了、为什么失败。

## 常见误区

- **“堆栈跟踪应该从上往下读。”** 要从下往上读。最后一行是真正的错误，上面的行说明执行是怎么走到那里的。
- **“堆栈跟踪和日志是一回事。”** 日志是程序正常运行时在选定位置有意写下的。堆栈跟踪只有在未处理的错误导致程序崩溃时才会自动生成。
- **“日志越多越好。”** 每一步都记录每个值，会让有用的行淹没在噪音里。只记录真正有助于诊断故障的信息。

## 典型面试题

<details>
<summary>你怎么读 Python 的堆栈跟踪？</summary>

从最底部开始。最后一行给出错误类型和错误信息，上一行显示崩溃发生的具体文件和行号。往上读，就能看到导致崩溃的调用顺序。

</details>

<details>
<summary>日志和堆栈跟踪有什么区别？</summary>

日志是程序运行时有意写出的文本，描述它做了什么。堆栈跟踪是程序崩溃时自动生成的，列出导致失败的函数调用链。

</details>

<details>
<summary>你在堆栈跟踪的最底部看到 `KeyError: 'PKR'`，这说明了什么？接下来你会查什么？</summary>

代码在一个字典里查找键 `'PKR'`，但字典里没有这个键。先看错误上方那一行，确认是哪次查找失败，然后往上追，找到这个键是从哪里来的。

</details>

## 延伸阅读

- 文章：[Julia Evans, A debugging manifesto](https://jvns.ca/blog/2022/12/08/a-debugging-manifesto/)（jvns.ca，调试原则清单，约 15 分钟）
- 文章：[MIT Missing Semester, Debugging and Profiling](https://missing.csail.mit.edu/2026/debugging-profiling/)（missing.csail.mit.edu，MIT 调试与性能分析课程）

## 相关页面

- [复现、缩小范围、最小化](./06-reproduce-narrow-minimize.md)
- [集成故障诊断](../03-apis-data-integration/07-diagnosing-integration-failures.md)
