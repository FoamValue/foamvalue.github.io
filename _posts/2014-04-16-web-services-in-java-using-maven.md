---
layout: post
title: 使用 Maven 实现 Java 的 Web Services
author: 陈鑫杰
---

## 维基
Web 服务是一种服务导向架构的技术，通过标准的 Web 协议提供服务，目的是保证不同平台的应用服务可以互操作。

## 百科
Web Service 是基于网络的、分布式的模块化组件，它执行特定的任务，遵守具体的技术规范，这些规范使得 Web Service 能与其他兼容的组件进行互操作。

## 教程

### 创建服务器端项目
使用 Maven 创建一个叫做`MyWebService`的项目。在`pom.xml`中定义所需的依赖关系和项目结构。
{% highlight xml %}
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
 <modelVersion>4.0.0</modelVersion>
 <groupId>MyWebService</groupId>
 <artifactId>MyWebService</artifactId>
 <version>0.0.1-SNAPSHOT</version>
 <name>MyWebService</name>

 <dependencies>
  <dependency>
   <groupId>com.sun.xml.ws</groupId>
   <artifactId>jaxws-rt</artifactId>
   <version>2.1.4</version>
  </dependency>
 </dependencies>

 <build>
  <pluginManagement>
   <plugins>
    <plugin>
     <groupId>org.codehaus.mojo</groupId>
     <artifactId>jaxws-maven-plugin</artifactId>
     <version>1.10</version>
     <executions>
      <execution>
       <goals>
        <goal>wsgen</goal>
       </goals>
      </execution>
     </executions>
     <configuration>
      <!-- Generation -->
 <sei>com.ubiteck.ws.server.MyServiceImpl</sei>
</configuration>
<!-- if you want to use a specific version of JAX-WS, -->
<!-- you can do so like this -->
     <dependencies>
      <dependency>
       <groupId>com.sun.xml.ws</groupId>
       <artifactId>jaxws-tools</artifactId>
       <version>2.1.4</version>
      </dependency>
     </dependencies>
    </plugin>
    <plugin>
     <artifactId>maven-compiler-plugin</artifactId>
     <version>2.3.2</version>
     <configuration>
      <source>1.6</source>
      <target>1.6</target>
     </configuration>
    </plugin>
   </plugins>
  </pluginManagement>
 </build>
</project>
{% endhighlight %}

### 创建 Web Service
创建一个服务端点接口（service endpoint interface），并声明调用服务的方法。
{% highlight java %}
/**   
 * @Title: MyService.java
 * @Package cn.live.ws.service
 * @Description: TODO service 包
 * @author FOAMVALUE FOAMVALUE@LIVE.CN
 * @date 2014年4月16日 下午2:34:39
 * @version V1.0
 */
package cn.live.ws.service;

import javax.jws.WebMethod;
import javax.jws.WebService;

/**
 * @ClassName: MyService
 * @Description: TODO A service endpoint interface (SEI) is a Java interface
 *               that declares the methods that a client can invoke on the
 *               service.
 * @author FOAMVALUE FOAMVALUE@LIVE.CN
 * @date 2014年4月16日 下午2:34:39
 *
 */
@WebService
public interface MyService {

	/**
	 * @Title: reverse
	 * @Description: As explained it returns a revesed string according
	 *               to the value provided. The reverse method is tagged with
	 *               the a @WebMethod annotation to mark the method as exposed
	 *               as a Web Service operation.
	 * @param value
	 * @return String
	 * @throws
	 */
	@WebMethod
	String reverse(String value);
}
{% endhighlight %}

### 实现 Web Service
{% highlight java %}
/**   
 * @Title: MyServiceImpl.java
 * @Package cn.live.ws.service.Impl
 * @Description: TODO service 实现包
 * @author FOAMVALUE FOAMVALUE@LIVE.CN
 * @date 2014年4月16日 下午3:59:03
 * @version V1.0
 */
package cn.live.ws.service.Impl;

import javax.jws.WebService;

import cn.live.ws.service.MyService;

/**
 * @ClassName: MyServiceImpl
 * @Description: TODO
 * @author FOAMVALUE FOAMVALUE@LIVE.CN
 * @date 2014年4月16日 下午3:59:03
 *
 */
@WebService(endpointInterface = "cn.live.ws.service.MyService")
public class MyServiceImpl implements MyService {

	/*
	 * (non-Javadoc) <p>Title: reverse</p> <p>Description: </p>
	 *
	 * @param value
	 *
	 * @return
	 *
	 * @see cn.live.ws.service.MyService#reverse(java.lang.String)
	 */
	@Override
	public String reverse(String value) {
		if (value == null)
			return null;
		return new StringBuffer(value).reverse().toString();
	}

}
{% endhighlight %}

### 发布 Web Service
{% highlight java %}
/**   
 * @Title: Publisher.java
 * @Package cn.live.ws.service
 * @Description: TODO
 * @author FOAMVALUE FOAMVALUE@LIVE.CN
 * @date 2014年4月16日 下午4:21:59
 * @version V1.0
 */
