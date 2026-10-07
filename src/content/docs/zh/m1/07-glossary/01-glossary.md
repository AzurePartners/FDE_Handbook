---
title: 术语表
---
**一句话：** 模块 1 中所用术语的简短释义，每条都链接到详细讲解它的页面。

## A 到 C

- **API (Application Programming Interface，应用程序编程接口)：** 一个程序向另一个程序请求数据或操作的既定方式。参见 [REST 设计约定](../03-apis-data-integration/01-rest-conventions.md)。
- **API key（API 密钥）：** 客户端发送的一串密钥字符串，用来证明是哪个账号在调用 API。参见 [API 认证](../03-apis-data-integration/02-auth.md)。
- **Async (asynchronous，异步)：** 在后台运行的工作，调用方不必等它完成。参见 [同步与异步](../06-reliability-scale/01-sync-vs-async.md)。
- **Authentication vs. authorization（认证与授权）：** 认证确认你是谁；授权确认你被允许做什么。参见 [API 认证](../03-apis-data-integration/02-auth.md)。
- **Backoff（退避）：** 每次重试之间等待得越来越久，让吃力的服务有机会恢复。参见 [重试与退避](../06-reliability-scale/03-retries-and-backoff.md)。
- **Bearer token（Bearer token）：** 放在 `Authorization` 请求头中发送的 token；谁持有它，谁就被视为已登录的调用方。参见 [API 认证](../03-apis-data-integration/02-auth.md)。
- **Branch（分支）：** Git 中一条独立的工作线，之后可以合并回去。参见 [分支与合并](../04-git-debugging-testing-security/02-branches-and-merging.md)。
- **Cache（缓存）：** 存放在离使用处更近的数据快速副本，这样就不必重新获取或重新计算。参见 [缓存](../06-reliability-scale/08-caching.md)。
- **Certificate (TLS)（TLS 证书）：** 由证书颁发机构签发、证明服务器拥有某个域名的文件。参见 [HTTPS、域名与证书](../05-containers-deployment/07-domains-and-certificates.md)。
- **CLI (Command-Line Interface，命令行界面)：** 在终端里输入命令来使用的工具。参见 [AI 编程工具](../01-ai-assisted-development/02-tool-forms.md)。
- **Client / server（客户端 / 服务器）：** 客户端提出请求，服务器做出应答。参见 [客户端-服务器模型](../02-how-web-apps-run/01-client-server-model.md)。
- **Commit（提交）：** Git 中保存的一份改动快照，附带说明改动原因的提交信息。参见 [Git 心智模型](../04-git-debugging-testing-security/01-git-mental-model.md)。
- **Connection pool（连接池）：** 一组保持打开的数据库连接，请求复用它们，而不是每次新建连接。参见 [连接上限与连接池](../06-reliability-scale/07-connection-limits-and-pooling.md)。
- **Container（容器）：** 镜像的一个正在运行的隔离副本，拥有自己的文件系统和进程。参见 [镜像、容器与镜像仓库](../05-containers-deployment/01-images-containers-registries.md)。
- **Context window（上下文窗口）：** AI 模型一次能看到的文本；窗口之外的内容，模型一概不知。参见 [上下文管理](../01-ai-assisted-development/05-context-management.md)。
- **Cookie（cookie）：** 服务器让浏览器保存的一小段数据，浏览器会在之后的请求中把它发回去。参见 [API 认证](../03-apis-data-integration/02-auth.md)。
- **CSV（逗号分隔值）：** 一种纯文本表格格式，每行是一条记录，列之间用逗号分隔。参见 [CSV 与表格](../03-apis-data-integration/08-csv-and-tables.md)。

## D 到 H

