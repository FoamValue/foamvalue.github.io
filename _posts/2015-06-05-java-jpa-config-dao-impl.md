---
layout: post
title: Java Jpa 配置以及 Dao 实现
author: 陈鑫杰
---

今天，是一个值得纪念的一天。  
所以，特地更新篇博客庆祝下，同时重新整理了下 [GitHub][] 上的工程。

## 吐槽
度娘已经抽风了，无法搜索到本博客的任何内容。有兴趣的，可以收藏下。  

## 概述
鉴于 Jpa 有别于一般的数据处理，一直都很想好好接触接触。然而，没有合适的项目能让我任性的选用这种方式，所以业余的时候，自己搭了一个基于 Jpa 的工程，通过不懈的努力，终于有了点点的收获。  
所以，趁着周岁生日，将自己的实现方式分享给有兴趣的大家。  

## 技术背景
这个项目基于 Spring MVC、Hibernate、Shiro、JPA、Bootstrap 等技术实现的。  
本文考虑到那什么，仅对 Jpa 配置以及 Dao 的实现做说明。  

为了更好的清楚明白，可能需要了解以下内容：  
1. Maven 安装、配置以及如何使用  
2. Eclipse Maven 工程的创建  
3. Spring MVC 的基本配置  

## Jpa 配置

### pom.xml
{% highlight xml %}
  <dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-jpa</artifactId>
    <version>1.7.1.RELEASE</version>
  </dependency>

  <dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-entitymanager</artifactId>
    <version>${hibernate.version}</version>
  </dependency>
{% endhighlight %}

以上使用的是 Spring-Data-Jpa，以及 Hibernate 来处理数据库连接池。  

### persistence.xml
{% highlight xml %}
<?xml version="1.0"?>
<persistence xmlns="http://java.sun.com/xml/ns/persistence"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://java.sun.com/xml/ns/persistence http://java.sun.com/xml/ns/persistence/persistence_1_0.xsd"
  version="1.0">
  <persistence-unit name="sinaweibo" transaction-type="RESOURCE_LOCAL">
    <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>
    <properties>
      <property name="hibernate.dialect" value="org.hibernate.dialect.MySQL5Dialect" />
      <property name="hibernate.connection.driver_class" value="com.mysql.jdbc.Driver" />
      <property name="hibernate.connection.username" value="root" />
      <property name="hibernate.connection.password" value="password" />
      <property name="hibernate.connection.url" value="jdbc:mysql://localhost:3306/sina?useUnicode=true&amp;characterEncoding=UTF-8" />
      <property name="hibernate.hbm2ddl.auto" value="update" />
      <property name="hibernate.show_sql" value="false" />
      <property name="hibernate.format_sql" value="false" />
      <!-- hibernate的c3p0连接池配置（需要jar包：c3p0-0.9.0.4.jar） -->
      <property name="hibernate.connection.provider_class" value="org.hibernate.connection.C3P0ConnectionProvider" />
      <!-- 最小连接数 -->
      <property name="c3p0.min_size" value="1" />
      <!-- 最大连接数 -->
      <property name="c3p0.max_size" value="10" />
      <!--最大空闲时间,60秒内未使用则连接被丢弃。若为0则永不丢弃。Default: 0 -->
      <property name="c3p0.maxIdleTime" value="60" />
      <!-- 获得连接的超时时间,如果超过这个时间,会抛出异常，单位毫秒 -->
      <property name="c3p0.timeout" value="1800" />
      <!-- 最大的PreparedStatement的数量 -->
      <property name="c3p0.max_statements" value="50" />
      <!-- 每隔120秒检查连接池里的空闲连接 ，单位是秒 -->
      <property name="c3p0.idle_test_period" value="120" />
      <!-- 当连接池里面的连接用完的时候，C3P0一下获取的新的连接数 -->
      <property name="c3p0.acquire_increment" value="1" />
      <!-- 是否每次都验证连接是否可用 -->
      <property name="c3p0.validate" value="false" />
    </properties>
  </persistence-unit>
