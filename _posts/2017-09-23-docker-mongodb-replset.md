---
layout: post
title: Docker MongoDB 副本集
keywords: Ubuntu Docker MongoDB
description: 最近，在看别人的代码。发现有点意思，所以准备整一个 NoSQL 的数据库集群来做实验。
tags: Ubuntu Docker MongoDB
author: 陈鑫杰
---

原本，准备在一个 Ubuntu 上做 Docker MongoDB 集群的。

有可能一个系统做集群没什么实际意义。所以，相关的资料基本找不到。

后来，Google 到一篇[复制集群](http://bazingafeng.com/2017/06/19/create-mongodb-replset-cluster-using-docker/)的文章，觉得可以拿来参考一下。

-----------

## 复制集群

首先安装 docker-compose

	$ apt-get install docker-compose

新建文件 docker-compose.yml

```
version: '2.0'
services:
  rs1:
    image: mongo:3.4
    container_name: "rs1"
    ports:
      - "30001:27017"
    volumes:
      - /root/mongodb/data/rs1:/data/db
    command: mongod --dbpath /data/db --replSet mongoreplset
  rs2:
    image: mongo:3.4
    container_name: "rs2"
    ports:
      - "30002:27017"
    volumes:
      - /root/mongodb/data/rs2:/data/db
    command: mongod --dbpath /data/db --replSet mongoreplset
  rs3:
    image: mongo:3.4
    container_name: "rs3"
    ports:
      - "30003:27017"
    volumes:
      - /root/mongodb/data/rs3:/data/db
    command: mongod --dbpath /data/db --replSet mongoreplset
```

执行 `docker-compose up -d` 可以启动三个容器。通过 `docker ps` 查看容器是否启动成功，如果启动失败，可以通过命令 `docker logs 容器id`查看日志信息。

初始化

	docker exec -ti rs1 mongo

	rs.initiate()
	rs.add('rs2:27017')
	rs.add('rs3:27017')
	rs.status()  

在rs1容器写入一条数据，然后进入rs2和rs3查看数据是否同步

	docker exec -ti rs1 mongo
	use test
	db.test.insert({now: new Date()})
	quit()

	docker exec -ti rs2 mongo
	rs.slaveOk()    // 备份节点默认不可读写，需要通过该命令来允许读操作
	use test
	db.test.find()
	quit()

	docker exec -ti rs3 mongo
	rs.slaveOk()
	use test
	db.test.find()
	quit()

执行 `docker-compose stop` 可以关闭三个容器。

-----------

## 单机版

拉取官方镜像

	$ docker pull mongo:3.4

直接使用镜像

	$ docker run -p 27017:27017  --name singleMongo -v /root/mongoData:/data/db -d mongo:3.4

***需要校验 --auth***

启动/停止

	$ docker stop singleMongo
	$ docker start singleMongo

进入容器

	$ docker exec -it singleMongo mongo

另一种方式，直接创建镜像，并进入容器

	$ docker run -it -p 27017:27017 --name singleMongo mongo:3.4 mongo
