---
layout: post
title: Spring Boot 特性之 Fluent Builder API
description: 深入挖掘了一下 Spring Boot 的 Fluent Builder API 特性。
---

Spring Boot 提供了一个流式调用的构建器 API，用来创建 SpringApplication 实例、提供 ConfigurableApplicationContext 上下文支持。

## 举个栗子

**BootApplication.java**

``` java
SpringApplication.run(BootApplication.class, args);
```

- 一行代码只调用了 run 方法。

``` java
new SpringApplicationBuilder()
  .sources(BootApplication.class)
  .bannerMode(Banner.Mode.OFF)
  .run(args);
```

- 一行代码调用了三个方法，分别是 sources、bannerMode、run。

以上就是 `Fluent Builder API` 的特性。用一行代码完成初始化对象、设置参数、最终返回期望的结果。

## SpringApplicationBuilder 剖析

**Fluent Builder 原理**

``` java
private final SpringApplication application;

public SpringApplicationBuilder(Class<?>... sources) {
  this.application = createSpringApplication(sources);
}

protected SpringApplication createSpringApplication(Class<?>... sources) {
  return new SpringApplication(sources);
}

public SpringApplicationBuilder sources(Class<?>... sources) {
  this.sources.addAll(new LinkedHashSet<>(Arrays.asList(sources)));
  return this;
}

public SpringApplicationBuilder web(WebApplicationType webApplicationType) {
  this.application.setWebApplicationType(webApplicationType);
  return this;
}
public SpringApplicationBuilder banner(Banner banner) {
  this.application.setBanner(banner);
  return this;
}

public SpringApplicationBuilder bannerMode(Banner.Mode bannerMode) {
  this.application.setBannerMode(bannerMode);
  return this;
}
```
- 初始化 SpringApplication 引用
- 返回类型是自身引用的公共方法


``` java
public ConfigurableApplicationContext run(String... args) {
	if (this.running.get()) {
		return this.context;
	}
	configureAsChildIfNecessary(args);
	if (this.running.compareAndSet(false, true)) {
		synchronized (this.running) {
			this.context = build().run(args);
		}
	}
	return this.context;
}
public SpringApplication build() {
	return build(new String[0]);
}
public SpringApplication build(String... args) {
  configureAsChildIfNecessary(args);
  this.application.addPrimarySources(this.sources);
  return this.application;
}
```

- build() 方法返回了一个可以运行的 SpringApplication
- run(args) 启动了 SpringBoot 应用程序。

## 总结

SpringApplicationBuilder 是通过初始化 SpringApplication 引用，并提供自定义配置的 builder 方法。最终，依靠 SpringApplication 提供的 run 方法进行启动。

本次剖析，深刻的认识了 builder 模式的核弹威力。

通过 builder 类的大量封装，可以简洁的创建一个复杂对象引用。真香啊。
