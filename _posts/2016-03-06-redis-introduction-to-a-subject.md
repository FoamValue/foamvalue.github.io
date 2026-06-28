---
layout: post
title: Redis 简单入门教程
author: 陈鑫杰
---

### 什么是 Redis
Redis is an open source (BSD licensed), in-memory data structure store, used as database, cache and message broker.

### 安装 Redis

[下载页面][download1]  [中文][download2]

>
$ wget http://download.redis.io/releases/redis-3.0.7.tar.gz  
$ tar xzf redis-3.0.7.tar.gz  
$ cd redis-3.0.7  
$ make  

#### 安装错误

A: `/bin/sh: cc: command not found`  
Q: `sudo apt-get install build-essential`

A: `jemalloc/jemalloc.h: No such file or directory`  
Q[^1]:
`cd deps`  
`make hiredis lua jemalloc linenoise`  

#### 运行验证
`$ src/redis-server`

#### 配置 Redis
`vi redis.conf`

#### 后台启动
`./src/redis-server redis.conf &`

### jedis

官方推荐的 Java 客户端之一。

#### Maven

{% highlight xml %}
<dependency>
  <groupId>redis.clients</groupId>
  <artifactId>jedis</artifactId>
  <version>2.8.0</version>
  <type>jar</type>
  <scope>compile</scope>
</dependency>
{% endhighlight xml %}

#### 简单调用

{% highlight java %}
package com.foamvalue.test;

import redis.clients.jedis.Jedis;

public class RedisTest {

  public static void test() {
    Jedis jedis = null;
    try {
      jedis = new Jedis("localhost", 6379);
      jedis.set("foo", "bar");
      String value = jedis.get("foo");

      System.out.println(value);
    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      if (jedis != null) {
        jedis.close();
      }
    }
  }

  public static void main(String[] args) {
    test();
  }

}

{% endhighlight java %}


### 帮助
[^1]: [原文链接](http://sharadchhetri.com/2015/07/07/jemallocjemalloc-h-no-such-file-or-directory-redis)

[download1]: http://redis.io/download
[download2]: http://www.redis.cn/download.html
