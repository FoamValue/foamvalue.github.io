---
layout: post
title: 数据库迁移：从 MySQL 到 Oracle
description: 有史以来，第一次数据库迁移。
---

------

有一种业务场景：需要把A的实现，套给B。保留大部分成熟的，定制部分关键性业务。

好在项目是基于Maven构建的，原项目架构比较明朗。

首先，需要替换的部分：

1. 数据库，Mysql 替换成 Oracle。
2. 分布式事务，TXC 替换成 Spring 事务。

然后，需要保留的部分：

1. 系统基础功能，用户、角色、权限、资源等。
2. 核心业务A。
3. 核心业务B。

最后，需要定制业务：

1. 定制业务A。
2. 定制业务B。

## 部分改造

删除

``` XML
<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
</dependency>

<dependency>
  <groupId>com.taobao.txc</groupId>
  <artifactId>txc-client</artifactId>
</dependency>
```
添加
``` XML
<dependency>
  <groupId>ojdbc</groupId>
  <artifactId>ojdbc</artifactId>
</dependency>
```
修改
``` properties
driverclassname: com.mysql.jdbc.Driver
url: jdbc:mysql://数据库链接.drds.aliyun.boc:3306/数据库名称?useUnicode\\=true\&amp;characterEncoding\\=UTF-8
username:
passw0rd:

driverclassname: oracle.jdbc.driver.OracleDriver
url: jdbc:oracle:thin:@数据库链接:1521\\数据库名称
username:
passw0rd:
```
替换
``` Java
@TxcTransaction(timeout = 1000 * 60)

@Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = Exception.class)
```

## 总结

整套更换下来，比较困难的在于两点。

1. 数据库迁移非常痛苦，花了将近2天的时间。没有成熟的工具，需要从零开始尝试。
  最终可行的解决方案：win版本navicat将mysql数据库导出成oracle版本的SQL文件。手动调整SQL文件，分批执行SQL文件。
2. 代码中mysql版本的SQL语言，需要手动替换成Oracle版本的。
  这就不存在解决方案了，只能先梳理一遍哪些需要替换的，然后协同具体开发同学一起进行。
