---
layout: post
title: 网站性能优化套路
keywords: 性能
description: 随着前端框架的不断兴起，有种前端性能优化话题会被终结的感觉。毕竟，现代的前端框架们。。。为此，本文主要梳理以 Html + JavaScript + CSS 模式下的前端性能优化。（内有图）
tags: 性能
author: 陈鑫杰
---

**简述**

前端网站是基于 Jekyll 纯文本转换成的静态 Html 文件。
前端页面是基于 Bootstrap 实现全平台使用。

**服务器架构**

通常推荐以 GitHub 为主的免费架构模式。
当然有条件的就是自备服务器来使用。
例如： docker + nginx

**如何检测**

1. [PageSpeed](https://developers.google.com/speed/pagespeed/insights/)
2. [gtmetrix](https://gtmetrix.com/)

当然国内也有很多类似的站点，本文以 PageSpeed 为例进行说明。

***PS. 本文不会涉及前端基础知识，如有不适，赶紧右上x。***

-------

## 网站现状

移动端：
![](/assets/images/posts/page-optimization/pagespeed-desktop.png)

电脑端：
![](/assets/images/posts/page-optimization/pagespeed-mobile.png)

从上图来看，本人还是相当走心了。
基本来讲，网站几乎不需要去优化了，毕竟评分已经很合格，甚至都是良好了。（虽然一直以来都是这样的借口。。。）

上图提示说：
“PSI估计这个页面需要2次额外的往返加载渲染阻塞资源，0.4 MB才能完全渲染。 中位数页面需要4次往返和3.4 MB。 更少的往返和字节导致更快的页面。”

以及给出了相应的优化建议：
“您的页面有4个阻止CSS资源。 这会导致渲染页面延迟。
如果不等待加载以下资源，则无法呈现页面上的上述内容。 尝试推迟或异步加载阻止资源，或直接在HTML中内联这些资源的关键部分。”
“利用浏览器缓存
在静态资源的HTTP标题中设置失效日期或最大使用期限指示浏览器从本地磁盘加载之前下载的资源，而不是通过网络加载。”
“启用压缩
使用gzip或deflate压缩资源可以减少通过网络发送的字节数。”

当然，也有已经优化的内容：
1. 避免登录页面重定向
2. 缩小CSS
3. 缩小HTML
4. 缩小JavaScript
5. 优先考虑可见内容
6. 减少服务器响应时间

-------

## 如何优化

当拿到了优化建议，那就要好好的分析一下如何优化。
首先，使用的是 Nginx，所以关于压缩跟缓存是需要优化配置的。
其次，关于图像的优化，虽然在电脑端没有显示需要优化。可以看出其实移动端对于kb是相当敏感的。（这里不得不吐槽下，国内推广 4G 后，各流氓应用、网页的无耻消耗流量的手段越来越高明了。）
最后，是如何消除渲染阻塞的JavaScript和CSS。这需要重构前端代码，也是最最痛苦的一件事情了。

### Nginx 启用压缩

直接配置 nginx.conf 文件，在对应的位置进行替换。

```
# 开启gzip
gzip on;
# 启用gzip压缩的最小文件，小于设置值的文件将不会压缩
gzip_min_length 1k;
# gzip 压缩级别，1-10，数字越大压缩的越好，也越占用CPU时间，后面会有详细说明
gzip_comp_level 2;
# 进行压缩的文件类型。javascript有多种形式。其中的值可以在 mime.types 文件中找到。
gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
# 是否在http header中添加Vary: Accept-Encoding，建议开启
gzip_vary on;
# 禁用IE 6 gzip
gzip_disable "MSIE [1-6]\.";

```

![](/assets/images/posts/page-optimization/use-gzip.png)

开启后，可以看出 gzip 启用后，例如 bootstrap.min.css 文件被压缩到 24KB，浏览器再解压到 147 KB。

### 优化图像

如果使用到自定义图标的话，还是要合并到一张图片上，本站基本使用 bootstrap 自带图标。
有部分固定大小的图标，例如 友链头像。

1. 下载头像到本地，使用 Gzip 压缩
2. 使用系统视图软件，修改图片成 30x30 像素
3. 使用工具进行压缩

这里推荐：
[tinypng](https://tinypng.com/  ) [imagemagick](https://www.imagemagick.org/script/convert.php) 搭配使用。

$ magick convert -size 30x30 szhshp.png szhshp.png

### Nginx 启用浏览器缓存

直接配置 nginx.conf 文件，在对应的位置进行替换。

```
server {
  ...
  root         /www;
  location ~ .*\.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|woff2|eot|svg|ttf|woff|otf)$
  {
      expires      7d;
  }
  location ~ .*\.(?:js|css)$
  {
      expires      7d;
  }
  location ~ .*\.(?:htm|html)$
  {
      add_header Cache-Control "private, no-store, no-cache, must-revalidate, proxy-revalidate";
  }
  ...
```

![](/assets/images/posts/page-optimization/use-cache.png)

-------

## 遗留问题

1. 第三方统计代码，无法 Gzip 压缩或者设置浏览器缓存
2. 消除渲染阻塞的JavaScript和CSS

### 图片压缩

手动式操作工具压缩，只能稍微解决一下这样的问题。
关键点，还是在前端自适应方面。例如：手机屏幕并不需要像电脑屏幕显示的那么“清晰”。

### 一点感想

第三方统计代码，目测是无法去改动的。
关于“消除渲染阻塞的JavaScript和CSS”，考虑到重构的复杂性，最后还是果断放弃了。推荐使用 React 这类前端框架，可以很好的规避这样的问题。
一个能自适应屏幕尺寸的图片系统是有必要的。

### 一点期望

React + Markdown 是否可以实现生成静态网页文件呢？

------
## 附录

**Jekyll 安装**

1. GNU/Linux, Unix, or macOS
2. [Ruby](https://www.ruby-lang.org/en/downloads/)
  $ apt-get install ruby-full
3. [RubyGems](https://rubygems.org/pages/download)
  $ gem update --system
  $ gem install rubygems-update
  $ update_rubygems
4. [GCC](https://gcc.gnu.org/install/) and [Make](https://www.gnu.org/software/make/)
5. Jekyll 使用插件
  $ gem install #插件名称
  $ apt install ruby-bundler
  $ bundle install


**Docker + Nginx**

1. 安装
  apt-get install docker
  apt-get install docker-compose
2. 搜索Nginx
  docker search nginx
  docker pull nginx
3. 创建路径
  nginx/logs nginx/www nginx/conf
4. nginx.conf
5. Docker 运行
  $ docker run -p 80:80 --name mynginx -v $PWD/www:/www -v   $PWD/conf/nginx.conf:/etc/nginx/nginx.conf -v   $PWD/logs:/wwwlogs  -d nginx
