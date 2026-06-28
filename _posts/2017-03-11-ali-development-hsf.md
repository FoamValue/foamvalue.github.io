---
layout: post
title: 阿里私有云开发总结 - HSF
keywords: 阿里云 HSF RPC
description: 过去的一年多里，以阿里私有云为主的企业分布式开发工作，积累了很多以阿里云为基础的开发技术。本文主要写如何使用 HSF 在分布式系统中实现跨服务器调用。
tags: HSF RPC
author: 陈鑫杰
---

HSF 是阿里云提供的 RPC 框架，提供服务器间通讯与远程调用。

### 摘要

_专业术语：_  
EDAS 产品中分布式服务化子模块的名字，是一个高性能的服务化框架，全称 High Speed FrameWork。  

_启动模式：_  
HSF 包含在 潘多拉（Pandora）容器，而潘多拉容器有包含在 Ali-Tomcat，所以由 Ali-Tomcat 启动。

_地址服务：_  
`jmenv.tbsite.net`，通过修改 Hosts 来实现服务注册与消费。   

### 环境搭建

[阿里云 EDAS-HSF 用户指南](https://edas-public.oss-cn-hangzhou.aliyuncs.com/doc/ALIYUN_EDAS_HSF_USER_GUIDE.pdf)       
[开发工具用户手册](http://edas-public.oss-cn-hangzhou.aliyuncs.com/doc/ALIYUN_EdasStudio_Developer_Tool.pdf)

### HSF 服务

举个例子

| DataId  | GroupId |  HostId |
| ------------- |:-------------:|:-------------:|
| com...MessageService:1.0.5_dev| HSFGroupTest | 10.101.4.43:39259 |
| com...MessageService:1.0.5_dev| HSFGroupTest | 172.16.11.173:7829 |

服务唯一性：**DataId + GroupId 确定一个服务**  
服务分布式：**一个服务可以由多个 HostId**  

**DataId**

由 Service 接口类全路径 + 类名称 + 服务指定版本号构成。  
其中全路径 + 类名称，是不会发生变化的。  
服务指定版本号，随着代码的不停优化发版等自定义。

	1. 本地 1.0.0 版本：com...MessageService:1.0.0_dev
	2. 测试 1.0.0 版本：com...MessageService:1.0.0_test
	3. 本地 1.0.1 版本：com...MessageService:1.0.1_dev
	4. 测试 1.0.1 版本：...
	5. ...

**GroupId**

由阿里云 HSF 服务端定义。

**HostId**

当前提供服务的机器 IP + 端口  
Ali-Tomcat 启动时，应用自动注册当前提供的 HSF 服务。

### 常见问题

1. HSF 提示服务不存在  
	检查 HSF 服务提供的版本号与应用消费的版本号是否一致。

2. HSF 提示服务超时  
	首先，检查网络环境是否稳定。其次，检查 HSF 服务注册端代码是否需要优化。

### 注意

由于 HSF 是依靠服务器间网络进行调用，所以对服务间网络环境要求很高。  
另外，为了不占满网络带宽影响其他服务器。  
HSF 服务都默认的超时时间（30s），当某个 HSF 服务出现调用超时的情况。  
代表这个 HSF 服务代码需要进行优化。
