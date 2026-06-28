---
layout: post
title: Spring Boot 特性之 Lazy
description: 深入挖掘了一下 Spring Boot 的 Lazy 特性。用于快速启动的延迟初始化，实现方式也比较简单。
---

## 如何使用

1. 全局配置方式

在 `application.properties` 文件中加入下面的配置信息。

``` properties
spring.main.lazy-initialization=true
```

从启动输出日志观察，全局延迟初始化会省略很多的 Bean 初始化日志。也就意味着 Spring Boot 已经支持延迟初始化（默认是关闭状态），当全局延迟初始化配置开启后。会大幅缩短应用启动时间、与占用的内存大小。

2. 注解方式

在需要延迟初始化的类、方法，构造器加上 `@Lazy` 注解。

``` java
@Target({ElementType.TYPE, ElementType.METHOD, ElementType.CONSTRUCTOR, ElementType.PARAMETER, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Lazy {
	boolean value() default true;
}
```

比较喜欢使用这种方式：默认全局延迟初始化关闭的情况下，对业务逻辑代码使用 `@Lazy` 单独配置延迟初始化。

以上是简单常用的两种方式。其他例如 XML 配置等相对比较复杂的方式，就不多做介绍了。

## 举个栗子

首先，举一个全局延迟初始化的栗子

**LazyBean.java**

``` java
public class LazyBean {
  private final String id;

  public LazyBean(String id) {
    this.id = id;
    System.out.println(id + " initialized!!!");
  }

  public void lazy(String message) {
    System.out.println(id + ": " + message);
  }
}
```

**MyApplication.java**

``` java
@SpringBootApplication
public class MyApplication {

  @Bean(value = "lazyBean1")
  public LazyBean getLazyBean1() {
    return new LazyBean("LazyBean 1");
  }

  @Bean(value = "lazyBean2")
  public LazyBean getLazyBean2() {
    return new LazyBean("LazyBean 2");
  }

  public static void main(String[] args) {
    ApplicationContext ctx = SpringApplication.run(MyApplication.class, args);

    System.out.println("Application context initialized!!!");

    LazyBean lazyBean1 = ctx.getBean("lazyBean1", LazyBean.class);
    lazyBean1.lazy("First message");

    LazyBean lazyBean2 = ctx.getBean("lazyBean2", LazyBean.class);
    lazyBean2.lazy("Second message");
  }
}
```

**打印日志(正常加载顺序)**

当全局延迟初始化默认关闭的时候，日志打印如下：

``` java
LazyBean 1 initialized!!!
LazyBean 2 initialized!!!
Application context initialized!!!
LazyBean 1: First message
LazyBean 2: Second message
```

**application.properties**

通过配置文件，启动全局延迟初始化。

``` properties
spring.main.lazy-initialization=true
```

**打印日志(延迟加载顺序)**

当全局延迟初始化开启的时候，日志打印如下：

``` java
Application context initialized!!!
LazyBean 1 initialized!!!
LazyBean 1: First message
LazyBean 2 initialized!!!
LazyBean 2: Second message
```

**日志分析**

- 正常加载时
	- `SpringApplication.run(MyApplication.class, args)` 启动应用程序
	- 初始化 `LazyBean 1`
	- 初始化 `LazyBean 2`
	- 应用程序初始化成功
	- 调用 `LazyBean 1` 实例的的 lazy 方法。
	- 调用 `LazyBean 2` 实例的的 lazy 方法。
- 延迟加载时
	- `SpringApplication.run(MyApplication.class, args)` 启动应用程序
	- 应用程序初始化成功
	- 初始化 `LazyBean 1`
	- 调用 `LazyBean 1` 实例的的 lazy 方法。
	- 初始化 `LazyBean 2`
	- 调用 `LazyBean 2` 实例的的 lazy 方法。

### 从 Bean 启动方向剖析

深入 `SpringApplication.run(MyApplication.class, args)` 源码，沿着 ApplicationContext 初始化的代码，可以找到 Bean 实例化的方式 `beanFactory.preInstantiateSingletons();`。

1. DefaultListableBeanFactory.java

``` java
@Override
public void preInstantiateSingletons() throws BeansException {
 if (logger.isTraceEnabled()) {
  logger.trace("Pre-instantiating singletons in " + this);
 }
 List<String> beanNames = new ArrayList<>(this.beanDefinitionNames);
 for (String beanName : beanNames) {
  RootBeanDefinition bd = getMergedLocalBeanDefinition(beanName);
  if (!bd.isAbstract() && bd.isSingleton() && !bd.isLazyInit()) {
   if (isFactoryBean(beanName)) {
    Object bean = getBean(FACTORY_BEAN_PREFIX + beanName);
    if (bean instanceof FactoryBean) {
     final FactoryBean<?> factory = (FactoryBean<?>) bean;
     boolean isEagerInit;
     if (System.getSecurityManager() != null && factory instanceof SmartFactoryBean) {
      isEagerInit = AccessController.doPrivileged((PrivilegedAction<Boolean>)
          ((SmartFactoryBean<?>) factory)::isEagerInit,
        getAccessControlContext());
     }
     else {
      isEagerInit = (factory instanceof SmartFactoryBean &&
        ((SmartFactoryBean<?>) factory).isEagerInit());
     }
     if (isEagerInit) {
      getBean(beanName);
     }
    }
   }
   else {
    getBean(beanName);
   }
  }
 }
 for (String beanName : beanNames) {
  Object singletonInstance = getSingleton(beanName);
  if (singletonInstance instanceof SmartInitializingSingleton) {
   final SmartInitializingSingleton smartSingleton = (SmartInitializingSingleton) singletonInstance;
   if (System.getSecurityManager() != null) {
    AccessController.doPrivileged((PrivilegedAction<Object>) () -> {
     smartSingleton.afterSingletonsInstantiated();
     return null;
    }, getAccessControlContext());
   }
   else {
    smartSingleton.afterSingletonsInstantiated();
   }
  }
 }
}

```

