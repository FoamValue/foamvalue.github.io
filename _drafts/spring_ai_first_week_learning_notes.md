---
layout: post
title: Spring AI 第一周学习笔记
tags: Spring AI
categories:
description: 
---

## 周一：项目结构与构建入门

**重点模块**：项目根目录、`spring-ai-bom`、`spring-ai-commons`

- [x] Clone 仓库并切换到 `1.1.x` 分支
- [x] 阅读 `README.md`，了解项目整体定位和模块划分
- [ ] 查看根 `pom.xml`，理解多模块聚合结构与 Maven 依赖管理
- [ ] 阅读 `spring-ai-bom/pom.xml`，理解 BOM 如何统一管理 16 个模型模块 + 21 个向量库模块的版本号
- [ ] 用 IDE 导入项目，确保能成功编译（`mvn compile -pl spring-ai-model`）
- [ ] 浏览 `spring-ai-commons` 模块，了解共享的 JSON 工具类和辅助工具

**关键文件**：
- `pom.xml`（根）
- `spring-ai-bom/pom.xml`
- `spring-ai-commons/src/main/java/org/springframework/ai/util/json/`
