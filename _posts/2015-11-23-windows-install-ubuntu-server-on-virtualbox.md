---
layout: post
title: 简述 windows 下的 ubuntu-server 安装（VirtualBox）
description: windows ubuntu server 安装（VirtualBox） openssh 文本模式
author: 陈鑫杰
---

准备做一些有关集群的储备，埋掉生产环境部署必须在深夜进行这个坑。  
本来想整 `Docker`，就是坑太大了，资源神马的太少。  
整了个 VirtualBox（拥抱开源~）  
于是记录下...  

### 准备工作  
Oracle VM VirtualBox 5.0.10 r104061  
ubuntu-14.04.3-server-amd64.iso  
putty.exe  
VirtualBox 相关知识  
Linux 相关知识  

PS. ubuntu-server 文本模式下，资源调用的比较少   

#### VirtualBox 篇
……（省略 Windows 下的安装步骤）  

* 新建一个虚拟电脑

	选择 Linux - ubuntu

	虚拟硬盘选择`固定大小`（耗时比较长），并挑一个比较大的分区。（其他默认选项）

* 设置虚拟机

	存储-控制器：IDE 添加一个盘片。（ubuntu-14.04.3-server-amd64.iso）  

	系统-启动程序，将光驱移动到第一行。  

	网络-网卡1：仅主机（HOST-ONLY）适配器。（主机与虚拟机间的 IP 互通）  

	网络-网卡2：网络地址转换（NAT）。（访问外网）  

	其他声音之类的关关掉之类的。  

#### Ubuntu Server 篇
……（省略 Ubuntu 系统安装，update，vim）  

* root

	`sudo passwd root`

	`su`

* openssh

	判断 openssh 是否安装：`ssh localhost`  

	安装 openssh：`sudo apt-get install openssh-server `  

	启动 openssh：`sudo /etc/init.d/ssh start`  

	确认：`ps -ef | grep ssh`  

* 配置SSH

	`vi /etc/ssh/sshd_config`  

	修改默认端口：port 23  

	允许 root 登录：PermitRootLogin yes  

	允许 root 登录：# StrictModes yes  

	重新启动：`/etc/init.d/ssh restart`  

* 固定IP

	`sudo vi /etc/network/interfaces`  

	auto eth0  
	iface eth0 inet static  
	address 192.168.25.100  
	netmask 255.255.255.0  

	auto eth1  
	iface eth1 inet dhcp  

* 设置永久 DNS

	`sudo vi /etc/resolvconf/resolv.conf.d/head`  

	添加：nameserver 8.8.8.8  

	`sudo resolvconf -u`  


PS. 开机默认文本模式  
运行 `vi /etc/default/grub` 命令，修改为：GRUB_CMDLINE_LINUX_DEFAULT="quiet splash text"  

#### putty
putty 自带的 `选中即复制`，`右击即粘贴` 简直大爱啊。。。

* 配置连接

	Session：Host Name（or IP address）+ 端口 = `OPEN`

> **Note:** 写到最后，你以为只是吐槽了吗？  
>
> 刚填完一个坑，给大家分享下。  
> 懒得新建一步步来，通过复制虚拟机增加数量。  
> 这本身是件棒棒的事情，但是有些配置没改导致这些'新'虚拟机不能好好的工作，当真是个坑！  
> 解决方式：  
> 1. 替换 IP 配置 `sudo vi /etc/network/interfaces`  
> 2. 替换主机名称 `sudo vi /etc/hostname`  
> 3. 替换 host `sudo vi /etc/hosts`  
>
> 把 3 给忘改了，然后…… 欲哭无泪啊  
