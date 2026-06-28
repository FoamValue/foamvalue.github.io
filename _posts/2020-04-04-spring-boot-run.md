---
layout: post
title: Spring Boot 运行源码剖析
description: 一直在使用 Spring Boot 开发各种的程序，但依旧停留在会用工具的能力上。现在的我，特别地希望通过不断的逼迫自己去源码剖析，让自己更加深入的了解 Spring Boot。
---

本文是 Spring Boot 运行源码剖析内容，内容夹杂了不少的 Spring Boot 源代码片段。

有兴趣的读者，可以按照章节名称跳跃阅读。本文分为两大章节，分别是：

- SpringBoot 工程准备
	- 简单入手 SpringBoot 工程，了解 Web 开发。
- 从启动类剖析
	- 强迫作者，学习分析源代码。

## 一、SpringBoot 工程准备

首先，花 2 分钟构建一个 SpringBoot 工程。

### pom.xml

``` xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>cn.live</groupId>
	<artifactId>springBoot</artifactId>
	<version>0.0.1</version>
	<name>springBoot</name>

	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.2.6.RELEASE</version>
	</parent>

	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-devtools</artifactId>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-actuator</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-logging</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>

	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
		<maven.compiler.encoding>UTF-8</maven.compiler.encoding>
		<java.version>13</java.version>
	</properties>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
				<configuration>
					<fork>true</fork>
				</configuration>
			</plugin>
		</plugins>
	</build>
</project>
```

### application.properties

``` properties
spring.profiles.active=dev
spring.devtools.add-properties=false
```

### application.properties

``` properties
spring.profiles=dev
logging.level.web=debug
```

### MyApplication.java

``` java
package cn.live;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

### 启动成功日志

``` java
.   ____          _            __ _ _
/\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
\\/  ___)| |_)| | | | | || (_| |  ) ) ) )
'  |____| .__|_| |_|_| |_\__, | / / / /
=========|_|==============|___/=/_/_/_/
:: Spring Boot ::        (v2.2.6.RELEASE)

