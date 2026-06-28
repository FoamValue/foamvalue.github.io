---
layout: post
title: Spring MVC 基础逻辑
author: 陈鑫杰
---

## 概述
Spring MVC 基于模型-视图-控制器（Model-View-Controller，MVC）模式实现。可以帮助构建灵活和松耦合的 Web 应用程序。  
**模型**：控制器返回给用户，并需要在浏览器上显示的信息。  
**视图**：直接返回原始的信息是不够的，需要以用户友好的方式进行优化，一般是 HTML，但这里（JAVA）通常指 JSP。  
**控制器**：用于处理请求的 Spring 组件。

## 请求逻辑
首先，Sping MVC 请求会到达一个前端控制器 Servlet（DispatcherServlet）。DispatcherServlet 通过查询一个或多个处理器（*HandletMapping）来确定合适的控制器。DispatcherServlet 将请求发送给确定的控制器。控制器获取到请求中的信息并进行逻辑处理。控制器在完成逻辑处理后，通常产生一些信息，包括需要返回给用户的信息（Model）以及这些信息如何去展示（View）。DispatcherServlet 获取到这些信息后，会查找视图解析器将这些信息渲染成实际的页面（JSP）展示给用户。

## DispatcherServlet
在 Spring MVC 中被成为前端控制器，也是 Spring MVC 的核心。和其他 Servlet 一样，DispatcherServlet 必须在 Web 应用程序的 web.xml 文件中进行配置。（org.springframework.web.servlet.DispatcherServlet）

## *HandletMapping
处理器映射，Spring 提供了多个处理器映射来明确的将请求分发给控制器。需要在 *-servlet.xml 文件中进行配置。  

* BeanNameUrlHandlerMapping：根据控制器 Bean 的名字将控制器映射到 URL。
* ControllerBeanNameHandlerMapping：根据控制器 Bean 的名字将控制器映射到 URL。Bean 的名字不需要遵循 URL 的约定。
* ControllerClassNameHandlerMapping：通过使用控制器的类名作为 URL 基础将控制器映射到 URL。
* DefaultAnnotationHandlerMapping：将请求映射给使用 @RequestMapping 注解的控制器和控制器方法。
* SimpleUrlHandlerMapping：使用定义在 Sping 应用上下文的属性集合将控制器映射到 URL。

## *Controller
自定义的控制器类，一般采用 Controller 作为命名的后缀（例如:SystemController）。通过添加注解（@Controller）的方式，向 Spring MVC 表明这个类（SystemController）是一个控制器。通过配置文件添加自动扫描将这个类（SystemController）注册成 Bean。  
控制器类中具体的方法，通过方法入参（例如：HttpRequest、HttpServletResponse、String 等）的方式获取用户请求参数（例如：查询参数、cookie、HTTP 请求头等。）。  
控制器类中具体的方法，通过返回 String 类型值指定试图的名称。也可以通过初始化 Model 将逻辑处理后的信息发送给用户。

## *ViewResolver
Spring MVC 提供多个视图解析器来实现请求返回视图名称和实际的 JSP 进行匹配。需要在 *-servlet.xml 文件中进行配置。  

* BeanNameViewResolver：查找 Bean ID 与逻辑视图名称相同 View 的实现。
* ContentNegotiatingViewResolver：委托一个或多个视图解析器，而选择哪一个取决于请求的内容类型。
* FreeMarketViewRsolver：查找一个基于 FreeMarket 的模板，它的路径根据加完前缀和后缀的逻辑视图名称来决定。
* InternalResourceViewResolver：在 Web 应用程序的 WAR 文件中查找视图模板。
* JasperReportsViewResolver：根据加载完前缀和后缀的逻辑视图名称来查找一个 Jasper Report 报表文件。
* ResourceBundleViewResolver：根据属性文件（properties file）来查找 View 实现。
* TilesViewResolver：查找通过 Tiles 模板定义的视图。
* UrlBasedViewResolver：一些其他视图解析器的积累。
* VelocityLayoutViewResolver：是 VelocityViewResolver 的子类，支持通过 Spring VelocityLayoutView 来进行页面组合。
* VelocityViewResolver：解析基于 Velocity 的视图。
* XmlViewResolver：查找在 XML 文件中声明的 View实现。
* XsltViewResolver：解析基于 XSLT 的视图。
