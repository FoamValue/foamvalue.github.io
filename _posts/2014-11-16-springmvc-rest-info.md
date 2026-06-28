---
layout: post
title: Spring MVC REST 功能
author: 陈鑫杰
---

## 概述  
传统的软件开发总是以业务处理为主，而数据则是事后才会考虑的因素。然而，REST 是以数据为中心的*表述性状态转移（Representational State Transfer, REST）*，并已经成为替代传统 SOAP Web 服务的流行方案。  
Spring 在 Spring MVC 上提供了对 REST 的良好支持，我们将基于 Spring MVC 来开发处理 RESTful 资源的控制器。  

## 了解 REST  

### REST 的基本原理  
* 表述性（Representational）：REST 资源可以用各种形式（包括 XML、JSON、HTML等）来进行表述。
* 状态（State）：关注资源的状态，而不是对资源采取的行为。
* 转移（Transfer）：以某一种表述性形式从一个应用转移到另一个应用。
* REST 就是将资源的状态以最合适的形式在服务器端和客户端之间转移。

### Spring 对 REST 的支持
* @PathVariable 注解使控制器能够处理参数化的 URL。
* &lt;form:form&gt;标签和 HiddenHttpMethodFilter，可以通过 HTML 表单提交 PUT 和 DELETE 请求。
* 通过使用 Spring 的视图和视图解析器，资源可以以各种形式进行表述。
* ContentNegitiaingViewResolver 选择最适合客户端的表述。
* @ResponseBody 注解和各种 HttpMethodConverter 实现视图的渲染。
* @ResponseBody 注解和 HttpMethodConverter 实现将传入的 HTTP 数据转化为传入控制器处理方法的 Java 对象。
* RestTemplate 简化了客户端对 REST 资源的使用。  

## 面向资源的控制器  

### URL  
URL是*统一资源定位符（uniform resource locator）*的缩写，用于定位资源。同时也是*URI*或*统一资源标识符（uniform resource identifier）*。所以任何给定的 URL 不仅可以定位一个资源还可以用于标识一个资源。  

#### RESTless URL  
实际上，很多的 URL 并没有定位或标识任何事情——它们只是提出要求。这些 URL 表明要采取一些行动，而不是标识事物。  
例如：

* http://localhost:8080/Spittler/displaySpittle.htm?id=123  
* 主机和端口号：http://localhost:8080
* Servlet 上下文路径：Spittle
* 动词：display
* 控制器 URL 模式：displaySpittle.htm
* 标识符：id=123

这个 URL 要求服务器展现（display）一个 Spittle。唯一的标识就是 id 的查询参数。其他的基本部分都是面向动作的，所以这是一个 RESTless 的 URL。

#### RESTful URL  
与 RESTless URL 不同的是，RESTful URL 完全承认 HTTP 用于标识资源。    
例如：

* http://localhost:8080/Spittle/spittle/123  
* 主机和端口号：http://localhost:8080
* Servlet 上下文路径：Spittle
* 资源类型（名词）：spittle
* 特定的 Spittle：123

**区分：**这个 URL 不仅定位资源，还可以唯一标识这个资源——不仅是 URL 也是 URI。使用完整的基本 URL 来标识资源，而不是使用查询参数标识资源。  
实际上，新的 URL 根本没有查询参数。尽管使用查询参数往服务器发送信息仍是一种合法的方式，但是这应当用于为服务器创建资源提供指导。查询参数不应该用于帮助标识资源。

#### URL 嵌入参数
使用参数化的 URL 路径，使用了查询参数作为输入，同时又是完整的基础 URL。为了处理这种类型的 URL，Spring 3 引入了新的 @PathVariable 注解。  
例如：  
{% highlight java %}
package com;
...
@Controller
@RequestMapping(value="/spittles")
public class SpittleController {
...
@RequestMapping(value="/{id}" method=RequestMethod.GET)
public String getSpittle(@PathVariable("id") Long id, Model model) {
model.addAttribute(spittleService.getSpittleById(id));
return "spittles/view";
}
...
}
{% endhighlight %}  
**说明：**通过 @RequestMapping 中加入 {id} 占位符，并在方法的入参中加入 @PathVariable("id") Long id 来获取 URL 中所带入的参数 id 的值。

