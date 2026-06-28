---
layout: post
title: mybatis generator 工具
author: 陈鑫杰
---

mybatis generator 工具简单运用

### 准备

mybatis-generator-core-1.3.2.jar  [Info][generator]

mysql-connector-java-5.1.37.jar

### 配置文件
名称：generatorConfig.xml
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN" "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">
<generatorConfiguration>  
  <!--数据库驱动-->
  <classPathEntry  location="mysql-connector-java-5.1.37.jar"/>
  <!-- 定义运行时目标 -->
  <context id="DB2Tables"  targetRuntime="MyBatis3">
    <commentGenerator>
      <property name="suppressDate" value="true"/>
      <!-- 是否去除自动生成的注释 true:是;false:否 -->
      <property name="suppressAllComments" value="true"/>
    </commentGenerator>

    <!--数据库链接地址账号密码-->
    <jdbcConnection driverClass="com.mysql.jdbc.Driver" connectionURL="jdbc:mysql://localhost:3306/testdb" userId="root" password="root"></jdbcConnection>

    <javaTypeResolver>
      <property name="forceBigDecimals" value="false"/>
    </javaTypeResolver>
    <!-- 生成模型的包名和位置-->
    <javaModelGenerator targetPackage="test.model" targetProject="src">
      <property name="enableSubPackages" value="true"/>
      <property name="trimStrings" value="true"/>
    </javaModelGenerator>
    <!--生成映射文件存放位置-->
    <sqlMapGenerator targetPackage="test.mapping" targetProject="src">
      <property name="enableSubPackages" value="true"/>
    </sqlMapGenerator>
    <!--生成Dao类存放位置-->
    <javaClientGenerator type="XMLMAPPER" targetPackage="test.dao" targetProject="src">
      <property name="enableSubPackages" value="true"/>
    </javaClientGenerator>
    <!--生成对应表及类名-->
    <table tableName="demo_accounts" domainObjectName="AccountsDto" enableCountByExample="false" enableUpdateByExample="false" enableDeleteByExample="false" enableSelectByExample="false" selectByExampleQueryId="false"></table>
    <table tableName="demo_login_history" domainObjectName="LoginHisDto" enableCountByExample="false" enableUpdateByExample="false" enableDeleteByExample="false" enableSelectByExample="false" selectByExampleQueryId="false"></table>
    <table tableName="demo_user_info" domainObjectName="UserInfoDto" enableCountByExample="false" enableUpdateByExample="false" enableDeleteByExample="false" enableSelectByExample="false" selectByExampleQueryId="false"></table>
  </context>
</generatorConfiguration>
{% endhighlight xml %}

### 执行命令
java -jar mybatis-generator-core-1.3.2.jar -configfile generatorConfig.xml -overwrite


[generator]: http://www.mybatis.org/generator/index.html
