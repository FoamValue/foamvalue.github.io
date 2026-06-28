---
layout: post
title: Maven2 Q&A
description: 记录 Maven2 使用过程中的问题点，以及相应的处理方法。
author: 陈鑫杰
---

记录 Maven2 使用过程中的问题点，以及相应的处理方法。

### Packing JAR
描述：单项目打包成可执行 Jar 方法  
{% highlight xml %}
<build>
  <plugins>
    <plugin>
      <artifactId>maven-compiler-plugin</artifactId>
      <version>3.3</version>
      <configuration>
      <source>1.8</source>
      <target>1.8</target>
      </configuration>
    </plugin>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-shade-plugin</artifactId>
      <version>2.3</version>
      <executions>
        <execution>
        <phase>package</phase>
        <goals>
          <goal>shade</goal>
        </goals>
        <configuration>
          <transformers>
            <transformer
            implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
              <manifestEntries>
                <Main-Class>cn.live.FoamValue</Main-Class>
              </manifestEntries>
            </transformer>
          </transformers>
          <artifactSet />
          <outputFile>${project.build.directory}/${project.artifactId}-${project.version}-fat.jar</outputFile>
        </configuration>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>
{% endhighlight xml %}

> **NOTE:** 执行方式  
> mvn clean package  
> java -jar target/fv-XXX-0.0.1-SNAPSHOT-fat.jar  

### Packing POM
描述：Parent 项目打包可执行 Jar 方法  

> **NOTE:** Parent 必须是 POM，所以和单项目打包方式不同。

{% highlight xml %}
<build>
  <plugins>
    <plugin>
      <artifactId>maven-compiler-plugin</artifactId>
      <version>3.3</version>
      <configuration>
      <source>1.8</source>
      <target>1.8</target>
      </configuration>
    </plugin>
    <plugin>
      <artifactId>maven-assembly-plugin</artifactId>
      <configuration>
        <appendAssemblyId>false</appendAssemblyId>
        <descriptorRefs>
          <descriptorRef>jar-with-dependencies</descriptorRef>
        </descriptorRefs>
        <archive>
        <manifest>
          <mainClass>cn.live.FoamValue</mainClass>
        </manifest>
        </archive>
      </configuration>
      <executions>
        <execution>
        <id>make-assembly</id>
        <phase>package</phase>
        <goals>
          <goal>assembly</goal>
        </goals>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>
{% endhighlight xml %}

> **NOTE:** 执行方式  
> mvn assembly:assembly  
> java -jar target/fv-XXX-0.0.1-SNAPSHOT-fat.jar  

### Profiles
描述：多环境打包方法

{% highlight xml %}
<profiles>
  <profile>
    <id>dev</id>
    <properties>
      <resource.filter>dev.properties</resource.filter>
    </properties>
  </profile>
  <profile>
    <id>test</id>
    <properties>
      <resource.filter>test.properties</resource.filter>
    </properties>
  </profile>
  <profile>
    <id>product</id>
    <properties>
      <resource.filter>product.properties</resource.filter>
    </properties>
  </profile>
  <profile>
    <id>beta</id>
    <activation>
      <activeByDefault>true</activeByDefault>
    </activation>
    <properties>
      <resource.filter>beta.properties</resource.filter>
    </properties>
  </profile>
</profiles>
{% endhighlight xml %}

> **NOTE:** 执行方式  
> mvn package -P dev

### dependencyManagement
描述：多模块Maven项目中，维护依赖一致性。

{% highlight xml %}
<dependencyManagement>
  <dependencies>
    <!-- Junit -->
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>${version.junit}</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
{% endhighlight xml %}

### mvn install:install-file
描述：部署私有 jar

> **NOTE:** 执行方式  
> mvn install:install-file -Dfile=xxx.jar -DgroupId=xxx -DartifactId=xxx -Dversion=xxx -Dpackaging=jar


### Deploy SNAPSHOT 版本
描述：SNAPSHOT 版本不能直接通过 mvn deploy 的方式上传到私有库

> **NOTE:** 执行方式  
> mvn deploy:deploy-file -DgroupId=com.foamvalue.xxx -DartifactId=xxx -Dversion=1.0.3-SNAPSHOT -DgeneratePom=true -Dpackaging=jar -DrepositoryId=server_id -Durl=http://xxx.xxx.xxx.xxx/nexus/content/repositories/snapshots -Dfile=xxx-1.0.3-SNAPSHOT.jar  

> **NOTE:** 执行方式2 -- 未验证  
> mvn install:install-file -Dfile=hsf.schema-edas1.0.1-SNAPSHOT.jar -DgroupId=com.alibaba -DartifactId=hsf.schema -Dversion=edas1.0.1-SNAPSHOT -Dpackaging=jar

**server_id：** server 标签中的 ID 属性
