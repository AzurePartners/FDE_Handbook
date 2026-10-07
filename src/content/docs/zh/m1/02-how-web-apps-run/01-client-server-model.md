---
title: 客户端-服务器模型
row: M1-L2.2
---
**一句话：** 客户端是主动发起请求、开启一次对话的程序；服务器是等待请求并返回响应的程序。

## 是什么

客户端是提问的一方。浏览器是客户端，移动应用、用 `curl` 跑的脚本，或者一个后端调用另一个后端，也都是客户端。服务器是等待并作答的一方。这两者是某一次交互中的角色，而不是固定身份：一个为前端请求提供服务的后端，在调用外部天气 API 时，自己也成了客户端。

## FDE 为什么需要

有人说“服务器挂了”，你得先弄清楚他说的是哪台服务器。浏览器发出的一个请求，可能要经过好几个扮演服务器角色的环节：Web 服务器、后端 API、数据库。明白客户端和服务器是角色而不是永久标签，你就能问出正确的追问，而不是在系统里随便猜一个环节。

## 核心概念

### 客户端和服务器是角色，不是机器类型

| 场景 | 谁是客户端 | 谁是服务器 |
|---|---|---|
| 你打开一个网站 | 你的浏览器 | 该公司的 Web 服务器 |
| 后端调用天气 API | 你的后端 | 天气服务商的服务器 |
| 你运行 `curl http://localhost:8000/health` | 你的终端 | 你本地运行的应用 |

## 常见误区

- **“服务器就是一台物理机器。”** 服务器是程序扮演的一种角色。一台物理机器可以同时运行多个服务器程序，各自处理不同的请求。
- **“后端永远是服务器，不会是客户端。”** 后端对调用它的前端来说是服务器，但它一旦去调用外部 API 或另一个后端，就成了客户端。

## 典型面试题

<details>
<summary>客户端和服务器有什么区别？</summary>

客户端是发起请求的程序，服务器是等待请求并作答的程序。这是某次具体交互中的角色，不是固定标签：后端对前端来说是服务器，但在调用外部 API 时就是客户端。

</details>

<details>
<summary>同一个程序能既是客户端又是服务器吗？</summary>

能。后端在响应前端时是服务器，在调用天气 API 这类外部服务时是客户端。角色取决于程序在某次交互中站在哪一边。

</details>

## 延伸阅读

- 文章：[Client-Server overview](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview)（MDN，客户端-服务器概述，约 20 分钟）。
- 文章：[How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works)（MDN，Web 是如何运作的，约 15 分钟）。

## 相关页面

- [IP 地址与端口](./02-dns-ip-ports.md)
- [进程与服务](./03-processes-and-services.md)
- [Web 应用的分层](./10-frontend-backend-database-layers.md)