- **Data contract（数据契约）：** 系统之间关于字段名、类型、单位和含义的约定。参见 [Schema 与数据契约](../03-apis-data-integration/10-schema-and-data-contracts.md)。
- **Dependency（依赖）：** 项目所用的外部代码，比如一个 Python 包。参见 [依赖风险](../04-git-debugging-testing-security/12-dependency-risk.md)。
- **Diff（差异）：** 两个版本代码之间逐行的差别。参见 [Diff 与撤销提交](../04-git-debugging-testing-security/03-diff-and-revert.md)。
- **DNS (Domain Name System，域名系统)：** 把 `example.com` 这类名字转换成 IP 地址的系统。参见 [HTTPS、域名与证书](../05-containers-deployment/07-domains-and-certificates.md)。
- **Docker（Docker）：** 构建镜像、运行容器最常用的工具。参见 [镜像、容器与镜像仓库](../05-containers-deployment/01-images-containers-registries.md)。
- **Edge case（边界情况）：** 处于代码预期边界上、少见但合法的输入，比如带重音符号的名字。本应被拒绝的输入，比如必填字段为空，属于失败情况。参见 [测试用例类型](../04-git-debugging-testing-security/07-three-kinds-of-test-case.md)。
- **Environment (local, staging, production)（环境：本地、预发布、生产）：** 同一系统的几份独立副本，分别用于开发、测试和真实使用。参见 [部署环境](../05-containers-deployment/04-environments.md)。
- **Environment variable（环境变量）：** 从代码外部传给程序的设置，常用于配置和密钥。参见 [配置](../05-containers-deployment/06-config-and-env-vars.md)。
- **Foreign key（外键）：** 指向另一张表中某一行主键的列。参见 [关系模型](../03-apis-data-integration/09-relational-model.md)。
- **Frontend / backend（前端 / 后端）：** 前端运行在用户的浏览器里；后端运行在服务器上。参见 [Web 应用的分层](../02-how-web-apps-run/10-frontend-backend-database-layers.md)。
- **Horizontal scaling（水平扩展）：** 通过增加服务器数量来承接更多负载，而不是换一台更大的服务器。参见 [负载均衡与水平扩展](../06-reliability-scale/09-load-balancing-and-horizontal-scaling.md)。
- **HTTP（超文本传输协议）：** 浏览器和服务器之间收发请求与响应所用的协议。参见 [HTTP 请求与响应](../02-how-web-apps-run/04-http-request-response.md)。
- **HTTP method（HTTP 方法）：** 请求的动词，比如 GET、POST、PUT、PATCH 或 DELETE。参见 [HTTP 方法](../02-how-web-apps-run/05-http-methods.md)。
- **HTTPS（安全超文本传输协议）：** 通过加密的 TLS 连接发送的 HTTP。参见 [HTTPS、域名与证书](../05-containers-deployment/07-domains-and-certificates.md)。

## I 到 P