### 执行 REST 动作  
转移资源状态的动作（post、get、put 以及 delete）直接对应于 HTTP 规范定义的4个方法。  
HTTP 方法具有两个特性：安全性和幂等性。如果一个方法不改变资源的状态，那么它就是安全的。如果一个方法一次请求和多次请求具有相同的作用（可能改变也可能不改变状态），那么它就是幂等的。所有安全的方法都是幂等的，但并不是所有幂等的方法都是安全的。  
**HTTP 提供操作资源的方法：**  

* GET：从服务器上检索资源数据，资源通过请求的 URL 来进行标识。安全、幂等。
* POST：传送数据到服务器上，数据会由监听该请求的 URL 的处理器来进行处理。不安全、不幂等。
* PUT：按照请求的 URL，放置资源数据到服务器上。不安全、幂等。
* DELETE：将请求 URL 标识的资源从服务器上删除。不安全、幂等。
* OPTIONS：请求与服务器通信可用的选项。安全、幂等。
* HEAD：类似于 GET，但只会返回头部信息——在响应体中不应该包含内容。安全、幂等。
* TRAGE：将请求体的内容返回给客户。安全、幂等。  

4个 HTTP 方法通常匹配到 CRUD（创建/读取/更新/删除）操作。其中，GET 方法执行读取操作，DELETE 方法执行删除操作，PUT 方法执行更新操作，POST 方法执行创建操作。

#### HTTP GET 方法  
{% highlight java %}  
@RequestMapping(value="/{id}" method=RequestMethod.GET)
public String getSpittle(@PathVariable("id") Long id, Model model) {
model.addAttribute(spittleService.getSpittleById(id));
return "spittles/view";
}
{% endhighlight %}  

#### HTTP PUT 方法  
{% highlight java %}  
@RequestMapping(value="/{id}" method=RequestMethod.PUT)
@ResponseStatus(HttpStatus.NO_CONTENT) // 响应状态，HTTP 状态码 204
public void putSpittle(@PathVariable("id") Long id, @Valid Spittle spittle) {
spittleService.saveSpittle(spittle);}
{% endhighlight %}  

#### HTTP DELETE 方法  
{% highlight java %}  
@RequestMapping(value="/{id}" method=RequestMethod.DELETE)
@ResponseStatus(HttpStatus.NO_CONTENT) // 响应状态，HTTP 状态码 204
public void deleteSpittle(@PathVariable("id") Long id) {
spittleService.deleteSpittle(spittle);
}
{% endhighlight %}  

#### HTTP POST 方法  
{% highlight java %}  
@RequestMapping(value="/{id}" method=RequestMethod.POST)
@ResponseStatus(HttpStatus.CREATE) // 响应状态，HTTP 状态码 201
public @ResponseBody Spittle createSpittle(@Valid Spittle spittle, BindingResult result, HttpServletResponse response) throws BindException {
if (result.hasErrors()) {
throw new BindException(result);
}
spittleService.saveSpittle(spittle);
response.setHeader("Location", "/spittles/" + spittle.getId()); // 设置资源位置
return spittle;
}
{% endhighlight %}  

## 表述资源  
表述是 REST 中很重要的一个方面。它是关于客户端和服务器端针对某一资源是如何通信的。任何给定的资源都几乎可以用任意的形式来进行表述（JSON、XML、HTML等）。  
Spring 提供了两种方法将资源的 Java 表述形式转换为发送给客户端的表述形式：*基于视图渲染进行协商*、*HTTP 消息转换器*。

