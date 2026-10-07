---
title: 镜像、容器与镜像仓库
row: M1-L5.1
---
**一句话：** Docker 把应用连同它需要的语言版本、库和操作系统文件一起打包成一个整体，这个整体在任何机器上都以同样的方式运行。

## 是什么

一位开发者在自己的笔记本上用 Python 3.12 和一组特定的库写了一个应用，交给客户。客户的服务器跑的是 Python 3.9，还少了一个库。应用跑不起来，不是代码写错了，而是两台机器的环境不一样。这就是常说的“在我机器上能跑”问题。

这里有两个关键词。**镜像**（image）是保存在磁盘上的应用“冻结版”：代码、依赖和启动指令都在里面。**容器**（container）是镜像的一个运行实例，就像正在运行的程序是磁盘上某个文件的实例一样。一个镜像可以启动出很多个容器。

容器不是虚拟机。虚拟机模拟一整台计算机，包括它自己的内核，所以体积大、启动慢。容器共享宿主机的内核，只打包应用这一层，因此不到一秒就能启动。

**镜像仓库**（registry）用来存储和分发镜像，就像 GitHub 存放代码。Docker Hub 是最常用的公共镜像仓库；各家云厂商也有自己的，比如 Azure Container Registry。团队只需构建一次镜像，推送（push）上去，然后在需要运行的地方拉取（pull）下来。

## FDE 为什么需要

FDE 经常先在本地做出东西，再放到客户的基础设施里运行，而这些基础设施并不完全由 FDE 掌控。客户说“演示时好好的，到我们服务器上就不行了”，第一个要问的就是两边环境到底是否一致。容器消除了这个变量：同一个容器在两边的行为完全相同；把构建好的镜像推到镜像仓库，就能保证客户运行的正是测试过的那一份。

## 核心概念

### Dockerfile

Dockerfile 是一个文本文件，按步骤写明如何构建镜像。它的语法不需要死记。下面是一个 Python FastAPI 应用的例子：

```dockerfile
# 基础镜像。
FROM python:3.12-slim
# 工作目录。
WORKDIR /app
# 先安装依赖，这样只改代码时可以复用这一步。
COPY requirements.txt .
RUN pip install -r requirements.txt
# 再把其余代码复制进来。
COPY . .
# 声明应用监听的端口。
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

`docker build` 把 Dockerfile 构建成镜像，`docker run` 从这个镜像启动一个容器。

### 镜像与容器的区别

| | 镜像 | 容器 |
|---|---|---|
| 是什么 | 保存在磁盘上的模板 | 镜像的一个运行实例 |
| 数量 | 一个 | 同一个镜像可以启动多个 |
| 运行时是否会变化 | 从不 | 会，直到容器被删除 |

### 镜像仓库与 Docker Compose

镜像仓库是构建好的镜像的存放地，其他机器可以从这里拉取。真实的应用往往不止一个容器，比如一个 Web 应用加一个数据库。Docker Compose 用一个文件描述多个容器，并通过 `docker compose up` 一起启动。

## 常见误区

- **“容器就是轻量级虚拟机。”** 容器共享宿主机的内核；虚拟机运行自己完整的内核。所以容器启动更快，占用资源更少。
- **“镜像和容器是一回事。”** 镜像是磁盘上保存的模板，容器是它的运行实例。
- **“必须把 Dockerfile 语法背下来。”** 大多数工程工作中，能读懂、能审查 Dockerfile 就够了。

## 典型面试题

<details>
<summary>镜像和容器有什么区别？</summary>

镜像是保存在磁盘上、已经“冻结”的应用包。容器是从镜像创建出来的运行实例，同一个镜像可以同时运行多个容器。

</details>

<details>
<summary>为什么用 Docker，而不是在 README 里写安装步骤？</summary>

步骤可能被跳过、执行顺序可能出错，也可能在一个略有不同的基础系统上执行，最后各处环境对不上。镜像则直接把确切的环境打包好了。

</details>

<details>
<summary>为什么要把镜像推到镜像仓库，而不是只分享 Dockerfile？</summary>

只分享 Dockerfile，意味着每个环境都要重新构建镜像，时间一长结果就可能不一致。推送构建好的镜像，能保证所有人运行的是完全相同的东西。

</details>

## 延伸阅读

- 视频：[Docker in 100 Seconds](https://www.youtube.com/watch?v=Gjnup-PuquQ)（Fireship，2 分钟，100 秒看懂 Docker）。
- 文章：[Docker Get Started](https://docs.docker.com/get-started/)（Docker 官方入门教程，2 到 3 小时）。
- 文章：[Docker for Beginners: images, containers, ports, and volumes explained](https://dev.to/chetancodelrca/docker-for-beginners-images-containers-ports-and-volumes-explained-ee6)（DEV，面向新手讲解镜像、容器、端口和卷）。
- 互动练习：[Docker playground](https://labs.iximiuz.com/playgrounds/docker)（iximiuz Labs，在浏览器中直接动手练习）。

## 相关页面

- [端口映射](./03-port-mapping.md)
- [卷与持久化](./02-volumes-and-persistence.md)
- [部署环境](./04-environments.md)
- [计算选项](./05-compute-options.md)