- **Idempotency（幂等性）：** 同一个操作执行两次，效果与执行一次相同。参见 [幂等性](../06-reliability-scale/05-idempotency.md)。
- **IDE (Integrated Development Environment，集成开发环境)：** 内置了编写、运行和调试代码等工具的编辑器，比如 VS Code。参见 [AI 编程工具](../01-ai-assisted-development/02-tool-forms.md)。
- **Image（镜像）：** 一个打包好的只读模板，包含应用及其运行所需的一切。参见 [镜像、容器与镜像仓库](../05-containers-deployment/01-images-containers-registries.md)。
- **Input validation（输入校验）：** 在使用传入的数据之前，检查它的结构和取值是否符合预期。参见 [输入校验](../04-git-debugging-testing-security/10-input-validation.md)。
- **Integration test（集成测试）：** 检查多个部分协同工作的测试，比如代码加数据库。参见 [单元测试与集成测试](../04-git-debugging-testing-security/08-unit-vs-integration-tests.md)。
- **IP address（IP 地址）：** 网络中一台机器的数字地址。参见 [IP 地址与端口](../02-how-web-apps-run/02-dns-ip-ports.md)。
- **JOIN（连接查询）：** 通过共同的键把两张表中的行组合起来的 SQL 操作。参见 [SQL 基础](../03-apis-data-integration/11-sql-basics.md)。
- **JSON（JSON）：** 一种结构化数据的文本格式，由对象、数组、字符串、数字、布尔值和 null 组成。参见 [JSON](../02-how-web-apps-run/07-json.md)。
- **JWT (JSON Web Token，JSON Web 令牌)：** 一种带签名的 token，携带关于用户的声明，常用来代替会话 cookie。参见 [API 认证](../03-apis-data-integration/02-auth.md)。
- **Least privilege（最小权限）：** 只给每个人或程序它所需要的访问权限，多一分都不给。参见 [最小权限](../04-git-debugging-testing-security/11-least-privilege.md)。
- **Load balancer（负载均衡器）：** 把传入的请求分摊到多台服务器上的组件。参见 [负载均衡与水平扩展](../06-reliability-scale/09-load-balancing-and-horizontal-scaling.md)。
- **Log（日志）：** 带时间戳的程序运行记录，用来查明哪里出了问题。参见 [日志与堆栈跟踪](../04-git-debugging-testing-security/05-logs-and-stack-traces.md) 和 [部署日志](../05-containers-deployment/08-deployment-logs.md)。
- **Merge conflict（合并冲突）：** 两个分支改动了相同的行，Git 需要由人来决定保留哪一边。参见 [分支与合并](../04-git-debugging-testing-security/02-branches-and-merging.md)。
- **Mock（模拟对象）：** 测试中用来替代真实依赖的假对象。参见 [单元测试与集成测试](../04-git-debugging-testing-security/08-unit-vs-integration-tests.md)。
- **Normalization（规范化）：** 设计数据库结构，让每个事实只存储一次；也指把来自多个来源的数据转换成统一格式。参见 [数据规范化](../03-apis-data-integration/12-data-normalization.md)。
- **OAuth（OAuth 授权协议）：** 一种标准，让用户无需交出密码，就能授予某个应用对其账号的有限访问权限。参见 [API 认证](../03-apis-data-integration/02-auth.md)。
- **Polling（轮询）：** 按固定时间间隔向另一个系统查询是否有更新。参见 [Webhook 与轮询](../03-apis-data-integration/05-webhook-vs-polling.md)。
- **Port（端口）：** 一个数字，用来标识机器上由哪个程序接收网络流量。参见 [IP 地址与端口](../02-how-web-apps-run/02-dns-ip-ports.md)。
- **Port mapping（端口映射）：** 把宿主机上的端口连接到容器内的端口，比如 `-p 8000:80`。参见 [端口映射](../05-containers-deployment/03-port-mapping.md)。
- **Primary key（主键）：** 其值能唯一标识表中每一行的列。参见 [关系模型](../03-apis-data-integration/09-relational-model.md)。
- **Process（进程）：** 正在运行的程序；服务是一种持续运行并等待请求的进程。参见 [进程与服务](../02-how-web-apps-run/03-processes-and-services.md)。
- **Pull request (PR)（拉取请求）：** 一份合并某个分支的提议，合并前先由其他人审查改动。参见 [Pull Request 工作流](../04-git-debugging-testing-security/04-pull-request-workflow.md)。

## Q 到 Z

