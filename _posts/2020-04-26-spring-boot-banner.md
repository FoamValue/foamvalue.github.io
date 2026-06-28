---
layout: post
title: Spring Boot 特性之 Banner
description: 深入挖掘了一下 Spring Boot 的 Banner 特性。个性化横幅日志，实现方式也比较简单。
---

Banner 特性是通过自定义的 banner.txt 文件，替换启动时打印的横幅。除了文字之外，还可以使用 banner.gif，banner.jpg、banner.png 图像文件，将图像转换为 ASCII 艺术作品进行打印。

## 举个例子

**application.properties**

``` java
# Banner
application.version=0.0.1
application.formatted-version=v0.0.1
spring-boot.version=2.2.6.RELEASE
spring-boot.formatted-version=v2.2.6.RELEASE
application.title=\u8fd9\u662f\u4e2a\u0020\u0044\u0065\u006d\u006f\u0020\u5de5\u7a0b
```

**banner.txt**

``` java
.   ____          _            __ _ _
/\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
\\/  ___)| |_)| | | | | || (_| |  ) ) ) )
'  |____| .__|_| |_|_| |_\__, | / / / /
=========|_|==============|___/=/_/_/_/

Application Title: ${application.title}
Application Version: ${application.version} [${application.formatted-version}]
Spring Boot Version: ${spring-boot.version} [${spring-boot.formatted-version}]

```

**日志输出**

``` java
.   ____          _            __ _ _
/\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
\\/  ___)| |_)| | | | | || (_| |  ) ) ) )
'  |____| .__|_| |_|_| |_\__, | / / / /
=========|_|==============|___/=/_/_/_/

Application Title: 这是个 Demo 工程
Application Version: 0.0.1 [v0.0.1]
Spring Boot Version: 2.2.6.RELEASE [v2.2.6.RELEASE]

...
Application context initialized!!!

```

## 启动顺序剖析

**Application.java**

- 应用程序启动的 `run()` 方法
``` java
...
public ConfigurableApplicationContext run(String... args) {
  ...
  Banner printedBanner = printBanner(environment);
  ...
```
 - 将 environment 对象传入 printBanner 方法中，获取返回 Banner 接口对象。


- printBanner 方法
``` java
private Banner printBanner(ConfigurableEnvironment environment) {
  if (this.bannerMode == Banner.Mode.OFF) {
    return null;
  }
  ResourceLoader resourceLoader = (this.resourceLoader != null) ? this.resourceLoader
      : new DefaultResourceLoader(getClassLoader());
  SpringApplicationBannerPrinter bannerPrinter = new SpringApplicationBannerPrinter(resourceLoader, this.banner);
  if (this.bannerMode == Mode.LOG) {
    return bannerPrinter.print(environment, this.mainApplicationClass, logger);
  }
  return bannerPrinter.print(environment, this.mainApplicationClass, System.out);
}
```
  - 判断 `Banner.Mode.OFF` 成立时，结束并返回 null。
  - 初始化 SpringApplicationBannerPrinter 对象。
  - 调用 bannerPrinter.print 方法，结束并返回 Banner 接口对象。
    - 判断 `Mode.LOG` 的类型，执行不同的 print 方法。

## 源代码剖析

**Banner.java**

``` java
@FunctionalInterface
public interface Banner {
	void printBanner(Environment environment, Class<?> sourceClass, PrintStream out);
	enum Mode {
		OFF,
		CONSOLE,
		LOG
	}
}
```
- 无返回值的打印接口
- 打印方式枚举
  - OFF 关闭
  - CONSOLE 命令行
  - LOG 日志文件

**Banner 接口都有哪些实现类**

- SpringBootBanner.java
  - 默认实现类
- ResourceBanner.java
  - 处理文本资源
- ImageBanner.java
  - 处理图像资源
- SpringApplicationBannerPrinter.Banners.java
  - 私有静态内部类
- SpringApplicationBannerPrinter.PrintedBanner.java
  - 私有静态内部类

其中，SpringBootBanner、ResourceBanner、ImageBanner 三个类内容比较简单，本文就不再展开叙述。

有兴趣的小伙伴，可以自行阅读 ResourceBanner（如何读取文本资源）、以及 ImageBanner（如何读取并处理图像资源）的代码。

**SpringApplicationBannerPrinter.java**

SpringApplicationBannerPrinter 是 Spring 应用程序用来打印 Banner 信息的类。

整个文件不到 100 多行的代码量。为了方便剖析，我把代码拆解成以下多份内容。

- 静态参数与构造器
``` java
static final String BANNER_LOCATION_PROPERTY = "spring.banner.location";
static final String BANNER_IMAGE_LOCATION_PROPERTY = "spring.banner.image.location";
static final String DEFAULT_BANNER_LOCATION = "banner.txt";
static final String[] IMAGE_EXTENSION = { "gif", "jpg", "png" };
private static final Banner DEFAULT_BANNER = new SpringBootBanner();
private final ResourceLoader resourceLoader;
private final Banner fallbackBanner;
SpringApplicationBannerPrinter(ResourceLoader resourceLoader, Banner fallbackBanner) {
	this.resourceLoader = resourceLoader;
	this.fallbackBanner = fallbackBanner;
}
```
  - properties 配置信息的前缀定义
  - 默认的文本资源名称。
  - 默认的图像资源后缀。
  - 默认的 Banner 接口对象，SpringBootBanner 类。
  - 资源加载器
  - 回调 Banner 接口对象。
  - 构造器，允许传入资源加载器、回调 Banner 接口对象。


