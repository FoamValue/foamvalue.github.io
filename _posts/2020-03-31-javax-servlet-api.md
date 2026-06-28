---
layout: post
title: Servlet API 源码剖析
description: Servlet 存在于各个 Web 应用程序之中，承担着用户浏览器与服务器之间的信息交互，是一个容易忽视又非常重要的软件程序。互联网时代的当下，大到某宝、小到V商都无时无刻不使用着 Servlet。
---

## 从目录出发

从目录出发，整个源代码分为 servlet、http、descriptor、annotation 四个部分。

其中 servlet 部分是最重要的，它是定义了与 Servlet 容器相关的 Java Servlet 接口、类。http 部分是第二重要的，它承接了 HTTP 协议相关的 Java Servlet 实现。剩下的 descriptor、annotation 部分虽然也重要，但相对来说比较简单。descriptor 部分用于从 web.xml、web-fragment.xml 中获取 web 应用配置信息的功能。annotation 部分用于注解的方式替换在 web.xml 中的繁琐配置。

这里要提下 Servlet 的两次重要版本更新。

首先是 Servlet 3.0 版本带来的新特性（如下列表）。descriptor、annotation 部分也就是这个时候引入 Servlet 之中的。

1. 注解支持：允许使用注解的方式，来替换原来在 web.xml 中的 Servlet、Listener、Filter 配置。
2. web 模块化：允许 Servlet、Listener、Filter 类文件单独打包成 jar 包，放在 WEB-INF\lib 目录下，配合 web-fragment.xml 使用。
3. Servlet 异步处理：支持异步调用。
4. 优化文件上传 API：通过 HttpServletRequest 获取到的 Part 对象，可以直接操作文件域。

其次是 Servlet 4.0 版本带来的新特性（如下列表）。

1. 服务器推送：服务器能预测客户端需要的资源，在完成请求处理之前，将这些资源推送到客户端。
2. 将服务器推送与 JSF 页面结合：当 JSF 引擎在处理和呈现页面时，这些资源将被逐个推送到客户端。
3. ServletMapping 接口：服务器可以对 Servlet 的 URL 执行运行时检查。

综上内容，基本涵盖了 Servlet 的主要功能内容。

## 从生命周期出发

Servlet 非常重要，那它的一生是怎么样的呢？

```java
public interface Servlet {
    public void init(ServletConfig config) throws ServletException;
    public ServletConfig getServletConfig();
    public void service(ServletRequest req, ServletResponse res)
	throws ServletException, IOException;
    public String getServletInfo();
    public void destroy();
}
```

从 Servlet 接口开始。当 Web 程序启动的时候，Servlet 容器会调用 init() 方法进行初始化。Web 程序启动成功之后，Servlet 会一直运行在 Servlet 容器之中。当浏览器需要请求服务端时，Servlet 容器会调用 service() 方法进行请求处理、并相应结果返回。当 Web 程序关闭时，Servlet 容器会调用 destroy() 方法标记 Servlet 对象可以被垃圾回收。

## 从作用域出发

从作用域出发，Servlet 中常用来存储数据的三大作用域，按使用范围从小到大分别为：HttpServletRequest、HttpSession、ServletContext。

HttpServletRequest 的使用范围是从浏览器请求开始，到这次请求服务端响应后结束。

HttpSession 的使用范围是从服务端第一次调用 getSession 方法开始，到 session 有效时间内（默认为 30 min）结束。它的结束时间会因为服务端异常、服务端重启、服务端手动注销等情况提前失效。

ServletContext 的使用范围是从 Servlet 初始化开始，伴随整个 Servlet 生命周期。

## 从源码出发

### ServletConfig

Servlet 在 Servlet 容器初始化时，读取 web.xml 中的 Servlet 配置信息。

```java
public String getServletName();
public ServletContext getServletContext();
public String getInitParameter(String name);
public Enumeration<String> getInitParameterNames();
```

ServletConfig 接口提供的方法，分别是获取 Servlet 名称、ServletContext、指定 name 的初始化数据，以及列举所有的初始化数据名称。

ServletConfig 接口的实现类，分别是直接实现 ServletConfig 接口的 GenericServlet 类，以及继承了 GenericServlet 类的 HttpServlet 类。依照类的命名 GenericServlet 是通用的协议无关的接口方法实现，而 HttpServlet 继承通用、协议无关的基础上，扩展了 Http 协议相关的方法。

#### GenericServlet

```java
public abstract class GenericServlet implements Servlet, ServletConfig, java.io.Serializable {

  private transient ServletConfig config;

  public void init(ServletConfig config) throws ServletException {
    this.config = config;
    this.init();
  }

  public abstract void service(ServletRequest req, ServletResponse res) throws ServletException, IOException;

```

GenericServlet 类自身拥有一个 ServletConfig 接口对象。也就说 GenericServlet 同时也支持其他自定义的 ServletConfig 接口实现类。

GenericServlet 抽象类是 Servlet 的适配器，也就是 Java 设计模式中的适配器模式。

当程序员需要自定义 MyServlet 类的时候，只需要继承 GenericServlet 抽象类，并实现 service() 抽象方法即可。并不需要去关注 Servlet、ServletConfig 接口的其他方法，应该如何实现。

#### HttpServlet

