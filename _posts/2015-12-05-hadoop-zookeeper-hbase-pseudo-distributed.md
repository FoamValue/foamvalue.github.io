---
layout: post
title: 进击的 HZH 伪分布式
description: hadoop-2.7.1 zookeeper-3.4.7 hbase-1.1.2 伪分布式
author: 陈鑫杰
---

在虚拟机上，以高版本的 hadoop、zookeeper、hbase 搭建伪分布式系统，用于 Java 微服务模式。  

度娘、谷歌出来，都尼玛大同小异的。无奈从零开始撸...  
连跌 3 天之后，终于可以用起来了。  
于是记录下，毕竟也要为下次完全分布式做准备。  

PS.  
因为.没有实际接触过分布式系统  
又因为.想尝试微服务的概念  
又因为.想尝试百度新闻订阅模式  
又因为...  
总之想玩了呗~  

------

### 前期准备
1. ubuntu-14.04.3-server-amd64（内存2G以上）
2. jdk1.7.0_80
2. hadoop-2.7.1 [Apache 下载][1]
3. zookeeper-3.4.7 [Apache 下载][2]
4. hbase-1.1.2 [Apache 下载][3]

> **NOTE:** 安装顺序  
> SSH → hadoop → zookeeper → hbase  
> 内存1G的时候，hbase 启动存在困难。  
> jdk1.8，hbase 启动会产生 jvm 警告。  

### 约定
解压缩：sudo tar -zxvf hadoop-2.7.1.tar.gz  
用户权限：sudo chown root:root -R hadoop-2.7.1  
运行权限：sudo chmod 755 -R hadoop-2.7.1  
创建目录：sudo mkdir /root/user/hadoop/dfs  
编辑文件：sudo vi hadoop-2.7.1/etc/hadoop/core-site.xml  
为了描述方便，HZH 代表 hadoop + zookeeper + hbase  

> **NOTE:**   
> root 用户...  

### SSH
1. 判断是否安装 `ssh localhost`  
2. 安装 SSH `sudo apt-get install openssh-server`  
3. 手贱改端口 `vi /etc/ssh/sshd_config`（默认22，改为23）  
4. 安装密钥  `cd ~/.ssh/` → `ssh-keygen -t rsa` → 各种回车 → `cat id_rsa.pub >> authorized_keys`  
5. 测试 `ssh -p23 localhost`  

> **NOTE:** 关于 SSH  
> 伪分布式这个梗需要通过 SSH 相互连接  
> 安装密钥是为了链接的时候不要在输入（简直废话）  
> 更改 SSH 默认端口，同时需要更改 HZH 配置文件（简直手贱）  

### JDK
略...

{% highlight xml %}
#set java environment
export JAVA_HOME=/usr/local/jdk1.7.0_80
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:${JRE_HOME}/bin:$PATH
{% endhighlight xml %}

> **NOTE:** 关于 JDK  
> 下载免安装包 → 解压 → 用户授权root → 运行权限755 → `sudo vi /ect/profile` → `source /etc/profile` → `java -version`  
> 多配配就熟了  

### hadoop
创建独立的 dfs 目录（非 hadoop/tmp路径下）：data[/root/user/hadoop/dfs/data]、name[/root/user/hadoop/dfs/data]

配置 core-site.xml[hadoop-2.7.1/etc/hadoop/core-site.xml]  
{% highlight xml %}
<configuration>
        <property>
                <name>hadoop.tmp.dir</name>
                <value>file:/root/hadoop-2.7.1/tmp</value>
                <description>Abase for other temporary directories.</description>
        </property>
        <property>
                <name>fs.defaultFS</name>
                <value>hdfs://localhost:9000</value>
        </property>
</configuration>
{% endhighlight xml %}

配置 hdfs-site.xml[hadoop-2.7.1/etc/hadoop/hdfs-site.xml]  
{% highlight xml %}
<configuration>
        <property>
                <name>dfs.replication</name>
                <value>1</value>
        </property>
        <property>
                <name>dfs.namenode.name.dir</name>
                <value>file:/root/user/hadoop/dfs/name</value>
        </property>
        <property>
                <name>dfs.datanode.data.dir</name>
                <value>file:/root/user/hadoop/dfs/data</value>
        </property>
</configuration>
{% endhighlight xml %}

配置 hadoop-env.sh[ hadoop-2.7.1/etc/hadoop/hadoop-env.sh]  
增加以下代码：  
{% highlight xml %}
export JAVA_HOME=/usr/local/jdk1.7.0_80  
export HADOOP_SSH_OPTS="-p 23"  
{% endhighlight xml %}

> **NOTE:**  
> 编辑 `/etc/hosts`，删除 `127.0.0.1  fv-u004`，增加 `192.168.25.104  fv-u004`  

格式化 `sudo bin/hdfs namenode -format`  

> **NOTE:**  
> 会有成功提示 successfully formatted  
> 如果没有成功，请仔细检查以上步骤  

