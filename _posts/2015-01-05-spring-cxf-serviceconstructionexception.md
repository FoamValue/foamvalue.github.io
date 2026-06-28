---
layout: post
title:  "Spring cxf 整合时的报错记录"
author: 陈鑫杰
---
## 问题描述
今天在整合 cxf 过程中，遇到一个报错问题。

## 报错信息
{% highlight ruby %}
[INFO][2015-01-05 14:33:41,516][org.apache.cxf.service.factory.ReflectionServiceFactoryBean]Creating Service {} from WSDL:
[ERROR][2015-01-05 14:33:41,929][org.jeecgframework.core.common.exception.MyExceptionHandler]org.springframework.beans.factory.BeanCreationException: Error creating bean with name '' defined in file []: Instantiation of bean failed; nested exception is org.springframework.beans.BeanInstantiationException: Could not instantiate bean class []: Constructor threw exception; nested exception is javax.xml.ws.WebServiceException: org.apache.cxf.service.factory.ServiceConstructionException
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.instantiateBean(AbstractAutowireCapableBeanFactory.java:997)
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:930)
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:485)
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:456)
at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:313)
at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:193)
at org.springframework.context.support.AbstractApplicationContext.getBean(AbstractApplicationContext.java:1093)
at org.springframework.web.servlet.handler.AbstractUrlHandlerMapping.lookupHandler(AbstractUrlHandlerMapping.java:178)
at org.springframework.web.servlet.handler.AbstractUrlHandlerMapping.getHandlerInternal(AbstractUrlHandlerMapping.java:102)
at org.springframework.web.servlet.handler.AbstractHandlerMapping.getHandler(AbstractHandlerMapping.java:288)
at org.springframework.web.servlet.DispatcherServlet.getHandler(DispatcherServlet.java:1063)
at org.springframework.web.servlet.DispatcherServlet.getHandler(DispatcherServlet.java:1048)
at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:886)
at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:852)
at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:882)
at org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:778)
at javax.servlet.http.HttpServlet.service(HttpServlet.java:620)
at javax.servlet.http.HttpServlet.service(HttpServlet.java:727)
at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:303)
at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)
at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)
at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:241)
at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)
at org.jeecgframework.core.aop.GZipFilter.doFilter(GZipFilter.java:48)
at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:241)
at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)
at com.alibaba.druid.support.http.WebStatFilter.doFilter(WebStatFilter.java:140)
at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:241)
at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)
at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:88)
at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:76)
at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:241)
at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)
at org.springframework.orm.hibernate4.support.OpenSessionInViewFilter.doFilterInternal(OpenSessionInViewFilter.java:119)
at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:76)
at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:241)
at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)
at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:220)
at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:122)
at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:501)
at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:171)
at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:102)
at org.apache.catalina.valves.AccessLogValve.invoke(AccessLogValve.java:950)
at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:116)
at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:408)
at org.apache.coyote.http11.AbstractHttp11Processor.process(AbstractHttp11Processor.java:1040)
at org.apache.coyote.AbstractProtocol$AbstractConnectionHandler.process(AbstractProtocol.java:607)
at org.apache.tomcat.util.net.JIoEndpoint$SocketProcessor.run(JIoEndpoint.java:316)
at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1145)
at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)
at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
at java.lang.Thread.run(Thread.java:724)
Caused by: org.springframework.beans.BeanInstantiationException: Could not instantiate bean class []: Constructor threw exception; nested exception is javax.xml.ws.WebServiceException: org.apache.cxf.service.factory.ServiceConstructionException
at org.springframework.beans.BeanUtils.instantiateClass(BeanUtils.java:162)
at org.springframework.beans.factory.support.SimpleInstantiationStrategy.instantiate(SimpleInstantiationStrategy.java:76)
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.instantiateBean(AbstractAutowireCapableBeanFactory.java:990)
51 more
Caused by: javax.xml.ws.WebServiceException: org.apache.cxf.service.factory.ServiceConstructionException
at org.apache.cxf.jaxws.ServiceImpl.getPort(ServiceImpl.java:336)
at org.apache.cxf.jaxws.ServiceImpl.getPort(ServiceImpl.java:325)
at javax.xml.ws.Service.getPort(Service.java:119)
at sun.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
at sun.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:57)
at sun.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
at java.lang.reflect.Constructor.newInstance(Constructor.java:526)
at org.springframework.beans.BeanUtils.instantiateClass(BeanUtils.java:147)
53 more
Caused by: org.apache.cxf.service.factory.ServiceConstructionException
at org.apache.cxf.jaxb.JAXBDataBinding.initialize(JAXBDataBinding.java:339)
at org.apache.cxf.service.factory.AbstractServiceFactoryBean.initializeDataBindings(AbstractServiceFactoryBean.java:86)
at org.apache.cxf.service.factory.ReflectionServiceFactoryBean.buildServiceFromWSDL(ReflectionServiceFactoryBean.java:446)
at org.apache.cxf.service.factory.ReflectionServiceFactoryBean.initializeServiceModel(ReflectionServiceFactoryBean.java:548)
at org.apache.cxf.service.factory.ReflectionServiceFactoryBean.create(ReflectionServiceFactoryBean.java:265)
at org.apache.cxf.jaxws.support.JaxWsServiceFactoryBean.create(JaxWsServiceFactoryBean.java:214)
at org.apache.cxf.frontend.AbstractWSDLBasedEndpointFactory.createEndpoint(AbstractWSDLBasedEndpointFactory.java:101)
at org.apache.cxf.frontend.ClientFactoryBean.create(ClientFactoryBean.java:90)
at org.apache.cxf.frontend.ClientProxyFactoryBean.create(ClientProxyFactoryBean.java:155)
at org.apache.cxf.jaxws.JaxWsProxyFactoryBean.create(JaxWsProxyFactoryBean.java:156)
at org.apache.cxf.jaxws.ServiceImpl.createPort(ServiceImpl.java:467)
at org.apache.cxf.jaxws.ServiceImpl.getPort(ServiceImpl.java:334)
62 more
Caused by: com.sun.xml.internal.bind.v2.runtime.IllegalAnnotationsException: 14 counts of IllegalAnnotationExceptions
Two classes have the same XML type name "{}". Use @XmlType.name and @XmlType.namespace to assign different names to them.
this problem is related to the following location:
this problem is related to the following location:
Two classes have the same XML type name "{}". Use @XmlType.name and @XmlType.namespace to assign different names to them.
this problem is related to the following location:
this problem is related to the following location:
Two classes have the same XML type name "{}". Use @XmlType.name and @XmlType.namespace to assign different names to them.
this problem is related to the following location:
this problem is related to the following location:
Two classes have the same XML type name "{}". Use @XmlType.name and @XmlType.namespace to assign different names to them.
this problem is related to the following location:
this problem is related to the following location:
Two classes have the same XML type name "{}". Use @XmlType.name and @XmlType.namespace to assign different names to them.
this problem is related to the following location:
this problem is related to the following location:
Two classes have the same XML type name "{}". Use @XmlType.name and @XmlType.namespace to assign different names to them.
this problem is related to the following location:
this problem is related to the following location:
Two classes have the same XML type name "{}". Use @XmlType.name and @XmlType.namespace to assign different names to them.
this problem is related to the following location:
this problem is related to the following location:
Two classes have the same XML type name "{}". Use @XmlType.name and @XmlType.namespace to assign different names to them.
this problem is related to the following location:
this problem is related to the following location:
Two classes have the same XML type name "{}". Use @XmlType.name and @XmlType.namespace to assign different names to them.
this problem is related to the following location:
this problem is related to the following location:
Two classes have the same XML type name "{}". Use @XmlType.name and @XmlType.namespace to assign different names to them.
this problem is related to the following location:
this problem is related to the following location:
Two classes have the same XML type name "{}un". Use @XmlType.name and @XmlType.namespace to assign different names to them.
this problem is related to the following location:
this problem is related to the following location:
Two classes have the same XML type name "{}un". Use @XmlType.name and @XmlType.namespace to assign different names to them.
this problem is related to the following location:
this problem is related to the following location:
Two classes have the same XML type name "{}". Use @XmlType.name and @XmlType.namespace to assign different names to them.
this problem is related to the following location:
this problem is related to the following location:
Two classes have the same XML type name "{}". Use @XmlType.name and @XmlType.namespace to assign different names to them.
this problem is related to the following location:
this problem is related to the following location:
at com.sun.xml.internal.bind.v2.runtime.IllegalAnnotationsException$Builder.check(IllegalAnnotationsException.java:91)
at com.sun.xml.internal.bind.v2.runtime.JAXBContextImpl.getTypeInfoSet(JAXBContextImpl.java:451)
at com.sun.xml.internal.bind.v2.runtime.JAXBContextImpl.<init>(JAXBContextImpl.java:283)
at com.sun.xml.internal.bind.v2.runtime.JAXBContextImpl.<init>(JAXBContextImpl.java:126)
at com.sun.xml.internal.bind.v2.runtime.JAXBContextImpl$JAXBContextBuilder.build(JAXBContextImpl.java:1148)
at com.sun.xml.internal.bind.v2.ContextFactory.createContext(ContextFactory.java:130)
at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)
at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
at java.lang.reflect.Method.invoke(Method.java:606)
at javax.xml.bind.ContextFinder.newInstance(ContextFinder.java:248)
at javax.xml.bind.ContextFinder.newInstance(ContextFinder.java:235)
at javax.xml.bind.ContextFinder.find(ContextFinder.java:445)
at javax.xml.bind.JAXBContext.newInstance(JAXBContext.java:637)
at org.apache.cxf.common.jaxb.JAXBContextCache.createContext(JAXBContextCache.java:341)
at org.apache.cxf.common.jaxb.JAXBContextCache.getCachedContextAndSchemas(JAXBContextCache.java:228)
at org.apache.cxf.jaxb.JAXBDataBinding.createJAXBContextAndSchemas(JAXBDataBinding.java:494)
at org.apache.cxf.jaxb.JAXBDataBinding.initialize(JAXBDataBinding.java:337)
73 more
{% endhighlight %}

## 解决方式

重新生成客户端代码