- 获取 Banner 接口对象
``` java
private Banner getBanner(Environment environment) {
  Banners banners = new Banners();
  banners.addIfNotNull(getImageBanner(environment));
  banners.addIfNotNull(getTextBanner(environment));
  if (banners.hasAtLeastOneBanner()) {
    return banners;
  }
  if (this.fallbackBanner != null) {
    return this.fallbackBanner;
  }
  return DEFAULT_BANNER;
}
```

 - 初始化 Banners 对象。
 - 调用 Banners 的 addIfNotNull 方法。
 - 判断 Banners 不为空时，结束并返回 Banners 对象。
  - 使用资源文件中的 Banner 配置
 - 判断 fallbackBanner 不为空时，结束并返回 fallbackBanner 对象。
  - 使用构造器传入的 Banner 接口对象。
 - 当 fallbackBanner 为空时。返回默认的 DEFAULT_BANNER 对象。
  - 默认的 SpringBootBanner 对象。


- 从 environment 对象读取图像、文本 Banner 方法。
``` java
private Banner getTextBanner(Environment environment) {
	String location = environment.getProperty(BANNER_LOCATION_PROPERTY, DEFAULT_BANNER_LOCATION);
	Resource resource = this.resourceLoader.getResource(location);
	if (resource.exists()) {
		return new ResourceBanner(resource);
	}
	return null;
}
private Banner getImageBanner(Environment environment) {
	String location = environment.getProperty(BANNER_IMAGE_LOCATION_PROPERTY);
	if (StringUtils.hasLength(location)) {
		Resource resource = this.resourceLoader.getResource(location);
		return resource.exists() ? new ImageBanner(resource) : null;
	}
	for (String ext : IMAGE_EXTENSION) {
		Resource resource = this.resourceLoader.getResource("banner." + ext);
		if (resource.exists()) {
			return new ImageBanner(resource);
		}
	}
	return null;
}
```
  - 从 environment 对象中读取 Properties 文件中关于 Banner 的配置信息。
  - 判断读取的配置信息在资源文件中是否存在。
  - 当配置存在时，是否 ResourceBanner 或 ImageBanner 读取资源文件。
  - 当配置不存在时，返回 null。


- 私有静态内部类 Banners
``` java
private static class Banners implements Banner {
	private final List<Banner> banners = new ArrayList<>();
	void addIfNotNull(Banner banner) {
		if (banner != null) {
			this.banners.add(banner);
		}
	}
	boolean hasAtLeastOneBanner() {
		return !this.banners.isEmpty();
	}
	@Override
	public void printBanner(Environment environment, Class<?> sourceClass, PrintStream out) {
		for (Banner banner : this.banners) {
			banner.printBanner(environment, sourceClass, out);
		}
	}
}
```
 - 初始化 Banner 接口集合对象 banners。
 - addIfNotNull 方法，当传入的 banner 对象不为空时，加入到 banners 集合中。
 - hasAtLeastOneBanner 方法，判断 banners 对象是否为空。为空时，返回 false。
 - printBanner 方法，循环调用 banners 对象的 printBanner 方法。


- 打印方法
``` java
Banner print(Environment environment, Class<?> sourceClass, Log logger) {
	Banner banner = getBanner(environment);
	try {
		logger.info(createStringFromBanner(banner, environment, sourceClass));
	}
	catch (UnsupportedEncodingException ex) {
		logger.warn("Failed to create String for banner", ex);
	}
	return new PrintedBanner(banner, sourceClass);
}
Banner print(Environment environment, Class<?> sourceClass, PrintStream out) {
	Banner banner = getBanner(environment);
	banner.printBanner(environment, sourceClass, out);
	return new PrintedBanner(banner, sourceClass);
}
```
  - 通过调用 getBanner 方法获取到 Banner 接口对象后。
  - 日志输出 createStringFromBanner 方法结果。
  - 最终返回 PrintedBanner 对象


- createStringFromBanner 方法
``` java
private String createStringFromBanner(Banner banner, Environment environment, Class<?> mainApplicationClass)
			throws UnsupportedEncodingException {
	ByteArrayOutputStream baos = new ByteArrayOutputStream();
	banner.printBanner(environment, mainApplicationClass, new PrintStream(baos));
	String charset = environment.getProperty("spring.banner.charset", "UTF-8");
	return baos.toString(charset);
}
```
 - 调用 banner.printBanner 方法，获取输出对象 baos。
 - 从 environment 中获取 banner 编码格式配置
 - 最后返回 baos 字符串。


- 私有静态内部类 PrintedBanner
``` java
private static class PrintedBanner implements Banner {
	private final Banner banner;
	private final Class<?> sourceClass;
	PrintedBanner(Banner banner, Class<?> sourceClass) {
		this.banner = banner;
		this.sourceClass = sourceClass;
	}
	@Override
	public void printBanner(Environment environment, Class<?> sourceClass, PrintStream out) {
		sourceClass = (sourceClass != null) ? sourceClass : this.sourceClass;
		this.banner.printBanner(environment, sourceClass, out);
	}
}
```
 - 使用了装饰器模式。
 - 提供了一个带参数的构造器。
 - 重写了 printBanner 方法。

## 总结

用一句话来概括，当 Spring 应用程序启动时，读取资源文件信息并打印在命令行或日志文件中。

每天阅读一点点源代码，加油。
