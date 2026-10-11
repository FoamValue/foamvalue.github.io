---
name: "framework-release-article"
description: "根据框架发布说明（Spring Boot、Spring Cloud、Spring AI 等）生成结构化科普文章。当用户提供了框架发布链接、Changelog、GitHub Release 内容，或要求写框架版本更新文章时调用。"
---

# 框架发布说明文章写作

将任意框架的发布说明转化为结构清晰、通俗易懂的科普文章。

## 触发条件

- 用户提供了一个框架的发布说明链接（微信公众号、GitHub Release、官方博客）
- 用户粘贴了 Changelog / Release Notes 内容，要求写成文章
- 用户说"写一篇 Spring Boot X.X.X 的发布文章"之类的话
- 用户要求把某个框架的版本更新整理成博客文章

## 写作流程

### 第一步：信息采集

1. 如果用户提供了 URL，用 WebFetch 抓取完整内容
2. 如果内容被截断，读取保存的完整文件
3. 提取以下维度的信息：
   - 框架名称 + 版本号
   - 安全修复（CVE 编号、影响描述）
   - 不兼容变更 / 升级注意事项（含 issue/PR 编号）
   - 新特性
   - 优化项 / 行为变更（含代码示例）
   - 依赖变更

4. 如果用户提供的信息不完整，用 WebSearch 搜索补充：
   - 搜索 `"<框架名> <版本号> release notes"`
   - 搜索 `"<框架名> <版本号> changelog"`
   - 查看官方 GitHub Release 页面

### 第二步：文章结构

严格按以下章节顺序组织，**不要增减一级章节**：

```
---
frontmatter（layout: post, title, tags, categories, description, cover_image）
---

## 开头导语（2-3 句话）

说明版本号、获取方式、本次更新的规模（涉及多少 issue/PR）。

## 01 安全问题修复

如果有 CVE，列成表格；如果没有安全问题，整节约用一句话说明"本次无安全修复"。

## 02 升级须知

列出所有不兼容变更，每项包含：
- 变更摘要 + issue/PR 编号
- 具体改了什么
- 开发者需要做什么

## 03 新特性

按功能模块分小节，每个特性包含：
- 功能名称（加粗）
- 解决了什么问题
- 怎么用（代码示例或配置项）

## 04 优化

逐项列出行为变更，每项包含：
- 变更标题
- 旧行为 vs 新行为对比
- 如果有恢复旧行为的方式，给出配置/代码
- 代码示例（如有）

## 快速升级清单

用 `- [ ]` 格式列出所有需要检查/修改的项。
```

### 第三步：写作风格

- **语言**：中文，面向 Java 开发者
- **语气**：科普为主，清晰易懂，不堆砌术语
- **代码**：Java 为主，配置用 properties/yaml，标注语言类型
- **表格**：对比类信息用表格（旧值→新值、旧行为→新行为）
- **issue 编号**：以 `(#编号)` 格式附在变更标题后
- **恢复旧行为**：如果某项变更可以恢复旧行为，必须给出配置方式
- **不加废话**：不写"这次更新非常棒"、"让我们来看看"等过渡句

### 第四步：Frontmatter 规范

```yaml
---
layout: post
title: "<框架名> <版本号> 发布——<一句话亮点>
tags:
  - <框架名>
  - <技术领域>
categories: <技术领域>
description: <一句话描述文章内容，包含框架名和版本号>
cover_image: /assets/images/posts/<框架目录>/<图片名>.jpg
---
```

### 第五步：封面图生成

用 GenerateImage 工具生成封面图：
- 保存路径：`/assets/images/posts/<框架目录>/<框架>-<版本>-cover.jpg`
- 图片大小：`landscape_16_9`
- 风格：抽象 3D 渲染，科技感，与框架主题相关
- **不包含文字和水印**

Prompt 模板：
```
Blog post featured image: <框架名> <版本号> release concept. <具体视觉描述>。Clean modern design with <色调> gradient tones, soft lighting, no text, no watermarks. Professional 3D render style, premium quality.
```

### 第六步：输出

- 文章保存到 `_drafts/` 目录，文件名格式：`<框架名>-<版本号>-release.md`
- 封面图保存到 `assets/images/posts/<框架目录>/`
- 向用户展示文件链接

## 参考范例

以下是一篇合格的文章结构示例（基于 Spring AI 2.0.1）：

```markdown
---
layout: post
title: Spring AI 2.0.1 发布——80+ issue 的维护版本
tags:
  - Spring AI
  - Java
categories: Java 生态
description: Spring AI 2.0.1 已发布，涵盖 7 个 CVE 修复、6 项升级须知、5 项新特性和 8 项优化变更。
cover_image: /assets/images/posts/spring-ai/spring-ai-2.0.1-cover.jpg
---

**Spring AI 2.0.1** 已经发布，现已可以从 Maven Central 获取！2.0.1 是 2.0.0 GA 基础上的第一个维护版本，涉及超过 80 个 issue 与 PR。

## 01 安全问题修复

| CVE 编号 | 影响 | 修复说明 |
|----------|------|---------|
| CVE-2026-47851 | PDF 文档读取器无限递归 | 限制递归深度 |
| ... | ... | ... |

## 02 升级须知

绝大多数应用只需把版本号提升到 2.0.1 即可完成迁移，但以下改动需要注意：

### Mistral AI 聊天模型下线 (#6772)
已弃用的 Mistral AI 聊天模型被正式下线。如果代码中以常量方式引用，需切换到受支持的模型名称。

...

## 03 新特性

**工具调用次数限制**
`ToolCallingAdvisor` 支持为每次请求配置工具调用次数上限，达到上限抛出 `ToolCallLimitExceededException`。

...

## 04 优化

### Redis 聊天记忆模块重命名

| 项目 | 旧值 | 新值 |
|------|------|------|
| Artifact | `spring-ai-autoconfigure-model-chat-memory-redis` | `spring-ai-autoconfigure-model-chat-memory-repository-redis` |

### 工具调用次数上限

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `DEFAULT_MAX_CALLS_PER_TOOL` | 40 | 每个工具的调用上限 |

调整方式：
\```java
ToolCallingManager.builder()
    .maxCallsPerTool(...)
    .unlimitedCallsPerTool()
\```

### 工具解析回退机制默认关闭

恢复旧行为：
\```properties
spring.ai.tools.resolution.fallback.enabled=true
\```

## 快速升级清单

- [ ] 将 `pom.xml` 中版本改为 `2.0.1`
- [ ] 检查是否使用了 Mistral AI 聊天模型常量
- [ ] 检查 Redis 聊天记忆模块的 artifact id 和配置前缀
...
```

## 注意事项

- 如果某个章节没有内容（如无安全修复），用一句话说明即可，不要省略章节
- issue/PR 编号必须标注，方便开发者追溯
- 所有"恢复旧行为"的配置/代码必须给出，这是文章最有价值的部分
- 快速升级清单要覆盖所有 Breaking Change，不能遗漏
- 如果用户提供了微信公众号链接，注意去除文末的公众号推广内容
