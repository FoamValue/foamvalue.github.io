---
layout: post
title: Json Web Token 整理
keywords: JWT Token
description: 先以短篇开年，狗年旺旺。
tags: jwt
author: 陈鑫杰
---
## 概念
一种基于JSON的开放标准(RFC 7519)，用于创建声称若干声明的访问令牌。
通常由三部分组成: 头信息(header), 有效载荷(payload)和签名(signature)，按顺序使用点号(".")链接。

**头信息(header)**
声明类型，以及使用的算法。 例如： `{"alg":"HS256","typ":"JWT"}`

**有效载荷(payload)**
一组 claim 的值。claim包含 name 和 value。前者是 string 类型，后者可以是任意的 json 对象。
有三种类型：reserved claim，public claim 和 private claim。

***reserved claim*** 属于预定义好的。推荐但并不强制使用。
1. iss: jwt签发者
2. sub: jwt所面向的用户
3. aud: 接收jwt的一方
4. exp: jwt的过期时间(Unix时间戳)，这个过期时间必须要大于签发时间
5. nbf: 定义在什么时间之前，该jwt都是不可用的.
6. iat: jwt的签发时间
7. jti: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。

***public claim、private claim***  前者由签发者提供的公有信息，后者是服务端与客户端共享的信息。

**签名(signature)**
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```
***secret*** 是保存在jwt签发和验证的服务器。

------
## 流程
![](/assets/images/posts/json-web-token/jwt.png)

1. 浏览器向服务端发起登录的 POST 请求。
2. 服务端校验用户名跟密码后，生成 JWT。
3. 服务端返回 JWT 给浏览器。
4. 浏览器将 JWT 放入 Auth Header 中，并发起获取订单信息的请求。
5. 服务端接收到请求后，校验 signature 信息，并获取请求用户信息。
6. 服务端校验成功后，向浏览器返回订单信息请求内容。

------
## 运用
**安全性**
首先，jwt 内容是可以解密的。但是，伪造一个更高权限的签名是不可能的，因为 secret 是不可知的。
其次，jwt 存在过期时间的。所以，拷贝一个 jwt 最多也只能在某一段时间内使用，甚至只能使用一次。
然后，服务端可以根据重复使用的次数，直接锁定可能存在隐患的账号。强制使用修改密码或其他防范措施。
最后，判断请求来源方于 jwt 中信息的接收方是否一致等。

**扩展性**
首先，不在依靠服务端 session，实现了服务无状态。
然后，就能横向无限扩展了。

**复杂性**
系统安全要求越高，jwt 生成、校验的规则越复杂。

***选择合理的场景，使用 jwt 很重要。***
