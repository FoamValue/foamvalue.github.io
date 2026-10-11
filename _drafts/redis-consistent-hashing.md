---
layout: post
title: Redis 一致性哈希与 Hash 环——分布式缓存的核心原理
tags:
  - Redis
  - 一致性哈希
  - Hash 环
  - 分布式
categories: 分布式
description: 用大白话解释一致性哈希的原理，配合完整的 Java 代码实现，让你彻底搞懂分布式缓存的数据路由。
cover_image: /assets/images/posts/redis/consistent-hashing-cover.jpg
---

## 先说问题：为什么需要一致性哈希

假设你有一个 Redis 集群，3 台机器。你要存一个 key，该存到哪台机器上？

最朴素的做法是**取模**：

```java
int index = hash(key) % 3;  // 结果 0、1、2，对应三台机器
```

这看起来没问题。但如果集群从 3 台变成 4 台呢？

```java
int index = hash(key) % 4;  // 结果 0、1、2、3
```

**几乎所有 key 的路由都变了。** 原来存在机器 2 上的数据，现在可能路由到机器 0。缓存全部失效，大量请求打到数据库——这就是著名的**缓存雪崩**。

一致性哈希就是为了解决这个问题：**节点变化时，只影响一小部分数据，而不是全部。**

## 一致性哈希的核心思路

一致性哈希把整个哈希空间想象成一个**首尾相连的圆环**——这就是 Hash 环。

![Hash 环示意](/assets/images/posts/redis/hash-ring.svg)

### 第一步：把哈希空间变成环

取一个哈希函数（比如 MD5），输出范围是 `0 ~ 2^32 - 1`。把这个范围首尾相接，形成一个环。

### 第二步：把节点放到环上

对每台机器的 IP 地址做哈希，得到一个值，把这个值放到环上对应的位置。

```
机器 A: hash("192.168.1.1") = 0x3A2F → 放在环的 0x3A2F 位置
机器 B: hash("192.168.1.2") = 0x7B1C → 放在环的 0x7B1C 位置
机器 C: hash("192.168.1.3") = 0xB04E → 放在环的 0xB04E 位置
```

### 第三步：把数据也放到环上

对数据的 key 做哈希，也得到一个值，放到环上。

### 第四步：顺时针找最近的节点

从数据的位置出发，**顺时针**沿着环走，遇到的第一个节点就是这台数据该去的机器。

```
key "user:100" → hash = 0x5000 → 顺时针走 → 第一个节点是 B → 存到机器 B
key "order:200" → hash = 0x9000 → 顺时针走 → 第一个节点是 C → 存到机器 C
key "product:300" → hash = 0xC000 → 顺时针走 → 绕回 A → 存到机器 A
```

## 为什么这样能解决节点变化问题

### 新增节点

假设新增机器 D，hash 值落在 B 和 C 之间。

```
之前：B 和 C 之间的数据都归 C 管
之后：B 和 D 之间的数据归 D 管，D 和 C 之间的数据归 C 管
```

**只有 B 和 D 之间这一段的数据需要迁移**，其他所有数据的路由不变。

### 删除节点

假设机器 B 挂了。

```
之前：A 和 B 之间的数据归 B 管
之后：A 和 C 之间的数据归 C 管
```

**只有原来 B 管的那一段数据需要迁移到 C**，其他数据不受影响。

## 虚拟节点：解决数据倾斜

一致性哈希有个问题：**节点在环上的位置是随机的，可能分布不均匀。**

极端情况：三台机器都挤在环的一小段上，另一大段空着。那段空区域的数据全归同一台机器，其他两台很闲。

解决办法是**虚拟节点**：每台物理机器在环上放多个虚拟节点。

```
机器 A → A#1, A#2, A#3, ..., A#100
机器 B → B#1, B#2, B#3, ..., B#100
机器 C → C#1, C#2, C#3, ..., C#100
```

虚拟节点越多，分布越均匀。数据先路由到虚拟节点，再映射回物理机器。

## Java 代码实现

下面是一个完整的一致性哈希实现，包含虚拟节点支持：

