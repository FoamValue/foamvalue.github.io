---
layout: post
title: Java 调用 .Net Web Services 接口
author: 陈鑫杰
---

## 概述
使用客户端调用方式，调用 .Net Web Services 接口。

## 前期准备
系统环境：JDK 1.6.0、eclipse  
.Net Web Services 接口地址：http://xxx.xxx.xxx.xxx:xxx/webserver/wxService.asmx

## 创建 Java Project
打开 eclipse，点击 File –New – Java Project，新建一个 Java Project 工程【WebServices】。

## 创建 Web Services Client
打开 eclipse，点击 File – New – Other，输入 Web Service Client，新建一个 Web Service Client。  
将接口地址复制到 Serivce definition 中，地址后面加上 ?WSDL 即 http://xxx.xxx.xxx.xxx:xxxx/webserver/wxService.asmx?WSDL  
选择 Client type：Java Proxy，选择输出文件到Java 工程下的 src 中【/WebServices/src】。

## 调用接口方法
{% highlight java %}
package test;
import java.rmi.RemoteException;
import org.tempuri.WxServiceSoapProxy;
public class TestDriver {
public static void xxx(String param1, String param2) {
try {
WxServiceSoapProxy wxServiceSoapProxy = new WxServiceSoapProxy();
String xxxResponse = wxServiceSoapProxy.xxx(param1, param2);
System.out.println(xxxResponse);
} catch (RemoteException e) {
e.printStackTrace();
}
}

public static void main (String[] args) {
xxx("参数一","参数二");
}
}
 {% endhighlight %}
测试时，会遇到以下报错信息：  
警告: Unable to find required classes (javax.activation.DataHandler and javax.mail.internet.MimeMultipart). Attachment support is disabled.  
需要手动引入 activation.jar 和 mail.jar 即可。  