package cn.live.ws.service;

import javax.xml.ws.Endpoint;

import cn.live.ws.service.Impl.MyServiceImpl;

/**
 * @ClassName: Publisher
 * @Description: TODO
 * @author FOAMVALUE FOAMVALUE@LIVE.CN
 * @date 2014年4月16日 下午4:21:59
 *
 */
public class Publisher {
	public static void main(String[] args) {
		Endpoint.publish("http://localhost:8080/WS/MyService", new MyServiceImpl());
	}
}
{% endhighlight %}

使用 Java Application 运行，并在浏览器中输入 URL（`http://localhost:8080/WS/MyService`）可以得到以下信息：
> Web Services  
> No JAX-WS context information available.  

### 创建客户端项目
使用 Maven 创建一个叫做`MyWebServiceClient`的项目。在`pom.xml`中定义所需的依赖关系和项目结构。
{% highlight xml %}
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
 <modelVersion>4.0.0</modelVersion>
 <groupId>MyWebServiceClient</groupId>
 <artifactId>MyWebServiceClient</artifactId>
 <version>0.0.1-SNAPSHOT</version>

 <dependencies>
  <dependency>
   <groupId>com.sun.xml.ws</groupId>
   <artifactId>jaxws-rt</artifactId>
   <version>2.1.4</version>
  </dependency>
 </dependencies>

 <build>
  <pluginManagement>
   <plugins>
    <plugin>
     <groupId>org.codehaus.mojo</groupId>
     <artifactId>jaxws-maven-plugin</artifactId>
     <version>1.10</version>
     <executions>
      <execution>
       <goals>
        <goal>wsimport</goal>
       </goals>
      </execution>
     </executions>
     <!-- -->
     <configuration>
      <wsdlUrls>
       <wsdlUrl>http://localhost:8080/WS/MyService?wsdl</wsdlUrl>
      </wsdlUrls>
      <sourceDestDir>${project.build.directory}/generated</sourceDestDir>
      <verbose>true</verbose>
     </configuration>
    </plugin>
    <plugin>
     <artifactId>maven-compiler-plugin</artifactId>
     <version>2.3.2</version>
     <configuration>
      <source>1.6</source>
      <target>1.6</target>
     </configuration>
    </plugin>
    <plugin>
     <groupId>org.codehaus.mojo</groupId>
     <artifactId>build-helper-maven-plugin</artifactId>
     <version>1.5</version>
     <executions>
      <execution>
       <id>add-source</id>
       <phase>generate-sources</phase>
       <goals>
        <goal>add-source</goal>
       </goals>
       <configuration>
        <sources>
         <source>${project.build.directory}/generated</source>
        </sources>
       </configuration>
      </execution>
     </executions>
    </plugin>
   </plugins>
  </pluginManagement>
 </build>
</project>
{% endhighlight %}

### 导入 WSDL 并生成文件
使用以下命令生成文件：

> $ cd MyWebServiceClient  
> $ mvn org.codehaus.mojo:jaxws-maven-plugin:1.10:wsimport  
> $ [INFO] Processing: http://localhost:8080/WS/MyService?wsdl  
> [INFO] jaxws:wsimport args: [-s, /home/foamvalue/workspace/MyWebServiceClient/target/generated,  
>  -d, /home/foamvalue/workspace/MyWebServiceClient/target/classes, -verbose,  
>  http://localhost:8080/WS/MyService?wsdl]  
> parsing WSDL...  
>
>   
> generating code...  
>   
> cn/live/ws/service/impl/MyService.java  
> cn/live/ws/service/impl/MyServiceImplService.java  
> cn/live/ws/service/ObjectFactory.java  
> cn/live/ws/service/Reverse.java  
> cn/live/ws/service/ReverseResponse.java  
> cn/live/ws/service/package-info.java  
>   
> compiling code...  

将生成的文件路径（`target/generated`），添加到`Source`。

### 创建 Web Service 客户端类文件
{% highlight java %}
/**   
 * @Title: MyWebServiceClient.java
 * @Package cn.live.ws.service
 * @Description: TODO
 * @author FOAMVALUE FOAMVALUE@LIVE.CN
 * @date 2014年4月16日 下午10:39:59
 * @version V1.0
 */
package cn.live.ws.service;

import cn.live.ws.service.impl.MyService;
import cn.live.ws.service.impl.MyServiceImplService;

/**
 * @ClassName: MyWebServiceClient
 * @Description: TODO create the Web service client class
 * @author FOAMVALUE FOAMVALUE@LIVE.CN
 * @date 2014年4月16日 下午10:39:59
 *
 */
public class MyWebServiceClient {
	public static void main(String[] args) {
		MyServiceImplService serviceImpl = new MyServiceImplService();
		MyService service = serviceImpl.getMyServiceImplPort();
		System.out.println(service.reverse("123456"));
	}
}
{% endhighlight %}

### 运行 Web Service 客户端应用程序
> 654321
