---
layout: post
title: 一个秒杀 Demo 的探讨
description: 优秀巴东，推了个秒杀案例。嗯，盘他。
---

**Demo 地址：** https://github.com/lsfire/redisframework.git

两天前，优秀巴东推了一个优秀的 GitHub。clone 下来，看了两遍之后，有点檬。

可能，最近没有好好看代码的原因。所以，记录了一下“盘”的过程。

## readme

“a demo that shows how to implement a 'second kill' using redis distributed lock.”

没错，是基于 redis 实现的分布式锁。

工程运行的话，需要一个 127.0.0.1 的本地 redis 服务。

## project explorer

从工程目录看来，是一个基于 Maven 构建的。

很清晰的结构。特别贴心的 Junit。

![](seckill/explorer.png)

## SecKillTest

Junit 主类。简单来说，提供一个多线程的模拟并发功能。初始配置是 1000 个线程同时启动。

考虑到便利一些，改成20个线程一起跑。

![](seckill/thread-20.png)

**threadCount** 总线程数。模拟 20 个用户同时点击。

**splitPoint** 每个商品启动 10 个线程。

## SeckillInterface

提供 @CacheLock 的扣减数量方法。

## SecKillImpl

实现了 SeckillInterface 接口，定义商品 10000001L， 10000002L 各 1000 件。

并提供扣减数量方法。

![](seckill/secKillImpl.png)

## 运行结果

84 次 “setnx key”

20 次 “setnx key”

每件商品 9990，这是正确的数量。

20 个线程同时启动，到最终“秒杀” 20 件商品，总共耗时** 92 毫秒**。

![](seckill/run-20.png)

## Proxy.newProxyInstance

线程中，采用动态代理实现商品扣减的动作。

![](seckill/secKillTest.png)

## CacheLockInterceptor

过滤非自定义类，获取加锁商品。

调用 RedisLock 方法，锁定解锁商品。

![](seckill/cacheLockInterceptor-invoke.png)

通过 getLockedObject 方法获取锁定对象。

![](seckill/cacheLockInterceptor.png)

## RedisLock

一个循环锁定，成功即结束，失败短暂 sleep 后重试。

![](seckill/redisLock.png)

## 1000 并发

结果统计：
10000001L， 10000002L 各剩下 9500
耗时 12.697 秒

## End.

简单的盘了一下，基本逻辑比较清晰了。但还是有些设计理念没有看明白，比如为什么要使用动态代理。

从 Demo 的角度来看，这是一个高分 Demo。可以略微改动之后，运用到生产环境。

最后，还是要多学习优秀的代码。
