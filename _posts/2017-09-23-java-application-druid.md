---
layout: post
title: Java Druid 链接池
keywords: Java Druid DataSource
description: Java Application 的链接池
tags: Java Druid DataSource
author: 陈鑫杰
---

druid 依赖

```
<dependency>
	<groupId>com.alibaba</groupId>
	<artifactId>druid</artifactId>
	<version>1.1.3</version>
</dependency>
		
```

DataSource链接池

```
public class BaseDaoImpl<T> {

	private static Logger logger = LoggerFactory.getLogger(BookTargetUrlDaoImpl.class.getName());

	static {
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");// 加载驱动
		} catch (ClassNotFoundException e) {
			String fullStackTrace = ExceptionUtils.getStackTrace(e);
			logger.error(fullStackTrace);
		}
	}

	private static Connection conn;

	public static Connection getConnection() {
		try {
			logger.debug("getConnection!");
			if (conn == null || conn.isClosed()) {
				conn = druidDataSource().getConnection();
				logger.debug("createConnection success!");
			} else {
				return conn;
			}
		} catch (SQLException e) {
			String fullStackTrace = ExceptionUtils.getStackTrace(e);
			logger.error(fullStackTrace);
		}
		return conn;
	}

	public static void close() {
		if (conn != null) {
			try {
				conn.close();
				logger.debug("close success!");
			} catch (SQLException e) {
				String fullStackTrace = ExceptionUtils.getStackTrace(e);
				logger.error(fullStackTrace);
			}
		}
	}

	private static DataSource druidDataSource() {
		DruidDataSource druidDataSource = new DruidDataSource();
        druidDataSource.setDriverClassName(Config.dbDriverClassName);
        druidDataSource.setUrl(Config.dbUrl);
        druidDataSource.setUsername(Config.dbUsername);
        druidDataSource.setPassword(Config.dbPassword);
        druidDataSource.setInitialSize(Config.dbInitialSize);
        druidDataSource.setMaxActive(Config.dbMaxActive);
        druidDataSource.setMaxWait(Config.dbMaxWait);
        druidDataSource.setTimeBetweenEvictionRunsMillis(Config.dbTimeBetweenEvictionRunsMillis);
        druidDataSource.setMinEvictableIdleTimeMillis(Config.dbMinEvictableIdleTimeMillis);
        druidDataSource.setValidationQuery(Config.dbValidationQuery);
        druidDataSource.setTestWhileIdle(Config.dbTestWhileIdle);
        druidDataSource.setTestOnBorrow(Config.dbTestOnBorrow);
        druidDataSource.setTestOnReturn(Config.dbTestOnReturn);
        druidDataSource.setPoolPreparedStatements(Config.dbPoolPreparedStatements);
        druidDataSource.setMaxPoolPreparedStatementPerConnectionSize(Config.dbMaxPoolPreparedStatementPerConnectionSize);
        return druidDataSource;
	}
}
```

local.properties 配置文件

```
#数据源
db.url= jdbc:mysql://localhost:3306/test?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&allowMultiQueries=true
db.driverClassName=com.mysql.cj.jdbc.Driver
db.username=root
db.password=123456
# 初始化大小，最小，最大
db.initialSize=5
db.minIdle=5
db.maxActive=20
# 配置获取连接等待超时的时间
db.maxWait=60000
# 配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒
db.timeBetweenEvictionRunsMillis=60000
# 配置一个连接在池中最小生存的时间，单位是毫秒
db.minEvictableIdleTimeMillis=300000
db.validationQuery=SELECT 1
db.testWhileIdle=true
db.testOnBorrow=false
db.testOnReturn=false
# 打开PSCache，并且指定每个连接上PSCache的大小
db.poolPreparedStatements=true
db.maxPoolPreparedStatementPerConnectionSize=20
```