```java
@Override
public void service(ServletRequest req, ServletResponse res) throws ServletException, IOException {
  HttpServletRequest  request;
  HttpServletResponse response;

  if (!(req instanceof HttpServletRequest &&
        res instanceof HttpServletResponse)) {
    throw new ServletException("non-HTTP request or response");
  }

  request = (HttpServletRequest) req;
  response = (HttpServletResponse) res;

  service(request, response);
}

protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
  String method = req.getMethod();

  if (method.equals(METHOD_GET)) {
    long lastModified = getLastModified(req);
    if (lastModified == -1) {
      doGet(req, resp);
    } else {
      long ifModifiedSince = req.getDateHeader(HEADER_IFMODSINCE);
      if (ifModifiedSince < lastModified) {
        maybeSetLastModified(resp, lastModified);
        doGet(req, resp);
      } else {
        resp.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
      }
    }

  } else if (method.equals(METHOD_HEAD)) {
    long lastModified = getLastModified(req);
    maybeSetLastModified(resp, lastModified);
    doHead(req, resp);

  } else if (method.equals(METHOD_POST)) {
    doPost(req, resp);

  } else if (method.equals(METHOD_PUT)) {
    doPut(req, resp);

  } else if (method.equals(METHOD_DELETE)) {
    doDelete(req, resp);

  } else if (method.equals(METHOD_OPTIONS)) {
    doOptions(req,resp);

  } else if (method.equals(METHOD_TRACE)) {
    doTrace(req,resp);

  } else {
    String errMsg = lStrings.getString("http.method_not_implemented");
    Object[] errArgs = new Object[1];
    errArgs[0] = method;
    errMsg = MessageFormat.format(errMsg, errArgs);

    resp.sendError(HttpServletResponse.SC_NOT_IMPLEMENTED, errMsg);
  }
}
```

HttpServlet 抽象类，直接把 service() 方法根据请求方式 req.getMethod() 的不同，拆分成 doPost()、doPut()、doDelete() 等不同且具体的方法。

当程序员想要实现一个浏览器 GET 请求时，只需要继承 HttpServlet 抽象类并实现 doGet() 方法即可。

### ServletContext

在 Servlet 容器启动时，会创建 ServletContext 代表当前整个生命周期。

从 3.0 版本开始，支持在运行时动态部署 Servlet、过滤器、监听器，以及为 Servlet 和过滤器增加 URL 映射等。

从 4.0 版本开始，支持在运行时动态添加 jsp 文件，以及提供了改变默认请求字符编码与 session 超时的处理接口。

#### ServletContextListener

```java
default public void contextInitialized(ServletContextEvent sce) {}
default public void contextDestroyed(ServletContextEvent sce) {}
```

用于接收有关 ServletContext 生命周期更改的通知事件的接口。

#### ServletContextAttributeListener

```java
default public void attributeAdded(ServletContextAttributeEvent event) {}
default public void attributeRemoved(ServletContextAttributeEvent event) {}
default public void attributeReplaced(ServletContextAttributeEvent event) {}
```

用于接收有关 ServletContext 属性更改的通知事件的接口。

#### ServletContextEvent

```java
public ServletContextEvent(ServletContext source) {
	super(source);
}
public ServletContext getServletContext () {
	return (ServletContext) super.getSource();
}
```

事件类，用于通知有关 Web 应用程序 ServletContext 更改的信息。

#### ServletContextAttributeEvent

```java
private String name;
private Object value;

public ServletContextAttributeEvent(ServletContext source, String name, Object value) {
  super(source);
  this.name = name;
  this.value = value;
}

public String getName() {
  return this.name;
}

public Object getValue() {
  return this.value;   
}
```

扩展了 ServletContextEvent 类，用于通知有关 Web 应用程序 ServletContext 属性更改的信息。

### ServletRequest

ServletRequest 接口定义了很多 Servlet 接收客户端请求信息的方法。

ServletRequestWrapper 类实现了 ServletRequest 接口的方法。

HttpServletRequest 接口继承了 ServletRequest 接口，扩展了 Servlet 通过 Http 接收请求信息的方法。

HttpServletRequestWrapper 类继承 ServletRequestWrapper 类的基础上，又实现了 HttpServletRequest 接口方法。

### ServletResponse

与 ServletRequest 接口对应，定义了返回请求相应结果的方法。

ServletResponseWrapper 类实现了 ServletResponse 接口的方法。

HttpServletResponse 接口继承了 ServletResponse 接口，扩展了 Servlet 通过 Http 返回请求相应结果的方法。

HttpServletResponseWrapper 类继承 ServletResponseWrapper 类的基础上，又实现了 HttpServletResponse 接口方法。

### Filter

用于资源请求或资源响应的过滤。

```java
default public void init(FilterConfig filterConfig) throws ServletException {}
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException;
default public void destroy() {}
```

只提供了两个实现类。分别是直接实现 ServletConfig 接口的 GenericServlet 类，以及继承了 GenericServlet 类的 HttpServlet 类。依照类的命名 GenericServlet 是通用的协议无关的接口方法实现，而 HttpServlet 继承通用、协议无关的基础上，扩展了 Http 协议相关的方法。

## 总结

最后，还有部分内容涵盖。例如 Cookie、Session、Async 异步请求处理、Part 文件上传API等比较简单的内容。

最后，希望全球疫情早日结束，世界早日恢复秩序。