- **Queue（队列）：** 一列等待 worker 处理的任务。参见 [队列与 worker](../06-reliability-scale/02-queues-and-workers.md)。
- **Race condition（竞态条件）：** 一种 bug，结果取决于两个同时发生的操作谁先完成。参见 [竞态条件](../06-reliability-scale/06-race-conditions.md)。
- **Rate limit（限流）：** 客户端在一个时间窗口内可发送请求数的上限，超出时通常返回 `429`。参见 [限流](../03-apis-data-integration/04-rate-limits.md)。
- **Registry（镜像仓库）：** 存储并分发容器镜像的地方，比如 Docker Hub 或 Azure Container Registry。参见 [镜像、容器与镜像仓库](../05-containers-deployment/01-images-containers-registries.md)。
- **REST（REST 架构风格）：** 一种常见的 Web API 风格，围绕资源、URL 和 HTTP 方法构建。参见 [REST 设计约定](../03-apis-data-integration/01-rest-conventions.md)。
- **Retry（重试）：** 再次尝试一个失败的操作，最好配合退避，并且只针对可能是暂时性的错误。参见 [重试与退避](../06-reliability-scale/03-retries-and-backoff.md)。
- **Revert（撤销提交）：** 通过新增一个反向提交来撤销某次提交。参见 [Diff 与撤销提交](../04-git-debugging-testing-security/03-diff-and-revert.md)。
- **Schema（数据结构定义）：** 数据的既定结构：字段、类型和规则。参见 [Schema 与数据契约](../03-apis-data-integration/10-schema-and-data-contracts.md)。
- **Secret（密钥）：** 能授予访问权限的密码、key 或 token，绝不能提交到代码里。参见 [密钥管理](../04-git-debugging-testing-security/09-secrets-management.md)。
- **Serverless（无服务器）：** 无需管理服务器即可运行代码；由平台按需启动。参见 [计算选项](../05-containers-deployment/05-compute-options.md)。
- **Session（会话）：** 服务器借助 cookie 或 token，在多次请求之间记住某个用户的方式。参见 [API 认证](../03-apis-data-integration/02-auth.md)。
- **SQL（结构化查询语言）：** 用来查询和修改关系型数据库中数据的语言。参见 [SQL 基础](../03-apis-data-integration/11-sql-basics.md)。
- **Stack trace（堆栈跟踪）：** 出错时正在执行的函数调用列表。参见 [日志与堆栈跟踪](../04-git-debugging-testing-security/05-logs-and-stack-traces.md)。
- **Staging area（暂存区）：** Git 中在提交之前收集改动的区域。参见 [Git 心智模型](../04-git-debugging-testing-security/01-git-mental-model.md)。
- **Stateless（无状态）：** 服务器在请求之间不保留任何东西；每个请求自带所需的一切。参见 [API 认证](../03-apis-data-integration/02-auth.md)。
- **Status code（状态码）：** HTTP 响应中的三位数字，表示请求的处理结果。参见 [状态码](../02-how-web-apps-run/06-status-codes.md)。
- **Timeout（超时）：** 程序在放弃之前等待响应的最长时间。参见 [超时](../06-reliability-scale/04-timeouts.md)。
- **TLS（传输层安全协议）：** HTTPS 背后的加密协议。参见 [HTTPS、域名与证书](../05-containers-deployment/07-domains-and-certificates.md)。
- **Unit test（单元测试）：** 单独检查一小段代码的测试。参见 [单元测试与集成测试](../04-git-debugging-testing-security/08-unit-vs-integration-tests.md)。
- **VM (Virtual Machine，虚拟机)：** 用软件模拟的计算机，有自己的操作系统，通常向云服务商租用。参见 [计算选项](../05-containers-deployment/05-compute-options.md)。
- **Volume（卷）：** 挂载到容器上的存储，容器被删除或替换后数据依然保留。参见 [卷与持久化](../05-containers-deployment/02-volumes-and-persistence.md)。
- **Webhook（Webhook 回调）：** 某件事发生时，另一个系统向你发起的 HTTP 调用。参见 [Webhook 与轮询](../03-apis-data-integration/05-webhook-vs-polling.md)。
- **Worker（工作进程）：** 从队列中取出任务并执行的进程。参见 [队列与 worker](../06-reliability-scale/02-queues-and-workers.md)。
- **Working tree（工作区）：** 项目文件夹中文件当前的样子，包括尚未暂存的改动。参见 [Git 心智模型](../04-git-debugging-testing-security/01-git-mental-model.md)。
