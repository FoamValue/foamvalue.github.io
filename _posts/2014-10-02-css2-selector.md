---
layout: post
title: CSS2 学习 - 选择器篇
author: 陈鑫杰
---

## 前言
感谢 css，再次感谢 css，还是要感谢 css。  
笔者尚且年少，未曾经历过 css 之前的年代。但从学校经历来看，如果没有 css，网页丑的都无法见人；如果没有 css 改动 html 页面的一个标题很轻松，改动 10个、100个标题，就要抽搐了。  
css 给页面带来了生机，让用户可以看到更加绚丽的、生动的页面。  
css 给程序员带来了...更多泡妹子的时间。  
以下简单记录一些关键的内容，更多内容请关注《CSS 权威指南》。（浅显易懂，如果想系统性的学习，可以考虑入手。）

## 基本规则
css 的规则结构：选择器（p) + 声明块（{) + 声明（属性（color） + （：） + 值（red） + （；））... + 声明块（}）  
即：p {color:red;}

## 分组
选择器分组：h1, h2 {color:red;}  
将 h1 {color:red;} 和 h2 {color:red;} 两个选择器（h1 和 h）分组到一起。  
通配选择器：* {color:red;}  
声明分组：h1 {color:red;font:18px;}  
将 h1 的两个声明（color:red; 和 font:18px;）分组到一起。  
实际运用是将两种分组搭配使用。

## 类选择器和 ID 选择器
类选择器：.info {color:red;}  
对应 html 中带有 class="info" 的元素。  
ID 选择器：#info {color:red;}  
对应 html 中带有 id="info" 的元素。  
**由于 html 对 ID 的唯一性要求不高，eclipse 下也就是提示警告。所以请谨慎使用。**

## 属性选择器
属性选择器：h1 [class] {color:red;}  
html中带有 class 属性的 h1 元素。  
模糊：h1 [class~="info"] {color:red;}  
开头：h1 [class^="info"] {color:red;}  
结尾：h1 [class$="info"] {color:red;}  
包含子串：h1 [class*="info"] {color:red;}  
以上是根据部分属性值选择，还有一种是根据特定属性选择。  
h1 [lang|="en"] {color:red;}  
选择lang 属性等于 en 或 en 开头的所有元素。

## 文档结构
html 就是一棵树，一棵根节点是 html 的树。  
后代选择器：h1 em {color:red;}  
选择作为 h1 后代的 em 元素。  
子元素选择器：h1 > em {color:red;}  
选择作为 h1 元素子元素的第一个 em 元素。  
相邻兄弟选择器：h1 + p {color:red;}  
选择紧接着在一个 h1 元素后出现的所有 em，h1 要和 em 元素有共同的父元素。

## 伪类和伪元素
链接伪类：:link :visited  
动态伪类：:hover :active :first-child  
伪元素：:first-letter :first-line :before :after
