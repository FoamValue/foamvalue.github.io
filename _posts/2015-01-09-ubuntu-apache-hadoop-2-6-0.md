---
layout: post
title: ubuntu 下配置 Hadoop 2.6.0 伪分布式
author: 陈鑫杰
---

## 目的
本文介绍如何设置和配置一个单节点的Hadoop的安装，让您可以快速执行使用Hadoop MapReduce和Hadoop分布式文件系统（HDFS），简单的操作。

## 准备

### 支持平台
* GNU/Linux的支持作为开发和生产平台。Hadoop的已被证明在2000个节点的GNU/Linux集群上。
* windows 也是一种支持的平台，但以下步骤为Linux而已。建立Hadoop的Windows上，看到的[wiki页面][wiki]。

### 所需软件
为Linux所需的软件包括：

1. Java™的必须安装。推荐的Java版本的[Hadoop Java Versions描述][Hadoop Java Version]。
2. SSH必须安装和sshd必须运行使用管理远程Hadoop守护进程的Hadoop的脚本。

### 安装软件
如果群集不具备必要的软件，你需要安装它

例如在Ubuntu Linux：

{% highlight ruby%}
$ sudo apt-get install ssh
$ sudo apt-get install rsync
{% endhighlight %}

## 下载
为了得到一个Hadoop发行版，从[Apache下载镜像][Apache Download Mirrors]之一，下载最近的稳定版本。

## 准备启动Hadoop集群
解压下载的Hadoop发行版。在配送，编辑文件`etc/hadoop/hadoop-env.sh`如下定义一些参数：

{% highlight xml %}
# set to the root of your Java installation
export JAVA_HOME=/usr/java/latest

# Assuming your installation directory is /usr/local/hadoop
export HADOOP_PREFIX=/usr/local/hadoop
{% endhighlight %}

试试下面的命令：

{% highlight ruby %}
$ bin/hadoop
{% endhighlight %}

这将显示为Hadoop脚本的使用文档。

现在，你就可以开始你的Hadoop集群中的三种支持方式之一：

* 单机模式（Local (Standalone) Mode）
* 伪分布式模式（Pseudo-Distributed Mode）
* 完全分布式模式（Fully-Distributed Mode）

## 单机模式操作

默认情况下，Hadoop的被配置为在非分布式模式下运行，作为一个单一的Java程序。这是用于调试。

下面的示例将解压后的conf目录作为输入使用，然后查找并显示每一个匹配给定正则表达式。输出写入指定的输出目录。

{% highlight ruby %}
$ mkdir input
$ cp etc/hadoop/*.xml input
$ bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.6.0.jar grep input output 'dfs[a-z.]+'
$ cat output/*
{% endhighlight %}

## 伪分布式操作

Hadoop的也可以在伪分布式模式单节点上运行，其中每个的Hadoop守护程序在一个单独的Java进程运行。

### 配置
使用以下命令：

`etc/hadoop/core-site.xml`：

{% highlight xml %}
<configuration>
 <property>
  <name>fs.defaultFS</name>
  <value>hdfs://localhost:9000</value>
 </property>
</configuration>
{% endhighlight %}

`etc/hadoop/hdfs-site.xml`：

{% highlight xml %}
<configuration>
 <property>
  <name>dfs.replication</name>
  <value>1</value>
 </property>
</configuration>
{% endhighlight %}

### 设置SSH免登陆

现在，检查您可以ssh到没有密码的本地主机：

{% highlight ruby %}
$ ssh localhost
{% endhighlight %}

如果你不能通过ssh没有密码为localhost，执行下面的命令：

{% highlight ruby %}
$ ssh-keygen -t dsa -P '' -f ~/.ssh/id_dsa
$ cat ~/.ssh/id_dsa.pub >> ~/.ssh/authorized_keys
{% endhighlight %}

## 执行

以下说明在本地运行一个MapReduce工作。

1. 格式化文件格式

{% highlight ruby %}
$ bin/hdfs namenode -format
{% endhighlight %}

2. 启动NameNode的守护和DataNode的守护进程：

{% highlight ruby %}
 $ sbin/start-dfs.sh
{% endhighlight %}

Hadoop的守护程序日志输出写入到$HADOOP_LOG_DIR目录（默认为$HADOOP_HOME/日志）。

3. 浏览网页界面的NameNode的;默认情况下它可在：

  * NameNode - http://localhost:50070/

4. 令执行的MapReduce工作所需的HDFS目录：

{% highlight ruby %}
$ bin/hdfs dfs -mkdir /user
$ bin/hdfs dfs -mkdir /user/<username>
{% endhighlight %}

5. 输入文件复制到分发文件系统：

{% highlight ruby %}
$ bin/hdfs dfs -put etc/hadoop input
{% endhighlight %}

6. 运行一些所提供的例子：

{% highlight ruby %}
$ bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.6.0.jar grep input output 'dfs[a-z.]+'
{% endhighlight %}

7. 检查输出文件：

从分布式文件系统复制输出文件到本地文件系统，并检查它们：

{% highlight ruby %}
$ bin/hdfs dfs -get output output
$ cat output/*
{% endhighlight %}

or

查看分布式文件系统的输出文件：

{% highlight ruby %}
$ bin/hdfs dfs -cat output/*
{% endhighlight %}

8. 当您完成后，停止与守护进程：

{% highlight ruby %}
$ sbin/stop-dfs.sh
{% endhighlight %}

## YARN单节点

你可以通过设置几个参数，另外运行ResourceManager中守护和NodeManager守护程序运行在伪分布式模式YARN一个MapReduce工作。

以下说明假设已经执行的1〜4步的上述指示。

1. 配置参数如下：

`etc/hadoop/mapred-site.xml`：

{% highlight xml %}
<configuration>
 <property>
  <name>mapreduce.framework.name</name>
  <value>yarn</value>
 </property>
</configuration>
{% endhighlight %}

`etc/hadoop/yarn-site.xml`：

{% highlight xml %}
<configuration>
 <property>
  <name>yarn.nodemanager.aux-services</name>
  <value>mapreduce_shuffle</value>
 </property>
</configuration>
{% endhighlight %}

2. 开始的ResourceManager守护和NodeManager守护进程：

{% highlight ruby %}
$ sbin/start-yarn.sh
{% endhighlight %}

3. 浏览网页界面ResourceManager中;默认情况下它可在：

  * ResourceManager - http://localhost:8088/

4. 运行MapReduce工作。

5. 当您完成后，停止与守护进程：

{% highlight ruby %}
$ sbin/stop-yarn.sh
{% endhighlight %}

## 完全分布式操作

有关设置[完全分布式][Cluster Setup]的信息，不平凡的集群看到群集设置

*原文链接：[Single Node Cluster][Single Node Cluster]*

[Single Node Cluster]:http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/SingleCluster.html
[wiki]:http://wiki.apache.org/hadoop/Hadoop2OnWindows
[Hadoop Java Version]:http://wiki.apache.org/hadoop/HadoopJavaVersions
[Apache Download Mirrors]:http://www.apache.org/dyn/closer.cgi/hadoop/common/
[Cluster Setup]:http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/ClusterSetup.html
