---
layout: post
title: Spring 表达式语言
author: 陈鑫杰
---

## 概述
SpEL 是一种强大、简洁的装配 Bean 的方式，它通过运行期执行的表达式将值装配到 Bean 的属性或构造器参数中。

### 特性
* 使用 Bean 的 ID 来引用 Bean
* 调用方法和访问对象的属性
* 对值进行算术、关系和逻辑运算
* 正则表达式匹配
* 集合操作

## SpEL 的基本原理
首要目标是通过计算获得某个值。最简单的 SpEL 是对字面值、Bean 的属性或者某个类的常量进行求值。

### 字面值
例如：5  
以下是不同类型的字面值示例（XML 中 property 属性为例）：  
{% highlight xml %}
<property name = "count" value = "#{5}"/>
<property name = "message" value = "The Value is #{5}"/>
<property name = "frequency" value = "#{89.7}"/>
<property name = "capacity" value = "#{1e4}"/>
<property name = "name" value = "#{'FoamValue'}"/>
<property name = 'name' value = '#{"FoamValue"}'/>
<property name = "enabled" value = "#{false}"/>
{% endhighlight %}
字面值非常简单，但是复杂的 SpEL 表达式都是简单的 SpEL 表达式构成。

### 引用 Bean、Properties 和方法
{% highlight xml %}
<property name = "instrument" value = "#{saxophone}"/>
{% endhighlight %}
使用 SpEL 将 ID 为 saxophone 的一个 Bean 装配到 instrument 属性中。使用 ref 属性也可以实现。
{% highlight xml %}
<property name = "song" value = "#{foamvalue.song}"/>
{% endhighlight %}
第一部分，通过 ID 指向 foamvalue Bean。第二部分，指向 foamvalue Bean 的 song 属性。通过这种方式装配 song 属性。  
{% highlight xml %}
<property name = "song" value = "#{songSelector.selectSong()?.toUpperCase()"/>
{% endhighlight %}
第一部分，通过 ID 指向 songSelector Bean。第二部分，指向 selectSong() 方法，此时返回歌曲的歌词。第三部分是 null-safe 存取器，如果运算符左边的值是 null，SpEL 则不在调用运算符右边的 toUpperCase() 方法。第四部分，返回全部大写的歌曲歌词。

### 操作类
使用 T() 运算符，可以调用类作用域的方法和常量。  
例如在 SpEL 中调用 Java 的 Math 类，可以这样写 T(java.lang.Math) 返回一个 java.lang.Math 类的对象，甚至可以装配到 Bean 的属性中，例如：  
{% highlight xml %}
<property name = "multiplier" value = "#{T(java.lang.Math).PI}"/>
{% endhighlight %}

## 在 SpEL 值上执行操作

| 运算符类型 | 运算符 |
| -------    | -----  |
| 算术运算   | +、-、*、/、%、^ |
| 关系运算   | &lt;、&le;、==、&ge;、&gt;、lt、le、eq、ge、gt |
| 逻辑运算   | and、or、not、\| |
| 条件运算   | ?: (ternary)、?: (Elvis) |
| 正则表达式 | matches |

使用以上的运算符可以对 SpEL 中的值执行基础的数学运算（数值运算、比较值、逻辑表达式、条件表达式、正则表达式）。
{% highlight xml %}
<property name = "area" value = "#{T(java.lang.Math).PI * circle.radius ^ 2}"/>
<property name = "equal" value = "#{countor.total == 100}"/>
<property name = "outOfStock" value = "#{!product.available}"/>
<property name = "song" value = "#{kenny.song != null ? kenny.song : 'Greensleeves'}"/>
<property name = "validEmail" value = "#{admin.email matches '[a-zA-Z0-9._%+-]+[a-zA-Z0-9-]+\\.com'}"/>
{% endhighlight %}

## 在 SpEL 中筛选集合

### 访问集合成员
{% highlight xml %}
<property name = "chosenCity" value = "#{cities[2]}"/>
{% endhighlight %}

### 查询集合成员
{% highlight xml %}
<property name = "bigCities" value = "#{cities.?[population gt 100000]}"/>
{% endhighlight %}
查询运算符（.?[]）、第一个匹配项（.^[]）、最后一个匹配项（.$[]）

### 投影集合
是从集合的每一个成员中选择特定的属性放入一个新的集合中（.![]）。
{% highlight xml %}
<property name = "cityNames" value = "#{cities.![name]}"/>
{% endhighlight %}
表达式结果是 cityNames 属性将被赋予一个 String 类型的集合。

## 小结
以上都是以 XML 配置为示例进行说明的，但是不要因此小看 SpEL 表达式。从 XML 中分离后，同样可以在基于注解驱动的装配中使用。
