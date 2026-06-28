---
layout: post
title: Spring Boot 特性之 Failure Analysis
description: 深入挖掘了一下 Spring Boot 的 Failure Analysis 特性。很人性化的提示机制，实现方式也比较简单。
---

Failure Analysis 就是：SpringBoot 启动错误时，日志会打印专业的错误信息和解决该问题的具体措施。

**举个例子**

当重复启动 SpringBoot 会输出以下信息：

``` java
Error starting ApplicationContext. To display the conditions report re-run your application with 'debug' enabled.
2020-04-11 14:20:06.773 ERROR 1899 --- [  restartedMain] o.s.b.d.LoggingFailureAnalysisReporter   :

***************************
APPLICATION FAILED TO START
***************************

Description:

Web server failed to start. Port 8080 was already in use.

Action:

Identify and stop the process that's listening on port 8080 or configure this application to listen on another port.
```

## 一、从日志类剖析

日志输出类是`o.s.b.d.LoggingFailureAnalysisReporter`，内容有错误描述`Description`和解决措施`Action`。

### LoggingFailureAnalysisReporter

``` java
public final class LoggingFailureAnalysisReporter implements FailureAnalysisReporter {

 private static final Log logger = LogFactory.getLog(LoggingFailureAnalysisReporter.class);

 @Override
 public void report(FailureAnalysis failureAnalysis) {
   if (logger.isDebugEnabled()) {
     logger.debug("Application failed to start due to an exception", failureAnalysis.getCause());
   }
   if (logger.isErrorEnabled()) {
     logger.error(buildMessage(failureAnalysis));
   }
 }

 private String buildMessage(FailureAnalysis failureAnalysis) {
   StringBuilder builder = new StringBuilder();
   builder.append(String.format("%n%n"));
   builder.append(String.format("***************************%n"));
   builder.append(String.format("APPLICATION FAILED TO START%n"));
   builder.append(String.format("***************************%n%n"));
   builder.append(String.format("Description:%n%n"));
   builder.append(String.format("%s%n", failureAnalysis.getDescription()));
   if (StringUtils.hasText(failureAnalysis.getAction())) {
     builder.append(String.format("%nAction:%n%n"));
     builder.append(String.format("%s%n", failureAnalysis.getAction()));
   }
   return builder.toString();
 }
}
```

LoggingFailureAnalysisReporter 是一个 实现 FailureAnalysisReporter 接口的 final 类。

- 重写 report 方法，根据日志的允许输出的级别，打印传入参数 failureAnalysis 的信息。
- 私有 buildMessage 方法，将传入参数 failureAnalysis 按照指定样式拼接成字符串。

### FailureAnalysisReporter

``` java
@FunctionalInterface
public interface FailureAnalysisReporter {
	void report(FailureAnalysis analysis);
}
```

`@FunctionalInterface` 注解修饰的功能性接口只提供一个 `void report(FailureAnalysis analysis)` 方法，向开发人员输出被传入的 analysis 对象。

### FailureAnalysis

``` java
public class FailureAnalysis {
	private final String description;
	private final String action;
	private final Throwable cause;

	public FailureAnalysis(String description, String action, Throwable cause) {
		this.description = description;
		this.action = action;
		this.cause = cause;
	}

	public String getDescription() {
		return this.description;
	}

	public String getAction() {
		return this.action;
	}

	public Throwable getCause() {
		return this.cause;
	}

}

```

一个简单的失败分析对象，包含三个属性：

- description，自定义的错误描述。
- action，自定义的解决措施。
- cause，完整的错误堆栈。

## 二、从 Spring 加载剖析

### SpringFactoriesLoader

