---
layout: post
title: 转角里遇见了一个 BUG
author: 陈鑫杰
---

爆了个让人难忘的 BUG

## 报错信息
{% highlight java %}
Sep 28, 2015 3:59:34 PM org.apache.tomcat.util.net.JIoEndpoint$Acceptor run  
SEVERE: Socket accept failed  
java.net.SocketException: Too many open files  
	at java.net.PlainSocketImpl.socketAccept(Native Method)  
	at java.net.PlainSocketImpl.accept(PlainSocketImpl.java:408)  
	at java.net.ServerSocket.implAccept(ServerSocket.java:462)  
	at java.net.ServerSocket.accept(ServerSocket.java:430)  
	at org.apache.tomcat.util.net.DefaultServerSocketFactory.acceptSocket(DefaultServerSocketFactory.java:60)  
	at org.apache.tomcat.util.net.JIoEndpoint$Acceptor.run(JIoEndpoint.java:220)  
	at java.lang.Thread.run(Thread.java:662)  
{% endhighlight %}

## 吐槽
``史诗`` 级副本 ``微信公众平台服务号 & 第三方平台``  
各种挑战，各种姿势跌倒 ... 在漫漫 ``[ERROR]`` 中终于爆了个 ``稀有`` ，真是件值得高兴的事儿。  

## 概述
我司为迎接十一国庆，策划了次微信活动。在很多很多很多粉丝以及访问量下，单服务器应用在某个高峰时刻出现了 ``断裂``。各种搜索之后，才知道 Linux 对进程打开的文件数量是有限制的。  

{% highlight python %}
foamvalue@ubuntu:/$ ulimit -a  
core file size          (blocks, -c) 0  
data seg size           (kbytes, -d) unlimited  
scheduling priority             (-e) 0  
file size               (blocks, -f) unlimited  
pending signals                 (-i) 31645  
max locked memory       (kbytes, -l) 64  
max memory size         (kbytes, -m) unlimited  
open files                      (-n) 1024  
pipe size            (512 bytes, -p) 8  
POSIX message queues     (bytes, -q) 819200  
real-time priority              (-r) 0  
stack size              (kbytes, -s) 8192  
cpu time               (seconds, -t) unlimited  
max user processes              (-u) 31645  
virtual memory          (kbytes, -v) unlimited  
file locks                      (-x) unlimited  
{% endhighlight %}

通过 ``ulimit -a`` 可以看到系统默认的 ``open files`` 为 1024    

## 解决方法
``vi /etc/security/limits.conf`` 添加如下一行:  
\* - nofile 1006154  
``vi /etc/pam.d/login`` 添加如下一行:  
session required /lib/security/pam\_limits.so

**添加内容中的（可能有）反斜杠为转义符，请忽略。**  