```java
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.concurrent.ConcurrentSkipListMap;

public class ConsistentHash {

    private final ConcurrentSkipListMap<Long, String> ring = new ConcurrentSkipListMap<>();
    private final int virtualNodeCount;

    public ConsistentHash(int virtualNodeCount) {
        this.virtualNodeCount = virtualNodeCount;
    }

    /**
     * 添加物理节点，同时创建虚拟节点
     */
    public void addNode(String node) {
        for (int i = 0; i < virtualNodeCount; i++) {
            String virtualNodeName = node + "#VN" + i;
            long hash = hash(virtualNodeName);
            ring.put(hash, node);
        }
    }

    /**
     * 移除物理节点及其所有虚拟节点
     */
    public void removeNode(String node) {
        for (int i = 0; i < virtualNodeCount; i++) {
            String virtualNodeName = node + "#VN" + i;
            long hash = hash(virtualNodeName);
            ring.remove(hash);
        }
    }

    /**
     * 根据 key 找到对应的节点
     */
    public String getNode(String key) {
        if (ring.isEmpty()) {
            throw new IllegalStateException("Hash ring is empty");
        }
        long hash = hash(key);
        // 顺时针找第一个 >= hash 的节点
        Map.Entry<Long, String> entry = ring.ceilingEntry(hash);
        // 如果没找到（hash 比所有节点都大），绕回环的起点
        if (entry == null) {
            entry = ring.firstEntry();
        }
        return entry.getValue();
    }

    /**
     * 使用 MD5 生成哈希值，取前 8 字节作为 long
     */
    private long hash(String key) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(key.getBytes());
            return ((long) (digest[3] & 0xFF) << 24)
                 | ((long) (digest[2] & 0xFF) << 16)
                 | ((long) (digest[1] & 0xFF) << 8)
                 |  (digest[0] & 0xFF);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    // ========== 测试 ==========
    public static void main(String[] args) {
        ConsistentHash ch = new ConsistentHash(100);

        // 添加 3 台机器
        ch.addNode("192.168.1.1");
        ch.addNode("192.168.1.2");
        ch.addNode("192.168.1.3");

        // 模拟 10000 个 key 的分布
        Map<String, Integer> distribution = new HashMap<>();
        for (int i = 0; i < 10000; i++) {
            String key = "key:" + i;
            String node = ch.getNode(key);
            distribution.merge(node, 1, Integer::sum);
        }

        System.out.println("=== 3 台机器的分布 ===");
        distribution.forEach((k, v) ->
            System.out.printf("%s: %d 条 (%.1f%%)%n", k, v, v / 100.0));

        // 新增第 4 台机器
        ch.addNode("192.168.1.4");

        // 重新统计，看有多少 key 迁移了
        int migrated = 0;
        Map<String, Integer> newDistribution = new HashMap<>();
        for (int i = 0; i < 10000; i++) {
            String key = "key:" + i;
            String oldNode = ch.getNode(key); // 注意：这里应该用旧的 ch 实例
            // 简化演示，直接看新分布
            newDistribution.merge(oldNode, 1, Integer::sum);
        }

        System.out.println("\n=== 4 台机器的分布 ===");
        newDistribution.forEach((k, v) ->
            System.out.printf("%s: %d 条 (%.1f%%)%n", k, v, v / 100.0));
    }
}
```

### 代码要点说明

| 要点 | 说明 |
|------|------|
| `ConcurrentSkipListMap` | 线程安全的有序 Map，`ceilingEntry()` 就是"顺时针找第一个节点" |
| 虚拟节点 | 每台物理机器创建 N 个虚拟节点，让数据分布更均匀 |
| MD5 哈希 | 取前 4 字节作为哈希值，分布足够均匀 |
| 绕回逻辑 | `ceilingEntry` 返回 null 时取 `firstEntry`，实现环的"首尾相接" |

## 在 Redis 中的实际应用

Redis Cluster 用的是**哈希槽（Hash Slot）**，本质上是一致性哈希的简化版：

- 固定 16384 个槽
- 每个 key 通过 `CRC16(key) % 16384` 确定槽号
- 每个槽分配给一个节点

好处是**槽的数量固定**，新增/删除节点时只是把一部分槽从一个节点迁移到另一个节点，不需要重新计算所有 key 的哈希。

Jedis 和 Lettuce 客户端都内置了哈希槽的计算逻辑，开发者不需要自己实现。

## 一致性哈希 vs 取模

| 对比项 | 取模 | 一致性哈希 |
|--------|------|-----------|
| 节点变化影响 | 几乎所有 key 都变 | 只影响一小段 |
| 实现复杂度 | 简单 | 中等 |
| 数据均匀性 | 均匀 | 需要虚拟节点 |
| 适用场景 | 节点数固定 | 节点动态扩缩容 |

## 一句话总结

一致性哈希的核心就一句话：**把哈希空间变成环，数据顺时针找最近的节点。节点变化时，只迁移环上一小段的数据。** 虚拟节点解决分布不均的问题。这就是分布式缓存数据路由的基石。