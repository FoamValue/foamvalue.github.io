---
layout: post
title: 阿里私有云开发总结 - Maven
keywords: 阿里云 Maven 分布式 架构
description: 过去的一年多里，以阿里私有云为主的企业分布式开发工作，积累了很多以阿里云为基础的开发技术。本文主要写如何使用 Maven 在分布式系统中实现项目搭建与部署。
tags: Maven 分布式 架构
author: 陈鑫杰
---

Maven 篇，简略描述 Maven 架构下的阿里私有云实现。  
既然定位在`互联网企业级分布式应用`，就必须配上工程架构利器 Maven。  
使用 Maven，可以减少对第三方 jar 工具包的所需跟升级版本的时间。  
使用 Maven，可以减少打包发版本的时间。（😊，写好 sh 脚本就可以啦）。  
使用 Maven，可以减少工程复杂度。  
使用 Maven，可以减少重复包。（占磁盘啊！）  
...


## 工程架构

`互联网企业级分布式应用`是一个复杂且拗口的工程集合。（至少 eclipse 已经躺了20+个工程目录了...）

为了更好的管理工程集合，必须定义一个顶级POM，用来约束项目间使用的 jar。重构项目中经常用到的方法，形成更简便的工具类。  
这样带来的好处，就是只需要最少的修改（例如顶级POM的 Spring 版本号），就能实现所有项目的改动。

为了符合阿里私有云`HSF`，把单服务中心切成服务中心接口跟服务中心实现类两个工程。  
服务中心接口只提供数据交互的 DTO 对象，以及 Public 服务接口，不包含实现。  
服务中心实现工程，在引入服务中心接口（jar）后提供对接口的实现类。并作为 WAR 进行分布式部署。  

为了实现企业内部的业务需要，势必需要各业务系统。  
各业务系统导入服务中心接口（jar），通过`HSF`实现对服务中心接口的调用。  

由此，构成`互联网企业级分布式应用`。  

### 顶级POM

	1. 约定所有项目使用 jar 版本号
	2. 通用工具类
	3. 通用配置类

#### 约定版本

使用 `properties`、`dependencyManagement` 标签

	<properties>
		<version.spring>4.1.2.RELEASE</version.spring>
	</properties>
	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>org.springframework</groupId>
				<artifactId>spring-expression</artifactId>
				<version>${version.spring}</version>
			</dependency>

			<dependency>
				<groupId>org.springframework</groupId>
				<artifactId>spring-core</artifactId>
				<version>${version.spring}</version>
			</dependency>
		</dependencies>
	</dependencyManagement>

#### 通用工具类

	1. 自定义注解
	2. 公共 JavaBean（DTO）
	3. 工具类（DateUtil、MD5Util 等）

#### 通用配置类

	1. Spring 与 Mybatis 基础配置
	2. 约定 Mybatis 路径
		（io.foamvalue.*.entity,classpath*:/mybatis/**/*Mapper.xml 等）
	3. 通用查询功能
		（select count(1) from ${tableName} where ${keyName} = '${keyValue}'）

### 服务中心接口

	1. JavaBean（DTO）
	2. Service 接口
		（提供 public 接口实现）

### 服务中心实现

	1. 数据库实体（JavaBean 非DTO）
	2. Mybatis Mapper 接口（Java Interface）
	3. Mybatis Mapper 实现（XML）
	4. Service 接口实现类

### 业务系统

	1. 具体业务实现（spring mvc）
	2. Maven 引入需要的服务中心接口（jar）

## 部署打包

通过 Maven 配置不同类型的 `properties`，将本地、测试、Beta以及生产环境不同的参数，通过 Maven 命令的方式，自动注入到代码中。  

	<profiles>
		<profile>
			<id>dev</id>
			<activation>
				<activeByDefault>true</activeByDefault>
			</activation>
			<properties>
				<resource.filter>dev.properties</resource.filter>
			</properties>
		</profile>
		<profile>
			<id>test</id>
			<properties>
				<resource.filter>test.properties</resource.filter>
			</properties>
		</profile>
		<profile>
			<id>product</id>
			<properties>
				<resource.filter>product.properties</resource.filter>
			</properties>
		</profile>
		<profile>
			<id>beta</id>
			<properties>
				<resource.filter>beta.properties</resource.filter>
			</properties>
		</profile>
	</profiles>

	<build>
		<resources>
			<resource>
				<directory>${project.basedir}/src/main/resources</directory>
				<filtering>true</filtering>
			</resource>
		</resources>
		<filters>
			<filter>${resource.filter}</filter>
		</filters>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-compiler-plugin</artifactId>
			</plugin>
		</plugins>
		<finalName>project</finalName>
	</build>

**打包命令**

	mvn -s apache-maven-3.3.9/conf/settings.xml -e -f project/pom.xml -DskipTests=true -P $1 clean install
	$1: dev 或 test 或 beta 或 produc

### dev

	本地开发配置

### test

	测试环境配置

### beta

	生产环境配置 - Beta

### product

	生产环境配置

## 扩展 - 打包脚本逻辑

	1. svn 更新
	2. maven 打包命令
	3. 删除 Deploy 目录下的 War 文件（老旧文件）
	4. find 最新 War 并移动到 Deploy 目录下
	5. 手动上传 War 部署发版
