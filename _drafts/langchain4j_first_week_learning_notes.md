---
layout: post
title: langchain4j 第一周学习笔记
tags: langchain4j
categories:
description: 
---

## 周一：项目结构与构建入门

**重点模块**：项目根目录、`langchain4j-bom`、`langchain4j-parent`

- [ ] Clone 仓库并浏览目录结构
- [ ] 阅读 `README.md`，了解项目定位（强调：不是 Python LangChain 的 Java 移植）
- [ ] 查看根 `pom.xml`（`langchain4j-aggregator`），理解多模块聚合结构
- [ ] 阅读 `langchain4j-bom/pom.xml`，理解 BOM 如何统一管理 100+ 模块的版本号
- [ ] 阅读 `langchain4j-parent/pom.xml`，理解 JDK 17 基线、依赖版本管理、代码风格插件（Spotless）
- [ ] 用 IDE 导入项目，确保能成功编译（`mvn compile -pl langchain4j-core`）
- [ ] 统计项目中的模块总数，感受项目的规模

**关键文件**：
- `pom.xml`（根，artifactId 为 `langchain4j-aggregator`）
- `langchain4j-bom/pom.xml`
- `langchain4j-parent/pom.xml`
