---
layout: post
title: 服务器安装 Mysql & 导入数据库
keywords: ubuntu mysql
description: 一份简易的 Mysql 安装文档。简单实现了，服务器安装以及本地使用工具进行访问的操作流程。
tags: ubuntu mysql
author: 陈鑫杰
---

操作系统

	# lsb_release -a

	No LSB modules are available.
	Distributor ID:	Ubuntu
	Description:	Ubuntu 16.04.2 LTS
	Release:	16.04
	Codename:	xenial

安装

	# apt-get install mysql-server
	# apt-get install mysql-client	# apt-get install libmysqlclient-dev

查看端口

	# netstat -an|grep 3306

	# netstat -lntp | grep 3306
	tcp 0 0 127.0.0.1:3306 0.0.0.0:* LISTEN 11824/mysqld

**需要外网访问端口**

	# vi /etc/mysql/mysql.conf.d/mysqld.cnf

	#bind-address = 127.0.0.1 #注释

重启服务

	# service mysql stop
	# service mysql start

再次查看端口

	# netstat -lntp | grep 3306
	tcp6 0 0 :::3306 :::* LISTEN 14082/mysqld

数据操作

	# mysql -u root -p

root 授权给所有链接

	grant all privileges on *.* to 'root'@'%' identified by '密码';

	#立即生效
	flush privileges;​

初始化数据库

	create database 数据库名称;

上传数据库文件

	scp 2017-06-09.sql root@192.168.1.111:/root/Downloads

选择数据库

	use abc;

设置数据库编码

	set names utf8;

导入数据

	source /root/Downloads/2017-06-09.sql;
