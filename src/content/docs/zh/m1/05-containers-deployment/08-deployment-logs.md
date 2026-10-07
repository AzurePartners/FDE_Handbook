---
title: 部署日志
row: M1-L5.4
---
**一句话：** 部署就是让应用在一台外界能访问到的服务器上跑起来，而读日志是弄清部署为什么失败的方法。

## 是什么

部署是把代码从开发者的机器搬到一个可以访问的地方。对于 Azure App Service 上的一个小型 Python Web 应用，一条命令就够了：

```
az webapp up --name my-app --resource-group my-rg --runtime "PYTHON:3.12"
```

这条命令会创建或更新 Web 应用、上传代码并启动它。成功时，平台会返回一个可访问的 URL。失败时，就去读 **日志**：应用或平台在启动过程中打印出来的持续记录。在 Azure 上实时查看日志（在 Linux 上，需要先用 `az webapp log config --docker-container-logging filesystem` 打开容器日志）：

```
az webapp log tail --name my-app --resource-group my-rg
```

日志是查找部署失败原因最有用的工具。一次“成功”的部署，仍然可能在应用开始运行的那一刻失败，而这种失败几乎总是最先出现在日志里。

## FDE 为什么需要

部署失败是家常便饭，只要认真读日志，大多数都不神秘。不看日志就重新部署，往往只会重复同样的失败。找到具体的错误并修复根因，在客户面前会显得沉着、专业。

## 核心概念

### 常见的部署失败

| 失败类型 | 表现 | 如何从日志中诊断 |
|---|---|---|
| 端口错误 | 应用在本地正常，但平台显示 “Application Error” | 应用监听的端口不是平台转发流量的端口。有些平台会通过环境变量（比如 `PORT`）把端口传给应用读取；在使用自定义容器的 Azure App Service 上，你需要把应用设置 `WEBSITES_PORT` 设为容器监听的端口。 |
| 缺少环境变量 | 应用启动即崩溃，或某个功能在使用时失败 | traceback 会点名那个始终没找到的设置项 |
| 缺少依赖 | 应用启动时因导入错误而崩溃 | 日志会点名代码尝试导入、但从未安装的那个包 |
| 启动时崩溃 | 应用始终无法进入正常工作状态 | 在处理任何请求之前、日志一开头就出现堆栈跟踪，说明问题在配置或初始化，而不在用户输入 |

### 有计划地读日志

从上往下读日志流，找到第一个错误，而不是最后一个；后面的错误往往只是它引发的连锁反应。然后从下往上读这个错误的堆栈跟踪，方法见 [日志与堆栈跟踪](../04-git-debugging-testing-security/05-logs-and-stack-traces.md)。要把“部署被接受”和“应用在运行”区分开：前者只说明代码上传成功了。

## 常见误区

- **“部署命令没报错就结束了，说明应用能用。”** 这只说明平台接受了代码并尝试启动它。应用仍可能一运行就崩溃。
- **“日志只有在出问题之后才有用。”** 部署过程中盯着日志，常常能抓到出错的那一刻。
- **“出现堆栈跟踪就一定是代码有 bug。”** 启动时的堆栈跟踪经常是缺少配置导致的，而不是应用逻辑的问题。
- **“遇到部署失败，先重启应用是合理的第一步。”** 重启修不好缺失的环境变量，只会把同样的失败再现一遍。

## 典型面试题

<details>
<summary>部署“成功”了，但应用显示错误页面。这说明什么？下一步查什么？</summary>

说明平台接受了代码并尝试启动，但应用在运行时出错了，这和部署本身是两回事。去查应用的日志，找到真正的错误。

</details>

<details>
<summary>只看日志，你如何区分缺少环境变量和缺少依赖？</summary>

缺少环境变量时，traceback 会点名代码期望读取却没找到的那个设置项。缺少依赖时，会出现导入错误，点名一个从未安装的包。

</details>

<details>
<summary>应用一启动、还没处理任何请求，就出现了堆栈跟踪。这说明什么？</summary>

启动时崩溃几乎总是指向配置或初始化问题，比如缺少环境变量，而不是应用逻辑里的 bug，因为此时还没有处理任何用户输入。

</details>

## 延伸阅读

- 文章：[Quickstart: Deploy a Python (Django, Flask, or FastAPI) web app to Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/quickstart-python)（Microsoft Learn，把 Python Web 应用部署到 Azure App Service 的快速入门）。
- 文章：[Configure a Linux Python app for Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/configure-language-python)（Microsoft Learn，在 Azure App Service 上配置 Linux Python 应用）。

## 相关页面

- [计算选项](./05-compute-options.md)
- [配置](./06-config-and-env-vars.md)
- [日志与堆栈跟踪](../04-git-debugging-testing-security/05-logs-and-stack-traces.md)
- 模块 4 中有更深入的内容：[Logs, Metrics, Traces, Health Checks & Alerts](../../m4/05-deployment-ci-cd-observability-and-production-readiness/02-logs-metrics-traces-health-checks-and-alerts.md)（日志、指标、链路追踪、健康检查与告警）
