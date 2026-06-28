---
layout: post
title: 归纳 git 使用技巧
keywords: git github使用
tags: github使用
author: 陈鑫杰
---

在维护线上系统 BUG 与新旧功能的开发／变更之间，如何控制系统代码版本。这是一件异常痛苦的事情，特别是开发为主的团队。
不同的功能分给不同的人，代码保存本地暂不提交，创建不同文件夹部署测试／线上工程，解决代码同步问题，等等。
常用的 SVN 管理代码版本的模式下，很少使用到分支。往往一个主分支开发、测试、线上、维护。
这样的现状持续着，这样的现状很难受。
为了更好的管理代码版本，为了更好的开发功能，为了更好的稳定线上系统。
为了从 SVN 平稳的切换到 GIT，参考网上资料整理归纳。

------

## GIT

1. Linux 之父 Linus Torvalds 发布了他的又一个里程碑作品。
2. 流行至今，且并未衰退。

以上两点，就可以明确的解释，为什么要从 SVN 切换到 GIT。

**然而**，GIT 只是一个版本控制系统。虽然 GIT 在设计上很适合多分支管理，但是举个栗子 - **混乱的分支图**。

![git-tips](summarize-git-using-tips/20160422193143_281.jpg)

遇到了，不知道是悲愤多些，还是吐血多些。

------

## 理论篇

[参考资料](#Info)，加个人理解。

有个很成熟的叫 **Git Flow** 的分支模型。

	Master: 最稳定功能的随时可发布线上的代码
	Hotfix: 修复线上代码 BUG
	Develop: 功能最新最全的分支
	Feature: 某个功能点正在开发阶段
	Release: 发布定期要测试上线的功能

其中 **Master**，**Develop** 是主分支，只能存在一个。其他分支都是主分支的衍生分支。

**有序的分支图**

![](summarize-git-using-tips/14724616710606.jpg)

### Master/Develop 分支

初始化主分支
***不允许提交代码，只允许衍生分支&合并代码。***

![git-tips](summarize-git-using-tips/20151229093807_669.png)

### Feature 分支

Develop 衍生的功能分支，不同的功能创建不同的分支。
完成功能开发后，合并到 Develop 分支。

![git-tips](summarize-git-using-tips/20151229093807_775.png)

### Release分支

Develop 衍生的测试上线分支，**需要记录 Tag**。

![git-tips](summarize-git-using-tips/20151229093807_423.png)

### Hotfix 分支

Master 衍生的修复线上 BUG 的分支。

![git-tips](summarize-git-using-tips/20151229093807_963.png)

------

## 命令 & 工具篇

**Git Flow** 的分支模型，只是分支模型。
具体如何使用，可以是敲打命令，也有可以使用工具。

### 常用操作命令

git commit
git add [--all]
git push
git pull
git branch [-d]
git merge
git cherry-pick
git checkout [-b] BRANCH_NAME
git stash

### <a name="git-flow-demo"></a>Git Flow 代码示例

a. 创建develop分支

	git branch develop
	git push -u origin develop

b. 开始新Feature开发

	git checkout -b some-feature develop
	# Optionally, push branch to origin:
	git push -u origin some-feature

	# 做一些改动
	git status
	git add some-file
	git commit

c. 完成Feature

	git pull origin develop
	git checkout develop
	git merge --no-ff some-feature
	git push origin develop

	git branch -d some-feature

	# If you pushed branch to origin:
	git push origin --delete some-feature

d. 开始Relase

	git checkout -b release-0.1.0 develop

	# Optional: Bump version number, commit
	# Prepare release, commit

e. 完成Release

	git checkout master
	git merge --no-ff release-0.1.0
	git push

	git checkout develop
	git merge --no-ff release-0.1.0
	git push

	git branch -d release-0.1.0

	# If you pushed branch to origin:
	git push origin --delete release-0.1.0


	git tag -a v0.1.0 master
	git push --tags

f. 开始Hotfix

	git checkout -b hotfix-0.1.1 master

g. 完成Hotfix

	git checkout master
	git merge --no-ff hotfix-0.1.1
	git push


	git checkout develop
	git merge --no-ff hotfix-0.1.1
	git push

	git branch -d hotfix-0.1.1

	git tag -a v0.1.1 master
	git push --tags

### 工具

1. Git
2. Git-Flow
3. SourceTree

***省略安装步骤，自行度娘或谷歌。***

*未完待续*

------

## <a name="Info"></a>资料来源

本文图片与[Git Flow 代码示例](#git-flow-demo)来源于（*顺序随机*）：

1. [研发团队GIT开发流程新人学习指南](https://yq.aliyun.com/articles/69414?spm=5176.100238.goodcont.128.jSsNah)
2. [Git 在团队中的最佳实践--如何正确使用Git Flow](http://www.open-open.com/lib/view/open1451353135339.html?spm=5176.100239.blogcont69414.16.B97ALy)
3. [团队中的 Git 实践](http://www.open-open.com/lib/view/open1461324562769.html?spm=5176.100239.blogcont69414.15.B97ALy)
4. [A successful Git branching model](http://nvie.com/posts/a-successful-git-branching-model/)

### Q&A

1. 为什么网上都有的资料，还要拷贝一份？
*M：一是加深理解；二是便于自己寻找。*

2. 未完待续？
*M：尚未实际操作。*
