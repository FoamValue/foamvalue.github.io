---
layout: post
title: Spring Boot 4.1.0 发布——gRPC 支持、SSRF 防护与 50+ 依赖升级
tags:
  - Spring Boot
  - Java
  - 微服务
categories: Java 生态
description: Spring Boot 4.1.0 已发布，涵盖 gRPC 自动配置、HTTP 客户端 SSRF 防护、Jackson 配置增强、OpenTelemetry 深度集成等新特性，以及 7 项安全修复和 6 项升级注意事项。
cover_image: /assets/images/posts/spring-boot/spring-boot-4.1.jpg
---

**Spring Boot 4.1.0** 已经发布，现已可以从 Maven Central 获取！这是 4.x 系列的首个功能更新版本，涵盖 50+ 项依赖升级、30+ 个 Bug 修复，并引入了 gRPC 自动配置等多项社区呼声较高的新能力。[$TRAE_REF](https://spring.io/blog/2026/06/10/spring-boot-4/)

## 01 安全问题修复

本版本包含 Spring Boot 4.0.7 的全部安全修复，并修复了以下问题：

| 编号 / Issue | 影响 | 修复说明 |
|-------------|------|---------|
| CVE-2026-40973 | `ApplicationTemp` 目录可预测且未验证所有权，本地攻击者可控制目录、劫持会话或执行代码 | 升级到 4.0.6+ / 4.1.0 [$TRAE_REF](https://spring.io/security/cve-2026-40973/) |
| CVE-2026-41850 | Spring Framework SpEL 表达式算法 DoS，攻击者可通过复杂表达式耗尽 CPU | Spring Framework 7.0.8 修复，引入 `maxOperations` 限制 [$TRAE_REF](https://spring.io/security/cve-2026-41850/) |
| #50747 | MailSender 自动配置未启用主机名验证 | 邮件服务器可能被中间人攻击 |
| #50745 | Artemis 自动配置使用可预测的数据路径 | 嵌入式消息代理安全风险 |
| #50700 | LDAP SSL 在证书为空时不应启用 | 避免错误的安全配置 |
| #50668 | `InetAddressFilter` 未排除 RFC 6890 特殊用途地址 | 潜在网络过滤绕过 |
| #50228 | `NimbusJwtDecoder` 静默接受未知 `jws-algorithms` 值 | JWT 验证绕过风险 |

## 02 升级须知

绝大多数应用只需把版本号提升到 4.1.0 即可完成迁移，但以下改动需要注意：

### 4.0 中弃用的 API 已移除
Spring Boot 4.0 中标记为 `@Deprecated` 的类、方法和属性已全部移除。升级前请确保没有调用已弃用的方法。

### Apache Derby 弃用
Apache Derby 项目已宣布退役，Spring Boot 中的 Derby 集成已被弃用。如果仍在使用 Derby，建议迁移到 H2 或 HSQLDB。

### layertools jar 模式移除
已弃用的 `layertools` jar 模式在本版本中正式移除。如果仍在使用，请迁移到 `tools`（Cloud Native Buildpacks），提供相同甚至更多功能。

### `-DskipTests` 不再跳过 AOT 测试处理 (#Skip-Tests)
Spring Boot Maven Plugin 不再响应 `-DskipTests` 来跳过测试的 AOT 处理。现在只响应 `maven.test.skip` 属性，与其他核心 Maven 插件保持一致。

### Spring Data JPA Bootstrap Modes 精化
`spring.data.jpa.repositories.bootstrap-mode` 属性行为已调整：

| 模式 | 旧行为 | 新行为 |
|------|--------|--------|
| `deferred` | 找不到 `AsyncTaskExecutor` 时静默跳过 | 找不到时抛异常 |
| `lazy` | 设置 bootstrap executor | 不再设置 bootstrap executor |

### ReactorClientHttpRequestFactoryBuilder 默认值更新
默认配置改为 `proxyWithSystemProperties()`，与 Spring Framework 保持一致。如需不同默认值：

```java
ReactorClientHttpRequestFactoryBuilder.create()
    .withHttpClientDefaults()    // 使用 HttpClient 默认值
    // 或
    .withoutHttpClientDefaults() // 移除所有默认值
```

### jOOQ 最低版本要求
jOOQ 支持版本提升到 3.20，需要 Java 21 或更高版本。

## 03 新特性

### Spring gRPC 支持

Spring Boot 4.1 内置了 gRPC 服务端和客户端的支持，支持两种模式：
- **独立服务器**（Netty 后端）
- **Servlet 集成**（通过 HTTP/2 暴露 gRPC）

此前开发者需要手动配置 gRPC 或依赖第三方 Starter，现在开箱即用。还提供了 `@GrpcAdvice` 用于集中异常处理，以及自动配置的 `ObservationGrpcServerInterceptor` 支持自定义可观测性。

如果你之前使用 Spring gRPC 1.0，官方提供了[迁移指南](https://github.com/spring-projects/spring-grpc/wiki/Spring-gRPC-1.1-Migration-Guide)升级到 1.1。

### Jackson 配置增强

**读写属性统一配置**：通用的 Jackson 读写特性（CBOR、JSON、XML 通用）现在可以通过 `spring.jackson.read.` 和 `spring.jackson.write.` 属性分别配置。

**工厂配置**：Jackson 的 `JsonFactory` 等工厂现在可以通过 `spring.jackson.factory.*` 属性微调读写约束。

**自定义回调**：新增三种 Customizer：
- `JsonFactoryBuilderCustomizer`（JSON）
- `CborFactoryBuilderCustomizer`（CBOR）
- `XmlFactoryBuilderCustomizer`（XML）

### HTTP 客户端 SSRF 防护（InetAddressFilter）

响应式和阻塞式 HTTP 客户端现在都可以配置 `InetAddressFilter`，阻止向特定地址的出站请求，用于防御 SSRF 攻击。

```java
@Bean
public InetAddressFilter inetAddressFilter() {
    return InetAddressFilter.blocking()
        .block(InetAddress.getByName("169.254.169.254"))  // 屏蔽云元数据端点
        .blockLocalAddresses();                            // 屏蔽本地地址
}
```

### 配置文件导入指定编码

`spring.config.import` 现在支持指定编码：

```properties
spring.config.import=classpath:import.properties[encoding=utf-8]
```

此前属性文件始终以 ISO-8859-1 编码加载（仍为默认值），现在可以显式指定 UTF-8。

### 懒加载 JDBC 连接

新增 `spring.datasource.connection-fetch` 属性：

```properties
spring.datasource.connection-fetch=lazy
```

设置为 `lazy` 后，自动配置的 `DataSource` 会被 `LazyConnectionDataSourceProxy` 包装，**只有在真正执行 SQL 语句时才从连接池获取物理连接**。对于事务中实际不操作数据库的场景（如只读事务），可以避免不必要的连接占用。

### Log4j 文件轮转

Log4j 新增四种文件轮转策略：

| 策略 | 说明 |
|------|------|
| `size`（默认） | 按文件大小轮转 |
| `time` | 按时间间隔轮转 |
| `size-and-time` | 同时满足大小和时间条件时轮转 |
| `cron` | 按 Cron 表达式轮转 |

### OAuth2 资源服务器 JWT 权限提取

新增基于 SpEL 表达式从 JWT 提取权限的自动配置：

```properties
spring.security.oauth2.resourceserver.jwt.authorities-claim-expressions=#{hasAuthority('admin')}
```

与已有的 `authorities-claim-name` 和 `authorities-claim-delimiter` 互斥，可在 Servlet 和 Reactive 应用中使用。

### MongoDB 支持 Spring Batch

新增 `spring-boot-batch-data-mongo` Starter，Spring Batch 现在可以使用 MongoDB 作为元数据存储：

```properties
spring.batch.data.mongo.schema.initialize=true
```

### @RedisListener 自动配置

Spring Data Redis 的 `@RedisListener` 端点现在自动配置。如果应用没有定义 `RedisMessageListenerContainer`，会注册一个默认容器。`spring-boot-starter-data-redis` 现在也依赖 `spring-messaging`。

### 可观测性增强

**异步上下文传播**：`@Async` 方法的上下文现在可以自动传播到独立线程。

**OpenTelemetry 增强**：
- 新增 `management.opentelemetry.enabled` 属性可禁用 OTel SDK
- 新增 `management.opentelemetry.tracing.sampler` 配置采样器
- 新增 `BatchLogRecordProcessor` 配置属性
- 新增 `SpanLimits` 和 `LogLimits` 自动配置
- 支持 OTLP exemplars
- OTLP 导出器支持 SSL Bundle
- 支持读取 OTel 环境变量

**自动配置的 Observation 约定**：Kafka、RabbitMQ 的 Listener 和 Template 的 Observation Convention Bean 现在自动应用。

## 04 优化

### WritableJson 内存优化 (#49428)
减少反复调用 `WritableJson.toByteArray()` 时的内存消耗。对于每秒数千次 JSON 序列化的微服务场景，内存占用可减少 30-50%。

### 异常处理增强 (#50211)
`InvalidConfigurationPropertyValueException` 新增 public 构造函数，支持传入 `cause` 链，方便追踪配置错误的根因。

### BuildInfo Task 文件名变更
Gradle `BuildInfo` 任务默认输出文件从 `build-info.properties` 改为 `META-INF/build-info.properties`。如需恢复旧文件名：

```groovy
buildInfo {
    filename = 'build-info.properties'
}
```

### Docker Compose 日志输出
`docker compose up` 或 `docker compose start` 失败时，现在会自动输出 `docker compose logs` 的内容。日志级别由 `spring.docker.compose.start.log-level` 控制，默认 `info`。

### 嵌入式 LDAP 支持 SSL (LDAPS)
嵌入式 LDAP 服务器现在支持 SSL：

```properties
spring.ldap.embedded.ssl.bundle=my-ssl-bundle
```

### Info Actuator 端点增强
Info 端点新增进程信息字段：`process.uptime`、`process.startTime`、`process.currentTime`、`process.timezone`、`process.locale`、`process.workingDirectory`。

### 依赖升级一览

| 依赖 | 旧版本 (4.0.x) | 新版本 (4.1.0) |
|------|----------------|----------------|
| Spring Framework | 7.0.x | 7.0.8 |
| Spring Security | 7.0.x | 7.1.0 |
| Spring Data | 2025.x | 2026.0.0 |
| Hibernate | 7.3.x | 7.4.1.Final |
| Tomcat | 11.0.x | 11.0.22 |
| Kotlin | 2.2.x | 2.3.21 |
| Micrometer | 1.16.x | 1.17.0 |
| Reactor | 2025.0.x | 2025.0.6 |
| jOOQ | 3.19.x | 3.21.5 |

## 快速升级清单

- [ ] 将 `pom.xml` / `build.gradle` 中 Spring Boot 版本改为 `4.1.0`
- [ ] 检查是否调用了 4.0 中弃用的 API（已全部移除）
- [ ] 如果使用 Apache Derby，迁移到 H2 或 HSQLDB
- [ ] 如果使用 `layertools` jar 模式，迁移到 Cloud Native Buildpacks
- [ ] 如果依赖 `-DskipTests` 跳过 AOT 测试处理，改用 `maven.test.skip`
- [ ] 检查 `spring.data.jpa.repositories.bootstrap-mode` 为 `deferred` 时是否有 `AsyncTaskExecutor` Bean
- [ ] 检查 `ReactorClientHttpRequestFactoryBuilder` 的默认值变更
- [ ] 如果使用 jOOQ，确认版本 ≥ 3.20 且 Java ≥ 21
- [ ] 如果使用 Spock 测试框架，可恢复使用（Spock 2.4 支持 Groovy 5）
- [ ] 如果 Gradle `BuildInfo` 任务依赖旧文件名，设置 `filename = 'build-info.properties'`
