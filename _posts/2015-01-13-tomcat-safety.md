---
layout: post
title:  "Tomcat 安全性"
author: 陈鑫杰
---

最近，某台服务器 CPU、IO、网络负载非常高。将服务器关闭后，通过文件打包后杀毒发现感染了`特洛伊 Trojan:Java/Micuh`。

经过各种搜索，最后在《[昨日终于找到攻击服务器的黑手了][url]》中发现和现状比较相似。

于是重新配置了 Tomcat。

## Tomcat部署

文件路径：`/usr/local/XX/apache-tomcat-XX`，部署方式：  

1. 进入目录  

> $ cd /usr/local/XX/  

2. 查看目录  

> $ ll  
> total 8744  
> drwxr-xr-x 9 root root    4096 Jan 13 10:06 apache-tomcat-XX  
> -rw-r\-\-r\-\- 1 root root 8941662 Jan 13 09:40 apache-tomcat-XX.tar.gz  

3. 创建目录  

> $ cp -R apache-tomcat-XX apache-tomcat-XX-XX  

4. 查看目录  

> $ ll  
> total 8748  
> drwxr-xr-x 9 root root    4096 Jan 13 10:06 apache-tomcat-XX  
> -rw-r\-\-r\-\- 1 root root 8941662 Jan 13 09:40 apache-tomcat-XX.tar.gz  
> drwxr-xr-x 9 root root    4096 Jan 13 10:25 apache-tomcat-XX-XX  

5. 修改tomcat端口  

> $ vi apache-tomcat-XX-XX/conf/server.xml  
{% highlight xml %}  
<Server port="8005" shutdown="XX">  

<Connector port="8005" protocol="HTTP/1.1"  
  connectionTimeout="20000"  
  redirectPort="8443" />  

<Connector port="8009" protocol="AJP/1.3" redirectPort="8443" />  
{% endhighlight %}  

## Tomcat 基本命令  

1. 检查Tomcat命令  

> $ ps -ef | grep tomcat  
> root 7920 1 0 10:35 pts/0 00:00:00 /usr/java/jdk1.6.0_45/bin/java   
>     -Djava.util.logging.config.file=/usr/local/XX/apache-tomcat-XX-XX/conf/logging.properties   
>     -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager   
>     -Djava.endorsed.dirs=/usr/local/XX/apache-tomcat-XX-XX/endorsed   
>     -classpath /usr/local/XX/apache-tomcat-XX-XX/bin/bootstrap.jar:/usr/local/XX/apache-tomcat-XX-XX/bin/tomcat-juli.jar   
>     -Dcatalina.base=/usr/local/XX/apache-tomcat-XX-XX   
>     -Dcatalina.home=/usr/local/XX/apache-tomcat-XX-XX   
>     -Djava.io.tmpdir=/usr/local/XX/apache-tomcat-XX-XX/temp   
>     org.apache.catalina.startup.Bootstrap start  
> root 7924 6908 0 10:35 pts/0 00:00:00 grep tomcat  

2. 进入目录  

> $ cd /usr/local/XX/apache-tomcat-XX-XX/  

3. 关闭tomcat  

> $ ./bin/shutdown.sh  

4. 关闭进程  

> $ kill -9 7920  

6. 启动tomcat  

> $ ./bin/startup.sh  

## 安全配置  

1. 注释用户信息  

`conf/tomcat-users.xml`：  
{% highlight xml %}  
<tomcat-users>  
<!--
  <role rolename="tomcat"/>  
  <role rolename="role1"/>  
  <user username="tomcat" password="tomcat" roles="tomcat"/>  
  <user username="both" password="tomcat" roles="tomcat,role1"/>  
  <user username="role1" password="tomcat" roles="role1"/>  
-->  
</tomcat-users>  
{% endhighlight %}  

2. 修改端口  

`conf/server.xml`：   
通过telnet到服务器`8005`端口，输入`SHUTDOWN`可以关闭tomcat。    
{% highlight xml %}  
<Server port="8005" shutdown="SHUTDOWN">  
{% endhighlight %}  
改为：  
{% highlight xml %}  
<Server port="80XX" shutdown="XX">  
{% endhighlight %}  

3. 自定义错误页面  

`conf/web.xml`：   
{% highlight xml %}  
    <error-page>  
        <error-code>404</error-code>  
        <location>/404.jsp</location>  
    </error-page>  
    <error-page>  
        <error-code>500</error-code>  
        <location>/500.jsp</location>  
    </error-page>  
{% endhighlight %}  

4. 屏蔽目录文件  

`conf/web.xml`：   
{% highlight xml %}  
<servlet>  
    <servlet-name>default</servlet-name>  
    <servlet-class>org.apache.catalina.servlets.DefaultServlet</servlet-class>  

    <init-param>  
        <param-name>debug</param-name>  
        <param-value>0</param-value>  
    </init-param>  

    <init-param>  
        <param-name>listings</param-name>  
        <param-value>false</param-value>  
    </init-param>  

    <load-on-startup>1</load-on-startup>  
</servlet>   
{% endhighlight %}  

在webapps目录下创建404.jsp、500.jsp两个空文件。  

6. 修改日志记录  

`conf/web.xml`：   
{% highlight xml %}  
<Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"  
    prefix="localhost_access_log." suffix=".txt"  
    pattern="%h %l %u %t &quot;%r&quot; %s %b" />  
{% endhighlight %}  
改为：  
{% highlight xml %}  
<Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"   
    pattern="%h %l %u %t &quot;%r&quot; %s %b"   
    prefix="localhost_access_log." suffix=".txt"/>  
{% endhighlight %}  

5. 删除项目清单  

> $CATALINA_BASE/webapps/manager  
> $CATALINA_BASE/webapps/host-manager  
> $CATALINA_BASE/webapps/examples  
> $CATALINA_BASE/webapps/docs  

[url]:http://blog.fens.me/black-ip-list/
