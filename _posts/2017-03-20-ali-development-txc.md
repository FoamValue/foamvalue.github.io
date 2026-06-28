---
layout: post
title: 阿里私有云开发总结 - TXC
keywords: 阿里云 分布式事务 TXC
description: 过去的一年多里，以阿里私有云为主的企业分布式开发工作，积累了很多以阿里云为基础的开发技术。本文主要写如何使用 TXC 在分布式系统中实现事务控制。
tags: 分布式事务 TXC
author: 陈鑫杰
---

分布式事务是分布式系统的关键技术。

在 <ruby>企业级分布式应用服务<rt>Enterprise Distributed Application Service</rt></ruby>中，实现这一技术的就是 TXC。

### 事务配置

**基于 Spring MVC，** 在<ruby>配置文件<rt>ApplcationContent</rt></ruby> 中添加事务配置。

	<bean class="com.taobao.txc.client.aop.TxcTransactionScaner">
		<constructor-arg value="${txc.clientName}" /><!-- 自定义客户端名称 -->
		<constructor-arg value="${txc.serverGroup}" /><!-- 预先定义组别 -->
		<constructor-arg value="1" />
		<constructor-arg value="1" />
	</bean>

与 Spring 事务配置不同，TXC 事务配置是进程级别的。

### 事务使用

TXC 事务依靠 <ruby>业务层<rt>Service</rt></ruby> 切面。

需要 TXC 事务控制时，只需在*业务层*的方法上增加事务注解。

	@TxcTransaction(timeout = 1000 * 60)

TXC 事务会通过 **EDAS 组件 - Eagleeye** 关联到业务层方法调用的其他服务之中，既全局回滚。

### 注意事项

<ruby>控制层<rt>Controller</rt></ruby> 方法  

	不能使用 TXC 注解
	主动使用 try - catch 捕获异常

<ruby>业务<rt>Service</rt></ruby> 层方法

	使用事务注解
	不使用 try - catch
	可主动 throw new IllegalAccessError()
	不能使用 try - catch，并需要 TXC 事务注解。
	打印 TxcContext.getCurrentXid() 辅助排查问题
