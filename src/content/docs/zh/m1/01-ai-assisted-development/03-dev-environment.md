---
title: 开发环境
row: M1-L1.2
---
**一句话：** 开发环境是代码运行所需的终端、编辑器、项目文件夹、已安装的包和配置。所有 AI 编程工具都在这同一个环境里工作，而不是替代它。

## 是什么

代码在运行之前，需要一个安身之处：一个有结构的文件夹，一份它所依赖的他人代码清单，以及一些在你的笔记本和客户服务器之间会变化的设置。

终端是一个文本窗口，你在里面直接向电脑输入命令。IDE 是专为写代码设计的编辑器，通常内置了终端。项目结构指的是它的文件夹和文件：一个启动应用的入口文件，存放源代码和测试的文件夹，以及顶层的几个配置文件。

依赖是你的项目需要用到的他人代码，列在 `requirements.txt` 这类文件里。虚拟环境是为某个项目单独准备的一份隔离的 Python 及其包，这样同一台机器上不同项目的依赖不会相互冲突。环境变量是存放在代码之外的值，比如 API key，在本地保存在 `.env` 文件中。

## FDE 为什么需要

FDE 通常第一天就被丢进别人的项目，而不是从空文件夹开始。如果你认不出一个典型项目的结构，就找不到该在哪里改。不用虚拟环境、直接全局安装包，可能会悄无声息地弄坏另一个项目。不懂环境变量，就有可能把客户的 API key 硬编码进文件，即使你之后轮换了 key，它也会一直留在 git 历史里。

## 核心概念

### 终端与 IDE

终端用来运行命令：启动服务器、安装包、跑测试。IDE 用来阅读和编辑代码。

### 项目结构

```
myapp/
  app.py              入口文件，启动服务器
  requirements.txt    依赖清单
  .env.example         环境变量模板，可以提交
  .env                 真实的值，绝不提交
  .gitignore           告诉 git 忽略 .env
  src/                 应用代码
  tests/               测试文件
```

### 依赖与虚拟环境

```bash
python -m venv .venv              # 为本项目创建隔离环境
source .venv/bin/activate         # 激活环境（Windows：.venv\Scripts\activate）
pip install -r requirements.txt   # 安装本项目的依赖
```

每个项目都有自己的 `.venv` 文件夹。在其中安装包，不会影响任何其他项目。

### 环境变量与 .env

`.env` 文件存放那些绝不应该直接写进代码的设置：

```
PORT=8000
WEATHER_API_URL=https://api.open-meteo.com/v1/forecast
```

代码在启动时读取这些值：

Python 本身不会读取 `.env`：`os.environ` 里只有 shell 导出的变量，或者 `docker run --env-file .env` 这类工具传进来的变量。在本地，由 `python-dotenv` 包先把文件加载进来：

```python
import os
from dotenv import load_dotenv   # pip install python-dotenv

load_dotenv()                    # 把 .env 中的值复制到 os.environ
port = os.environ.get("PORT", "8000")
```

`.env` 文件写在 `.gitignore` 里，因此永远不会被提交。取而代之提交的是一个填了占位值的 `.env.example`，这样任何克隆项目的人都知道需要配置哪些变量。

## 常见误区

- **“直接全局安装包更简单。”** 只有一个项目时感觉更简单，等到第二个项目需要同一个包的不同版本时，就会出真正的麻烦。
- **“.env 文件提交了也没事，不过是些设置。”** 它们经常存着真实的密钥。从最新版本里删掉，并不能把它们从 git 历史里删掉。
- **“环境变量只有部署后才重要。”** 一个缺失或拼错的环境变量，正是“在我机器上能跑”、换个地方就不行的原因。

## 典型面试题

<details>
<summary>写在 requirements.txt 里的依赖和全局安装的依赖有什么区别？</summary>

`requirements.txt` 里的依赖限定在该项目的虚拟环境内，并且记录了确切版本。全局安装的包会影响机器上的每个项目，可能和其他项目期望的版本悄悄冲突。

</details>

<details>
<summary>为什么要用虚拟环境，而不是把所有东西装到系统里？</summary>

它把每个项目的依赖隔离开，不同项目可以使用同一个包的冲突版本，而且同样的环境可以在别处复现。

</details>

<details>
<summary>什么是环境变量？什么时候应该用它，而不是把值硬编码？</summary>

环境变量是在代码之外提供、启动时读取的值。凡是敏感的、或者在不同环境之间会变化的值，都应该用环境变量，而不是写在源文件里。

</details>

<details>
<summary>一位同事把包含真实 API key 的 .env 文件提交了。接下来应该怎么做？</summary>

立即轮换这个 key，因为任何有仓库访问权限的人都已经看到了它。删除这个文件，并把它加进 `.gitignore`。只修复最新版本是不够的，key 在被推送的那一刻就已经泄露了。

</details>

## 延伸阅读

- 视频：MIT Missing Semester 2026，[Introduction to the Shell](https://missing.csail.mit.edu/2026/course-shell/) 和 [Version Control and Git](https://missing.csail.mit.edu/2026/version-control/)（MIT，Shell 入门与版本控制，自定进度）
- 文章：[The Twelve-Factor App, part III on config](https://12factor.net/config)（十二要素应用第三条：配置，约 10 分钟）

## 相关页面

- [AI 编程工作流](./01-ai-coding-workflow.md)
- [读懂代码](./04-reading-code.md)
- [上下文管理](./05-context-management.md)
- [密钥管理](../04-git-debugging-testing-security/09-secrets-management.md)
- [配置](../05-containers-deployment/06-config-and-env-vars.md)
