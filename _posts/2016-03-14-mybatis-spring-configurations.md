---
layout: post
title: Mybatis-Spring 配置
author: 陈鑫杰
---

mybatis-spring 简单用法

[帮助文档][info]

### MyBatis-Spring 模块

{% highlight xml %}
<dependency>
  <groupId>org.mybatis</groupId>
  <artifactId>mybatis-spring</artifactId>
  <version>x.x.x</version>
</dependency>
{% endhighlight xml %}

### dataSource
推荐 com.alibaba.druid.pool.DruidDataSource

### 数据库事务
{% highlight xml %}
<tx:annotation-driven transaction-manager="transactionManager" />
<!-- 配置事务管理器 -->
<bean id="transactionManager"
  class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
  <property name="dataSource" ref="dataSource" />
</bean>
</bean>
{% endhighlight xml %}

### SqlSessionFactory
{% highlight xml %}
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
  <property name="dataSource" ref="dataSource" />
  <property name="typeAliasesPackage" value="com.foamvalue.*.entity" />
  <property name="mapperLocations" value="classpath:/mybatis/*Mapper.xml" />
</bean>
{% endhighlight xml %}

**mapperLocations** 从类路径下加载在 sample.config.mappers 包和它的子包中所有的 MyBatis 映射器 XML 文件。

### 一个数据映射器类

{% highlight xml %}
<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
  <property name="annotationClass" value="org.springframework.stereotype.Repository" />
  <property name="basePackage" value="com.foamvalue.*.repository" />
  <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory" />
</bean>
{% endhighlight xml %}

要注意,所指定的映射器类必须是一个接口,而不是具体的实现类。


### 数据实现
{% highlight java %}
@Service
public class FooServiceImpl implements FooService {

@Autowired
private UserMapper userMapper;

@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
public User doSomeBusinessStuff(String userId) {
  return this.userMapper.getUser(userId);
}
{% endhighlight java %}

### 映射器 XML 文件
对应 `getUser` 的 sql 实现

[info]: http://www.mybatis.org/spring/zh/factorybean.html
