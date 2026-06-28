---
layout: post
title: Spring Bean 装配
author: 陈鑫杰
---

## 概述
Spring 提供了几种技巧，来减少 XML 的配置数量。

* 自动装配（autowiring）：减少甚至消除配置 &lt;property&gt; 元素和 &lt;constructor-arg&gt; 元素，让 Spring 自动识别如何装配 Bean 的依赖关系。
* 自动检测（autodiscovery）：让 Spring 自动识别哪些类需要被装配成 Spring Bean，从而减少甚至消除对 &lt;bean&gt; 元素的使用。

## 自动装配

### 装配策略
* byName：将与属性名称相匹配的其他 Bean 自动装配到 Bean 的对应属性中。如果没有，则该属性不进行装配。
* byType：将与属性的类型相匹配的其他 Bean 自动装配到 Bean 的对应属性中。如果没有，则该属性不进行装配。
* constructor：将与 Bean 构造函数入参的类型相配配的其他 Bean 自动装配到 Bean 构造函数对应的入参中。
* autodetect：首先尝试 constructor 方式自动装配。如果失败，则再次尝试 byType 进行装配。

### byName 自动装配
{% highlight xml %}
<bean id = "kenny" class = "com.*" autowire = "byName">
<property name = "song" value = "FoamValue"/>
</bean>
{% endhighlight %}
为属性自动装配 ID 与该属性的名字相同的 Bean。通过设置 autowire 属性为 byName，Spring 将特殊对待 kenny 的所有属性，为这些属性寻找与其名字相同的 Spring Bean。

### byType 自动装配
工作方式类似于 byName 自动装配，只不过不再是匹配属性的名字，而是属性的类型。  
byType 自动装配存在一个局限性。就是有多个 Bean，它们的属性类型与需要匹配的属性类型都符合时，Spring 会直接抛出异常。为了避免 byType 自动装配所带来的歧义。我们可以为自动装配标识一个首选 Bean，或者消除候选 Bean 的资格。如果只有一个候选 Bean 的 primary 属性设置为 true，那么它比其他候选 Bean 优先被选择。但是 primary 属性默认是 true，所以我们要将其他非首选 Bean 的 primary 属性设置为 false。  
如果在自动装配时，我们也可以排除某些 Bean。只要设置这些 Bean 的 autowire-candidate 属性为 false。

### constructor 自动装配
如果要通过构造器注入来配置 Bean，可以移除 &lt;constructor-arg&gt; 元素，由 Spring 在应用的上下文中自动选择 Bean 注入到构造器入参中。

### 最佳自动装配
如果不能确定使用哪一种自动装配方式，那么将 autowire 属性设置为 autodetect，由 Spring 来决定。

## 自动检测
在 Spring 配置中使用 &lt;context:component-scan&gt; 自动扫描指定的包及其所有的子包，并查找出能够自动注册为 Spring Bean 的类。base-package 属性标识了 &lt;context:component-scan&gt;元素所扫描的包。

### 为自动检测标注 Bean
* @Component：通用的构造型注解，标识该类为 Spring 组建。
* @Controller：标识将该类定义为 Spring MVC Controller。
* @Repository：标识将该类定义为数据仓库。
* @Service：标识将该类定义为服务。
* 使用 @Component 标注的任意自定义注解。

### 过滤组建扫描
* &lt;context:include-filter&gt;：告知&lt;context:component-scan&gt;哪些类需要被注册为 Spring Bean。
* &lt;context:exclude-filter&gt;：告知&lt;context:component-scan&gt;哪些类不需要被注册 Spring Bean。

5种过滤类型

* annotation：过滤器扫描使用指定注解所标注的那些类，通过 expression 属性指定要扫描的注解。
* assignable：过滤器扫描派生于 expression 属性所指定的那些类。
* aspectj：过滤器扫描与 expression 属性所指定的 AspectJ 表达式所匹配的那些类。
* custom：使用自定义的 org.springframework.core.type.TypeFilter 实现类，该类有 expression 属性指定。
* regex：过滤器扫描类的名称与 expression 属性所指定的正则表达式匹配的那些类。

## 小结
终结了复杂的 XML 配置，大幅简化了 Spring 的配置。