从上面代码可以看到 `if (!bd.isAbstract() && bd.isSingleton() && !bd.isLazyInit()) {`。也就是应用启动过程中，会主动的过滤到需要延迟初始化的 Bean。

## 再举个栗子

最后，再举一个默认关闭全局延迟初始化的情况下，对业务代码使用 `@Lazy` 进行延迟初始化。

**BootController.java**

``` java
@RestController
public class BootController {

  private final BootService bootService;

  @Lazy(true)
  public BootController(BootService bootService) {
    this.bootService = bootService;
  }

  @GetMapping(path = "/boot/hello")
  public String hello() {
    return bootService.hello();
  }

}
```

**BootService.java**

``` java
public interface BootService {
  String hello();
}
```

**BootServiceImpl.java**

``` java
@Lazy(true)
@Service
public class BootServiceImpl implements BootService {

  BootServiceImpl() {
    System.out.println("BootServiceImpl init");
  }

  @Override
  public String hello() {
    System.out.println("hello");
    return "hello";
  }
}
```

**打印日志**

在浏览器访问 `http://localhost:8080/boot/hello` 地址的时候，截取了部分日志信息，如下：

``` java
o.s.w.s.m.m.a.RequestMappingHandlerMapping 414 - Mapped to cn.live.controller.BootController#hello()
20:20:44.401 default [http-nio-8080-exec-1] DEBUG o.s.b.f.s.DefaultListableBeanFactory 213 - Creating shared instance of singleton bean 'bootServiceImpl'
BootServiceImpl init
hello
20:20:44.423 default [http-nio-8080-exec-1] DEBUG o.s.w.s.m.m.a.RequestResponseBodyMethodProcessor 265 - Using 'text/html', given [text/html, application/xhtml+xml, image/webp, image/apng, application/xml;q=0.9, application/signed-exchange;v=b3;q=0.9, */*;q=0.8] and supported [text/plain, */*, text/plain, */*, application/json, application/*+json, application/json, application/*+json]
```

### 从日志方向剖析

当发生业务请求时，`o.s.b.f.s.DefaultListableBeanFactory` 会对延迟初始化的类进行实例化。


1. DefaultSingletonBeanRegistry.java

``` java
public Object getSingleton(String beanName, ObjectFactory<?> singletonFactory) {
		Assert.notNull(beanName, "Bean name must not be null");
		synchronized (this.singletonObjects) {
			Object singletonObject = this.singletonObjects.get(beanName);
			if (singletonObject == null) {
				if (this.singletonsCurrentlyInDestruction) {
					throw new BeanCreationNotAllowedException(beanName,
							"Singleton bean creation not allowed while singletons of this factory are in destruction " +
							"(Do not request a bean from a BeanFactory in a destroy method implementation!)");
				}
				if (logger.isDebugEnabled()) {
					logger.debug("Creating shared instance of singleton bean '" + beanName + "'");
				}
				beforeSingletonCreation(beanName);
				boolean newSingleton = false;
				boolean recordSuppressedExceptions = (this.suppressedExceptions == null);
				if (recordSuppressedExceptions) {
					this.suppressedExceptions = new LinkedHashSet<>();
				}
				try {
					singletonObject = singletonFactory.getObject();
					newSingleton = true;
				}
				catch (IllegalStateException ex) {
					singletonObject = this.singletonObjects.get(beanName);
					if (singletonObject == null) {
						throw ex;
					}
				}
				catch (BeanCreationException ex) {
					if (recordSuppressedExceptions) {
						for (Exception suppressedException : this.suppressedExceptions) {
							ex.addRelatedCause(suppressedException);
						}
					}
					throw ex;
				}
				finally {
					if (recordSuppressedExceptions) {
						this.suppressedExceptions = null;
					}
					afterSingletonCreation(beanName);
				}
				if (newSingleton) {
					addSingleton(beanName, singletonObject);
				}
			}
			return singletonObject;
		}
	}
```

## 总结

延迟初始化，确实可以减少应用程序启动的时间，也可以减少应用程序启动所占用的内存。

但是，带来了不能及时发现应用程序问题的不便。例如：当调用某个业务方法时，才发现相关的 Bean 存在问题。应用程序启动后一段时间，出现内存溢出问题。

（｀Δ´）ゞ
