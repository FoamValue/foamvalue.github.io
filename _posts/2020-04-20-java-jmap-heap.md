---
layout: post
title: 如何使用 Java Jmap 工具
description: 服务器上如何使用 Java Jmap 工具，查看应用程序的占用内存的运行情况。
---

## 查看系统版本

``` shell
# cat /proc/version
Linux version 3.10.0-327.el7.x86_64 (builder@kbuilder.dev.centos.org) (gcc version 4.8.3 20140911 (Red Hat 4.8.3-9) (GCC) ) #1 SMP Thu Nov 19 22:10:57 UTC 2015

# cat /etc/redhat-release
CentOS Linux release 7.2.1511 (Core)
```

## 查看 Java 进程号

``` shell
# jps -m -l
15968 sun.tools.jps.Jps -m -l
4285 cs-1.0.0.jar -XX:MetaspaceSize=1024m -XX:MaxMetaspaceSize=1024m -Xms2048m -Xmx2048m -Xmn1024m -Xss512k -XX :SurvivorRatio=8 -XX:+UseConcMarkSweepGC --spring.profiles.active=prod
```

## 生成 Java 堆的详细信息

``` shell
# jmap -heap 4285
Attaching to process ID 4285, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.65-b01

using thread-local object allocation.
Parallel GC with 2 thread(s)

Heap Configuration:
MinHeapFreeRatio = 0
MaxHeapFreeRatio = 100
MaxHeapSize = 994050048 (948.0MB)
NewSize = 20971520 (20.0MB)
MaxNewSize = 331350016 (316.0MB)
OldSize = 41943040 (40.0MB)
NewRatio = 2
SurvivorRatio = 8
MetaspaceSize = 21807104 (20.796875MB)
CompressedClassSpaceSize = 1073741824 (1024.0MB)
MaxMetaspaceSize = 17592186044415 MB
G1HeapRegionSize = 0 (0.0MB)

Heap Usage:
Exception in thread "main" java.lang.reflect.InvocationTargetException
at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
at java.lang.reflect.Method.invoke(Method.java:497)
at sun.tools.jmap.JMap.runTool(JMap.java:201)
at sun.tools.jmap.JMap.main(JMap.java:130)
Caused by: java.lang.RuntimeException: unknown CollectedHeap type : class sun.jvm.hotspot.gc_interface.CollectedHeap
at sun.jvm.hotspot.tools.HeapSummary.run(HeapSummary.java:144)
at sun.jvm.hotspot.tools.Tool.startInternal(Tool.java:260)
at sun.jvm.hotspot.tools.Tool.start(Tool.java:223)
at sun.jvm.hotspot.tools.Tool.execute(Tool.java:118)
at sun.jvm.hotspot.tools.HeapSummary.main(HeapSummary.java:49)
... 6 more
```


安装 debuginfo

``` shell
# yum list installed |grep openjdk
java-1.8.0-openjdk.x86_64 1:1.8.0.65-3.b17.el7 @base
java-1.8.0-openjdk-devel.x86_64 1:1.8.0.65-3.b17.el7 @base
java-1.8.0-openjdk-headless.x86_64 1:1.8.0.65-3.b17.el7 @base

# wget http://debuginfo.centos.org/7/x86_64/java-1.8.0-openjdk-debuginfo-1.8.0.65-3.b17.el7.x86_64.rpm

# yum localinstall java-1.8.0-openjdk-debuginfo-1.8.0.65-3.b17.el7.x86_64.rpm

# rpm -qa|grep debuginfo
java-1.8.0-openjdk-debuginfo-1.8.0.65-3.b17.el7.x86_64
```

## 再次生成java堆的详细信息

``` shell
# jmap -heap 12107
Attaching to process ID 12107, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.65-b01

using thread-local object allocation.
Parallel GC with 2 thread(s)

Heap Configuration:
MinHeapFreeRatio = 0
MaxHeapFreeRatio = 100
MaxHeapSize = 994050048 (948.0MB)
NewSize = 20971520 (20.0MB)
MaxNewSize = 331350016 (316.0MB)
OldSize = 41943040 (40.0MB)
NewRatio = 2
SurvivorRatio = 8
MetaspaceSize = 21807104 (20.796875MB)
CompressedClassSpaceSize = 1073741824 (1024.0MB)
MaxMetaspaceSize = 17592186044415 MB
G1HeapRegionSize = 0 (0.0MB)

Heap Usage:
PS Young Generation
Eden Space:
capacity = 178257920 (170.0MB)
used = 16845776 (16.065383911132812MB)
free = 161412144 (153.9346160888672MB)
9.450225830078125% used
From Space:
capacity = 524288 (0.5MB)
used = 0 (0.0MB)
free = 524288 (0.5MB)
0.0% used
To Space:
capacity = 7864320 (7.5MB)
used = 0 (0.0MB)
free = 7864320 (7.5MB)
0.0% used
PS Old Generation
capacity = 108003328 (103.0MB)
used = 15761464 (15.031303405761719MB)
free = 92241864 (87.96869659423828MB)
14.593498452195844% used

17225 interned Strings occupying 1578640 bytes.
```
