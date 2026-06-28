# DevBlog - Jekyll 技术博客

一个基于 Jekyll 构建的现代化个人技术博客，专注于程序员技术分享。

## 特性

- **浅色主题设计** - 清爽优雅的浅色配色方案，支持深色模式自动切换
- **代码高亮** - 使用 Rouge 语法高亮，支持多种编程语言，行号显示，代码复制功能
- **图片优化** - 懒加载、响应式图片、灯箱查看
- **响应式布局** - 完美适配桌面端、平板和移动设备
- **SEO 友好** - 集成 jekyll-seo-tag，自动生成 sitemap
- **快速导航** - 粘性导航栏、文章分类、标签云
- **搜索功能** - 全站文章搜索面板

## 技术栈

- [Jekyll](https://jekyllrb.com/) 4.3+
- SCSS/CSS 变量
- Vanilla JavaScript
- [Rouge](https://rouge.jneen.net/) 代码高亮
- Inter / JetBrains Mono / Noto Sans SC 字体

## 目录结构

```
.
├── _config.yml          # Jekyll 配置
├── _layouts/            # 页面布局模板
│   ├── default.html     # 默认布局
│   ├── post.html        # 文章布局
│   └── page.html        # 页面布局
├── _includes/           # 可复用组件
│   ├── header.html      # 头部导航
│   └── footer.html      # 页脚
├── _sass/               # SCSS 样式文件
│   ├── _base.scss       # 基础样式和 CSS 变量
│   ├── _layout.scss     # 布局样式
│   ├── _components.scss # 组件样式
│   └── _code.scss       # 代码高亮和图片样式
├── _posts/              # 博客文章
├── _plugins/            # Jekyll 插件
├── assets/              # 静态资源
│   ├── css/
│   ├── js/
│   └── images/
├── index.html           # 首页
├── about.md             # 关于页面
├── posts.html           # 文章归档
├── categories.html      # 分类页面
├── tags.html            # 标签页面
└── Gemfile              # Ruby 依赖
```

## 快速开始

### 安装依赖

```bash
bundle install
```

### 本地开发

```bash
bundle exec jekyll serve
```

访问 http://localhost:4000 预览博客。

### 构建

```bash
bundle exec jekyll build
```

构建后的文件在 `_site` 目录中。

## 写作指南

### 创建新文章

```bash
# 使用 Jekyll 命令
bundle exec jekyll post "文章标题"
```

或在 `_posts` 目录创建文件：

```markdown
---
layout: post
title: "文章标题"
subtitle: "副标题"
date: 2026-06-28 10:00:00 +0800
categories: [前端开发]
tags: [javascript, react]
cover_image: "/assets/images/cover.jpg"
---

文章内容...
```

### 代码块

使用 Markdown 代码块，支持语法高亮：

````markdown
```javascript
const greeting = 'Hello World';
console.log(greeting);
```
````

### 图片

```markdown
![图片描述](/assets/images/example.jpg)
```

图片会自动应用懒加载和灯箱效果。

## 自定义配置

修改 `_config.yml` 文件：

```yaml
title: "你的博客名称"
description: "博客描述"
author:
  name: "作者名"
  email: "邮箱"
  bio: "个人简介"
```

## 部署

本博客兼容各种静态托管服务：

- [GitHub Pages](https://pages.github.com/)
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

## 许可证

MIT License
