---
title: IP 地址与端口
row: M1-L2.2
---
**一句话：** IP 地址标识网络上的一台机器，端口号告诉这台机器该由哪个程序接收流量。

## 是什么

网络上的每台机器都有一个 IP 地址，比如 `192.0.2.10`，用来标识这台机器，就像门牌地址标识一栋楼。IPv4 地址由四个 0 到 255 之间的数字组成，用点分隔；较新的 IPv6 地址更长，用十六进制书写，比如 `2001:db8::1`。有些地址是公网地址，可以从互联网访问；`10.x.x.x`、`192.168.x.x` 这类私有地址段只能在家庭或公司内网中使用。人们通常输入的是域名而不是 IP 地址，由 DNS（域名系统）负责把域名翻译成 IP 地址，详见 [HTTPS、域名与证书](../05-containers-deployment/07-domains-and-certificates.md)。

IP 地址能把你带到正确的机器，但一台机器可以同时运行很多程序：Web 服务器、数据库、内部工具。端口是一个 0 到 65535 之间的数字，标识这台机器上某扇特定的网络流量“门”。每个服务器选一个端口监听，进来的流量就知道该交给哪个程序处理。端口 80 是普通 HTTP 的默认端口，443 是 HTTPS 的默认端口。输入 `http://localhost:8000` 的意思是：“去这台机器，敲 8000 号门。”

`localhost`（或 `127.0.0.1`）的意思是“就是这台机器，而且只有这台机器”。绑定到 `localhost` 的服务器，从另一台电脑是访问不到的。绑定到 `0.0.0.0` 的意思是“在这台机器的所有网络接口上监听”，这样其他机器，或者容器外部，才能访问到这个服务器。

## FDE 为什么需要

一个演示在你的笔记本上好好的，到了客户环境里却完全跑不起来，常见原因有三个：访问应用用错了 IP 地址；防火墙拦住了应用监听的端口；服务器绑定的是 `localhost` 而不是 `0.0.0.0`。只要你知道这是三件不同的事，每一项都能单独快速排查。

## 核心概念

### 查看正在运行什么、占用哪个端口

```
# See if something is listening on port 8000 (Linux/Mac)
lsof -i :8000

# See if something is listening on port 8000 (Windows PowerShell)
Get-NetTCPConnection -LocalPort 8000

# Start a FastAPI app on a specific port
uvicorn main:app --port 8000
```

### 值得认得的常见端口

| 端口 | 典型用途 |
|---|---|
| 80 | 普通 HTTP |
| 443 | HTTPS（加密的 HTTP） |
| 5432 | PostgreSQL 数据库 |
| 8000、3000、5000 | 本地开发常用的默认端口 |

### 按症状判断连接失败

| 症状 | 可能原因 |
|---|---|
| “Connection refused”（连接被拒绝） | 该端口上没有程序在监听，或者服务器只绑定了 `localhost` |
| 请求一直挂着，最后超时 | 防火墙在静默丢弃发往该端口的流量 |
| 启动时报 “Address already in use”（地址已被占用） | 另一个进程已经占用了这个端口 |

## 常见误区

- **“localhost 和 0.0.0.0 可以互换。”** 不能。`localhost` 把访问限制在本机。`0.0.0.0` 让服务器对所有网络接口开放，一旦迁到容器或云上，这一点就很关键。
- **“域名和 IP 地址是一回事。”** 域名是给人看的标签，在建立任何连接之前，DNS 要先把它翻译成 IP 地址。
- **“192.168.x.x 地址从哪里都能访问。”** 这是私有地址段，只在局域网内有效。要从外部访问这样的机器，需要公网地址或隧道。

## 典型面试题

<details>
<summary>服务器绑定到 localhost 和绑定到 0.0.0.0 有什么区别？</summary>

`localhost` 只接受来自本机的连接。`0.0.0.0` 在所有网络接口上监听，因此其他机器或容器外部的流量都能访问到它。

</details>

<details>
<summary>端口是什么？为什么一台机器需要不止一个端口？</summary>

端口是一个数字，用来标识某段网络流量应该交给机器上哪个正在运行的程序。一台机器需要很多端口，是因为它可以同时运行多个服务器，比如端口 80 上的 Web 服务器和端口 5432 上的数据库，它们共用同一个 IP 地址。

</details>

<details>
<summary>同事说“我的服务器起不来，端口 8000 已被占用”。你会检查什么？</summary>

用 `lsof -i :8000` 或对应的 PowerShell 命令，查看是什么程序已经在监听端口 8000。要么停掉那个进程，要么换一个端口启动新服务器。

</details>

## 延伸阅读

- 文章：[How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works)（MDN，Web 是如何运作的，约 15 分钟）。
- 文章：[Client-Server overview](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview)（MDN，客户端-服务器概述，约 20 分钟）。

## 相关页面

- [客户端-服务器模型](./01-client-server-model.md)
- [进程与服务](./03-processes-and-services.md)
- [完整的请求生命周期](./11-full-request-lifecycle.md)
- [端口映射](../05-containers-deployment/03-port-mapping.md)
- [HTTPS、域名与证书](../05-containers-deployment/07-domains-and-certificates.md)
