---
layout: post
title: HBase 快速安装
author: 陈鑫杰
---

系统版本：Ubuntu 12.04 LTS  
Java version：1.7.0_51  
HBase：0.94.18  

> cd Downloads  
> sudo tar xvfz hbase-0.94.18.tar.gz  
> sudo mv sudo mv hbase-0.94.18/ ../  
> cd ../  
> sudo chmod 777 -R hbase-0.94.18/  

上述步骤完成解压 HBase 的 tar 文件包，为了方便起见，可以创建一个环境变量指向这个目录，以便于操作。

> \# Set HBase  
> HBASE_HOME=/home/foamvalue/hbase-0.94.18  
> export HBASE_HOME=$HBASE_HOME  
> export PATH=$HBASE_HOME/bin:$PATH

完成后，使用系统提供的脚本（Terminal）启动 HBase：

> $HBASE/bin/start-hbase.sh  
> starting master, logging to /home/.../hbase-0.94.18/logs/hbase-...-master-...out

同时也把 $HBASE/bin 放进 PATH 变量，以便于直接执行 hbase 命令，而不是 $HBASE/bin/hbase。  
全部做完后，单机模式的 HBase 就安装成功了。HBase 的配置信息主要在两个文件里 hbase-env.sh 和 hbase-site.xml 。这两个文件都存在在 /conf/ 目录下。单机模式的默认设置里，HBase 写数据到目录 /tmp 下，但是该目录不是长期保存数据的地方，需要编辑 hbase-site.xml 文件，添加下面配置信息来将目录改到你指定的地方：
{% highlight xml %}
<property>
<name>hbase.rootdir</name><value>file:///home/foamvalue/myhbasedirectory</value>
</property>
{% endhighlight %}
HBase 安装成功后有一个简单管理页面，运行在端口http://localhost:60010
