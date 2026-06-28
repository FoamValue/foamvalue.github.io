---
layout: post
title: Quartz 高级折腾方式
keywords: Java Quartz
description: 定时任务，一种普遍存在的业务场景。以前，采用数据库的定时作业；现在，采用付费第三方产品系统；将来，希望能自建分布式定时任务系统，满足各种非人的业务需要。
tags: Java Quartz
author: 陈鑫杰
---

本文采用代码+吹牛的模式，聊(chui)聊(niu) Quartz 技术。  
***代码摘要谷娘。***

------
## 基础知识

1. Scheduler:任务调度器，是实际执行任务调度的控制器。
2. Trigger：触发器，用于定义任务调度的时间规则。
3. JobDetail:用来描述Job实现类及其它相关的静态信息。
4. Job：一个接口。

------
## 简单运用

``` xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-quartz</artifactId>
</dependency>
```

``` java
@Slf4j
public class TokenJob extends QuartzJobBean {

	@Override
	protected void executeInternal(JobExecutionContext context) throws JobExecutionException {
		System.out.println(String.format("This is Token Job Begin."));
	}
}

@Component
public class TokenQuartz {

	@Bean
	public JobDetail jobDetail() {
		return JobBuilder
				.newJob(TokenJob.class)
				.withIdentity("tokenJob")
				.storeDurably()
				.build();
	}

	@Bean
	public Trigger jobTrigger() {
		SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder
				.simpleSchedule()
				.withIntervalInSeconds(7100)
				.repeatForever();

		return TriggerBuilder
				.newTrigger()
				.forJob(jobDetail())
				.withIdentity("trigger")
				.withSchedule(scheduleBuilder)
				.build();
	}
}
```

首先，贴上三段代码实现。  
基于 Spring Boot 架构实现单机版定时任务的话，只需要在 pom.xml 中引入 spring-boot-starter-quartz 组件，然后创建 TokenJob 类、构建 JobDetail、注册 Trigger 就可以实现。

------
## 高端玩法

关键词：**数据库**  
通过数据库的方式，来保障各节点间的数据同步，最终完成 Quartz 集群。

``` properties
org.quartz.scheduler.instanceName = quartzScheduler
org.quartz.scheduler.instanceId = AUTO

org.quartz.jobStore.class = org.quartz.impl.jdbcjobstore.JobStoreTX
org.quartz.jobStore.driverDelegateClass = org.quartz.impl.jdbcjobstore.StdJDBCDelegate
org.quartz.jobStore.tablePrefix = QRTZ_
org.quartz.jobStore.isClustered = true
org.quartz.jobStore.clusterCheckinInterval = 10000  
org.quartz.jobStore.dataSource = myDS

org.quartz.dataSource.myDS.driver = com.mysql.jdbc.Driver
org.quartz.dataSource.myDS.URL =
org.quartz.dataSource.myDS.user =
org.quartz.dataSource.myDS.password =
org.quartz.dataSource.myDS.maxConnections = 30

org.quartz.threadPool.class = org.quartz.simpl.SimpleThreadPool
org.quartz.threadPool.threadCount = 5
org.quartz.threadPool.threadPriority = 5
org.quartz.threadPool.threadsInheritContextClassLoaderOfInitializingThread = true
```

``` xml
<bean id="quartzScheduler" lazy-init="false" class="org.springframework.scheduling.quartz.SchedulerFactoryBean">
      <property name="dataSource" ref="dataSource" />
      <property name="autoStartup" value="true" />
      <property name="applicationContextSchedulerContextKey"  value="applicationContextKey" />
       <property name="configLocation" value="classpath:quartz.properties"/>
      <property name="triggers">
           <list>
                <ref bean="job02Trigger" />
           </list>
      </property>
 </bean>
```

以上两段代码，是数据库配置与启动自动加载数据库中的任务。

------
## 高级折(chui)腾(niu)
Quartz 虽然采用了数据库，来实现分布式集群调度。但各节点的任务，还是从节点启动后加载入内存的信息来执行的。  
根据这一特性，以及 Quartz 赋予的工具包(jar)。  
我们就可以很愉快的，再节点运行中加入/删除任务咯。

------
**期望**  
统一的分布式 Quartz 集群，通过调用接口的形式，为各系统/平台提供定时任务的功能。  
统一管理、统计日志，提供更负责的功能，例如：顺序执行，并发执行等。
