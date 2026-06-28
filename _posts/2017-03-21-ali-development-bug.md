---
layout: post
title: 阿里私有云开发总结 - BUG
keywords: 阿里云 BUG
description: 过去的一年多里，以阿里私有云为主的企业分布式开发工作，积累了很多以阿里云为基础的开发技术。本文主要写如何出解决常见 BUG。
tags: BUG列表
author: 陈鑫杰
---

### NoClassDefFoundError

Q: java.lang.NoClassDefFoundError: org/aopalliance/intercept/MethodInterceptor  
A: 缺少 aopalliance

	<dependency>
		<groupId>aopalliance</groupId>
		<artifactId>aopalliance</artifactId>
	</dependency>


### Maven

Q: Maven 打包遇到“非法字符 \ufeff”  
A: 该文件编码格式存在问题，使用 notepad++ 软件把 "UTF-8 BOM" 转换成 "UTF-8 无BOM"。



### TXC

Q: registTrxBranch error  
A: 检查方法是否包含 TXC 事务注解。

Q: com.mysql.jdbc.MysqlDataTruncation: Data truncation: Data too long for column 'rollback_info'  
A: 调整 TXC rollback\_info 列长度。


### HSF

Q: Desc info:[HSF-Consumer] The target address of the service that needs to be called is not found:: group： ERR-CODE: [HSF-0001], Type: [ENV Problems]  
A: 无法找到服务地址，检查 HSF 服务是否提供，HSF 服务消费版本是否一致。

Q: nested exception is org.springframework.beans.factory.NoSuchBeanDefinitionException: No qualifying bean of type [..] found for dependency: expected at least 1 bean which qualifies as autowire candidate for this dependency. Dependency annotations: {@org.springframework.beans.factory.annotation.Autowired(required=true)}  
A: SVN 上传或更新文件存在遗漏。

Q: Caused  by:  java.lang.RuntimeException:  the  hsf  version  has  errors,  don't  release  
A: hsf 版本错误，检查 target 下配置文件。

Q: Caused by: HSFTimeOutException-Timeout waiting for task. ERR-CODE: [HSF-0002], Type: [], More: [http://console.taobao.net/help/HSF-0002]描述信息：3000  
A: 服务调用超时。优先方案，优化服务端代码。最后方案，调用端增加超时时间。



### Spring

Q: Maximum upload size of 100000 bytes exceeded; nested exception is org.apache.commons.fileupload.FileUploadBase$SizeLimitExceededException: the request was rejected because its size (294085) exceeds the configured maximum (100000)  
 A: 增大 maxUploadSize 限制。

	<bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
		<property name="maxUploadSize" value="100000000" />
		<property name="maxInMemorySize" value="10240000" />
	</bean>

Q: @Autowried 注解下的 service 空指针  
A: service 实现类 @Service 改为 @Service("aService")。@Autowried 改为 @Autowried AService aService。



### Tomcat

Q: Cannot Load interface com.taobao.hsf.configuration.service.ConfigurationService   
A: hosts 中 jmenv.tbsite.net 被注释掉。


### Mybatis

Q: Result Maps collection does not contain value for java.lang.Integer  
A: resultMap="java.long.Integer" 改为 resultType="java.long.Integer"
