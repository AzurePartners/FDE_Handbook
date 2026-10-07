---
title: 配置
row: M1-L5.3
---
**一句话：** 云上的应用从它所运行的平台读取设置，而不是从开发者笔记本上的某个文件读取，这样同一个镜像在每个环境里都能正确运行。

## 是什么

开发者在自己机器上工作时，本地的 `.env` 文件里存着数据库地址、超时时长之类的值。这个文件不属于部署出去的应用。应用迁到云上之后，这些值必须放在平台能读取的地方。在 Azure App Service 上，这叫 **应用设置**（application settings）：一组键值对，在应用启动时以环境变量的形式提供给应用。如果应用需要 `API_TIMEOUT`，而它只存在于本地 `.env` 文件中，云上的版本就拿不到它，依赖它的功能都会失败。

这遵循 Twelve-Factor App（一套被广泛引用的云软件实践）的一条原则：把配置存放在环境中，而不是代码里。应用在本地和云上都用同一种方式读取配置，即通过环境变量。变化的只是这些值的来源：本地的 `.env` 文件，或平台的应用设置。代码本身不应改变。

其中有些值是密钥，比如 API key 和密码。如何安全地处理它们，包括使用 Azure Key Vault 这类工具，会在单独的页面中介绍。

## FDE 为什么需要

一个常见的早期部署故障：应用在本地运行正常，部署之后就崩溃，原因是某个在本地 `.env` 里悄悄设置好的值，从没被添加到云平台的应用设置中。理解这一点的 FDE 只要对比两边，几分钟就能诊断出来，而不是反复去读那些根本没问题的应用代码。

## 核心概念

### 环境变量与应用设置

在每个环境中，应用都通过环境变量读取配置。在本地，由一个 `.env` 文件（不纳入 git）来设置；在云上，由平台自己的设置界面或 CLI 来设置，并在启动时注入到运行中的容器里。注意，`os.environ` 本身并不会读取 `.env`，参见 [开发环境](../01-ai-assisted-development/03-dev-environment.md)。

### 配置与代码

配置是指在不同部署之间会变化的一切：数据库连接、功能开关、要调用哪些外部服务、超时时长。其余的都是代码，它在本地、预发布和生产中应该完全一致。如果把应用从一个环境搬到另一个环境时某个值必须改变，那它就属于配置，不应该硬编码在源代码里。

## 常见误区

- **“本地 .env 文件里有的东西，在云上自动就能用。”** 平台自己的配置必须单独设置；`.env` 文件不纳入 git，也应该排除在镜像之外，所以云端根本看不到它。
- **“配置写在代码里更好找。”** 硬编码的配置意味着每次在不同环境间改一个值，都得重新构建镜像，还可能把不该公开的值提交上去。
- **“应用设置和密钥应该用同样的方式处理。”** 普通配置，比如超时时长，作为普通的应用设置就可以。密钥需要专门处理，另有页面介绍。

## 典型面试题

<details>
<summary>一个应用依赖某个环境变量，本地运行正常，部署后立刻崩溃。你先检查什么？</summary>

检查这个变量是否真的设置在平台的配置里，比如 Azure App Service 的应用设置。本地的 `.env` 文件不会自动带过去。

</details>

<details>
<summary>为什么要把配置放在环境变量里，而不是硬编码在应用中？</summary>

这样同一份代码和镜像就能在每个环境中运行，只有环境变量不同。硬编码的值每次需要修改都得重新构建，还可能把本该按环境区分的内容提交进代码。

</details>

<details>
<summary>本地和云上，配置的来源有什么不同？</summary>

在本地，配置通常来自开发者排除在版本控制之外的 `.env` 文件。在云上，配置来自平台自己的设置，比如 Azure App Service 的应用设置，由平台在启动时以环境变量的形式注入。

</details>

## 延伸阅读

- 文章：[The Twelve-Factor App, part III: Config](https://12factor.net/config)（12factor.net，十二要素第三条：配置）。
- 文章：[Configuring a Linux Python app on Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/configure-language-python)（Microsoft Learn，在 Azure App Service 上配置 Linux Python 应用）。

## 相关页面

- [密钥管理](../04-git-debugging-testing-security/09-secrets-management.md)
- [HTTPS、域名与证书](./07-domains-and-certificates.md)
- [部署环境](./04-environments.md)
- 模块 4 中有更深入的内容：[Secret Management, Environment Variables & Rotation](../../m4/02-authentication-authorization-rbac-and-secrets/03-secret-management-environment-variables-and-rotation.md)（密钥管理、环境变量与轮换）