2020-04-06 16:50:28.783  INFO 4205 --- [  restartedMain] cn.live.MyApplication                    : Starting MyApplication on FoamValue-MBP.local with PID 4205 (/Users/chenxinjie/workspace-2020-02/springBoot/target/classes started by chenxinjie in /Users/chenxinjie/workspace-2020-02/springBoot)
2020-04-06 16:50:28.785  INFO 4205 --- [  restartedMain] cn.live.MyApplication                    : The following profiles are active: dev
2020-04-06 16:50:29.768  INFO 4205 --- [  restartedMain] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
2020-04-06 16:50:29.781  INFO 4205 --- [  restartedMain] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2020-04-06 16:50:29.781  INFO 4205 --- [  restartedMain] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.33]
2020-04-06 16:50:29.857  INFO 4205 --- [  restartedMain] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2020-04-06 16:50:29.857 DEBUG 4205 --- [  restartedMain] o.s.web.context.ContextLoader            : Published root WebApplicationContext as ServletContext attribute with name [org.springframework.web.context.WebApplicationContext.ROOT]
2020-04-06 16:50:29.857  INFO 4205 --- [  restartedMain] o.s.web.context.ContextLoader            : Root WebApplicationContext: initialization completed in 1020 ms
2020-04-06 16:50:29.997 DEBUG 4205 --- [  restartedMain] o.s.b.w.s.ServletContextInitializerBeans : Mapping filters: filterRegistrationBean urls=[/*] order=-2147483647, characterEncodingFilter urls=[/*] order=-2147483648, formContentFilter urls=[/*] order=-9900, requestContextFilter urls=[/*] order=-105
2020-04-06 16:50:29.997 DEBUG 4205 --- [  restartedMain] o.s.b.w.s.ServletContextInitializerBeans : Mapping servlets: dispatcherServlet urls=[/]
2020-04-06 16:50:30.118  INFO 4205 --- [  restartedMain] o.s.s.concurrent.ThreadPoolTaskExecutor  : Initializing ExecutorService 'applicationTaskExecutor'
2020-04-06 16:50:30.129 DEBUG 4205 --- [  restartedMain] s.w.s.m.m.a.RequestMappingHandlerAdapter : ControllerAdvice beans: 0 @ModelAttribute, 0 @InitBinder, 1 RequestBodyAdvice, 1 ResponseBodyAdvice
2020-04-06 16:50:30.183 DEBUG 4205 --- [  restartedMain] s.w.s.m.m.a.RequestMappingHandlerMapping : 2 mappings in 'requestMappingHandlerMapping'
2020-04-06 16:50:30.209 DEBUG 4205 --- [  restartedMain] o.s.w.s.handler.SimpleUrlHandlerMapping  : Patterns [/webjars/**, /**] in 'resourceHandlerMapping'
2020-04-06 16:50:30.219 DEBUG 4205 --- [  restartedMain] .m.m.a.ExceptionHandlerExceptionResolver : ControllerAdvice beans: 0 @ExceptionHandler, 1 ResponseBodyAdvice
2020-04-06 16:50:30.315  INFO 4205 --- [  restartedMain] o.s.b.d.a.OptionalLiveReloadServer       : LiveReload server is running on port 35729
2020-04-06 16:50:30.319  INFO 4205 --- [  restartedMain] o.s.b.a.e.web.EndpointLinksResolver      : Exposing 2 endpoint(s) beneath base path '/actuator'
2020-04-06 16:50:30.370  INFO 4205 --- [  restartedMain] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
2020-04-06 16:50:30.374  INFO 4205 --- [  restartedMain] cn.live.MyApplication                    : Started MyApplication in 1.941 seconds (JVM running for 2.381)
```

### 浏览器打开效果

在浏览器中输入 `http://localhost:8080/actuator` 可以展现如下效果：

``` json
{"_links":{"self":{"href":"http://localhost:8080/actuator","templated":false},"health":{"href":"http://localhost:8080/actuator/health","templated":false},"health-path":{"href":"http://localhost:8080/actuator/health/{*path}","templated":true},"info":{"href":"http://localhost:8080/actuator/info","templated":false}}}
```

### 小结

依稀还记得 2011 年那会儿，Spring 还没有现在这么流行。那时更多的还是，手动下载一个个的 jar 包，然后放在一个 Java Web 工程下面去尝试。Spring Framework + Struts2 + Hibernate 的架构，包含很多 jar 的基础上，还有一些特定版本冲突的问题。那时候，从零构建一个 Java Web 工程，是一件非常苦痛的任务。

而现在，Spring Boot + Maven 的方式，简直不要太香了。

## 二、从启动类剖析

MyApplication.java 是开发人员自定义的启动类，但实际上有效的代码只有两行。分别是 `@SpringBootApplication` 和 `SpringApplication.run()`。

从 `@SpringBootApplication`、`SpringApplication.run()` 两个角度来拆分的话，可以得到下面的树状结构。

```
MyApplication.java
|-- @SpringBootApplication
|   |-- @SpringBootConfiguration
|       |-- @Configuration
|   |-- @EnableAutoConfiguration
|       |-- @AutoConfigurationPackage
|           |-- @Import(AutoConfigurationPackages.Registrar.class)
|       |-- @Import(AutoConfigurationImportSelector.class)
|   |-- @ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class), @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
|       |-- @Repeatable(ComponentScans.class)
|           |-- @ComponentScans
|--SpringApplication.run()
```


### SpringBootApplication 注解部分

> Java 注解用于为 Java 代码提供元数据。作为元数据，注解不直接影响你的代码执行，但也有一些类型的注解实际上可以用于这一目的。

1. SpringBootApplication 注解接口类

``` Java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
```

- @SpringBootApplication 的作用范围在接口、类、枚举、注解接口类。
- @SpringBootApplication 在 class 字节码文件中存在，运行时可以通过反射获取到。
- @SpringBootApplication 将被包含在 javadoc 中去。
- @SpringBootApplication 修饰的类，它的子类可以继承 @SpringBootApplication 注解。
- @SpringBootApplication 等效于同时使用 @SpringBootConfiguration、@EnableAutoConfiguration、@ComponentScan 三个注解。

2. SpringBootConfiguration 注解

``` Java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Configuration
```

- @SpringBootConfiguration 的作用范围在接口、类、枚举、注解接口类。
- @SpringBootConfiguration 在 class 字节码文件中存在，运行时可以通过反射获取到。
- @SpringBootConfiguration 将被包含在 javadoc 中去。

3. Configuration 注解

``` Java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
```

- @Configuration 的作用范围在接口、类、枚举、注解接口类。
- @Configuration 在 class 字节码文件中存在，运行时可以通过反射获取到。
- @Configuration 将被包含在 javadoc 中去。
- @Configuration 注解使用 @Component 之后，会被实例化到 Spring 容器中。

4. EnableAutoConfiguration 注解

``` java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)
```

- @EnableAutoConfiguration 的作用范围在接口、类、枚举、注解接口类。
- @EnableAutoConfiguration 在 class 字节码文件中存在，运行时可以通过反射获取到。
- @EnableAutoConfiguration 将被包含在 javadoc 中去。
- @EnableAutoConfiguration 修饰的类，它的子类可以继承 @EnableAutoConfiguration 注解。
- @EnableAutoConfiguration 修饰的类，会将 AutoConfigurationImportSelector 自动注入到 Spring 容器中。

5. AutoConfigurationPackage 注解

``` java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Import(AutoConfigurationPackages.Registrar.class)
```

- @AutoConfigurationPackage 的作用范围在接口、类、枚举、注解接口类。
- @AutoConfigurationPackage 在 class 字节码文件中存在，运行时可以通过反射获取到。
- @AutoConfigurationPackage 将被包含在 javadoc 中去。
- @AutoConfigurationPackage 修饰的类，它的子类可以继承 @AutoConfigurationPackage 注解。
- @AutoConfigurationPackage 修饰的类，会将 AutoConfigurationPackages.Registrar 自动注入到 Spring 容器中。

6. ComponentScan 注解

``` java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
@Repeatable(ComponentScans.class)
```

- @ComponentScan 在 class 字节码文件中存在，运行时可以通过反射获取到。
- @ComponentScan 的作用范围在接口、类、枚举、注解接口类。
- @ComponentScan 将被包含在 javadoc 中去。

7. ComponentScans 注解

``` java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
```

- @ComponentScan 在 class 字节码文件中存在，运行时可以通过反射获取到。
- @ComponentScan 的作用范围在接口、类、枚举、注解接口类。
- @ComponentScan 将被包含在 javadoc 中去。

以上是 @SpringBootApplication 注解的展开内容。所有的注解加起来，只做了两件事。

- 标注
- 将指定类注入到 Spring 容器中
	- AutoConfigurationImportSelector
	- AutoConfigurationPackages.Registrar
	- TypeExcludeFilter
	- AutoConfigurationExcludeFilter

### SpringApplication.run() 部分

1. new SpringApplication(primarySources)

``` java
@SuppressWarnings({ "unchecked", "rawtypes" })
	public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
		this.resourceLoader = resourceLoader;
		Assert.notNull(primarySources, "PrimarySources must not be null");
		this.primarySources = new LinkedHashSet<>(Arrays.asList(primarySources));
		this.webApplicationType = WebApplicationType.deduceFromClasspath();
		setInitializers((Collection) getSpringFactoriesInstances(ApplicationContextInitializer.class));
		setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));
		this.mainApplicationClass = deduceMainApplicationClass();
	}
```

- 初始化 resourceLoader
- 初始化 PrimarySources
- 初始化 webApplicationType
- 初始化 ApplicationContext 构造器
- 初始化 ApplicationListener 应用监听器
- 初始化 mainApplicationClass

2. SpringApplication.run(args)

``` java
public ConfigurableApplicationContext run(String... args) {
	StopWatch stopWatch = new StopWatch();
	stopWatch.start();
	ConfigurableApplicationContext context = null;
	Collection<SpringBootExceptionReporter> exceptionReporters = new ArrayList<>();
	configureHeadlessProperty();
	SpringApplicationRunListeners listeners = getRunListeners(args);
	listeners.starting();
	try {
		ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
		ConfigurableEnvironment environment = prepareEnvironment(listeners, applicationArguments);
		configureIgnoreBeanInfo(environment);
		Banner printedBanner = printBanner(environment);
		context = createApplicationContext();
		exceptionReporters = getSpringFactoriesInstances(SpringBootExceptionReporter.class, new Class[] { ConfigurableApplicationContext.class }, context);
		prepareContext(context, environment, listeners, applicationArguments, printedBanner);
		refreshContext(context);
		afterRefresh(context, applicationArguments);
		stopWatch.stop();
		if (this.logStartupInfo) {
			new StartupInfoLogger(this.mainApplicationClass).logStarted(getApplicationLog(), stopWatch);
		}
		listeners.started(context);
		callRunners(context, applicationArguments);
	}
	catch (Throwable ex) {
		handleRunFailure(context, ex, exceptionReporters, listeners);
		throw new IllegalStateException(ex);
	}

	try {
		listeners.running(context);
	}
	catch (Throwable ex) {
		handleRunFailure(context, ex, exceptionReporters, null);
		throw new IllegalStateException(ex);
	}
	return context;
}
```

- 初始化应用计数器，并启动。
- 初始化应用监听组，并启动。
- 准备环境变量
- Banner 彩蛋
- 创建 ApplicationContext
- 获取排除工厂实例
- 准备 ApplicationContext
- 刷新 ApplicationContext
- 刷新后处理 ApplicationContext
- 停止应用计数器
- 回调监听组
- 回调 ApplicationRunner、CommandLineRunner 接口
- 运行应用监听组

### 小结

简单翻阅了源代码，了解 `@SpringBootApplication` 都包含哪些注解标记。以及 `SpringApplication.run()` 执行的之后，都有哪些步骤。
