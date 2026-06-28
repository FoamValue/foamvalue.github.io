---
layout: post
title: Jedis 源码学习(多图版)
description: 上回通过源码阅读，基本熟悉了整体架构。其中有简单易理解的内容，当然最重要的是复杂难以理解的部分，需要重点关照学习。
---

## 前言

Jedis连接Redis Server分为四种方式：Jedis、ShardedJedis、JedisSentinelPool和JedisCluster，分别对应Redis Server的四种工作模式：单机、分片、哨兵和集群。

简单说明下Redis Server的工作模式。
```
1. 单机模式，所有数据都存储在一台服务器。
2. 主从模式，单机模式的基础上增加了一台只读服务器，分摊读取压力或备份数据。
3. 分片模式，单机模式无法承受所有数据的情况下，通过哈希算法将数据平分出去。
4. 哨兵模式，当master发生宕机、slave又不允许写入的情况下。哨兵会重新选举一个master以保证服务。
5. 集群模式，无中心的分布式服务，最小为3台master、3台slave组成。
```
从Redis Server的工作模式来看，使用频繁的模式是单机、集群两种。单机模式是支持开发本地调试运行，集群模式适用于测试生产环境。剩余的三种模式，基本6台Docker服务器就可以搭建一个简单集群。

## Jedis 单机

单机模式的Jedis继承类BinaryJedis实现所有的Command接口。当new Jedis()对象的时候，直接调用父类BinaryJedis来实现连接Redis Server的。Jedis的实际作用只有使用Client来实现这些Command接口的方法。（PS. 不只是单机可以用Jedis，主从、分片、哨兵跟集群同样可以使用Jedis，只要提供地址、端口）

### BinaryJedis

封装Client、Transaction、Pipeline的方式来实现访问Redis Server。
![](jedis-study/BinaryJedis.jpg)

## ShardedJedis 分片

初始化ShardedJedisPool连接池后获取ShardedJedis对象。依靠Jedis对象完成对数据的操作。

![](jedis-study/ShardedJedis.jpg)

## JedisSentinelPool 哨兵

初始化JedisSentinelPool连接池后通过getResource()方法获取Jedis对象。

### MasterListener

JedisSentinelPool对应的是Redis Server的哨兵模式，所以MasterListener实现了连接池中的定时监听功能。

![](jedis-study/MasterListener.jpg)

## JedisCluster 集群

集群模式的JedisCluster相对Jedis就简单很多。只需要继承BinaryJedisCluster实现JedisClusterCommands、MultiKeyJedisClusterCommands、JedisClusterScriptingCommands三个命令接口。

### BinaryJedisCluster
封装JedisClusterConnectionHandler实现获取Jedis的方法，最终通过Jedis访问Rediscover Server。

![](jedis-study/JedisClusterConnectionHandler.jpg)

***以上的四种工作方式，最终还是以Jedis类来实现与Redis Server进行数据交互。其中Jedis提供了三种数据交互方式：Client、Pipeline、Transaction。***

## Client 请求

提供了最外层的封装，通过继承BinaryClient实现Commands接口方法。

### Connection

BinaryClient通过继承Connection类，实现了Socket长链接、通过Protocol.sendCommand提供底层方法。pipelined
![](jedis-study/Connection.jpg)

### Protocol

实现了Redis Server发送命令与参数。

![](jedis-study/sendCommand.jpg)

## Pipeline 请求

高性能的请求方式，一次记录多个Redis Server命令。一次性发送，通过减少网络的往返时间和IO的读写次数，大幅度提高通信性能，但Pipeline不支持原子性，如果想保证原子性，可同时开启事务模式。

![](jedis-study/pipelined.jpg)

## Transaction 请求

Transaction is nearly identical to Pipeline, only differences are the multi/discard behaviors

![](jedis-study/Transaction.jpg)

## 总结

其实Pipeline、Transaction高效的请求方式并没有运用。还是以Jedis、JedisCluster、Client的运用为主。

基本来说，2000并发操作JedisCluster是完全没有压力的。
