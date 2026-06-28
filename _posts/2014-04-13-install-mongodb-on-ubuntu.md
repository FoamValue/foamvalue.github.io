---
layout: post
title: 在 Ubuntu 上安装 MongoDB 数据库
author: 陈鑫杰
---

## 概述
使用本教程在 Ubuntu Linux 系统上安装 MongoDB。本教程使用 .deb 包进行安装。虽然 Ubuntu 包含了自己的 MongoDB 包，但官方 MongoDB 包一般都是较新的。

## 包
MongoDB 包库包含五个文件：

* mongodb-org 这个包是一个元数据包，它会自动安装下面列出的四个组建包。
* mongodb-org-server 这个包包含 mongod 守护进程和相关配置以及初始化脚本。
* mongodb-org-mongos 这个包包含 mongos 守护进程。
* mongodb-org-shell 这个包包含 mongo shell。
* mongodb-org-tools 这个包包含以下的 MongoDB工具：mongoimport bsondump，mongodump，mongoexport，mongofiles，mongoimport，mongooplog，mongoperf，mongorestore，mongostat和mongotop。

## 控制脚本
在 mongodb-org 包中包含各种控制脚本，包括初始化脚本 /etc/rc.d/init.d/mongod。  
使用 /etc/mongod.conf 文件和控制脚本配置 MongoDB。  
因为 2.6.0 版本，没有 mongos 的控制脚本。mongos 进程只能被使用于分片。你可以使用 mongod 初始化脚本去派生你自己的 mongos 控制脚本。  
你不能同时和 Ubuntu 提供的 mongodb，mongodb-server,或者 mongodb-clients 包，安装这个包。  

## 安装 MongoDB

### 导入软件包管理系统使用的公钥
Ubuntu 的软件包管理工具（即 dpkg 和 apt）通过要求经销商使用 GPG 密钥签名软件包来确保软件包的一致性和真实性。发布以下命令去导入 MongoDB 公共 GPG 密钥：  

> sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10

### 创建 MongoDB 的列表文件
使用以下命令创建 /etc/apt/sources.list.d/mongodb.list 列表文件：  

> echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' \| sudo tee /etc/apt/sources.list.d/mongodb.list

### 刷新本地包数据库
发布以下命令来刷新本地包数据库：  

> sudo apt-get update

### 安装 MongoDB 包
你可以安装最新的稳定的 MongoDB 企业版版本或者 MongoDB 企业版的一个特定版本。  

#### 安装最新的稳定的 MongoDB 企业版版本
发布以下命令：  

> sudo apt-get install mongodb-org

#### 安装 MongoDB 企业版的一个特定版本
分别指定每个组件包和追加包名的版本号，如下列实例安装 MongoDB 2.6.1 版本：  

> apt-get install mongodb-org=2.6.1 mongodb-org-server=2.6.1 mongodb-org-shell=2.6.1 mongodb-org-mongos=2.6.1 mongodb-org-tools=2.6.1

#### Pin MongoDB 企业版的一个特定版本
虽然你可以指定 MongoDB 企业版的任何可用版本，但是当一个较新版本可用时， apt-get 将会更新包。去 pin 一个 MongoDB 版本在当前版本，请发布以下命令序列：  

> echo "mongodb-org hold" | sudo dpkg --set-selections
> echo "mongodb-org-server hold" | sudo dpkg --set-selections
> echo "mongodb-org-shell hold" | sudo dpkg --set-selections
> echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
> echo "mongodb-org-tools hold" | sudo dpkg --set-selections

以前版本的 MongoDB 包使用不同的命名约定。查看 2.4 版本的文档以获取更多信息。   

## 运行 MongoDB
MongoDB 实例存储数据文件在 /var/lib/mongo 和日志文件在 /var/log/mongo，并运行使用 mongod 的用户账户。如果你更改了运行 MongoDB 进程的用户，你必须修改访问控制权限到 /var/lib/mongo 和 /var/log/mongo 目录。

### 启动 MongoDB
你可以通过发出以下命令启动 mongod 进程。  

> sudo service mongod start

### 验证 MongoDB 已正常启动
你可以通过检查位于 /var/log/mongodb/mongod.log 日志文件来验证 mongod 进程已经正常启动。  
你可以通过以下命令来选择确保 MongoDB 会随着系统重新启动而启动。  

> sudo chkconfig mongod on

### 停止 MongoDB
根据需要，你可以通过发出以下命令来停止 mongodb 进程：  

> sudo service mongod stop

### 重新启动 MongoDB
你可以通过发布以下命令重新启动 mongod 进程：  

> sudo service mongod restart

你可以通过观察在 /var/log/mongo/mongod.log 文件的输出，来跟踪错误进程的状态或者重要信息。