启动 hadoop  
`./hadoop-2.7.1/sbin/start-dfs.sh`  
{% highlight xml %}
Starting namenodes on [localhost]
localhost: starting namenode, logging to /root/hadoop-2.7.1/logs/hadoop-root-namenode-fv-u004.out
localhost: starting datanode, logging to /root/hadoop-2.7.1/logs/hadoop-root-datanode-fv-u004.out
Starting secondary namenodes [0.0.0.0]
0.0.0.0: starting secondarynamenode, logging to /root/hadoop-2.7.1/logs/hadoop-root-secondarynamenode-fv-u004.out
{% endhighlight xml %}

使用 jps 确认是否启动成功
{% highlight xml %}
root@fv-u004:~# jps
2234 Jps
2069 SecondaryNameNode
1833 DataNode
1693 NameNode
{% endhighlight xml %}

> **NOTE:**  
> 如果SecondaryNameNode没有启动，请运行 sbin/stop-dfs.sh 关闭进程，然后再次尝试启动尝试。  
> 如果 NameNode 或 DataNode 没有启动，请仔细检查之前步骤。  
>  
> 强烈建议检查日志文件有无报错  
> `tail -n 500  /root/hadoop-2.7.1/logs/hadoop-root-namenode-fv-u004.log`  
> `tail -n 500  /root/hadoop-2.7.1/logs/hadoop-root-datanode-fv-u004.log`  
> `tail -n 500  /root/hadoop-2.7.1/logs/hadoop-root-secondarynamenode-fv-u004.log`  

### zookeeper
创建三个文件目录：zk1[/root/user/zoo/zk1]、zk2[/root/user/zoo/zk2]、zk3[/root/user/zoo/zk3]

配置 myid  
`sudo echo "1" > /root/user/zoo/zk1/myid`  
`sudo echo "2" > /root/user/zoo/zk2/myid`  
`sudo echo "3" > /root/user/zoo/zk3/myid`  

zookeeper-3.4.6/conf/zk1.cfg
{% highlight xml %}
tickTime=2000
initLimit=10
syncLimit=5
dataDir=/root/user/zoo/zk1
clientPort=2181
server.1=192.168.25.104:2888:3888
server.2=192.168.25.104:2889:3889
server.3=192.168.25.104:2890:3890
{% endhighlight xml %}

zookeeper-3.4.6/conf/zk2.cfg
{% highlight xml %}
tickTime=2000
initLimit=10
syncLimit=5
dataDir=/root/user/zoo/zk2
clientPort=2182
server.1=192.168.25.104:2888:3888
server.2=192.168.25.104:2889:3889
server.3=192.168.25.104:2890:3890
{% endhighlight xml %}

zookeeper-3.4.6/conf/zk3.cfg
{% highlight xml %}
tickTime=2000
initLimit=10
syncLimit=5
dataDir=/root/user/zoo/zk3
clientPort=2183
server.1=192.168.25.104:2888:3888
server.2=192.168.25.104:2889:3889
server.3=192.168.25.104:2890:3890
{% endhighlight xml %}

启动集群
{% highlight xml %}
./zookeeper-3.4.6/bin/zkServer.sh start zookeeper-3.4.6/conf/zk1.cfg
./zookeeper-3.4.6/bin/zkServer.sh start zookeeper-3.4.6/conf/zk2.cfg
./zookeeper-3.4.6/bin/zkServer.sh start zookeeper-3.4.6/conf/zk3.cfg
{% endhighlight xml %}

检查集群
{% highlight xml %}
root@fv-u004:~# ./zookeeper-3.4.6/bin/zkServer.sh status zookeeper-3.4.6/conf/zk1.cfg
JMX enabled by default
Using config: zookeeper-3.4.6/conf/zk1.cfg
Mode: follower

root@fv-u004:~# ./zookeeper-3.4.6/bin/zkServer.sh status zookeeper-3.4.6/conf/zk2.cfg
JMX enabled by default
Using config: zookeeper-3.4.6/conf/zk2.cfg
Mode: leader

root@fv-u004:~# ./zookeeper-3.4.6/bin/zkServer.sh status zookeeper-3.4.6/conf/zk3.cfg
JMX enabled by default
Using config: zookeeper-3.4.6/conf/zk3.cfg
Mode: follower
{% endhighlight xml %}

使用 jps 确认是否启动成功
{% highlight xml %}
root@fv-u004:~# jps
2069 SecondaryNameNode
1833 DataNode
1693 NameNode
2396 QuorumPeerMain
2425 QuorumPeerMain
2468 QuorumPeerMain
2691 Jps
{% endhighlight xml %}

> **NOTE:**  
> zookeeper 集群没有完全启动的时候，可能会存在不稳定的情况。  
>  
> 强烈建议检查日志文件有无报错  
> `tail -n 500 zookeeper-3.4.6/zookeeper.out`  

### hbase

