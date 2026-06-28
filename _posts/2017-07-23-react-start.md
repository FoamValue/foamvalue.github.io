---
layout: post
title: 初识 React
keywords: React Webpack
description: Facebook 开源的 JavaScript library。
tags: React Webpack
author: 陈鑫杰
---

React 不是一个 Javascript MVC 框架，而是一个用于构建组建化 UI 的 JavaScript library，是一个前端界面开发工具。

**npm**

通过搜索，发现互联网上很多的教程、案例都喜欢使用 npm 去管理 Javascript。

```
npm install webpack -g
npm install webpack-dev-server -g
npm install react react-dom --save
npm install jquery --save
npm install babel-core babel-loader babel-preset-es2015 babel-preset-react --save-dev
```

*有种 Maven 管理包的即视感。*

**webpack**

Webpack 是当下最热门的前端资源模块化管理和打包工具。它可以将许多松散的模块按照依赖和规则打包成符合生产环境部署的前端资源。还可以将按需加载的模块进行代码分隔，等到实际需要的时候再异步加载。

```
$ webpack
Hash: 8541542f5f1f0dddcbcc
Version: webpack 3.3.0
Time: 2765ms
    Asset     Size  Chunks                    Chunk Names
bundle.js  1.56 MB       0  [emitted]  [big]  main
  [85] (webpack)/buildin/module.js 517 bytes {0} [built]
 [201] ./src/chopperReact.js 526 bytes {0} [built]
 [304] ./src/NewsList.js 3.15 kB {0} [built]
 [305] ./src/css/NewsList.css 1.02 kB {0} [built]
 [306] ./node_modules/css-loader!./src/css/NewsList.css 266 bytes {0} [built]
 [308] ./src/NewsHeader.js 4.44 kB {0} [built]
 [309] ./src/img/y18.gif 177 bytes {0} [built]
 [310] ./src/css/NewsHeader.css 1.03 kB {0} [built]
 [312] ./src/css/chopper.css 1.02 kB {0} [built]
 [313] ./node_modules/css-loader!./src/css/chopper.css 214 bytes {0} [built]
 [314] ./src/NewsItem.js 5.31 kB {0} [built]
 [315] ./src/css/NewsItem.css 1.02 kB {0} [built]
 [316] ./node_modules/css-loader!./src/css/NewsItem.css 875 bytes {0} [built]
 [324] ./src/img/grayarrow.gif 189 bytes {0} [built]
 [325] ./node_modules/moment/locale ^\.\/.*$ 2.79 kB {0} [optional] [built]
    + 311 hidden modules
```

npm、webpack，本身都具有很多的技术特性待发掘。本文主要起到一个入门的作用。

**分析例子**

[amazeui](http://amazeui.org/react)， [源码](https://github.com/amazeui/amazeui-react)。

1.目录结构

```
	├── package.json
	├── dist          # UMD 包构建目录
	├── docs          # 文档源文件
	├── examples      # 示例源文件
	├── lib           # npm 包构建目录
	├── www           # 文档构建目录
	└── src           # 组件源文件（JSX）
```

**当然**， amazeui 本身是一个 js 工具类。

当你想写 Javascript 工具的时候，可以参考 src 中的源码，最后产生的是 dist 中的 .js 跟 .min.js	。

当你想写 Html 的前端演示页面时，可以参考 examples 中的源码，index.html 是可以正常打开的。

2.通过简单的浏览，可以发现有非常多的 Javascript 文件，并且在 Javascript 文件中即存在 Html 标签，也存在 Javascript 语法。

**存在**一个新的概念或者思想。按根深蒂固的开发思想来说，Html 就是表现， Javascript 就是逻辑，要求表现与逻辑分开写。

但是，这里引入了 JSX。就是 Html 与 Javascript 嵌入的写。

从浏览器加载来看，JSX 似乎更有助于快速加载画面。

```
import $ from 'jquery';
import React from 'react';
import { render } from 'react-dom';

class HelloWorld extends React.Component {
  render() {
    return (
        <div>Hello World</div>
        );
  }
}

render(<HelloWorld />, $('#content')[0]);

```

3.package.json 可以发现引入了一大堆的依赖（Javascript 第三方工具）。

4.webpack.build.js 可以看到一些打包的配置。

以上 4 点是比较特殊的，或者有意思的地方。

**开始动手**

初略了解之后，寻找到一个较为合适的开发教程 [React HN](https://github.com/theJian/build-a-hn-front-page)。

**结论**

综上所述，基本可以实现前端分离。

并且，可以借助新框架带来的页面加载优化、图片懒加载等技术，提升用户满意度。

最关键，react、webpack 能跟上现在主流前端技术，并且坑很大。

hehe ...