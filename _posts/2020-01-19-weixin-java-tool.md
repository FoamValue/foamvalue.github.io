---
layout: post
title: weixin-java-tool 3.6.0 源码学习
description: weixin-java-tool 是一个有着 18k+ star 的开源微信开发 Java SDK，支持包括微信支付、开放平台、小程序、企业微信、企业号和公众号等的后端开发。
---

## 初衷

多看看优秀的项目，转变自己的代码风格，提升代码能力。

## 架构

大致可以分为三大块：

1. weixin-java-common 错误码、API 接口、Session，以及通用工具类包。
2. weixin-java-cp（mp、miniapp、open、pay）面向不同的细分项目，例如企业号、公众号、小程序、开放平台、微信支付。
3. wx-java-cp（mp、miniapp、open、pay）-spring-boot-starter 面向 Spring Boot 的引入工程。

## 阅读

完整项目的篇幅很大，光看类文件的话，就特别的多。逐个类看下来，大致可以分为这四类：

1. 微信业务相关的实体类
2. Json 转换与微信业务相关的 Builder 扩展类
3. 具体微信业务实现方法
4. 常用的工具类

这么一拆分的话，整个项目的大体框架的就比较清晰。篇幅最大的是微信业务相关的实体类、Json 转换与微信业务相关的 Builder 扩展类。这是最基础且易懂的部分，不实际使用可以忽略。

### 源代码片段

这里摘录了一些片段，主要是有些实现是自己从来没有想到的，有一些是觉得比较关键的代码。

1. ConcurrentHashMap、AtomicBoolean、Thread 实现消息重复检测。

``` java

private final ConcurrentHashMap<String, Long> msgId2Timestamp = new ConcurrentHashMap<>();
private final AtomicBoolean backgroundProcessStarted = new AtomicBoolean(false);

protected void checkBackgroundProcessStarted() {
  if (this.backgroundProcessStarted.getAndSet(true)) {
    return;
  }
  Thread t = new Thread(new Runnable() {
    @Override
    public void run() {
      try {
        while (true) {
          Thread.sleep(WxMessageInMemoryDuplicateChecker.this.clearPeriod);
          Long now = System.currentTimeMillis();
          for (Map.Entry<String, Long> entry :
              WxMessageInMemoryDuplicateChecker.this.msgId2Timestamp.entrySet()) {
            if (now - entry.getValue() > WxMessageInMemoryDuplicateChecker.this.timeToLive) {
              WxMessageInMemoryDuplicateChecker.this.msgId2Timestamp.entrySet().remove(entry);
            }
          }
        }
      } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
      }
    }
  });
  t.setDaemon(true);
  t.start();
}

@Override
public boolean isDuplicate(String messageId) {
  if (messageId == null) {
    return false;
  }
  checkBackgroundProcessStarted();
  Long timestamp = this.msgId2Timestamp.putIfAbsent(messageId, System.currentTimeMillis());
  return timestamp != null;
}
```

2. 输入流响应处理。

``` Java
public class InputStreamResponseHandler implements ResponseHandler<InputStream> {
  public static final ResponseHandler<InputStream> INSTANCE = new InputStreamResponseHandler();
  private static final int STATUS_CODE_300 = 300;

  @Override
  public InputStream handleResponse(final HttpResponse response) throws IOException {
    final StatusLine statusLine = response.getStatusLine();
    final HttpEntity entity = response.getEntity();
    if (statusLine.getStatusCode() >= STATUS_CODE_300) {
      EntityUtils.consume(entity);
      throw new HttpResponseException(statusLine.getStatusCode(), statusLine.getReasonPhrase());
    }
    return entity == null ? null : entity.getContent();
  }
}
```

3. Builder 扩展类

```Java

public final class ImageBuilder extends BaseBuilder<ImageBuilder> {
  private String mediaId;
  public ImageBuilder() {
    this.msgType = WxConsts.KefuMsgType.IMAGE;
  }
  public ImageBuilder mediaId(String media_id) {
    this.mediaId = media_id;
    return this;
  }
  @Override
  public WxMpKefuMessage build() {
    WxMpKefuMessage m = super.build();
    m.setMediaId(this.mediaId);
    return m;
  }
}

public class WxMpKefuMessage implements Serializable {
  private static final long serialVersionUID = -9196732086954365246L;
  private String toUser;
  private String msgType;
  private String content;
  private String mediaId;
  ...

  ...
  public static ImageBuilder IMAGE() {
    return new ImageBuilder();
  }
}
```

