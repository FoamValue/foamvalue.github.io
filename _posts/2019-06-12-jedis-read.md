---
layout: post
title: 阅读 Jedis 源码
description: 一次消灭优越感的阅读尝试
---

这是一次已经「成功」的“突破舒适区”尝试。

围绕实际使用的 Jedis 源码，以纯阅读的模式，分析实现的主干逻辑，并以文字与截图的方式进行记录。

----------

## 目录结构

![](jedis-read/packages.png)

核心代码写在 redis.clients.jedis 目录。

commands、exceptions、params、util包分别存放命令接口、自定义错误、命令参数、工具类。

## Jedis

使用 HostAndPort 进行初始化。

![](jedis-read/jedis-get.png)

使用 *Multi、Pipeline* 的情况下是，不能直接用 Client 方式获取数据的。

checkIsInMultiOrPipeline() 方法提供了统一的校验，满足条件就抛出异常。

### Client 实现

类的顺序：Client -> BinaryClient -> Connection -> Protocol

Client 提供初始化方法

BinaryClient 提供二进制的客户端初始化、命令方法等。

Connection 提供 stock 链接。

Protocol 提供命令输出、接收返回数据。

![](jedis-read/sendCommand.png)

## JedisCluster

使用 Set<HostAndPort> 进行初始化。

![](jedis-read/jedisCluster-get.png)

类顺序：JedisCluster -> BinaryJedisCluster -> JedisClusterCommand -> Jedis ->  BinaryClient -> Connection -> Protocol

![](jedis-read/runWithRetries.png)

*JedisCluster 比 Jedis 多了一层 Node 判断。*

## RedisOutputStream

将命令与参数以 FilterOutputStream 输出流的方式，发给 Redis Server。

## RedisInputStream

读取 Redis Server 的 RESP 流。

## JedisClusterInfoCache

ReentrantReadWriteLock 的方式返回 JedisPool。
