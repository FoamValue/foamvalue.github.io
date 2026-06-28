---
layout: post
title: Docker & Mysql 安装
keywords: Ubuntu Docker Mysql
description: Docker 领域下的探索
tags: Ubuntu Docker Mysql
author: 陈鑫杰
---

## Docker 安装

详细安装[步骤](https://yeasy.gitbooks.io/docker_practice/content/install/ubuntu.html)

**系统支持 Ubuntu Xenial 16.04 (LTS)**

```
root@ubuntu-V001:~# lsb_release -a
No LSB modules are available.
Distributor ID:	Ubuntu
Description:	Ubuntu 16.04.2 LTS
Release:	16.04
Codename:	xenial
```

**配置 GRUB 引导参数**

修改 GRUB 的配置文件 /etc/default/grub，在 GRUB_CMDLINE_LINUX 中添加内核引导参数 cgroup_enable=memory swapaccount=1

然后不要忘记了更新 GRUB：

```
$ sudo update-grub
$ sudo reboot
```

**脚本自动安装**

```
$ curl -fsSL get.docker.com -o get-docker.sh
$ sudo sh get-docker.sh --mirror Aliyun
```

**安装完成**

```
root@ubuntu-V001:~# docker version
Client:
 Version:      17.05.0-ce
 API version:  1.29
 Go version:   go1.7.5
 Git commit:   89658be
 Built:        Thu May  4 22:10:54 2017
 OS/Arch:      linux/amd64

Server:
 Version:      17.05.0-ce
 API version:  1.29 (minimum version 1.12)
 Go version:   go1.7.5
 Git commit:   89658be
 Built:        Thu May  4 22:10:54 2017
 OS/Arch:      linux/amd64
 Experimental: false
```

**非 Root 用户**

```
sudo usermod -aG docker $USER
```

**检查运行状态**

```
root@ubuntu-V001:~# systemctl status docker
● docker.service - Docker Application Container Engine
   Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
   Active: active (running) since 一 2017-08-28 13:14:07 CST; 49s ago
     Docs: https://docs.docker.com
 Main PID: 6146 (dockerd)
    Tasks: 16
   Memory: 16.0M
      CPU: 298ms
   CGroup: /system.slice/docker.service
           ├─6146 /usr/bin/dockerd -H fd://
           └─6165 docker-containerd -l unix:///var/run/docker/libcontainerd/docker-containerd.sock --metrics-interval=0 --start-timeout 2m --state-dir /var/run/docker/libcontainerd/containerd --shim docker-containerd-shim --runtime dock

8月 28 13:14:07 ubuntu-V001 dockerd[6146]: time="2017-08-28T13:14:07.512967556+08:00" level=info msg="Graph migration to content-addressability took 0.00 seconds"
8月 28 13:14:07 ubuntu-V001 dockerd[6146]: time="2017-08-28T13:14:07.514213217+08:00" level=warning msg="Your kernel does not support cgroup rt period"
8月 28 13:14:07 ubuntu-V001 dockerd[6146]: time="2017-08-28T13:14:07.514647894+08:00" level=warning msg="Your kernel does not support cgroup rt runtime"
8月 28 13:14:07 ubuntu-V001 dockerd[6146]: time="2017-08-28T13:14:07.515883407+08:00" level=info msg="Loading containers: start."
8月 28 13:14:07 ubuntu-V001 dockerd[6146]: time="2017-08-28T13:14:07.639604026+08:00" level=info msg="Default bridge (docker0) is assigned with an IP address 172.17.0.0/16. Daemon option --bip can be used to set a preferred IP address"
8月 28 13:14:07 ubuntu-V001 dockerd[6146]: time="2017-08-28T13:14:07.671845272+08:00" level=info msg="Loading containers: done."
8月 28 13:14:07 ubuntu-V001 dockerd[6146]: time="2017-08-28T13:14:07.721394288+08:00" level=info msg="Daemon has completed initialization"
8月 28 13:14:07 ubuntu-V001 dockerd[6146]: time="2017-08-28T13:14:07.721718164+08:00" level=info msg="Docker daemon" commit=89658be graphdriver=aufs version=17.05.0-ce
8月 28 13:14:07 ubuntu-V001 systemd[1]: Started Docker Application Container Engine.
8月 28 13:14:07 ubuntu-V001 dockerd[6146]: time="2017-08-28T13:14:07.744495695+08:00" level=info msg="API listen on /var/run/docker.sock"
```


关闭 Docker 服务 systemctl stop docker  
重启 Docker 服务 systemctl restart docker  
开启 Docker 服务 systemctl start docker  
开机启动 Docker systemctl enable docker  

-----------

## Mysql 镜像

**创建目录**

```
root@ubuntu-V001:~/mysql# mkdir -p ~/mysql/data ~/mysql/logs
```

**Mysql 官方镜像**

```
root@ubuntu-V001:~/mysql# docker pull mysql:5.6
```

**运行容器**

```
root@ubuntu-V001:~/mysql# docker run -p 3306:3306 --name mysql -v ~/mysql/logs:/logs -v ~/mysql/data:/mysql_data -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.6

36c87c8f7ac20d4d5876b609be4f28656d1e001db6dbc404d3dabd2af08b130c

root@ubuntu-V001:~/mysql# docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
36c87c8f7ac       mysql:5.6           "docker-entrypoint..."   14 minutes ago      Up 2 seconds        0.0.0.0:3306->3306/tcp   mysql
```

命令说明：  
-p 3306:3306：将容器的3306端口映射到主机的3306端口  
-v ~/mysql/logs:/logs：将主机当前目录下的logs目录挂载到容器的/logs  
-v ~/mysql/data:/mysql_data：将主机当前目录下的data目录挂载到容器的/mysql_data  
-e MYSQL_ROOT_PASSWORD=123456：初始化root用户的密码

**进入容器**

```
root@ubuntu-V001:~/mysql# docker exec -it mysql bash
root@36c87c8f7ac:/# mysql
ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)
root@36c87c8f7ac:/# exit
exit
root@ubuntu-V001:~/mysql#
```

**停止容器**

```
root@ubuntu-V001:~/mysql# docker stop mysql
```

**再次启动**

```
root@ubuntu-V001:~/mysql# docker start mysql
```

**删除容器**

```
docker rm 36c87c8f7ac20d4d5876b609be4f28656d1e001db6dbc404d3dabd2af08b130c
```
