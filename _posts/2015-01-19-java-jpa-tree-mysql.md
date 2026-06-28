---
layout: post
title:  "Java JPA 树状结构实现（Mysql）"
author: 陈鑫杰
---

树状结构是较为简单的一种数据结构，通常用来处理上下级之间的逻辑关系。  
本文仅记录了以 Java JPA 方式的一种实现案例。

## 概述

一般而言，树状结构都是以单表形式实现的。在逻辑上，以及处理过程中都比较清晰与容易，但是在实际的工作中，总会存在多表之间实现树的情况。对于此类情况，本着不讨论其究竟是否合理的原则下，给出`先分析表，再建立试图`的处理方式。

## 分析表

1. 表1

{% highlight sql %}

create table `t_area` (
    area_id    varchar(32),
    area_name  varchar(32),
    parent_id  varchar(32)
)

{% endhighlight %}

2. 表2

{% highlight sql %}

create table `t_store` (
    store_id    varchar(32),
    store_name  varchar(32),
    area_id     varchar(32)
)

{% endhighlight %}

以上两张表为例，区域表（`t_area`）和店铺表（`t_store`）。  
区域表：组织结构是以区域为主，同时区域与区域之间存在一个上下级（`区域树`）的关系。  
店铺表：店铺数据是存在于区域之下，或者是按区域进行划分的。

## 建立视图

如果没有视图，我们必须同时操作两张表，再进行操作并匹配。  
既增加了后台逻辑的复杂性，同时也增加了系统响应时间。所以我选择了一种偷懒的方式 —— 建立试图。  
_存在其他更好的解决方式，但本案例因实际因素采用这种处理方式。_

{% highlight sql %}

CREATE
    ALGORITHM = UNDEFINED
    DEFINER = `admin`@`%`
    SQL SECURITY DEFINER
VIEW `view_depart` AS
    SELECT
        `area_id` AS `id`,
        `area_name` AS `depart_name`,
        `parent_id` AS `parent_id`
    FROM
        `t_area`

    UNION ALL

    SELECT
        `store_id` AS `id`,
        `store_name` AS `depart_name`,
        `area_id` AS `parent_id`
    FROM
        `t_store`;

{% endhighlight %}


## Java 实体类

使用 JPA 方式，可以非常方便的获取上级对象与下级对象集合。  
在实际的处理中可以减少数据库的递归查询，减少因大量数据查询，而导致的资源消耗，缩短请求的响应时间。  

{% highlight java %}

package cn.live.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * @ClassName: ViewDepart
 * @Description: TODO 树状结构
 * @author: FoamValue
 * @mail:
 * @time:
 * @version: V1.0
 */
@Entity
@Table(name = "view_depart", schema = "")
public class ViewDepart extends IdEntity implements Serializable {
	/**
	 * @Fields serialVersionUID : TODO
	 */
	private static final long serialVersionUID = 8891015927725521554L;
	private String name; // 名称
	private ViewDepart parentDepart; // 上级部门
	private List<ViewDepart> viewDeparts = new ArrayList<ViewDepart>(); // 下属部门

	@Column(name = "depart_name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_id")
	public ViewDepart getParentDepart() {
		return parentDepart;
	}

	public void setParentDepart(ViewDepart parentDepart) {
		this.parentDepart = parentDepart;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "parentDepart")
	public List<ViewDepart> getViewDeparts() {
		return viewDeparts;
	}

	public void setViewDeparts(List<ViewDepart> viewDeparts) {
		this.viewDeparts = viewDeparts;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
}

{% endhighlight %}