4. 获取 Ticket 与消息发送

```Java
@Override
public String getAgentJsapiTicket(boolean forceRefresh) throws WxErrorException {
  if (forceRefresh) {
    this.configStorage.expireAgentJsapiTicket();
  }

  if (this.configStorage.isAgentJsapiTicketExpired()) {
    synchronized (this.globalAgentJsapiTicketRefreshLock) {
      if (this.configStorage.isAgentJsapiTicketExpired()) {
        String responseContent = this.get(this.configStorage.getApiUrl(GET_AGENT_CONFIG_TICKET), null);
        JsonObject jsonObject = new JsonParser().parse(responseContent).getAsJsonObject();
        this.configStorage.updateAgentJsapiTicket(jsonObject.get("ticket").getAsString(),
          jsonObject.get("expires_in").getAsInt());
      }
    }
  }

  return this.configStorage.getAgentJsapiTicket();
}

@Override
public String post(String url, String postData) throws WxErrorException {
  return execute(SimplePostRequestExecutor.create(this), url, postData);
}

@Override
public <T, E> T execute(RequestExecutor<T, E> executor, String uri, E data) throws WxErrorException {
  int retryTimes = 0;
  do {
    try {
      return this.executeInternal(executor, uri, data);
    } catch (WxErrorException e) {
      if (retryTimes + 1 > this.maxRetryTimes) {
        log.warn("重试达到最大次数【{}】", this.maxRetryTimes);
        throw new RuntimeException("微信服务端异常，超出重试次数");
      }
      WxError error = e.getError();
      if (error.getErrorCode() == -1) {
        int sleepMillis = this.retrySleepMillis * (1 << retryTimes);
        try {
          log.debug("微信系统繁忙，{} ms 后重试(第{}次)", sleepMillis, retryTimes + 1);
          Thread.sleep(sleepMillis);
        } catch (InterruptedException e1) {
          Thread.currentThread().interrupt();
        }
      } else {
        throw e;
      }
    }
  } while (retryTimes++ < this.maxRetryTimes);
  log.warn("重试达到最大次数【{}】", this.maxRetryTimes);
  throw new RuntimeException("微信服务端异常，超出重试次数");
}

protected <T, E> T executeInternal(RequestExecutor<T, E> executor, String uri, E data) throws WxErrorException {
  E dataForLog = DataUtils.handleDataWithSecret(data);
  if (uri.contains("access_token=")) {
    throw new IllegalArgumentException("uri参数中不允许有access_token: " + uri);
  }
  String accessToken = getAccessToken(false);
  String uriWithAccessToken = uri + (uri.contains("?") ? "&" : "?") + "access_token=" + accessToken;
  try {
    T result = executor.execute(uriWithAccessToken, data, WxType.CP);
    log.debug("\n【请求地址】: {}\n【请求参数】：{}\n【响应数据】：{}", uriWithAccessToken, dataForLog, result);
    return result;
  } catch (WxErrorException e) {
    WxError error = e.getError();
    if (error.getErrorCode() == 42001 || error.getErrorCode() == 40001 || error.getErrorCode() == 40014) {
      this.configStorage.expireAccessToken();
      return execute(executor, uri, data);
    }

    if (error.getErrorCode() != 0) {
      log.error("\n【请求地址】: {}\n【请求参数】：{}\n【错误信息】：{}", uriWithAccessToken, dataForLog, error);
      throw new WxErrorException(error, e);
    }
    return null;
  } catch (IOException e) {
    log.error("\n【请求地址】: {}\n【请求参数】：{}\n【异常信息】：{}", uriWithAccessToken, dataForLog, e.getMessage());
    throw new RuntimeException(e);
  }
}

```

## 个人总结

weixin-java-tool 项目在微信开发方面是非常给力的。如果需要微信开发的话，以 weixin-java-tool 作为 SDK 引入的话，可以节约很多的代码开发时间。

源代码也给我很多灵感，在后续的写代码过程中，可以参考，让代码能力变得更强。

最后，马上要过年了。祝大家新年快乐，在新的一年：好运连连、财源滚滚、福气满满！
