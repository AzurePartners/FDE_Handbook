---
title: 读懂代码
row: M1-L1.3
---
**一句话：** 读代码靠的是模式识别：认出函数、变量、条件判断、循环、异常和模块这些所有主流语言共有的模式。所以你不需要精通某门语言，也能追踪它的代码在做什么。

## 是什么

大多数人以为，读代码就得像掌握一门外语那样掌握编程语言，把词汇和语法都背下来。但 FDE 日常需要的并不是这个。几乎所有语言写的几乎所有代码，都由一小组反复出现的积木搭成：存储一个值，把若干步骤打包成可复用的单元，按条件分支，重复做某件事，处理出错的情况，以及引入别人写的代码。

一旦能认出这六种形态，即使是从没用过的语言，你也能跟上代码的逻辑，因为这些形态在哪里看起来都差不多：条件判断总是某种形式的 `if`，循环总是某种形式的 `for` 或 `while`，错误处理总是某种形式的 `try`。具体关键字会变，底层结构不会变。你是在追踪结构，而不是逐字翻译语法。

## FDE 为什么需要

FDE 的工作中有很大一部分是读别人写的代码，常常是不熟悉的语言，时间紧，还当着客户的面。先学到精通再动手并不现实。现实的做法是：找到入口，跟着一个请求走过它经过的函数，不需要专门去学那门语言。正是这项能力，让 FDE 能够信任或质疑 AI 工具对代码库的描述，而不是照单全收它的总结。

## 核心概念

### 六种基本积木

| 积木 | 怎么认出来 |
|---|---|
| 变量 | 赋值语句，`name = value` |
| 函数 | `def` 或 `function`，加一个名字和括号 |
| 条件判断 | `if`、`else`、`elif`、`switch` |
| 循环 | `for` 或 `while` |
| 异常 | `try`、`except`、`catch`、`raise` |
| 模块 | `import`、`from`、`require` |

### 读一个真实的函数

```python
import requests                    # 模块

def get_forecast(latitude, longitude):   # 函数
    url = "https://api.open-meteo.com/v1/forecast"  # 变量
    params = {"latitude": latitude, "longitude": longitude,
              "daily": "temperature_2m_max"}
    try:                            # 异常处理
        response = requests.get(url, params=params, timeout=10)
        if response.status_code != 200:   # 条件判断
            raise ValueError("forecast request failed")
        for temp in response.json()["daily"]["temperature_2m_max"]:  # 循环
            print(temp)
        return response.json()
    except requests.Timeout:
        return None
```

即使没写过 Python 也能看懂：`get_forecast` 接收一个位置，调用外部服务，检查调用是否失败，遍历每日气温，遇到超时则返回 `None` 而不是崩溃。这些都不需要背语法，只需要认出那六种形态。

### 一套阅读方法

1. 找到入口，也就是程序开始执行的文件或函数。
2. 选一条贯穿代码的路径，比如一个请求或一次点击，先只跟这一条。
3. 先看清每个代码块的形态，再去管具体语法。
4. 用这个结构去核对 AI 工具给出的解释。

## 常见误区

- **“要精通一门语言才能读懂它。”** 精通能帮你更快写出地道的代码。但要弄清现有代码在做什么，只需要那六种基本积木。
- **“扫一眼命名就知道代码在做什么。”** 命名可能有误导，也可能早已过时。你必须追踪真实的控制流。
- **“AI 解释了代码就够了。”** 解释可能是错的。运行代码，或者自己追踪一遍，确认它和代码一致。

## 典型面试题

<details>
<summary>看一个不熟悉的函数，你怎么认出其中的循环、条件判断和异常处理？</summary>

找反复出现的关键字，而不是逐行翻译：`for`/`while` 是循环，`if`/`else` 是条件判断，`try`/`except` 是异常处理。具体语法因语言而异，但这些形态几乎在每种语言里都有。

</details>

<details>
<summary>某个文件用的语言你从没用过，你怎么弄清楚它在做什么？</summary>

找到入口，只跟一条路径而不是读每一行，并把看到的内容对应到那六种积木上。

</details>

<details>
<summary>你怎么验证 AI 对代码的解释是对的？</summary>

按照 AI 描述的结构自己追踪一遍代码，条件允许时运行它，或者写一个小测试，确认行为与解释一致。

</details>

<details>
<summary>要找到一个 Web 请求最先进入代码库的地方，最快的办法是什么？</summary>

在顶层应用文件附近找路由或端点定义，然后沿着该路由的函数，看它调用了哪些东西。

</details>

## 延伸阅读

- 文章：[MDN, JavaScript first steps](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting)（MDN，JavaScript 入门，约 2 小时）
- 视频：[MIT Missing Semester 2026, Debugging and Profiling](https://missing.csail.mit.edu/2026/debugging-profiling/)（MIT，调试与性能分析，自定进度）

## 相关页面

- [AI 编程工具](./02-tool-forms.md)
- [AI 代码审查](./06-verify-dont-trust.md)