``` java
public final class SpringFactoriesLoader {

	public static final String FACTORIES_RESOURCE_LOCATION = "META-INF/spring.factories";

	private static final Log logger = LogFactory.getLog(SpringFactoriesLoader.class);

	private static final Map<ClassLoader, MultiValueMap<String, String>> cache = new ConcurrentReferenceHashMap<>();

	private SpringFactoriesLoader() {
	}

	public static <T> List<T> loadFactories(Class<T> factoryType, @Nullable ClassLoader classLoader) {
		Assert.notNull(factoryType, "'factoryType' must not be null");
		ClassLoader classLoaderToUse = classLoader;
		if (classLoaderToUse == null) {
			classLoaderToUse = SpringFactoriesLoader.class.getClassLoader();
		}
		List<String> factoryImplementationNames = loadFactoryNames(factoryType, classLoaderToUse);
		if (logger.isTraceEnabled()) {
			logger.trace("Loaded [" + factoryType.getName() + "] names: " + factoryImplementationNames);
		}
		List<T> result = new ArrayList<>(factoryImplementationNames.size());
		for (String factoryImplementationName : factoryImplementationNames) {
			result.add(instantiateFactory(factoryImplementationName, factoryType, classLoaderToUse));
		}
		AnnotationAwareOrderComparator.sort(result);
		return result;
	}

	public static List<String> loadFactoryNames(Class<?> factoryType, @Nullable ClassLoader classLoader) {
		String factoryTypeName = factoryType.getName();
		return loadSpringFactories(classLoader).getOrDefault(factoryTypeName, Collections.emptyList());
	}

	private static Map<String, List<String>> loadSpringFactories(@Nullable ClassLoader classLoader) {
		MultiValueMap<String, String> result = cache.get(classLoader);
		if (result != null) {
			return result;
		}

		try {
			Enumeration<URL> urls = (classLoader != null ?
					classLoader.getResources(FACTORIES_RESOURCE_LOCATION) :
					ClassLoader.getSystemResources(FACTORIES_RESOURCE_LOCATION));
			result = new LinkedMultiValueMap<>();
			while (urls.hasMoreElements()) {
				URL url = urls.nextElement();
				UrlResource resource = new UrlResource(url);
				Properties properties = PropertiesLoaderUtils.loadProperties(resource);
				for (Map.Entry<?, ?> entry : properties.entrySet()) {
					String factoryTypeName = ((String) entry.getKey()).trim();
					for (String factoryImplementationName : StringUtils.commaDelimitedListToStringArray((String) entry.getValue())) {
						result.add(factoryTypeName, factoryImplementationName.trim());
					}
				}
			}
			cache.put(classLoader, result);
			return result;
		}
		catch (IOException ex) {
			throw new IllegalArgumentException("Unable to load factories from location [" +
					FACTORIES_RESOURCE_LOCATION + "]", ex);
		}
	}

	@SuppressWarnings("unchecked")
	private static <T> T instantiateFactory(String factoryImplementationName, Class<T> factoryType, ClassLoader classLoader) {
		try {
			Class<?> factoryImplementationClass = ClassUtils.forName(factoryImplementationName, classLoader);
			if (!factoryType.isAssignableFrom(factoryImplementationClass)) {
				throw new IllegalArgumentException(
						"Class [" + factoryImplementationName + "] is not assignable to factory type [" + factoryType.getName() + "]");
			}
			return (T) ReflectionUtils.accessibleConstructor(factoryImplementationClass).newInstance();
		}
		catch (Throwable ex) {
			throw new IllegalArgumentException(
				"Unable to instantiate factory class [" + factoryImplementationName + "] for factory type [" + factoryType.getName() + "]",
				ex);
		}
	}

}
```

SpringFactoriesLoader 是 Spring 框架内部使用的通用工厂加载机制。

- 静态公共参数，需要加载工厂类的位置，即 `META-INF/spring.factories`。
- 静态私有参数，使用 LogFactory 进行初始化的日志类 logger。
- 静态私有参数，使用 ConcurrentReferenceHashMap 初始化的集合 cache。
- 构造器私有化，不允许进行 new 实例化。
- 静态公共方法 loadFactories
- 静态公共方法 loadFactoryNames
- 静态私有方法 loadSpringFactories
- 静态私有方法 instantiateFactory

**loadFactories 方法**

