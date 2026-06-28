---
layout: post
title: vertx RESTful 实现
keywords: vertx RESTful mongodb java
description: 层出不穷的语言，各种高深的应用框架。似乎 Spring MVC 并不能囊括所有的业务场景，所以是该学习更多的语言/架构了。比如 Java 的异步架构 -- Vert.x！
tags: vertx RESTful mongodb java
author: 陈鑫杰
---

探索轻量的、利于分布式部署的 Restful 框架，是发现 Vert.x 的契机之一。

基于 Java 程序猿的角度，更愿意选择已掌握的开发语言，去学习/思考未曾触及的架构领域，这是契机之二。

探索 Java 并发，这是契机之三。

Java 8，函数编程，这是契机...

...

## Vertx

Vert.x[^Vert.x]基于全异步Java服务器Netty。

**异步无锁编程**，**EventBus 分布式解耦**...

***参考资料 [关于Java框架Vert.x的几点思考](http://www.csdn.net/article/2015-05-20/2824733-Java)。***

------

## RESTful

非常适合用来实现 RESTful HTTP micro-services。

举个栗子

```
router.route("/api/*").handler(ResponseContentTypeHandler.create());

router.get("/api/books").produces("text/xml").produces("application/json").handler(rc -> {
  findBooks(ar -> {
    if (ar.succeeded()) {
      if (rc.getAcceptableContentType().equals("text/xml")) {
        rc.response().end(toXML(ar.result()));
      } else {
        rc.response().end(toJson(ar.result()));
      }
    } else {
      rc.fail(ar.cause());
    }
  });
});
```
------

## Verticle & EventBus

**Verticle**

Event Bus 是可以跨多个服务器节点和多个浏览器的分布式对等消息系统。

举一个 发布/订阅栗子。

**订阅** AddressDTO.GET_COUNT，从 Mongo 中查询数据。

```
public class CountVerticle extends AbstractVerticle {

	final static Logger LOGGER = LoggerFactory.getLogger(CountVerticle.class);

	@Override
	public void start() throws Exception {
		vertx.eventBus().<JsonObject>consumer(AddressDTO.GET_COUNT, message -> {
			try {
				final MongoClient mongoClient = MongoClient.createShared(vertx, MongoInfo.MONGO_CONFIG);

				JsonObject query = new JsonObject();

				mongoClient.count(MongoInfo.DB_COLLECTION, query, res -> {
					if (res.succeeded()) {
						message.reply(res.result());
					} else {
						res.cause().printStackTrace();
					}
				});
			} catch (Exception e) {
				message.fail(101, e.getLocalizedMessage());
				String fullStackTrace = ExceptionUtils.getStackTrace(e);
				LOGGER.error(fullStackTrace);
			}
		});
		super.start();
	}
}
```

**注册**、**发布** && RestFul

```
public class NginxVerticle extends AbstractVerticle {

	@Override
	public void start() throws Exception {
		deployVerticle();
		Router router = Router.router(vertx);

		router.get("/getCount").handler(context -> {
			vertx.eventBus().send(AddressDTO.GET_COUNT, null, rst -> {
				ResultUtil.sendPlain(JsonUtil.toJson(rst.result().body()), context.response());
			});
		});
		vertx.createHttpServer().requestHandler(router::accept).listen(AddressDTO.SERVER_PORT);
	}

	private void deployVerticle() {
		vertx.deployVerticle("io.vertxPress.nginx.verticle.CountVerticle", new DeploymentOptions().setWorker(true));
	}
}
```

**依赖包**

```
<dependency>
	<groupId>io.vertx</groupId>
	<artifactId>vertx-core</artifactId>
	<version>${vertx.version}</version>
</dependency>
<dependency>
	<groupId>io.vertx</groupId>
	<artifactId>vertx-web</artifactId>
	<version>${vertx.version}</version>
</dependency>
<dependency>
	<groupId>io.vertx</groupId>
	<artifactId>vertx-mongo-client</artifactId>
	<version>${vertx.version}</version>
</dependency>
<dependency>
	<groupId>io.vertx</groupId>
	<artifactId>vertx-auth-mongo</artifactId>
	<version>${vertx.version}</version>
</dependency>
```

-------

## 结尾

从 **发布/订阅栗子** 可以发现，一个单纯无状态的 RestFul 请求到数据库获取数据后返回 Json 结果。整套工程相对于 Spring MVC 实现的 RESTful，确实轻量不少。

特别是 Event Bus 号称 “can even be bridged to allow client side JavaScript running in a browser to communicate on the same event bus.”，“ forms a distributed peer-to-peer messaging system spanning multiple server nodes and multiple browsers.”。

对分布式有着天生的支持。可以想象到很简单的配置就可实现分布式 RESTful。

-------

[^Vert.x]: http://vertx.io