配置 hbase-env.sh[hbase-1.1.2/conf/hbase-env.sh]  
增加以下代码：
{% highlight xml %}
export JAVA_HOME=/usr/local/jdk1.7.0_80
export HBASE_CLASSPATH=/root/hadoop-2.7.1
export HBASE_SSH_OPTS="-p 23"
export HBASE_MANAGES_ZK=true
{% endhighlight xml %}

配置 hbase-site.xml[hbase-1.1.2/conf/hbase-site.xml]
{% highlight xml %}
<configuration>
	<property>
		<name>hbase.rootdir</name>
		<value>hdfs://localhost:9000/hbase</value>
	</property>
	<property>
		<name>hbase.zookeeper.quorum</name>
		<value>localhost</value>
	</property>
	<property>
		<name>hbase.cluster.distributed</name>
		<value>true</value>
	</property>
</configuration>
{% endhighlight xml %}

启动 hbase
{% highlight xml %}
root@fv-u004:~# ./hbase-1.1.2/bin/start-hbase.sh
localhost: starting zookeeper, logging to /root/hbase-1.1.2/bin/../logs/hbase-root-zookeeper-fv-u004.out
starting master, logging to /root/hbase-1.1.2/logs/hbase-root-master-fv-u004.out
starting regionserver, logging to /root/hbase-1.1.2/logs/hbase-root-1-regionserver-fv-u004.out
{% endhighlight xml %}

运行 habse
{% highlight xml %}
root@fv-u004:~# ./hbase-1.1.2/bin/hbase shell
2015-12-05 16:42:56,389 WARN  [main] util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
HBase Shell; enter 'help<RETURN>' for list of supported commands.
Type "exit<RETURN>" to leave the HBase Shell
Version 1.1.2, rcc2b70cf03e3378800661ec5cab11eb43fafe0fc, Wed Aug 26 20:11:27 PDT 2015

hbase(main):001:0>
{% endhighlight xml %}

### 关闭流程
关闭 hbase
{% highlight xml %}
root@fv-u004:~# ./hbase-1.1.2/bin/stop-hbase.sh
stopping hbase................
{% endhighlight xml %}

关闭 zookeeper
{% highlight xml %}
root@fv-u004:~# ./zookeeper-3.4.6/bin/zkServer.sh stop zookeeper-3.4.6/conf/zk1.cfg
JMX enabled by default
Using config: zookeeper-3.4.6/conf/zk1.cfg
Stopping zookeeper ... STOPPED
root@fv-u004:~# ./zookeeper-3.4.6/bin/zkServer.sh stop zookeeper-3.4.6/conf/zk2.cfg
JMX enabled by default
Using config: zookeeper-3.4.6/conf/zk2.cfg
Stopping zookeeper ... STOPPED
root@fv-u004:~# ./zookeeper-3.4.6/bin/zkServer.sh stop zookeeper-3.4.6/conf/zk3.cfg
JMX enabled by default
Using config: zookeeper-3.4.6/conf/zk3.cfg
Stopping zookeeper ... STOPPED
{% endhighlight xml %}

关闭 hadoop
{% highlight xml %}
root@fv-u004:~# ./hadoop-2.7.1/sbin/stop-dfs.sh
Stopping namenodes on [localhost]
localhost: stopping namenode
localhost: stopping datanode
Stopping secondary namenodes [0.0.0.0]
0.0.0.0: stopping secondarynamenode
{% endhighlight xml %}

检查是否正常关闭
{% highlight xml %}
root@fv-u004:~# jps
5393 Jps
{% endhighlight xml %}

> **NOTE:**  
> 关闭顺序与启动顺序相反  
> 如果没有正常关闭，那么直接 kill -9 进程号吧。

### 错误处理
1. `192.168.25.104: no zookeeper to stop because no pid file /tmp/hbase-root-zookeeper.pid`  


2. `java.net.ConnectException: Call From fv-u004/127.0.1.1 to localhost:9000 failed on connection exception: java.net.ConnectException: Connection refused; For more details see:  http://wiki.apache.org/hadoop/ConnectionRefused`  


3. org.apache.hadoop.hdfs.server.datanode.DataNode: Initialization failed for Block pool  
变更 Hadoop 配置之后，没有清空 data、name 目录。并重新格式化 `sudo bin/hdfs namenode -format`    


### 结束语
just beginning.  

### 参考资料
hadoop 安装：[http://www.powerxing.com/install-hadoop](http://www.powerxing.com/install-hadoop)  
zookeeper 安装：[http://blog.fens.me/hadoop-zookeeper-intro](http://blog.fens.me/hadoop-zookeeper-intro)  
hbase 安装：[http://cp1985chenpeng.iteye.com/blog/1310175](http://cp1985chenpeng.iteye.com/blog/1310175)  
baidu & google

[1]: http://www.eu.apache.org/dist/hadoop/common/stable/  
[2]: http://www.eu.apache.org/dist/zookeeper/stable/  
[3]: http://www.eu.apache.org/dist/hbase/stable/  
