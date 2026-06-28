---
layout: post
title:  "一个奇葩的问题（create table）"
author: 陈鑫杰
---
## 问题描述
向 mysql 中加入某张表时，提示以下报错信息。  
然后亮点来了，各种 baidu、google 完全找不到可行的解决方式。  
最终，闪过一个灵感：是不是表字段太长造成了这问题？ ———— 300 多个字段的 create table 语句  

## 报错信息
{% highlight ruby %}
Error Code: 1296. Got error 1229 'Too long frm data supplied' from NDBCLUSTER	48.751 sec
{% endhighlight %}

## 解决方式

> * create table 表名
> * ALTER TABLE 表名 ADD COLUMN 列名 数据类型
