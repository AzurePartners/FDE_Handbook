---
title: HTTPS、域名与证书
row: M1-L5.3
---
**一句话：** 应用部署到某处之后，还需要一个人能读懂、DNS 能解析的地址，以及一张证明这个地址确实属于它的证书，这样流量才能通过加密的 HTTPS 传输。

## 是什么

**域名**是服务器数字 IP 地址的一个人类可读的名字，比如 `api.example.com`。**DNS**（域名系统，Domain Name System）负责查询，把名字翻译成计算机要连接的地址。这一步在任何 HTTP 请求发出之前自动完成，所以 DNS 出故障时表现为“完全连不上”，永远不会是某个状态码。

普通的 HTTP 以明文传输所有内容，包括你在表单里输入的密码。任何处在中间的人，比如在同一个公共 Wi-Fi 上，或者控制了某台被攻破的路由器，都能读取甚至篡改这些内容。**HTTPS** 是架在 **TLS**（传输层安全协议，Transport Layer Security）之上的 HTTP：TLS 先加密连接，并在发送任何 HTTP 数据之前核验服务器的身份。核验依靠的是 **TLS 证书**：一个声明“该服务器控制着这个域名”的文件，由 **证书颁发机构**（CA）签名。CA 是受信任的机构，会在签名前核实对方确实控制该域名。浏览器内置了一份受信任 CA 的列表，对这些 CA 签发的证书直接接受，不会弹出警告。

Azure App Service 会给每个应用分配一个默认域名，比如 `client-app.azurewebsites.net`，HTTPS 开箱即用。自定义域名，比如 `app.example.com`，则需要你自己配置 DNS 记录和证书。

## FDE 为什么需要

自定义域名是客户常提的需求，而客户往往没意识到，这需要在域名注册商那里修改 DNS，而 FDE 并没有那里的权限。知道要请客户添加 A 记录或 CNAME 记录，就能把一段让人摸不着头脑的等待变成一张清单。客户也常问“这安全吗”，或者被证书警告吓到；证书过期更是经典的故障：应用明明运行正常，浏览器却拒绝连接。

## 核心概念

### DNS 解析如何工作

```
Browser needs app.example.com
        |
        v
Resolver asks DNS servers, which return the record
        |
        v
Connection opens to that IP address on port 443
        |
        v
TLS handshake, then the HTTP request
```

（流程：浏览器需要访问 `app.example.com` → 解析器向 DNS 服务器查询并拿到记录 → 在 443 端口连接该 IP 地址 → 完成 TLS 握手，然后发送 HTTP 请求。）

查询结果会被缓存一段时间，时长由每条记录上的 TTL（time to live，生存时间）决定。这就是为什么一次 DNS 修改可能需要几分钟到几小时才能对所有人生效。

### 自定义域名所需的 DNS 记录

| 记录 | 指向 | 典型用途 |
|---|---|---|
| A | 一个 IP 地址 | 把域名指向一个固定的服务器地址 |
| CNAME | 另一个域名 | 把域名指向云平台的地址，而该地址可能会变 |

DNS 不允许在顶级（根）域名上使用 CNAME，比如 `example.com`，所以根域名通常需要 A 记录。平台一般还会要求添加一条验证记录，以确认这个映射确实是域名所有者申请的。

### HTTPS 保护什么，不保护什么

| 受保护 | 不受保护 |
|---|---|
| 数据在传输途中无法被读取 | 服务器收到数据后如何处理 |
| 数据在传输途中无法被悄悄篡改 | 网站本身是否值得信任 |
| 服务器的身份会通过证书得到核验 | 应用自身代码里的 bug |

### TLS 1.3 握手的几个步骤

1. 浏览器发起连接，并发送自己那一份密钥材料。
2. 服务器回复它那一份；双方据此推导出相同的加密密钥。
3. 服务器发送自己的证书，此时证书已经用这些密钥加密。
4. 浏览器检查证书是否由受信任的 CA 签名，以及是否覆盖当前域名。
5. 之后的 HTTP 请求和响应都以加密方式传输。

整个过程不到一秒，发生在浏览器 Network 面板里出现任何内容之前。

### 证书与续期

一张证书只覆盖其中列出的域名，并且有到期日。对于 Basic 及以上层级中已验证的自定义域名，App Service 可以免费创建一张 **托管证书**（不支持通配符），只要 DNS 配置保持正确，它就会自动续期。手动管理的证书必须手动续期，否则这个域名的 HTTPS 就会开始失败。

## 常见误区

- **“自定义域名和它的证书会像默认域名一样自动搞定。”** 自定义域名需要先配置 DNS 记录来证明所有权，平台才会把流量路由过去或签发证书。
- **“有小锁图标就说明网站是安全的。”** 它只表示连接已加密、服务器身份已核验。诈骗网站同样可以有小锁。
- **“内部工具用不用 HTTPS 无所谓。”** 不管面向谁，HTTP 流量都是明文传输的。
- **“证书签发之后就再也不用管了。”** 证书会过期。托管证书在 DNS 保持有效时会自动续期；非托管证书则需要手动续期。

## 典型面试题

<details>
<summary>A 记录和 CNAME 记录有什么区别？</summary>

A 记录把域名指向一个数字 IP 地址。CNAME 把域名指向另一个域名；对接云平台时通常用它，因为平台的地址可能会变。

</details>

<details>
<summary>HTTPS 保护什么，不保护什么？</summary>

它保护传输中的数据不被读取或篡改，并核验服务器的身份。它不保护服务器拿到数据之后的事情，也无法说明网站本身是否值得信任。

</details>

<details>
<summary>什么是证书颁发机构？为什么浏览器会自动信任某些证书？</summary>

证书颁发机构是受信任的机构，在为服务器签发证书之前会核实该服务器确实控制着这个域名。浏览器内置了一份受信任机构的列表，所以这些机构签发的证书会被直接接受，不会弹出警告。

</details>

<details>
<summary>TLS 1.3 握手过程中，按顺序会发生什么？</summary>

双方交换密钥材料并推导出共享密钥；服务器发送用这些密钥加密过的证书；浏览器检查签名和域名；之后 HTTP 流量以加密方式传输。

</details>

<details>
<summary>客户的自定义域名突然出现证书警告，可应用本身在正常运行。你会检查什么？</summary>

检查证书是否已过期且没能续期，常见原因是它所依赖的某条 DNS 记录被修改或删除了。托管证书只有在域名仍能正确解析时才会续期。

</details>

## 延伸阅读

- 文章：[Set up an existing custom domain name for your app](https://learn.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-domain)（Microsoft Learn，为应用配置已有的自定义域名）。
- 文章：[Install a TLS/SSL certificate for your app](https://learn.microsoft.com/en-us/azure/app-service/configure-ssl-certificate)（Microsoft Learn，为应用安装 TLS/SSL 证书）。
- 文章：[Transport Layer Security](https://developer.mozilla.org/en-US/docs/Glossary/TLS)（MDN，TLS 术语解释）。

## 相关页面

- [IP 地址与端口](../02-how-web-apps-run/02-dns-ip-ports.md)
- [完整的请求生命周期](../02-how-web-apps-run/11-full-request-lifecycle.md)
- [API 认证](../03-apis-data-integration/02-auth.md)
- [配置](./06-config-and-env-vars.md)
