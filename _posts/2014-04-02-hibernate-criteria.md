---
layout: post
title: Hibernate Criteria 分页查询用法
author: 陈鑫杰
---

Criteria 是 Hibernate 提供的一个接口，通过组合 Criterion 对象查询实体对象。Criteria 由 Hibernate Session 创建，例如：
{% highlight java %}
Criteria criteria = session.createCriteria(cat.class);
criteria.add( Restrictions.like("name", "Iz%") );
criteria.add( Restrictions.gt( "weight", new Float(minWeight) ) );
criteria.addOrder( Order.asc("age") );
criteria.setFirstResult((pageNo - 1) * pageSize);
criteria.setMaxResults(pageSize);
List cats = criteria.list();
{% endhighlight %}

* Criteria add(Criterion cirtersion) 添加约束。Restriction 类提供静态方法来添加约束，例如：eq（等于）、ge（大于等于）、gt（大于）等。
* Criteria addOrder(Order order) 添加排序。Order 类提供静态的排序方法，例如：asc（顺序）、desc（倒序）。
* Criteria setFirstResult(int firstResult) 设置第一个结果，从 0 开始编号。
* Criteria setMaxResults(int MaxResult) 设置要被查询的对象的数目。
* Criteria list()返回符合查询结果列表。