</persistence>

{% endhighlight %}

以上是通过 persistence.xml 的方式配置数据库连接的，采用 c3p0 作为数据库连接池。  

### spring-db.xml
{% highlight xml %}
  <tx:annotation-driven transaction-manager="transactionManager" />
  <bean id="transactionManager" class="org.springframework.orm.jpa.JpaTransactionManager">
    <property name="entityManagerFactory" ref="entityManagerFactory" />
  </bean>
  <bean id="entityManagerFactory" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean"></bean>
{% endhighlight %}

以上是配置基于注解的数据库事务管理。  

### web.xml
{% highlight xml %}
  <filter>
    <filter-name>OpenEntityManagerInViewFilter</filter-name>
    <filter-class>org.springframework.orm.jpa.support.OpenEntityManagerInViewFilter</filter-class>
    <init-param>
      <param-name>entityManagerFactoryBeanName</param-name>
      <param-value>entityManagerFactory</param-value>
    </init-param>
  </filter>

  <filter-mapping>
    <filter-name>OpenEntityManagerInViewFilter</filter-name>
    <url-pattern>/*</url-pattern>
  </filter-mapping>
{% endhighlight %}

加入 Lazy 加载的 Filter 配置。  

**部分 xml 配置，只说明了关键部分。需要自己补充。**  
**以上就是 Jpa 的配置，只是说明了我是如何实现 Jpa 配置的。至于为什么要这样配置，请原谅我也不是很清楚。**

## Dao 实现
Dao 原来采用的是 @NamedQuery 的方式去操作的，因为要繁琐的给每个实体配置 SQL 语句，所以被我认为相当的不方便，现已改成动态查询（CriteriaBuilder）的方式。  
事实上，直接写 SQL 在处理大数据量上，存在很大的优势。因为很多“傻瓜式”的，在转换成 SQL 语句上需要时间，同时转换后的 SQL 可能并不是“最优”的。所以，在这种情况下，请不要考虑简单和优雅了，快速的查询到数据才是你真正应该做的事情。  

在数据量并不大的情况下，我觉得采用动态查询，可以更好的将注意力放在业务实现和前端展现上。  

### Filter.java
{% highlight java %}
package cn.live.utils;

import java.io.Serializable;
import java.util.Date;

public class Filter implements Serializable {
    public enum Operator {
      eq, ne, gt, lt, ge, le, like, in, isNull, isNotNull,between;

      public static Operator fromString(String value) {
        return valueOf(value.toLowerCase());
      }
    }

    private static final long serialVersionUID = -8712382358441065075L;
    private String property;
    private Filter.Operator operator;
    private Object value;
    private Date start;
    private Date end;
    private Boolean ignoreCase = Boolean.valueOf(false);

    public Filter() {
    }

    public Filter(String property, Filter.Operator operator, Object value) {
      this.property = property;
      this.operator = operator;
      this.value = value;
    }

    public Filter(String property, Operator operator, Date start, Date end) {
      this.property = property;
      this.operator = operator;
      this.start = start;
      this.end = end;
    }

    public Filter(String property, Filter.Operator operator, Object value, boolean ignoreCase) {
      this.property = property;
      this.operator = operator;
      this.value = value;
      this.ignoreCase = Boolean.valueOf(ignoreCase);
    }

    public static Filter eq(String property, Object value) {
      return new Filter(property, Filter.Operator.eq, value);
    }

    public static Filter eq(String property, Object value, boolean ignoreCase) {
      return new Filter(property, Filter.Operator.eq, value, ignoreCase);
    }

    public static Filter ne(String property, Object value) {
      return new Filter(property, Filter.Operator.ne, value);
    }

    public static Filter ne(String property, Object value, boolean ignoreCase) {
      return new Filter(property, Filter.Operator.ne, value, ignoreCase);
    }

    public static Filter gt(String property, Object value) {
      return new Filter(property, Filter.Operator.gt, value);
    }

    public static Filter lt(String property, Object value) {
      return new Filter(property, Filter.Operator.lt, value);
    }

    public static Filter ge(String property, Object value) {
      return new Filter(property, Filter.Operator.ge, value);
    }

    public static Filter le(String property, Object value) {
      return new Filter(property, Filter.Operator.le, value);
    }

    public static Filter like(String property, Object value) {
      return new Filter(property, Filter.Operator.like, value);
    }

    public static Filter in(String property, Object value) {
      return new Filter(property, Filter.Operator.in, value);
    }

    public static Filter isNull(String property) {
      return new Filter(property, Filter.Operator.isNull, null);
    }

    public static Filter isNotNull(String property) {
      return new Filter(property, Filter.Operator.isNotNull, null);
    }

    public static Filter between(String property,Date start,Date end) {
      return new Filter(property, Operator.between, start,end);
    }

    public Filter ignoreCase() {
      this.ignoreCase = Boolean.valueOf(true);
      return this;
    }

    public String getProperty() {
      return this.property;
    }

    public void setProperty(String property) {
      this.property = property;
    }

    public Filter.Operator getOperator() {
      return this.operator;
    }

    public void setOperator(Filter.Operator operator) {
      this.operator = operator;
    }

    public Object getValue() {
      return this.value;
    }

    public void setValue(Object value) {
      this.value = value;
    }

    public Date getStart() {
      return start;
    }

    public void setStart(Date start) {
      this.start = start;
    }

    public Date getEnd() {
      return end;
    }

    public void setEnd(Date end) {
      this.end = end;
    }

    public Boolean getIgnoreCase() {
      return this.ignoreCase;
    }

    public void setIgnoreCase(Boolean ignoreCase) {
      this.ignoreCase = ignoreCase;
    }

}
{% endhighlight %}

以上是封装的一个查询工具类。

### Order.java

{% highlight java %}
package cn.live.utils;

import java.io.Serializable;
public class Order implements Serializable {
    public enum Direction {
      asc, desc;

      public static Direction fromString(String value) {
        return valueOf(value.toLowerCase());
      }
    }

    private static final long serialVersionUID = -3078342809727773232L;
    private static final Order.Direction defaultDirection = Order.Direction.desc;
    private String property;
    private Order.Direction direction = defaultDirection;

    public Order() {
    }

    public Order(String property, Order.Direction direction) {
      this.property = property;
      this.direction = direction;
    }

    public static Order asc(String property) {
      return new Order(property, Order.Direction.asc);
    }

    public static Order desc(String property) {
      return new Order(property, Order.Direction.desc);
    }

    public String getProperty() {
      return this.property;
    }

    public void setProperty(String property) {
      this.property = property;
    }

    public Order.Direction getDirection() {
      return this.direction;
    }

    public void setDirection(Order.Direction direction) {
      this.direction = direction;
    }
}
{% endhighlight %}

以上是封装的排序工具类

### BaseDao.java
{% highlight java%}
package cn.live.dao;

public interface BaseDao<T, ID extends java.io.Serializable> {
  void create(T entity);
  void createAll(java.util.List<T> entities);
  T findById(ID id);
  void merge(T entity);
  void remove(T entity);
  void removeAll(java.util.List<T> entities);
  java.util.List<T> createQuery(java.util.List<cn.live.utils.Filter> filters, java.util.List<cn.live.utils.Order> orders);
  cn.live.utils.PageResult<T> findByPage(Integer page, Integer size, java.util.List<cn.live.utils.Filter> filters, java.util.List<cn.live.utils.Order> orders);
  java.util.List<?> getBySQL(String sql);

}

{% endhighlight %}

以上是 Dao 接口。

### BaseDaoImpl.java
{% highlight java %}
package cn.live.dao.Impl;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import org.apache.commons.lang.StringUtils;
import org.springframework.transaction.annotation.Transactional;
import cn.live.dao.BaseDao;
import cn.live.utils.Filter;
import cn.live.utils.PageResult;

@Transactional
public class BaseDaoImpl<T, ID extends Serializable> implements BaseDao<T, ID> {
  private Class<T> clazz;

  @SuppressWarnings("unchecked")
  private Class<T> getClazz() {
    if (clazz == null) {   
      clazz = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
    }
    return clazz;
   }

    @PersistenceContext(unitName = "sinaweibo")  
    private EntityManager em;

    @Override
    public void create(T entity) {
      em.persist(entity);
    }

    @Override
    public void createAll(List<T> entities) {
      for (T entity : entities) {
        em.persist(entity);
      }
    }

    @Transactional(readOnly = true)
    @Override
    public T findById(ID id) {
      return em.find(getClazz(), id);
    }

    @Override
    public void merge(T entity) {
      em.merge(entity);
    }

    @Override
    public void remove(T entity) {
      em.remove(em.contains(entity) ? entity : em.merge(entity));
    }

    @Override
    public void removeAll(List<T> entities) {
      for (T entity : entities) {
        remove(entity);
      }
    }

    @Override
    public List<T> createQuery(List<Filter> filters, List<cn.live.utils.Order> orders) {
      CriteriaBuilder builder = em.getCriteriaBuilder();
      CriteriaQuery<T> query = builder.createQuery(getClazz());
      Root<T> root = query.from(getClazz());
      if (filters != null && filters.size() > 0) {
        List<Predicate> restrictionLists = new ArrayList<Predicate>();
        restrictionLists = getPredicates(builder, root, filters);
        query.where(restrictionLists.toArray(new Predicate[restrictionLists.size()]));
      }

      if (orders != null && orders.size() > 0) {
        List<Order> o = new ArrayList<Order>();
        o = getQueryOrders(builder, root, orders);
        query.orderBy(o);
      }
    TypedQuery<T> typedQuery = em.createQuery(query);
    return typedQuery.getResultList();
  }

  @Transactional(readOnly = true)
  public PageResult<T> findByPage(Integer page, Integer size, List<cn.live.utils.Filter> filters, List<cn.live.utils.Order> orders) {
    try {
      // 创建一个CriteriaBuilder 实例
      CriteriaBuilder builder = em.getCriteriaBuilder();
      // 创建一个泛型的 CriteriaQuery 对象
      CriteriaQuery<T> query = builder.createQuery(getClazz());
      CriteriaQuery<Long> queryCount = builder.createQuery(Long.class);
      // 设置查询表达式
      // 查询表达式是在一个树中组装的核心单元或节点，用于指定 CriteriaQuery。
      Root<T> root = query.from(getClazz());
      query.select(root);
      queryCount.select(builder.count(queryCount.from(getClazz())));
      // 设置查询条件
      if (filters != null && filters.size() > 0) {
        List<Predicate> criteria = new ArrayList<Predicate>();
        criteria = getPredicates(builder, root, filters);
        if (criteria == null || criteria.size() == 0) {
          throw new RuntimeException("no criteria");
        } else {
          query.where(builder.and(criteria.toArray(new Predicate[criteria.size()])));
          queryCount.where(builder.and(criteria.toArray(new Predicate[criteria.size()])));
        }
      }
      // 设置排序
      if (orders != null && orders.size() > 0) {
        List<Order> order = new ArrayList<Order>();
        order = getQueryOrders(builder, root, orders);
        if (order == null || order.size() == 0) {
          throw new RuntimeException("no order");
        } else {
          query.orderBy(order);
        }
      }
      List<T> result = em.createQuery(query)
        .setFirstResult(page)
        .setMaxResults(size)
        .getResultList();
      return new PageResult<T>(em.createQuery(queryCount).getSingleResult(), result);
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }
  }

  @Override
  public List<?> getBySQL(String sql) {
    return null;
  }

  private List<Predicate> getPredicates(CriteriaBuilder builder, Root<T> root, List<cn.live.utils.Filter> filters) {
    if ((filters == null) || (filters.isEmpty())) {
      return null;
  }
    try {
      List<Predicate> predicates = new ArrayList<Predicate>();
      for (cn.live.utils.Filter filter : filters) {
        if ((filter != null) && (!StringUtils.isEmpty(filter.getProperty()))) {
          if ((filter.getOperator() == cn.live.utils.Filter.Operator.eq) && (filter.getValue() != null)) {
            predicates.add(builder.equal(root.get(filter.getProperty()), filter.getValue()));
          } else if ((filter.getOperator() == cn.live.utils.Filter.Operator.ne) && (filter.getValue() != null)) {
            predicates.add(builder.notEqual(root.get(filter.getProperty()), filter.getValue()));
          } else if ((filter.getOperator() == cn.live.utils.Filter.Operator.gt) && (filter.getValue() != null)) {
            predicates.add(builder.gt(root.get(filter.getProperty()), Double.valueOf(filter.getValue().toString())));
          } else if ((filter.getOperator() == cn.live.utils.Filter.Operator.lt) && (filter.getValue() != null)) {
            predicates.add(builder.lt(root.get(filter.getProperty()), Double.valueOf(filter.getValue().toString())));
          } else if ((filter.getOperator() == cn.live.utils.Filter.Operator.ge) && (filter.getValue() != null)) {
            predicates.add(builder.ge(root.get(filter.getProperty()), Double.valueOf(filter.getValue().toString())));
          } else if ((filter.getOperator() == cn.live.utils.Filter.Operator.le) && (filter.getValue() != null)) {
            predicates.add(builder.le(root.get(filter.getProperty()), Double.valueOf(filter.getValue().toString())));
          } else if ((filter.getOperator() == cn.live.utils.Filter.Operator.like) && (filter.getValue() != null) && ((filter.getValue() instanceof String))) {
            predicates.add(builder.like(root.get(filter.getProperty()), filter.getValue().toString()));
          } else if ((filter.getOperator() == cn.live.utils.Filter.Operator.in) && (filter.getValue() != null)) {
            Object value = filter.getValue();
            if (value instanceof Collection) {
              predicates.add(root.get(filter.getProperty()).in((Collection<?>)value));
            } else if (value.getClass().isArray()) {
              predicates.add(root.get(filter.getProperty()).in((Object[])value));
            } else {
              predicates.add(root.get(filter.getProperty()).in(value));
            }
          } else if (filter.getOperator() == cn.live.utils.Filter.Operator.isNull) {
            predicates.add(root.get(filter.getProperty()).isNull());
          } else if (filter.getOperator() == cn.live.utils.Filter.Operator.isNotNull) {
            predicates.add(root.get(filter.getProperty()).isNotNull());
          } else if (filter.getOperator() == cn.live.utils.Filter.Operator.between) {
            predicates.add(builder.between(root.get(filter.getProperty()), filter.getStart(), filter.getEnd()));
          }
        }
      }
      return predicates;
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }
  }

  private List<Order> getQueryOrders (CriteriaBuilder builder, Root<T> root, List<cn.live.utils.Order> orders) {
    if ((orders == null) || (orders.isEmpty())) {
      return null;
    }
    try {
      List<Order> result = new ArrayList<Order>();
      for (cn.live.utils.Order order : orders) {
        if (order.getDirection() == cn.live.utils.Order.Direction.asc) {
          result.add(builder.asc(root.get(order.getProperty())));
        } else if (order.getDirection() == cn.live.utils.Order.Direction.desc) {
        result.add(builder.desc(root.get(order.getProperty())));
        }
      }
      return result;
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }
  }
}
{% endhighlight %}

以上是 Dao 接口的实现类。  
写的有点欠抽，封装了查询和排序，测试下来是 OK，但可能覆盖面可能不够，毕竟业余。  

### BaseService.java
{% highlight java %}
package cn.live.service;

public interface BaseService <T, ID extends java.io.Serializable> {
  void save(T entity);
  void saveAll(java.util.List<T> entities);
  T findById(ID id);
  void update(T entity);
  void delete(T entity);
  void deleteAll(java.util.List<T> entities);
  java.util.List<T> createQuery(java.util.List<cn.live.utils.Filter> filters);
  java.util.List<T> createQuery(java.util.List<cn.live.utils.Filter> filters, java.util.List<cn.live.utils.Order> orders);
  cn.live.utils.PageResult<T> findByPage(Integer page, Integer size);
  cn.live.utils.PageResult<T> findByPage(Integer page, Integer size, java.util.List<cn.live.utils.Filter> filters);
  cn.live.utils.PageResult<T> findByPage(Integer page, Integer size, java.util.List<cn.live.utils.Filter> filters,   java.util.List<cn.live.utils.Order> orders);
}

{% endhighlight %}

以上是基础业务接口。

### BaseServiceImpl.java
{% highlight java %}
package cn.live.service.Impl;

import java.io.Serializable;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import cn.live.dao.BaseDao;
import cn.live.service.BaseService;
import cn.live.utils.Filter;
import cn.live.utils.Order;
import cn.live.utils.PageResult;

@Transactional
public class BaseServiceImpl<T, ID extends Serializable> implements BaseService<T, ID> {
  private BaseDao<T, ID> dao;  

  public void setDao(BaseDao<T, ID> dao) {
  this.dao = dao;  
    }

  @Override
  public void save(T entity) {
    dao.create(entity);
  }

  @Override
  public void saveAll(List<T> entities) {
    dao.createAll(entities);
  }

  @Override
  public T findById(ID id) {
    return dao.findById(id);
  }

  @Override
  public void update(T entity) {
    dao.merge(entity);
  }

  @Override
  public void delete(T entity) {
    dao.remove(entity);
  }

  @Override
  public void deleteAll(List<T> entities) {
    dao.removeAll(entities);
  }

  @Override
  public List<T> createQuery(List<cn.live.utils.Filter> filters) {
    return dao.createQuery(filters, null);
  }

  @Override
  public List<T> createQuery(List<Filter> filters, List<Order> orders) {
    return dao.createQuery(filters, orders);
  }

  @Override
  public PageResult<T> findByPage(Integer page, Integer size) {
    return dao.findByPage(page, size, null, null);
  }

  @Override
  public PageResult<T> findByPage(Integer page, Integer size, List<Filter> filters) {
    return dao.findByPage(page, size, filters, null);
  }

  @Override
  public PageResult<T> findByPage(Integer page, Integer size, List<cn.live.utils.Filter> filters, List<cn.live.utils.Order> orders) {
    return dao.findByPage(page, size, filters, orders);
  }
}

{% endhighlight %}

以上是基础业务的实现类。  

整个 Dao 的实现，可以分为 BaseDaoImpl 和 BaseServiceImpl。  
1. BaseDaoImpl 封装了所有可能的数据库操作方法，每个实体都要创建自己的 DaoImpl 去继承 BaseDaoImpl，实现了泛型，也允许拥有自己的方法。  
2. BaseServiceImpl 封装了对 BaseDaoImpl 的调用，每个实体都要创建自己的 ServiceImpl 去继承 BaseServiceImpl，同样实现了泛型，也允许拥有自己的方法。

**综上，就完成了 Jpa 配置和 Dao 实现。**

## 结束语
本文主要讲述了，我是如何实现 Jpa 配置和 Dao 实现的。可能存在不足和错误，请诸位大牛指教。可直接回复，也可发邮件。

最后，祝大家每天都过得特别充实。说笑呢，祝大家工作轻松，身体健康。

[GitHub]: https://github.com/FoamValue
