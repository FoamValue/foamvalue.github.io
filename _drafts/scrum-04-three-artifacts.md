---
layout: post
title: Scrum 的三个工件——信息透明的基础
tags:
  - Scrum
  - Backlog
  - 工件
categories: Scrum 敏捷开发
description: Product Backlog、Sprint Backlog、Increment——三个工件让团队信息完全透明。
cover_image: /assets/images/posts/scrum/scrum-04-cover.jpg
---

Scrum 的三个工件（Artifacts）是团队的信息枢纽。**工件的质量决定了团队决策的质量。**

## Product Backlog（产品待办列表）

Product Backlog 是一个**按优先级排序的需求列表**，它是活的、不断变化的。

**特点：**
- 唯一来源：所有要做的功能都在这里
- 动态变化：PO 根据市场反馈随时调整优先级
- 持续细化：高优先级的故事更详细，低优先级的故事只有一句话

**DEEP 原则：**
- **D**etailed appropriately（详略得当）
- **E**stimated（有估算）
- **E**mergent（不断涌现）
- **P**rioritized（按优先级排序）

## Sprint Backlog（迭代待办列表）

Sprint Planning 时，团队从 Product Backlog 顶部选出本次 Sprint 要完成的故事，放入 Sprint Backlog。

**关键点：**
- 团队自己认领任务，不是 PO 分配
- Sprint Backlog 在 Sprint 期间是"活的"——团队发现新任务可以加进去
- 但 Sprint Goal 不能变

**Sprint Backlog 除了故事列表，还包含：**
- Sprint Goal（一句话目标）
- 实现方案（粗略的设计思路）
- 任务拆分（把故事拆成具体任务）

## Increment（增量）

每个 Sprint 结束时，团队必须产出**一个"完成"的增量**——"完成"意味着符合 Definition of Done。

**Definition of Done（DoD）：**
- 代码已编写并提交
- 已通过 Code Review
- 已通过自动化测试
- 已部署到测试环境
- 已通过验收测试

**DoD 是团队的承诺标准**，不是 PO 说了算，是团队一起定的。所有故事必须达到 DoD 才能算"完成"。

## 三个工件的关系

```
Product Backlog（所有需求）
    ↓ PO 排序，团队估算
Sprint Backlog（本次要做）
    ↓ 团队自组织执行
Increment（可用的产出）
    ↓ Sprint Review 展示
反馈回到 Product Backlog（重新排序）
```

## 一句话总结

三个工件让团队和 stakeholders 对"**还有什么要做、正在做什么、做完了什么**"一目了然。信息透明了，信任就有了。