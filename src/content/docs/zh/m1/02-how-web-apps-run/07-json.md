---
title: JSON
row: M1-L2.2
---
**一句话：** JSON 是一种用纯文本书写结构化数据的方式，浏览器里的 JavaScript 和后端的 Python 都能准确无误地读写它。

## 是什么

JSON 是 JavaScript Object Notation（JavaScript 对象表示法）的缩写。它是一种表示数据的文本格式，可以表示数字、文本、真/假值、列表，以及嵌套的命名值集合。它长这样：

```json
{
  "city": "Lahore",
  "temp_c": 32.1,
  "is_daytime": true,
  "forecast": [29.5, 31.0, 33.2]
}
```

几乎所有现代 API 都在 HTTP 请求和响应的 body 里收发 JSON。它之所以成为标准，一是一眼就能看懂，二是几乎每种语言都内置了把 JSON 文本转成该语言原生数据结构、再转回来的方法。在 Python 里这个结构通常是字典，在 JavaScript 里是对象。文本本身与语言无关，所以它能在浏览器和用不同语言写成的服务器之间通用。

JSON 只支持六种值：字符串（用双引号）、数字、布尔值（`true` 或 `false`）、`null`、对象（花括号里的键值对）和数组（方括号里的有序列表）。不支持注释，没有原生的日期类型，也不允许末尾多一个逗号。

## FDE 为什么需要

FDE 碰到的集成 bug，大多是 JSON 结构对不上：后端期望一个叫 `city_name` 的字段，前端发的却是 `city`。在 Network 面板里读原始 JSON，逐个字段对照代码的预期，就能把“数据没显示出来”这种模糊的抱怨变成精确的诊断。

## 核心概念

### 在 Python 后端中使用 JSON

```python
import json

data = {"city": "Lahore", "temp_c": 32.1}
json_text = json.dumps(data)   # Python dict 转 JSON 文本
parsed = json.loads(json_text) # JSON 文本转回 Python dict
```

## 常见误区

- **“JSON 和 Python 字典是一回事。”** JSON 是文本，Python 字典是内存中的数据结构。代码必须用 `json.dumps` 或 `json.loads` 显式地在两者之间转换。
- **“JSON 能解析成功，数据就是对的。”** 解析成功只能说明这段文本是合法的 JSON，完全不能说明字段名或字段值符合接收方代码的预期。

## 典型面试题

<details>
<summary>JSON 是什么？为什么 API 都用它？</summary>

JSON 是一种表示结构化数据的纯文本格式，由字符串、数字、布尔值、null、对象和数组构成。API 用它，是因为它人类可读，而且几乎所有编程语言都能把它和自己的原生数据结构互相转换。

</details>

<details>
<summary>后端端点返回了数据，但前端什么都没显示。你会先查什么？</summary>

打开 Network 面板，看原始的响应 body，把其中的字段名和类型与前端代码期望读取的逐一对照。常见原因是字段名不一致，比如后端发的是 `city_name`，前端读的却是 `city`。

</details>

## 延伸阅读

- 文章：[Working with JSON](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON)（MDN，JSON 使用入门）

## 相关页面

- [HTTP 请求与响应](./04-http-request-response.md)
- [状态码](./06-status-codes.md)
- [CSV 与表格](../03-apis-data-integration/08-csv-and-tables.md)
- [Schema 与数据契约](../03-apis-data-integration/10-schema-and-data-contracts.md)
