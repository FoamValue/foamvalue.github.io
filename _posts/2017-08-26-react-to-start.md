---
layout: post
title: React 零基础入坑
keywords: React Webpack Bootstrap Scss Jquery
description: 前端框架的一种探索。初次接触 React & Webpack 的背景下，如何写出一个「粗鲁」前端框架。
tags: React Webpack Bootstrap Scss Jquery
author: 陈鑫杰
---

**Webpack** is a module bundler for modern JavaScript applications.

**React** is a javascript library for building user interfaces.

**Bootstrap** is the most popular HTML, CSS, and JS framework in the world for building responsive, mobile-first projects on the web.

**Sass** is the most mature, stable, and powerful professional grade CSS extension language in the world.

**JQuery** is a fast, small, and feature-rich JavaScript library.

## 一个「粗鲁」的案例

[github 地址](https://github.com/OnePieceOrg/Chopper)

![](react-to-start/demo.jpeg)

### 「粗鲁」的由来

习惯使用 Spring MVC + JSP 的开发模式去解决各种系统开发。

从很大的程度上，禁锢了开发思维，也限制了系统的可能性。

于是，必须探索一种更适应现代化的开发框架。

比如：一个适用于 Html5 的 Web 管理系统前端框架。

### 案例架构

```
├── package.json
├── webpack.config.js
├── build               # 工程输出目录
├── node_modules        # npm 模块目录
└── src                 # 组件源文件（JSX）
     ├── scss           # 样式文件目录
     ├── components     # JavaScript 目录
     ├── fonts          # 字体
     └── img            # 图片路径
```

### Webpack

前端资源模块化管理和打包工具。

### React

为数据提供渲染为HTML视图的开源JavaScript 库。

### bootstrap@3.3.7

完全开源的响应式布局、移动设备优先框架。

**栅格系统**

页面根据不同的屏幕，自动分成 12 列。

这是最常用的功能之一，有利于对页面的布局。

### Sass

CSS 扩展语言。

可以像写函数一样，使用 变量 、嵌套等语法，优雅的书写样式文件。

### JQuery

JavaScript 库。

极大地简化了 JavaScript 编程。

## React 语法

**引入资源**

```
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

var createReactClass = require('create-react-class');

import 'bootstrap/dist/css/bootstrap.css';
import './scss/index.scss';

import Header from './components/header.js';

```

**组件**

```
class Header extends React.Component {

  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
    		<div className="navbar_div">
    			<span className="header">Tony Tony Chopper</span>
    		</div>
    	</nav>
    )
  }
};

export default Header;

```

**引用组件**

```
import Header from './components/header.js';

...
render() {
	return (
		<div className="container-fluid">
			<Header />
			...

```

**使用 Js**

```
class Iframe extends React.Component {

  ...

  componentDidMount() { // 组建挂载后调用
    var $iframeId = "#" + this.props.id + "_iframe";
    $($iframeId)[0].height = $('#main-nav').height() - $('#nav').height() - 10;
  }

  render() {
   return (
      ...
   )
 }

};
```

## 构想

使用 Js、Css 实现的，基于 Html5 前端系统框架。

Webpack 代码拆分，浏览器缓存，CDN 网络加速等方式。

或许可以极大限度的提升系统访问速度。

不得否认，系统的复杂度也同样提升了很多。

***只是某种探索下的一种尝试。***