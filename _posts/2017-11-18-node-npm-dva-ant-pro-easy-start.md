---
layout: post
title: 前端架构简单入门
keywords: node npm dva ant
description: 前端互联网架构化，以前虽然也使用比较热门的前端框架，但还是第一次使用这么彻底的架构方式。全面引入了 Node、Npm 的概念，更加彻底的解耦了前后端代码。从此前端更加注重前端，后端更多的提供 API 供前端使用。这是架构的更新换代，也是一次技术壁垒的考验。是回退，还是打破。
tags: 前端
author: 陈鑫杰
---

## NODE 安装

官方下载地址： https://nodejs.org/zh-cn/download/

**各系统对应下载**

Windows Installer (.msi)  
macOS Installer (.pkg)  
Linux Binaries (x86/x64)  

安装完成后，执行 `$ node -v` 跟 `$ npm -v` 查看版本信息。

**NPM 换源**

1.临时使用

```
$ npm --registry https://registry.npm.taobao.org install express
```

2.持久使用

```
$ npm config set registry https://registry.npm.taobao.org
// 配置后可通过下面方式来验证是否成功
$ npm config get registry
```

**升级**

```
$ npm install npm -g
$ npm install node
$ sudo brew update # Mac
$ sudo brew install node
```

------

## DVA 概念

基于 redux、redux-saga 和 react-router 的轻量级前端框架。

**前端请求流程**

* UI 组件交互操作；
* 调用 model 的 effect；
* 调用统一管理的 service 请求函数；
* 使用封装的 request.js 发送请求；
* 获取服务端返回；
* 然后调用 reducer 改变 state；
* 更新 model。

**代码流程**

* roadhogrc
* router
* components
* mainLayout
* models
* serivces
* utils/request

**浏览器插件**

Chrome —— Redux DevTools

**实际操练**：[12 步 30 分钟，完成用户管理的 CURD 应用 (react+dva+antd)](https://github.com/sorrycc/blog/issues/18)

**完整代码**：[dva-example-user-dashboard 代码](https://github.com/dvajs/dva-example-user-dashboard)


**文档支持**

[React Router 中文文档](https://react-guide.github.io/react-router-cn/)

[React Router 使用教程](http://www.ruanyifeng.com/blog/2016/05/react_router.html)

[roadhog](https://github.com/sorrycc/roadhog)

------

## ANT DESIGN PRO

官方地址：https://pro.ant.design/index-cn
代码地址：https://github.com/ant-design/ant-design-pro
说明地址：https://pro.ant.design/docs/getting-started-cn

**用法**

```
$ git clone https://github.com/ant-design/ant-design-pro.git --depth=1
$ cd ant-design-pro
$ npm install
$ npm start         # visit http://localhost:8000
```

**目录结构**

```
├── mock                     # 本地模拟数据
├── public
│   ├── favicon.ico          # Favicon
│   └── index.html           # HTML 入口模板
├── src
│   ├── common               # 应用公用配置，如导航信息
│   ├── components           # 业务通用组件
│   ├── e2e                  # 集成测试用例
│   ├── layouts              # 通用布局
│   ├── models               # dva model
│   ├── routes               # 业务页面入口和常用模板
│   ├── services             # 后台接口服务
│   ├── utils                # 工具库
│   ├── g2.js                # 可视化图形配置
│   ├── polyfill.js          # 兼容性垫片
│   ├── theme.js             # 主题配置
│   ├── index.js             # 应用入口
│   ├── index.less           # 全局样式
│   └── router.js            # 路由入口
├── tests                    # 测试工具
├── README.md
└── package.json
```
