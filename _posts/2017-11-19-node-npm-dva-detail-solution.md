---
layout: post
title: dva 简单使用
keywords: node npm dva ant
description: dva 是一个轻量级的工具，提供了部分代码的自动构建。通过分析代码结构，以及示例代码片段，能够简单的增加一些新的功能。从 dva 去了解 Node 、 Npm 下的前端架构。
tags: 前端
author: 陈鑫杰
---
## dva

初始代码 [dva-example-user-dashboard](https://github.com/dvajs/dva-example-user-dashboard)

```
$ git clone https://github.com/dvajs/dva-example-user-dashboard.git dva-example-user-dashboard-copy
$ cd dva-example-user-dashboard-copy/
$ npm install
$ npm run build:dll
$ npm start
```

**目录结构**

```
├── dist                    # 编译后代码
├── src                     # 源代码
│   ├── assets              # 静态资源
│   ├── components          # 业务通用组件
│   ├── routes              # 业务页面入口和常用模板
│   ├── services            # 后台接口服务
│   ├── models              # dva model
│   ├── utils               # 工具库
│   ├── constants.js        # 常量
│   ├── index.css    
│   ├── index.html   
│   ├── index.js            # 应用入口
│   └──router.js            # 路由入口
├── node_modules
├── package.json
└── README.md
```

------

##.roadhogrc

[roadhog](https://github.com/sorrycc/roadhog) 是一个 cli 工具，提供 server、 build 和 test 三个命令，分别用于本地调试和构建，并且提供了特别易用的 mock 功能。命令行体验和 create-react-app 一致，配置略有不同，比如默认开启 css modules，然后还提供了 JSON 格式的配置方式。

```
{
  "entry": "src/index.js",    # 指定 webpack 入口文件
  "disableCSSModules": false, # 禁用 CSS Modules
  "publicPath": "/",          # 配置生产环境的 publicPath，开发环境下永远为 /
  "theme": {                  # 配置主题，实际上是配 less 的 modifyVars
    "@primary-color": "#1DA57A",
    "@link-color": "#1DA57A",
    "@border-radius-base": "2px",
    "@font-size-base": "16px",
    "@line-height-base": "1.2"
  },
  "autoprefixer": null,     # 配置 autoprefixer 参数
  "proxy": {                # 配置代理
    "/api": {
      "target": "http://jsonplaceholder.typicode.com/",
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "" }
    }
  },
  "extraBabelPlugins": [     # 配置额外的 babel plugin。babel plugin 只能添加，不允许覆盖和删除。
    "transform-runtime",
    ["import", { "libraryName": "antd", "style": true }]
  ],
  "env": {                  # 针对特定的环境进行配置。server 的环境变量是 development，build 的环境变量是 production
    "development": {
      "extraBabelPlugins": [
        "dva-hmr"
      ]
    }
  },
  "dllPlugin": {
    "exclude": [
      "babel-runtime"
    ],
    "include": [
      "dva/router",
      "dva/saga",
      "dva/fetch"
    ]
  }
}
```

------

## Router

**src/index.js**

```
app.router(require('./router.js'));
```

Webpack 入口文件，向 dva 初始化路由信息。

**src/router.js**

```
function registerModel(app, model) {
  if (!cached[model.namespace]) {
    app.model(model);
    cached[model.namespace] = 1;
  }
}

function RouterConfig({ history, app }) {
  const routes = [
    {
      path: '/',
      name: 'IndexPage',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('./routes/IndexPage'));
        });
      },
    },
    {
      path: '/users',
      name: 'UsersPage',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/users'));
          cb(null, require('./routes/Users'));
        });
      },
    },
  ];

  return <Router history={history} routes={routes} />;
}
```

初始化链接并注册模块。

**src/routes/IndexPage.js**

```
function IndexPage({ location }) {
  return (
    <MainLayout location={location}>
      <div className={styles.normal}>
        <h1 className={styles.title}>Yay! Welcome to dva!</h1>
        <div className={styles.welcome} />
        <ul className={styles.list}>
          <li>To get started, edit <code>src/index.js</code> and save to reload.</li>
          <li><a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">Getting Started</a></li>
        </ul>
      </div>
    </MainLayout>
  );
}
```
Index 页面 Html 代码。

**命令生成 Router**

```
$ dva g route posts
/usr/local/lib/node_modules/dva-cli/bin/dva-generate
      create  routeComponent src/routes/Posts.js, src/routes/Posts.css
      create  route posts with src/routes/Posts.js
```

* 按照 `src/routes/Users.*` 修改 `src/routes/Posts.*`。
* 在 `router.js` 中，按照 `path: '/users',` 新增 `path: '/posts',` 对象。

***此处，还缺少对应的 `src/models/posts.js` 文件。***

------

## Model

**命令生成 Model**

```
dva g model posts
/usr/local/lib/node_modules/dva-cli/bin/dva-generate
      create  model posts
    register  to entry src/index.js
```

* 移除 `app.model(require("./models/posts"));`
* 按照 `src/models/users.js` 补充 `src/models/posts.js`

***此处，还缺少对应的 `src/services/posts.js` 文件。***

------

## Service

* 新建 `src/services/posts.js` 文件
* 按照 `src/services/users.js` 进行补充

------

## Component

**命令生成 component**

```
$ dva g component Posts/Posts
/usr/local/lib/node_modules/dva-cli/bin/dva-generate
      create  component src/components/Posts/Posts.js, src/components/Posts/Posts.css
```

* 新建 `src/components/Posts/PostModal.js`
* 按照 `src/components/Users/User*` 补充 `src/components/Posts/Posts*`
* 在 `src/components/MainLayout/Header.js` 添加 `<Menu.Item key="/posts">` 对象。

------

## 其他概念

[css-modules](https://github.com/css-modules/css-modules)
