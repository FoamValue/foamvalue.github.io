---
layout: post
title: 如何收集 nginx 日志到 mongodb - fluentd 篇
keywords: nginx mongodb fluentd
description: 记一次小小的折腾，文字不多，但踩到的坑确实不少。前前后后，少看了一个星期的电视/电影/日漫（20:00 - 22:00 😊）。
tags: nginx mongodb fluentd
author: 陈鑫杰
---

如何检查服务器版

	# lsb_release -a

	LSB Version:	...
	Distributor ID:	Ubuntu
	Description:	Ubuntu 16.04.2 LTS
	Release:	16.04
	Codename:	xenial

不同版本下的安装，可能存在差异。

ubunut 个人比较喜欢。

## nginx

下载一个喜欢的发行版本 [here](https://nginx.org/en/download.html)。

解压即可用，修改 conf/nginx.conf。

举个栗子，以下是简单版配置：

	user root;
	worker_processes  2;

	pid        /root/nginx/logs/nginx.pid;
	events {
	    worker_connections  1024;
	}
	http {
	    limit_req_zone $binary_remote_addr zone=one:10m rate=30r/s;
	    include       mime.types;
	    default_type  application/octet-stream;
	    log_format compression '$remote_addr $remote_user [$time_local] $status "$request" $body_bytes_sent "$http_referer" "$http_user_agent"';
	    access_log  /root/logs/http/access.log  compression buffer=32k;
	    sendfile        on;
	    keepalive_timeout  65;
	    server {
	        listen       80;
	        server_name  localhost;
	        access_log  /root/logs/http/host.access.log  compression buffer=32k;
	        location / {
	            root   /root/webserver/foamvalue.com;
	            index  index.html index.htm;
	        }
	        error_page  404   http://www.foamvalue.com/404.html;
	    }
	}

**关键点**

pid，指定一个 nginx pid 位置。

log_format，日志格式 略重要。

access_log，日志路径

location /，Html 文件目录


相对简单的 nginx 配置，需要想玩好。可以参照网上的优化方案进行调整。

***小流量静态站点，感觉这样就足够了。制约在公网流量限制。***

实测阿里云 1Mbps，单页面打开在 2s 以内，大致能达到 200 并发量。

轰炸好几个小时，依然稳定，不假死。

------

## mongodb

简易安装：

	# sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
	# echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
	# apt-get update
	# sudo apt-get install -y mongodb-org
	# sudo service mongod start # 启动
	# sudo service mongod start # 关闭


启动命令

	# mongo

	use admin # 切换数据库

	# 设置 root 密码
	db.createUser({
     user: "root",
     pwd: "root",
     roles: [{ role: "userAdminAnyDatabase", db: "admin" } ]
   	})

为了安全考虑，非 root 账号，使用 readWrite 角色。

关于配置文件（/etc/mongod.conf），可选择性修改 DB、 log 路径。

公网访问时，需要配置 bindIp: 0.0.0.0

if (mongod 不能正常启动) {
	# service mongod status; # 查看错误信息
}

**Q&A**

已知可能存在无法启动的问题：

1. conf 文件必须是 "A: B"，不能是 "A:B"。就是说冒号后面，需要一个空格。
2. conf 文件不要使用 tab。
3. Path 不能使用 /root 目录。
4. Path 需要 chown mongodb:mongodb -R

------

## fuentd

官方安装教程 [here](http://docs.fluentd.org/v0.12/articles/install-by-deb)。

For xenial

	curl -L https://toolbelt.treasuredata.com/sh/install-ubuntu-xenial-td-agent2.sh | sh


修改 limits & reboot

	etc/security/limits.conf

	root soft nofile 65536
	root hard nofile 65536
	* soft nofile 65536
	* hard nofile 65536

	# ulimit -n
	65535

安装 fluentd & fluent-plugin-mongo

	# gem install fluentd
	# gem install fluent-plugin-mongo

修改 fluentd.conf

	<source>
	  @type tail
	  path /root/logs/http/host.access.log # nginx log path
	  pos_file /root/logs/td-agent/access.log # just a path
	  tag nginx.access
	  format /^(?<remote>[^ ]*) (?<user>[^ ]*) \[(?<time>[^\]]*)\] (?<code>[^ ]*) "(?<method>\S+)(?: +(?<path>[^\"]*) +\S*)?" (?<size>[^ ]*)(?: "(?<referer>[^\"]*)" "(?<agent>[^\"]*)")?$/time_format %d/%b/%Y:%H:%M:%S %z
	</source>

	<match nginx.*>
	  @type mongo
	  database 数据库名
	  collection 表名
	  host IP地址
	  port 端口地址

	  user 用户名
	  password 密码
	  flush_interval 10s
	</match>

启动

	# fluentd -c fluentd.conf &

**Q&A**

Q: mkmf.rb can't find header files for ruby

A: sudo apt-get install ruby-dev

------

## mongoDB 分析

行数统计

	db.表名.count({});


聚合统计

	db.表名.aggregate([{$group : {_id : "$path", num_tutorial : {$sum : 1}}},{$sort: {num_tutorial: -1}}])

------


## 自动挂载 NAS

	# vim /etc/fstab

	//IP/文件夹名  /pic  cifs  username=,password=,iocharset=utf8,sec=ntlm  0  0

------
