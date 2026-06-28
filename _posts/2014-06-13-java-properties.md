---
layout: post
title: Java 读取 properties 文件
author: 陈鑫杰
---

在 Java 项目开发过程中，往往会遇到很多不确定性的参数。这些参数并非人为因素造成的，而是客观因素无法确定。这时引入 properties 配置文件，可以减少项目后期，一旦参数发生变化所带来的庞大的修改工程。  
下面是从某个项目中抽取出来的配置代码：  

## 配置 Web.xml 监听
{% highlight xml %}
<listener><listener-class>cn.live.listener.APIListener</listener-class></listener>
{% endhighlight %}

## 实现 ServletContextListener 接口实现监听

{% highlight java %}
package cn.live.listener;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import org.logicalcobwebs.proxool.configuration.JAXPConfigurator;
import cn.live.util.BaseUtils;

public class APIListener implements ServletContextListener {
 @Override
 public void contextDestroyed(ServletContextEvent arg0) {
 }

 @Override
 public void contextInitialized(ServletContextEvent arg0) {
  try {
   BaseUtils.APIPROPERTIES.load(this.getClass().getResourceAsStream("/api.properties"));
  } catch (Exception e) {
   e.printStackTrace();
  }
 }
}
{% endhighlight %}

## 工具类获取数据
{% highlight java %}
package cn.live.util;

import java.io.UnsupportedEncodingException;
import java.util.Properties;

public final class BaseUtils {

 /**
  * @Fields APIPROPERTIES : API properties 实例
  */
 public static Properties APIPROPERTIES = new Properties();

 /**
  * @Fields DBPROPERTIES : DB properties 实例
  */
 public static Properties DBPROPERTIES = new Properties();

 /**
  * @Description: TODO 获取 API 配置文件信息
  * @param @param key
  * @param @return
  * @return String
  * @throws
  */
 public static String getAPIByKey(String key) {
  try {
   String value = APIPROPERTIES.getProperty(key);
   // 中文乱码处理
   return new String(value.getBytes("ISO8859-1"), "UTF-8");
  } catch (UnsupportedEncodingException e) {
   e.printStackTrace();
  }
  return "";
 }
}
{% endhighlight %}
