---
layout: post
title: 如何在 CentOS 下快速搭建 Nginx 服务器
description: 只是一篇简单的 Nginx 服务器搭建教程，本意是为以后再次更换时提供便利。
---

## 查看服务器版本

```shell
# cat /etc/redhat-release

CentOS Linux release 8.1.1911 (Core)
```

## 安装步骤

1. 更新 yum

```shell
# yum update
Failed to set locale, defaulting to C.UTF-8
CentOS-8 - AppStream                                                                                                                                              4.1 kB/s | 4.3 kB     00:01
CentOS-8 - Base                                                                                                                                                   5.1 kB/s | 3.8 kB     00:00
CentOS-8 - Extras                                                                                                                                                 4.1 kB/s | 3.0 kB     00:00
Dependencies resolved.
Nothing to do.
Complete!
```

2. 安装 Nginx

```shell
sudo yum install nginx
```

3. 配置 Nginx

设置开机启动

```	shell
# sudo systemctl enable nginx
```

启动服务

```shell
# sudo systemctl start nginx
```

停止服务

```shell
# sudo systemctl restart nginx
```

重新加载

```shell
# sudo systemctl reload nginx
```

## 防火墙配置

```shell
# sudo firewall-cmd --zone=public --permanent --add-service=http
success
```

开通某个端口，重新加载配置后生效。持久

```	shell
# sudo firewall-cmd --add-port=80/tcp --permanent
success
# sudo firewall-cmd --add-port=443/tcp --permanent
success
```

重启服务器，并查看防火墙状态。

```	shell
# sudo firewall-cmd --list-service
dhcpv6-client http ssh
```

查询放开端口

```shell
# sudo firewall-cmd --list-ports
80/tcp
```

## Nginx 常见错误

查看错误信息

```SHELL
# cat /var/log/nginx/error.log
```

1. 修改 nginx.conf 启动用户

```shell
# ps aux | grep "nginx: worker process" | awk '{print $1}'
nobody
root

# vim conf/nginx.conf

user root;
worker_processes auto;
error_log /var/log/nginx/error.log;
...
```

2. 修改 html 文件权限

查看原 html 目录文件权限

```shell
# ls -lrtZ /usr/share/nginx/html
total 24
-rw-r--r--. 1 root root system_u:object_r:httpd_sys_content_t:s0  368 Oct  7 21:16 nginx-logo.png
-rw-r--r--. 1 root root system_u:object_r:httpd_sys_content_t:s0 4057 Oct  7 21:16 index.html
-rw-r--r--. 1 root root system_u:object_r:httpd_sys_content_t:s0 4020 Oct  7 21:16 50x.html
-rw-r--r--. 1 root root system_u:object_r:httpd_sys_content_t:s0 3971 Oct  7 21:16 404.html
-rw-r--r--. 1 root root system_u:object_r:httpd_sys_content_t:s0 4148 Oct  7 21:16 poweredby.png
```

修改自定义目录

```shell
chcon -R -u system_u /xxx/
chcon -R -t httpd_sys_content_t /xxx/
```

## 安全配置

1. 隐藏目录

```shell
http {
	autoindex off;
}
```

2. 隐藏显示版本号

```shell
http {
	server_tokens off;
}
```

3. 限制访问请求参数

```SHELL
http {
  # 设置客户端请求头读取超时时间
  client_header_timeout 15;
  # 设置客户端请求主体读取超时时间
  client_body_timeout 15;   
  # 上传文件大小限制
  client_max_body_size 10m;
  # 指定响应客户端的超时时间
  send_timeout    60;
  # 设置客户端连接保持会话的超时时间
  keepalive_timeout 60;
}
```

4. 访问限制的，allow就是允许访问的ip和ip段，deny就是禁止访问的ip和ip段

```shell
# 设置网站根目录的访问权限
location / {
    allow 192.168.1.1/24;
    deny 192.168.1.2/24;
    deny all;
}
```

5. 限制访问个别目录或文件后缀名

```shell
# 在访问 uploads、p_w_picpaths 目录指定后缀的文件
location ~ ^/(uploads|p_w_picpaths)/.*\.(php|php5|jsp)$ {
    return 403;
}
# 禁止访问所有目录指定后缀的文件
location ~.*\.(sql|log|txt|jar|war|sh|py) {
    deny all;
}
```
