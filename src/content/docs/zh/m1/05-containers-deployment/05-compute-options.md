---
title: 计算选项
row: M1-L5.2
---
**一句话：** 计算选项指的是代码在云上实际在哪里、以什么方式运行；主要的选择有 Serverless 函数、虚拟机和托管容器服务，它们在控制力、搭建工作量和成本上各有取舍。

## 是什么

每个应用都得跑在某台计算机上。像 Azure 这样的云厂商提供了好几种租用计算机的方式，而且它们不能互相替代。有的直接给你一台裸机，所有事情都要你自己管；有的几乎替你包办一切，代价是你的控制权更少。

一端是 **虚拟机**：一台由你完全掌控的模拟计算机。你选操作系统，手动安装所有东西，自己负责打补丁。另一端是 **Serverless**：你交出一个函数或容器，平台自动运行和扩缩容，你不需要管理任何服务器。介于两者之间的是 **托管容器服务**：你把应用打包成容器，平台负责运行、重启和扩缩容，你不必碰底层机器。

没有哪种选项在所有情况下都更好。虚拟机给你最多的控制，也要你承担最多的责任；Serverless 在这两方面都最少。怎么选，取决于团队愿意管理多少、流量模式如何，以及应用有多复杂。

## FDE 为什么需要

客户经常想要听起来最强大的方案，比如为一个每天只有十个请求的内部小工具搭一整套 Kubernetes 集群。理解这些取舍的 FDE 可以推荐更简单、更便宜、更好维护的方案。反过来的情况也有：客户把一个高流量服务跑在一台自己手工维护的小虚拟机上，负载一上来就挂了。了解这些选项，FDE 才能做出判断，而不是默认选那个听起来最厉害的。

## 核心概念

### 取舍对比表

| 选项 | 你需要管理 | 扩缩容 | 计费方式 | 适用场景 |
|---|---|---|---|---|
| Serverless 函数 | 只有你的代码 | 自动，可缩到零 | 按执行次数 | 小型、偶发的任务 |
| 虚拟机 | 操作系统及其上的一切 | 手动或脚本化 | 按运行时长，闲置也计费 | 需要完全控制、非常规配置 |
| 托管容器服务 | 你的容器镜像 | 自动，有一定上限 | 按实际运行的资源 | 大多数常见的 Web 应用和 API |
| 容器编排 | 集群配置和镜像 | 高度自动，但复杂 | 按集群节点 | 大规模运行的多个服务 |

### Azure 上对应的各个选项

- **Azure Functions**，Serverless。写一个函数，Azure 自动运行并扩缩容。适合小型、偶发的任务，比如处理一个上传的文件。
- **Azure Virtual Machines**，基础设施即服务（IaaS）。一台完整的虚拟计算机，由你自己配置和维护。适合应用需要托管平台不支持的东西的情况。
- **Azure App Service**，面向 Web 应用的托管平台。交给它代码或容器，它负责服务器、扩缩容和 HTTPS。
- **Azure Container Apps**，Serverless 容器，围绕自动扩缩容（包括缩到零）而设计。
- **Azure Kubernetes Service (AKS)**，完整的容器编排。最强大也最复杂的选项，用于需要协调多个服务协同运行的场景。

### 用决策树代替猜测

Azure 发布了一份计算服务决策树，通过一系列问题引导你，比如应用是否需要完整的操作系统、是否已经容器化，最后指向合适的服务。这比因为听着耳熟就选某个方案要靠谱得多。

## 常见误区

- **“Serverless 就是没有服务器。”** 代码仍然跑在服务器上，只是由云厂商来管理，而不是你。
- **“用容器就必须用 Kubernetes。”** 单个容器在 App Service 这类托管服务上就能跑得很好。Kubernetes 是用来协调大量容器的。
- **“虚拟机已经过时了。”** 当应用需要完全控制，或需要托管平台不支持的东西时，虚拟机仍然是正确选择。
- **“最强大的选项永远最稳妥。”** 能力越强，通常意味着越复杂、越贵。把一个小工具放在 Kubernetes 集群上，往往比放在更简单的服务上更难维护。

## 典型面试题

<details>
<summary>什么时候你会选 Azure Functions 而不是 Azure App Service？</summary>

Functions 适合偶尔运行的小任务，比如处理一个上传的文件。App Service 适合持续运行、承接日常流量的应用，比如 Web API。

</details>

<details>
<summary>Azure App Service 和 AKS 有什么区别？</summary>

App Service 接收你的代码或容器，并替你管理底层服务器。AKS 是完整的编排平台，你要管理一个集群，并在集群上协调各个容器，代价是多得多的搭建工作。

</details>

<details>
<summary>“缩到零”（scale to zero）是什么意思？哪些 Azure 选项支持？</summary>

没有流量时平台停掉所有实例，闲置期间不产生费用。Azure Functions（在其按用量计费的方案下）和 Container Apps 支持这一点；App Service 和虚拟机通常至少保持一个实例在运行。

</details>

<details>
<summary>客户想运行一个完整的操作系统，上面装有只能在该系统上运行的定制软件。哪个选项合适？</summary>

虚拟机。只有它能让你完全控制操作系统以及上面安装的一切。

</details>

<details>
<summary>对一个常见的 Web API，你会如何在托管容器服务和虚拟机之间做选择？</summary>

先看应用实际需要多少控制。如果它只需要运行一个容器，并由平台处理重启、扩缩容和 HTTPS，那么像 App Service 这样的托管容器服务就能做到，而且持续维护的工作量远少于一台需要团队手工打补丁和监控的虚拟机。

</details>

## 延伸阅读

- 文章：[Azure compute decision tree](https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/compute-decision-tree)（Microsoft Learn，Azure 计算服务决策树）。
- 文章：[Azure App Service Python quickstart](https://learn.microsoft.com/en-us/azure/app-service/quickstart-python)（Microsoft Learn，Azure App Service 的 Python 快速入门）。

## 相关页面

- [镜像、容器与镜像仓库](./01-images-containers-registries.md)
- [部署环境](./04-environments.md)
- [部署日志](./08-deployment-logs.md)