### 协商资源表述  
Spring 的 ContentNegotiatingViewResolver 是一个特殊的视图解析器，它考虑到了客户端所需要的内容类型。同其他的视图解析器一样，它作为一个&lt;bean&gt;配置在 Spring 应用上下文里。  
ContentNegotiatingViewResolver 涉及内容协商的两个步骤：  
1. 确定请求的媒体类型。  
2. 找到合适请求媒体类型的最佳视图。

### HTTP 信息转换器  
通过使用 @ResponseBody 注解，来实现控制器返回的对象自动转化为适合客户端的表述形式。

#### 在响应体中返回资源状态  
如果处理方法使用了 @ResponseBody 注解，那表明 HTTP 信息转换器会发挥作用，并将返回的对象转换为客户端需要的任意格式（更具体的将，资源的格式需要满足请求中 Accept 头信息的要求。如果请求中没有包含 Accept 头信息的话，就假设客户端能够接受任意的表述形式。）。  
例如：  
{% highlight java %}  
@RequestMapping(value="/{username}", method=RequestMethod.GET, headers={"Accept=text/xml, application/json"})
public @ResponseBody Spittle getSpittle(@PathVariable String username) {
return spittleService.getSpittle(username);
}  
{% endhighlight %}  
headers 属性表明这个方法只处理 Accept 头部信息为 text/xml 或 application/json 的请求。其他任何类型的请求都不会被这个方法处理，这些请求会被其他方法（如果存在）进行处理，或者返回客户端 HTTP 406（Not Acceptable）响应。  
Spring HTTP 信息转换器的工作就是，将处理方法返回的 Java 对象转换为满足客户端要求的表述形式。Spring 自带了各种各样的转换器，满足最常见的将对象转换为表述的需要。

### 在请求体中接收资源状态  
@ResponseBody 注解能够对客户端发过来的对象进行自动转换。例如：  
{% highlight java %}  
@RequestMapping(value="/{username}", method=RequestMethod.PUT, header="Content-Type=application/json")
@ResponseStatus(HttpStatus.NO_CONTENT)
public void updateSpittle(@PathVariable String username, @ResponseBody Spittle spittle) {
spittleService.saveSpittle(spittle);
}  
{% endhighlight %}  
实现自动转换，必须满足以下两个条件：  
1. 请求的 Content-Type 头信息必须是 application/json；
2. Jackson Json 库必须包含在应用程序的类路径下。

## REST 客户端  
REST 客户端会涉及到模板代码和异常处理：
{% highlight java %}  
public Spittle[] retrieveSpittlesForSpittle(String username) {
try {
// 创建 HttpClient
HttpClient httpClient = new DefaultHttpClient();
// 组件 URL
String spittleUrl = "http://localhost:8080/Spittle/spittles/" + username + "/spittles";
// 创建对 URL 的请求
HttpGet getRequset = new HttpGet(spittleUrl);
getRequest.setHeader(new BasicHeader("Accept", "application/json"));
// 执行请求
HttpResponse response = httpClient.execute(getRequest);
// 解析结果
HttpEntity entity = response.getEntity();
ObjectMapper mapper = new ObjectMapper();
return mapper.readValue(entity.getContent(), Spittlep[].class);
}catch (IOException e) {
throw new SpittleClientException("Unable to retrieve Spittles", e);
}
}
{% endhighlight %}  
虽然使用了 Jakarta Commons HTTP Client 创建请求并使用 Jackson JSON processor 解析响应，但还是只有极少的代码是直接与功能相关的。如果要写另一个方法，那么会有很大部分内容与这个方法相似，只有很小的差别。  
Spring 的 RestTemplate 类似与 jdbcTemplate，对 REST 客户端方法进行了封装，极大的方便了我们使用。

### RestTemplate 操作  
RestTemplae 定义了11个独立的操作，而每一个都有重载，一个是33个与 REST 资源交互的方法。涵盖了 HTTP 动作的各种形式。  

