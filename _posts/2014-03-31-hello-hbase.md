---
layout: post
title: Hello HBase
author: 陈鑫杰
---

> $ hbase shell  
> HBase Shell; enter 'help&lt;RETURN&gt;' for list of supported commands.  
> Type "exit&lt;RETURN&gt;" to leave the HBase Shell  
> Version 0.94.18, r1577788, Sat Mar 15 04:46:47 UTC 2014  
> hbase(main):001:0>

以上步骤可以确认 Java 和 HBase 函数库已经安装成功。为了最终确认，可以试试列出 HBase 中所有表的命令。这个动作执行了一个全程请求，从客户端应用到 HBase 服务器，然后返回。在 shell 提示符下，输入 list 然后按回车键。你应该可以看到输出 0 个结果，以及接下来的提示符

> hbase(main):001:0> list  
> TABLE</br>0 row(s) in 0.9220 seconds</br>hbase(main):002:0>  

完成安装和验证后，现在创建表并存储一些数据。

## 存储数据
HBase 使用表作为顶级结构来存储数据。写数据到 HBase，就是写数据到表。现在创建一个只有一个**列族**的表，表名是 mytable,列族名 cf。

> hbase(main):002:0> create 'mytable','cf'  
> 0 row(s) in 1.2750 seconds   
> hbase(main):003:0> list   
> TABLE  
> mytable  
> 1 row(s) in 0.0190 seconds  
> hbase(main):004:0>  

* 写数据  
表创建后，现在写入一些数据。往表里写入字符串 hello HBase。按 HBase 的说法，“在 'mytable' 表的 'first' 行中的 'cf:message' 列对应的数据**单元**中插入字节数组 'hello world' 。”  

> hbase(main):004:0> put 'mytable', 'first', 'cf:message', 'hello HBase'  
> 0 row(s) in 0.1680 seconds  
> hbase(main):005:0> put 'mytable', 'second', 'cf:foo', '0x0'  
> 0 row(s) in 0.0070 seconds  
> hbase(main):006:0> put 'mytable', 'third', 'cf:bar', 3.14159  
> 0 row(s) in 0.0210 seconds</br>hbase(main):007:0>  

现在表里有 3 行和 3 个数据单元。注意，在使用列的时候，你并没有提前定义这些列，也没有定义往列里存储的数据的类型。这就是所说的。HBase 是一种**无模式（schema-less）**的数据库。

* 读数据  
HBase 有两种方式读取数据： get 和 scan。  
执行 get：  

> hbase(main):007:0> get 'mytable', 'first'  
> COLUMN CELL  
> cf:message timestamp=1396270738949, value=hello HBase  
> 1 row(s) in 0.0350 seconds  
> hbase(main):008:0>  

* 执行 scan：  

> hbase(main):008:0> scan 'mytable'  
> ROW COLUMN+CELL  
> first column=cf:message, timestamp=1396270738949, value=hello HBase  
> second column=cf:foo, timestamp=1396270767394, value=0x0  
> third column=cf:bar, timestamp=1396270797019, value=3.14159  
> 3 row(s) in 0.0510 seconds</br>hbase(main):009:0>

声明：本文参考自《HBase In Action》，如需转载请注明出处，谢谢。