- 传入参数 factoryType 代表工厂类的接口或抽象类。
- 传入参数 classLoader 代表使用的类加载器，可以为空。
- 检查 factoryType 不允许为空
- 判断 classLoader 是否为空
  - 为空时，使用当前类 SpringFactoriesLoader 的类加载器。
- 调用`loadFactoryNames 方法`
- 判断日志是否允许 trace 级别输出
  - 允许时，将调用`loadFactoryNames 方法`的结果输出到日志。
- 初始化一个空 ArrayList 集合
- 循环 factoryImplementationName
  - 调用`instantiateFactory 方法`
  - 将调用结果放入 ArrayList 集合中
- 使用 AnnotationAwareOrderComparator 进行排序
- 结束方法并返回 ArrayList 集合

**loadFactoryNames 方法**

- 传入参数 factoryType 代表工厂类的接口或抽象类。
- 传入参数 classLoader 代表使用的类加载器，可以为空。
- 获取 factoryType 的名称
- 调用`loadSpringFactories 方法`
- 结束方法并返回调用结果中的 List 集合
  - 当 List 集合为空时，返回一个空的 List 集合。

**loadSpringFactories 方法**

- 传入参数 classLoader 代表使用的类加载器，可以为空。
- 从 cache 缓存中获取 Map 集合
  - 当结果不为空时，结束方法并返回该结果。
- 获取所有 "META-INF/spring.factories" 的绝对路径集合
- 初始化一个空 LinkedMultiValueMap 对象：result
- 循环绝对路径集合
  - 获取下一个路径 url
  - 加载路径到 UrlResource
  - 将 UrlResource 解析成 Properties 对象
  - 循环 Properties 对象节点
    - 获取 key 的值：factoryTypeName
    - 循环 value 的值，以 `,` 为分隔符转换成 List 集合，并循环放入集合 result 中。
- 放入 cache 集合
- 结束方法并返回对象：result

** instantiateFactory 方法**

- 传入参数 factoryImplementationName 代表类的完整路径，从`META-INF/spring.factories`中来。
- 传入参数 factoryType 代表工厂类的接口或抽象类。
- 传入参数 classLoader 代表使用的类加载器，可以为空。
- 使用类工具，将 factoryImplementationName 字符串转换成类引用 factoryImplementationClass。
- 判断 factoryImplementationClass 类是否为 factoryType 类的超类或者超接口类
  - 不是，抛出异常
- 结束方法并返回通过反射初始化的 factoryImplementationClass 实例。

### spring.factories

`spring-boot-2.2.6.RELEASE.jar` 源码包中，包含了一个 `spring.factories` 文件。

``` factories
# Error Reporters
org.springframework.boot.SpringBootExceptionReporter=\
org.springframework.boot.diagnostics.FailureAnalyzers

# Failure Analyzers
org.springframework.boot.diagnostics.FailureAnalyzer=\
org.springframework.boot.diagnostics.analyzer.BeanCurrentlyInCreationFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.BeanDefinitionOverrideFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.BeanNotOfRequiredTypeFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.BindFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.BindValidationFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.UnboundConfigurationPropertyFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.ConnectorStartFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.NoSuchMethodFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.NoUniqueBeanDefinitionFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.PortInUseFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.ValidationExceptionFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.InvalidConfigurationPropertyNameFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.InvalidConfigurationPropertyValueFailureAnalyzer

# FailureAnalysisReporters
org.springframework.boot.diagnostics.FailureAnalysisReporter=\
org.springframework.boot.diagnostics.LoggingFailureAnalysisReporter
```

Properties 格式的配置文件。等号前面是接口类全路径，等号后面是接口实现类的全路径。

SpringFactoriesLoader 类在加载工厂类时，会将 factories 文件中的实现类进行实例化。

## 总结

Failure Analysis，是 Spring 启动类预先准备好的错误说明、解决措施。Spring 启动时，会通过 SpringFactoriesLoader 加载 spring.factories 文件中配置的类路径。当 Spring 启动报错时，会调用日志输出接口。该接口会返回具体类的重写接口的结果，并写入日志文件。

最后，下周二继续努力。