* delete()：在特定的 URL 上对资源执行 HTTP DELETE 操作。
* exchange()：在 URL 上执行特定的 HTTP 方法，返回包含对象的 ResponseEntity，这个对象是从响应体中映射得到的。
* execute()：在 URL 上执行特定的 HTTP 方法，返回一个从响应体映射得到的对象。
* getForEntity()：发送一个 HTTP GET 请求，返回的 ResponseEntity 包含了响应体所映射成的对象。
* getForObject()：GET 资源，返回的请求体将映射为一个对象。
* headForHeaders()：发送 HTTP HEAD 请求，返回包含特定资源的 URL 的 HTTP 头。
* optionsForAllow()：发送 HTTP OPTIONS 请求，返回对特定 URL 的 Allow 头信息。
* postForEntity()：POST 数据，返回包含一个对象的 ResponseEntity，这个对象是从响应体中映射得到的。
* postForLocation()：POST 数据，返回新资源的 URL。
* postForObject()：POST 数据，返回的请求体将匹配为一个对象。
* put()：PUT 资源到特定的 URL。  

每个操作都以3中方法形式进行了重载：  
1. 一个使用 Java.net.URI 作为 URL 格式，不支持参数化 URL；
2. 一个使用 String 作为 URL 格式，并使用 Map 指明 URL 参数；
3. 一个使用 String 作为 URL 格式，并使用可变参数列表指明 URL 参数。

## RESTful 表单  
Spring 通过两个特性来支持 POST 伪装：  
1. 通过使用 HiddenHttpMethodFilter 来进行请求转换；
2. 使用 &lt;sf:form&gt; JSP 标签渲染隐藏域。

### JSP 中渲染隐藏的方法域  
HTTP 的4个主要的方法：GET、POST、PUT、DELETE。其中 GET 和 POST 所对应的 HTTP 请求比较容易理解（GET 请求和 POST 请求），然而 PUT 和 DELETE 则需要伪装成 POST 请求进行处理。  
在 HTML 表单中，将 PUT 和 DELETE 请求伪装成 POST 请求的关键是创建一个带有隐藏域并且 method 为 POST 的表单。例如：  
{% highlight html %}  
<form method="post">
<input type="hidden" name="_method" value="delete"/>
...
</form>
{% endhighlight %}  
这样创建一个隐藏域（指定真正的 HTTP 方法）的表单并不麻烦。当这个表单提交时，会发送 POST 请求到服务器端，服务器端将从 _method 域中得到真正要处理的方法类型（即，delete）。  
当使用 Spring 的表单绑定库时，&lt;sf:form&gt;会变得更简单。  
{% highlight html %}  
<sf:form method="delete" modelAttribute="spittle">
...
</sf:form>
{% endhighlight %}  
当&lt;sf:form&gt;渲染为 HTML 时，结果与 HTML 的 &lt;form&gt;类似。使用&lt;sf:form&gt;能够免于处理隐藏域，以更加自然的方式使用 PUT 和 DELETE 表单，就好像浏览器真的支持一样。

### 真正的请求  
PUT 或 DELETE 请求，作为 POST 请求到达服务器后，HTTP 方法的不匹配问题必须在 DispatcherServlet 查找控制器处理方法之前进行处理。这就是 HiddenHttpMethodFilter 所要做的事情。  
HiddenHttpMethodFilter 是一个 Servlet 过滤器，并要在 web.xml 中进行配置：  
{% highlight xml %}  
<filter>
<filter-name>httpMethodFilter</filter-name>
<filter-class>org.springframework.web.filter.HiddenHttpMethodFilter</filter-class>
</filter>
...
<filter-mapping>
<filter-name>httpMethodFilter</filter-name>
<url-pattern>/*</url-pattern>
</filter-mapping>
{% endhighlight %}  
这样配置之后，所有的 URL 的请求（匹配到 “/*”）到达 DispatcherServlet 前都会经过 HiddenHttpMethodFilter 将伪装成 POST 请求的 PUT 和 DELETE 请求转换为原本的形式。  

## 参考资料  
Spring IN ACTION,THIRD EDITION.
