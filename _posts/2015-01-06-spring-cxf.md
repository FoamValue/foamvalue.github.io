---
layout: post
title:  "Spring cxf 整合"
author: 陈鑫杰
---
## 描述
Spring MVC 下整合 CXF 工程。整合过程遇到了比较多的问题。例如没找到类，Controller 类没有实例化成功等等。等所有问题都解决完回头再看时，徒然有种原来如此的感觉。  
记录下本次整合所修改的配置文件和所用到的包名，一方面是提醒自己再遇到这种情况时该如何处理，另一方面也是为大家提供类似解决问题的一种参考。

## 原料

* 一个 Spring MVC 项目（可正常使用）
* 一个 Java cxf 项目（可正常使用）

## web.xml

{% highlight ruby %}
<context-param>
  <param-name>contextConfigLocation</param-name>  
    <param-value>   
      classpath:spring-*.xml,   
      classpath:cxf.xml  
    </param-value>   
  </context-param>
...
<listener>
  <description>spring监听器</description>
  <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>
...
<!-- CXF WebService -->
  <servlet>
    <servlet-name>CXFServlet</servlet-name>
    <servlet-class>org.apache.cxf.transport.servlet.CXFServlet</servlet-class>
    <load-on-startup>3</load-on-startup>
</servlet>
<servlet-mapping>
  <servlet-name>CXFServlet</servlet-name>
  <url-pattern>/ws/*</url-pattern>
</servlet-mapping>
{% endhighlight %}

## cxf.xml

{% highlight ruby %}
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"  
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:jaxws="http://cxf.apache.org/jaxws"  
  xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
    http://cxf.apache.org/jaxws
    http://cxf.apache.org/schemas/jaxws.xsd">
      <import resource="classpath:META-INF/cxf/cxf.xml" />
      <import resource="classpath:META-INF/cxf/cxf-servlet.xml" />
</beans>  
{% endhighlight %}

## jar

{% highlight ruby %}
cxf-2.6.13.jar
geronimo-activation_1.1_spec-1.0.2.jar
geronimo-annotation_1.0_spec-1.1.1.jar
geronimo-javamail_1.4_spec-1.3.jar
geronimo-jms_1.1_spec-1.1.1.jar
geronimo-stax-api_1.0_spec-1.0.1.jar
geronimo-ws-metadata_2.0_spec-1.1.2.jar
neethi-3.0.3.jar
org.json.jar
stax2-api-3.1.4.jar
velocity-1.5.jar
velocity-tools-view-1.4.jar
woodstox-core-asl-4.2.0.jar
wsdl4j-1.6.2.jar
xmlschema-core-2.0.1.jar
{% endhighlight %}

## 结束语

* 遇到问题时，不要着急。
* 慢慢来问题总是会被解决的。
