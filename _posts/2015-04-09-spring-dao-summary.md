---
layout: post
title: Spring Dao 汇总
author: 陈鑫杰
---

最近在写一个框架的 Dao 层时，遇到了点问题。所以整理了以下两种不同的实现方式，希望能给大家带来些帮助。  
其实 Dao 层，不考虑太深入的情况下，还是非常简单的。都是基于框架已经实现好的功能去二次扩展，例如：Session、EntityManager。

## SessionFactory
基于 Hibernate(4.0+)

### XML
{% highlight xml %}
	<bean id="sessionFactory" class="org.springframework.orm.hibernate4.LocalSessionFactoryBean">
		<property name="dataSource" ref="c3p0dataSource" />
		<property name="packagesToScan" value="com.foamvalue.*" />
		<property name="hibernateProperties">
			<props>
				<prop key="hibernate.dialect">${hibernate.dialect}</prop>
				<prop key="hibernate.show_sql">false</prop>
				<prop key="hibernate.format_sql">true</prop>
				<prop key="hibernate.bytecode.use_reflection_optimizer">true
				</prop>
			</props>
		</property>
	</bean>
{% endhighlight %}

### Dao
{% highlight java %}
package com.foamvalue.dao.impl;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;

import javax.annotation.Resource;

import com.foamvalue.dao.BaseDao;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.util.Assert;

public class BaseDaoImpl<T, ID extends Serializable> implements BaseDao<T, ID> {
	private Class<T> clazz;

	@SuppressWarnings("unchecked")
	public BaseDaoImpl() {
		ParameterizedType type = (ParameterizedType) this.getClass().getGenericSuperclass();
		clazz = ((Class<T>) type.getActualTypeArguments()[0]);
	}

	@Resource(name = "sessionFactory")
	private SessionFactory sessionFactory;

	protected Session getSession() {
		return this.sessionFactory.getCurrentSession();
	}

	@Override
	public void create(T entity) {
		this.getSession().save(entity);
		this.getSession().flush();

	}

	@SuppressWarnings("unchecked")
	@Override
	public T findById(ID id) {
		return (T) this.getSession().get(clazz, id);
	}

	@Override
	public void merge(T entity) {
		Assert.notNull(entity);
		this.getSession().merge(entity);
		this.getSession().flush();
	}
}

{% endhighlight %}

以上是泛型的基础 Dao，实际开发过程中，需要另外实现这个 Dao。例如：

{% highlight java %}
package com.foamvalue.service.impl;

import com.foamvalue.dao.BaseDao;

@Service("userService")
public class UserServiceImpl implements UserService {

	private SessionFactory sessionFactory;

	@Resource(name = "sessionFactory")
	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
		userDao = new BaseDao<User>(User.class, sessionFactory);
	}

	private BaseDao<User> userDao;

	public void save(User user) {
		userDao.create(user);
	}

}
{% endhighlight %}

UserService: 简单的接口类

## EntityManager
基于 JPA

### XML
{% highlight xml %}

	<bean id="entityManagerFactory" class="org.springframework.orm.jpa.LocalEntityManagerFactoryBean">
  	<property name="persistenceUnitName" value="web"/>
	</bean>

{% endhighlight %}

### Dao

{% highlight java %}

package com.foamvalue.buyphone.service.base;

import com.foamvalue.buyphone.utils.GenericsUtils;
import org.springframework.transaction.annotation.Propagation;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.Serializable;
public abstract class DaoImpl<T> implements DAO<T> {
    protected Class<T> entityClass = GenericsUtils.getSuperClassGenricType(this.getClass());

    @PersistenceContext
    protected EntityManager em;

    public void clear() {
        em.clear();
    }

    public void delete(Serializable... entityids) {
        for (Object id : entityids) {
            em.remove(em.getReference(this.entityClass, id));
        }
    }

    public T find(Serializable entityId) {
        return em.find(this.entityClass, entityId);
    }

    public void save(Object entity) {
        em.persist(entity);
    }

}

{% endhighlight %}

同样泛型的基础 Dao，实际开发过程中，需要另外实现这个 Dao。例如：

{% highlight java %}
package com.foamvalue.service.impl;

import com.foamvalue.dao.UserDao;

@Service("userService")
public class UserServiceImpl implements UserService {
  @Resource(name = "userDao")
  private UserDao<User> userDao;

  public void save(User user) {
    userDao.create(user);
  }

}
{% endhighlight %}

UserDao: 简单的继承 BaseDao 的接口
UserService: 简单的接口类
