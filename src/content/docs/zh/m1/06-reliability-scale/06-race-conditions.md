---
title: 竞态条件
row: M1-L6.3
---
**一句话：** 当两件事几乎同时读取并修改同一份数据，而它们碰巧完成的先后顺序会改变最终结果时，就出现了竞态条件。

## 是什么

并发是指多个操作在差不多同一时间发生，一个应用只要有不止一个用户，这就是常态。它变成 bug 的情形是：两个操作都读取了同一份数据，都根据读到的内容算出一个新值，然后都写回去，结果一个写入悄悄覆盖了另一个。

经典的例子是两个浏览器标签页。用户在标签页 A 和标签页 B 中打开了同一条记录。在 A 中，他把状态改成了“Approved”。在 B 中，他没有刷新，修改了备注然后点击保存。如果 B 按照它之前加载的内容保存整条记录，就会用旧状态覆盖 A 的“Approved”，尽管 B 的用户根本没碰过这个字段。这叫丢失更新（lost update）。与之相关的另一个问题是过期状态（stale state）：页面或缓存值显示的是旧数据，因为没有任何东西通知它数据已经变了。

## FDE 为什么需要

客户的系统几乎总有多个用户在操作共享数据：两个客服处理同一张工单，一个人和一个自动任务编辑同一行数据。一个由一个人独自开发和测试的系统会把这个 bug 藏起来，直到真实使用开始，它才以“我的修改不见了”这类难以复现的投诉冒出来。掌握标准的解决办法，能把会排查“这数据有时候不对”的人，和只会多加日志的人区分开。

## 核心概念

```
标签页 A 加载：{status: "Pending", notes: "call back Tuesday"}
标签页 B 加载：{status: "Pending", notes: "call back Tuesday"}
标签页 A 把 status 改为 "Approved"，并保存整条记录。
标签页 B 把 notes 改为 "left voicemail" 并保存，手里拿的
    仍是它当初加载的旧 status。
结果：status 变回 "Pending"。标签页 A 的审批丢失了。
```

**唯一约束**从根本上阻止两条冲突的行同时存在，例如每个 `(user_id, date)` 只允许插入一次。第二次插入会明确报错，而不是悄悄插入重复数据。

**原子更新**让数据库自己一步完成计算，而不是在应用里先读后写：

```sql
-- Race-prone: read, then write
UPDATE accounts SET credits = 11 WHERE id = 5;  -- app computed 10 + 1

-- Atomic: the database does the increment
UPDATE accounts SET credits = credits + 1 WHERE id = 5;
```

**用版本列实现乐观锁**：给每一行加一个 `version` 编号。更新时必须带上它读到的版本号；如果另一个更新已经改过这一行，这次写入就会被拒绝，应用可以重新加载后再试。

```sql
UPDATE records SET notes = 'left voicemail', version = version + 1
WHERE id = 42 AND version = 3;
-- if version is already 4, this affects 0 rows: reload and retry
```

**锁**让第二个操作一直等到第一个操作释放为止。乐观锁通常更适合常见的 Web 编辑场景；真正的锁适合短时间、高争用的操作，比如库存计数。

## 常见误区

- **“这只会发生在复杂的分布式系统里。”** 只要两个人能编辑同一行，在一个普通的单体数据库里就会发生。
- **“保存前刷新一下就能解决。”** 这只是缩小了时间窗口，并没有消除它；在这期间别的用户仍然可能保存。
- **“锁永远是正确的解法。”** 锁会带来等待，持有太久还会引发它自己的问题。大多数 Web 应用场景用乐观锁或原子更新就能解决，没有这些代价。

## 典型面试题

<details>
<summary>解释一下“两个浏览器标签页”问题，以及它为什么会发生。</summary>

两个标签页加载了同一条记录。在其中一个标签页编辑并保存，记录就改变了。如果另一个标签页之后基于它较旧的副本保存整条记录，就会覆盖第一个标签页的修改，连它从未碰过的字段也一并覆盖，因为第二次保存无从知道数据已经变了。

</details>

<details>
<summary>什么是乐观锁？版本列是如何实现它的？</summary>

它假定冲突很少见，不预先加锁，只在保存时检查冲突。每次成功更新，版本号都会递增。保存时必须带上它读到的版本号；如果版本号已经对不上，写入就会被拒绝，应用重新加载后再试。

</details>

<details>
<summary>为什么在并发下“读取、在应用里修改、再写回”有风险？</summary>

两个操作可能在任何一方写回之前都读到了同一个初始值，于是最后写入的那个会悄悄丢弃另一个的修改。原子更新让数据库一步完成修改，可以避免这个问题。

</details>

## 延伸阅读

- 文章：[Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html)（PostgreSQL 官方文档，显式锁）。
- 文章：[Preventing Race Conditions with Locks, Atomic Updates, and Idempotency](https://oatllo.com/preventing-race-conditions-web-app)（oatllo，用锁、原子更新和幂等性防止竞态条件）。
- 文章：[Idempotency](https://algomaster.io/learn/system-design/idempotency)（AlgoMaster，讲解幂等性，约 15 分钟）。

## 相关页面

- [幂等性](./05-idempotency.md)
- [关系模型](../03-apis-data-integration/09-relational-model.md)
- [缓存](./08-caching.md)
