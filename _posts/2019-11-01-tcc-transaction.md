---
layout: post
title: tcc-transaction 1.2.x 源码学习
description: tcc-transaction 是一个有着 4k+ star 的开源的 TCC 型分布式事务解决方案。
---

------

集群、分布式，是当下互联网最基础的两个词。

那如何在集群、分布式下，保证数据库的一致性呢？

目前有三种被广泛认可的解决方案：开发人员无感知的分布式数据库事务服务，例如阿里云的 GTS。开发人员需要手动进行补偿的数据库事务，例如 tcc-transaction。最后是异步消息的方式，例如 RocketMQ。

笔者有长期使用 GTS 的习惯，除了少量不支持的 SQL 语法，GTS 几乎适合所有的业务场景。

但是，这是了解一种分布式事务解决方案，明显不符合一个开发人员的身份。

于是，就有了 [tcc-transaction](https://github.com/changmingxie/tcc-transaction) 源码学习的想法，从源码层面了解 tcc-transaction。

## 核型逻辑

```
Try: 尝试执行业务
  完成所有业务检查（一致性）
  预留必须业务资源（准隔离性）

Confirm: 确认执行业务
  真正执行业务
  不作任何业务检查
  只使用 Try 阶段预留的业务资源
  Confirm 操作满足幂等性

Cancel: 取消执行业务
  释放 Try 阶段预留的业务资源
  Cancel 操作满足幂等性
```

## 源码学习

**tcc-transaction-api** -- 基础定义包

  1. 事务核心注解 Compensable，通用的事务属性定义。例如 confirm、cancel 方法名，异步 confirm、cancel 标记，以及默认提供 TransactionContext 方法。
  2. 事务基本属性 TransactionContext。
  3. 事务通用接口 TransactionContextEditor。
  4. 事务的全局、分支主键 TransactionXid。
  5. 事务属性、传播类型枚举。

**tcc-transaction-core** -- 事务实现核心包

  1. 自定义异常，区分 Confirming、Cancelling 等不同用途。
  2. 事务统一管理 TransactionManager。
  3. 数据源接口 TransactionRepository，提供 Cache 与 File、Jdbc、Redis、Zookeeper 多种不同的接口实现。
  4. 预留 @Aspect 抽象类 CompensableTransactionAspect、ResourceCoordinatorAspect，可以 AOP 方式接入事务 TransactionManager。
  5. 线程安全的 ThreadLocal<Kryo> 序列化、反序列化方法。

**tcc-transaction-server** -- 事务实现服务端

  1. 提供 JDBC、Redis 两种方式用来存储 TCC 数据源。
  2. 提供 HTTP 方式维护 TCC 数据源。
  3. 提供 TransactionDao 通用 TCC 数据接口。

**tcc-transaction-spring** -- Spring 框架集成的服务端

  1. 继承 ResourceCoordinatorAspect、CompensableTransactionAspect 的方式，实现 TransactionConfigurator 的注入。
  2. 增加了 RecoverScheduledJob 定时任务，处理 TCC 数据源中的事务记录。

  RecoverScheduledJob 处理规则
    1. 检测事务重试次数是否超过最大重试次数。
    2. 检测分支事务开始时间+最大重试次数 * 每次恢复时间，是否大于当前时间。
    3. 事务添加 Retried Count。
    4. 事务状态属性 CONFIRMING，更新 TCC 表事务记录，循环提交 Participant 事务，删除 TCC 表事务记录。
    5. 事务状态属性 CANCELLING、ROOT，更新 TCC 表事务记录状态为 CANCELLING，循环回滚 Participant 事务，删除 TCC 表事务记录。

**tcc-transaction-dubbo** -- Dubbo 基本工具包

  1. DubboTransactionContextEditor，通过 RpcContext 来存取 TransactionContext。

## 个人总结

tcc-transaction 的理念为围绕着自定义注解 Compensable，通过反射获取当前方法、参数属性、参数数值，记录到单独的事务缓存或者单独的数据库表中。通过 AOP 的方式监控方法的执行情况，同时更新事务数据记录。最后，通过 Quartz 的方式进行事务的提交与回滚。

总结一下，本次源码学习，还是发现自身很多的不足。很多技术只知道如何使用，却不思考为什么这样用。这或许又是一个自我提升的方向。
