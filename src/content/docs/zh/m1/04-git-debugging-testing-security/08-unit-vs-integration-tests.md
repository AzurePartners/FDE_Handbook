---
title: 单元测试与集成测试
row: M1-L4.3
---
**一句话：** 单元测试单独检查一小段代码；集成测试检查真实的各个部分（比如你的代码和一个真实的数据库）能否真正协同工作。

## 是什么

不是每个测试都该检查同样大的范围。单元测试单独检查一小段代码，通常是一个函数，它所依赖的东西都会被替换成假的或者去掉。集成测试检查两个或更多真实的部分能否协同工作，比如你的代码是否真的按预期在数据库里存下了一行数据。还有第三种粒度，端到端（E2E）测试，它像真实用户一样检查整个系统。

可以拿测试一辆汽车来类比。单元测试是把点火钥匙单独放在工作台上，转一下，检查它是否发出了正确的信号。集成测试是接上电池，真正启动发动机。端到端测试则是开着车绕街区跑一圈。

这几种粒度是在速度、信心和成本之间做取舍。单元测试快而便宜，但发现不了只有真实部件交互时才出现的问题，比如字段名和真实 API 对不上。集成测试和端到端测试能发现这类问题，但运行更慢，维护成本也更高。一个经验法则是测试金字塔：大量单元测试，较少的集成测试，少数几个端到端测试。

## FDE 为什么需要

在客户现场，你很少有时间在每次改动后都手动把应用点一遍。几个单元测试能在几秒内发现逻辑错误。少量集成测试能发现你的代码和真实依赖（比如数据库或 API）对数据结构理解不一致的问题。“我的逻辑是对的”和“我的逻辑在真实依赖上也能跑通”之间的这道缝隙，正是 AI 工具那些看起来很靠谱的代码最先出问题的地方。

## 核心概念

### Mock

mock 是代码所依赖的某个东西的假替身，用在单元测试里，让你不必调用真实的数据库或外部 API 就能测试自己的逻辑。比如 mock 一个汇率 API，你就可以测试代码如何处理汇率为 `108.5` 或汇率缺失的情况，而无需真正发起网络请求。

```python
# unit test with a mock: no real network call happens
def test_converts_currency_with_mocked_rate(mocker):
    mocker.patch("app.services.fetch_exchange_rate", return_value=108.5)
    result = convert_price(100, "USD", "JPY")
    assert result == 10850
```

```python
# integration test: hits the real, running database
def test_saves_order_to_database(db_session):
    save_order(db_session, item="widget", total=10850)
    row = db_session.query(Order).filter_by(item="widget").first()
    assert row is not None
```

第一个测试完全不碰网络，只检查计算是否正确。`mocker` fixture 来自 pytest-mock 插件（`pip install pytest-mock`），而不是 pytest 本身。第二个测试使用一个真实的测试数据库，确认保存操作在存储层确实有效。

## 常见误区

- **“端到端测试越多，信心就越足。”** 单个端到端测试带来的信心确实高，但它们很慢，而且可能因为无关的原因失败（比如网络请求不稳定），时间一长就会削弱大家对整套测试的信任。
- **“用了 mock，测试就不那么可信了。”** mock 去掉了无关的依赖（比如一个线上 API），让单元测试更快。代价是仅靠 mock 无法证明真实的集成能正常工作，而这正是集成测试要做的事。
- **“单元测试都通过了，功能就没问题。”** 单元测试通过，只能证明各个部分在隔离状态下能工作。少了集成测试，字段名不一致这类问题可能一直藏到生产环境才暴露。

## 典型面试题

<details>
<summary>单元测试和集成测试有什么区别？</summary>

单元测试单独检查一小段代码，通常是一个函数，依赖项都被 mock 掉。集成测试检查真实的组件（比如你的代码和一个真实的数据库）能否正确地协同工作。

</details>

<details>
<summary>为什么测试金字塔建议单元测试要比端到端测试多？</summary>

单元测试快、便宜，能精确定位失败；端到端测试慢，而且可能因为与改动无关的原因失败，比如网络不稳定。金字塔的形状能让整套测试保持快速可靠，同时仍然覆盖系统层面的行为。

</details>

<details>
<summary>什么是 mock？什么时候会用它？</summary>

mock 是真实依赖（比如外部 API 或数据库）的假替身，让测试不必真正发起网络请求或写入数据，就能检查你代码的逻辑。在单元测试中用它，把逻辑和那些慢或不可靠的东西隔离开。

</details>

## 延伸阅读

- 文章：[Martin Fowler, The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)（martinfowler.com，测试金字塔实践指南）

## 相关页面

- [测试用例类型](./07-three-kinds-of-test-case.md)
- [集成故障诊断](../03-apis-data-integration/07-diagnosing-integration-failures.md)
