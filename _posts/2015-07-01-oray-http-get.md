---
layout: post
title: 花生壳（公网版）网页版实现
author: 陈鑫杰
---

花生壳，提供域名跟本地 IP 的映射服务，有点意思的技术。

## 吐槽
1. WNR500 无线路由器，设置动态 DNS 连接到花生壳，失败！  
2. 树莓派基于 ARM 内核，不太了解 x86\_64、i386、arm 之间的区别，失败！  
3. Linux 小白，搞不定交叉编译，失败！  

## 概述
想实现域名指向本地环境，进而做一些实验性工程。例如：微信、微博、OpenVPN、subVersion 等等...  
但是在实现过程中，从无线路由器自带动态 DNS 用不起来，到花生壳下载安装版安装不上去，再到花生壳下载安装版交叉编译失败，最后选择网页版实现。  
本文主要讲，如何实现花生壳的网页版。  

## 技术背景
基于 Spring，Ehcache 等技术实现。  

为了更好的清楚明白，可能需要了解以下内容：  
1. Spring 基本配置  
2. Ehcache 基本配置  
3. 定时器  
4. Get 请求  

## 实现说明
首先是阅览花生壳提供的官方文档：[软件下载][oray-http]、[花生壳:http协议说明][oray-http-wiki]。  
官方提供的两种方式实现：  
1. 使用 URL 验证  
2. 原始 HTTP GET 访问  
从难易程度来说，第一种最简单，第二种稍微比较复杂。  
从安全程度来说，第一种不安全，第二种稍微安全一些。  
在实现技术无压力的情况下，当然选择略复杂的第二种方法来实现。  

思路：  
通过定时器，设置时间间隔后，重复提交请求来保证域名对应的 IP 是有效的。（如果有固定外网 IP，那么直接去花生壳官网配置把。）但是，考虑到本地环境的资源有限的情况下，可能真的每个几分钟发送一个请求。同时，如果间隔的时间太长，有可能导致本地外网 IP 被刷新，没有及时更新到花生壳。  
为了解决上述的问题，引入缓存。首先，缓存需要一个失效时间，防止奇葩情况，即强制某个时间间隔（略微长一些，60 分钟以上）必须重新提交。其次，提交前，先从缓存获取 IP，比较存在改动后重新提交，更新成功后，将外网 IP 压入缓存。  

关键是两个时间点：  
1. 定时器，每隔几分钟先判断缓存，再判断是否提交请求；  
2. 缓存有效时间，每隔几小时直接清空缓存，必须重新提交请求。  

## Ehcache.xml 配置
{% highlight xml %}
  <!-- ORAY缓存 保存100分钟 -->
  <cache name="orayCache"
    maxEntriesLocalHeap="10"
    eternal="false"
    timeToIdleSeconds="6000"
    timeToLiveSeconds="6000"
    overflowToDisk="false"
    statistics="false">
  </cache>
{% endhighlight %}

## applicationContext.xml 配置
添加：  
1. xmlns:task="http://www.springframework.org/schema/task"  
2. xsi:schemaLocation="http://www.springframework.org/schema/task http://www.springframework.org/schema/task/spring-task.xsd"  
3. &lt;task:annotation-driven/&gt;  

第一、二项是添加在 beans 属性里，第三项放在 context:component-scan 之后。  

## HttpCommon.java
{% highlight java %}
package cn.live.common;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;
import java.util.Map;

/**
 * @ClassName: HttpCommon HTTP 操作
 * @Description:
 * @author: FoamValue
 * @mail: foamvalue@live.cn
 * @time: 2015年6月29日 下午10:57:52
 * @version: V1.0
 */
public class HttpCommon {

	/**
	 * Get 方式请求
	 * @param urlStr
	 * @param params
	 * @return
	 */
	public static String sendGetURL(String urlStr, Map<String, String> params) {
		String result = "";
        BufferedReader in = null;
		try {
			URL url = new URL(urlStr);
			// 打开和URL之间的连接
            URLConnection connection = url.openConnection();
            // 设置通用的请求属性
            if (params != null && !params.isEmpty()) {
            	for (String key : params.keySet()) {
            		connection.setRequestProperty(key, params.get(key));
            	}
            }
            // 建立实际的连接
            connection.connect();
            // 获取所有响应头字段
            Map<String, List<String>> map = connection.getHeaderFields();
            // 遍历所有的响应头字段
            for (String key : map.keySet()) {
                System.out.println(key + "--->" + map.get(key));
            }
            // 定义 BufferedReader输入流来读取URL的响应
            in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String line;
            while ((line = in.readLine()) != null) {
                result += line;
            }
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
            try {
                if (in != null) {
                    in.close();
                }
            } catch (Exception e2) {
                e2.printStackTrace();
            }
        }
		return result;
	}
}

{% endhighlight %}

## OrayTimer.java
{% highlight java %}
package cn.live.timer;

import java.util.HashMap;
import java.util.Map;

import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;

import org.apache.commons.lang.StringUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import cn.live.common.BaseCommon;
import cn.live.common.HttpCommon;

/**
 * @ClassName: OrayTimer 花生壳定时器
 * @Description: 采用网页版的方式刷新花生壳 IP
 * @author: FoamValue
 * @mail: foamvalue@live.cn
 * @time: 2015年6月29日 下午10:44:10
 * @version: V1.0
 */
@Component
public class OrayTimer {

	/**
	 * 开通花生壳服务的域名
	 */
	private final static String orayUrl = "ORAYURL";

	/**
	 * 花生壳帐号
	 */
	private final static String userName = "USERNAME";

	/**
	 * 花生壳密码
	 */
	private final static String password = "PASSWORD";

	/**
	 * 测试外网IP
	 */
	private final static String checkUrl = "http://ddns.oray.com/checkip";

	/**
	 * 缓存管理器
	 */
	private static CacheManager cacheManager =  CacheManager.create();

	/**
	 * 花生壳缓存
	 */
	private static Cache orayRefreshCache;

	/**
	 * 花生壳缓存KEY
	 */
	private final static String orayCacheKey = "_ORAYCACHEKEY";

	/**
	 * 刷新 IP
	 */
	@Scheduled(cron = "0 0/2 * * * ?")
	public static void refreshIP() {
		orayRefreshCache = cacheManager.getCache("orayCache");
		Element element = orayRefreshCache.get(orayCacheKey);
		String ip = null;
		if (element != null) ip = orayRefreshCache.get(orayCacheKey).getObjectValue().toString();
		String checkIp = checkIP();
		if (StringUtils.isBlank(ip) || !ip.equals(checkIp)) {
//			GET /ph/update?hostname=yourhostname&myip=ipaddress HTTP/1.0
//			Host: ddns.oray.com
//			Authorization: Basic base-64-authorization
//			User-Agent: Oray
			StringBuilder urlStr = new StringBuilder("http://ddns.oray.com/ph/update?hostname=")
				.append(orayUrl)
				.append("&myip=");

			Map<String, String> params = new HashMap<String, String>();
			params.put("Host", "ddns.oray.com");
			params.put("Authorization", "Basic " + BaseCommon.getBase64(userName + ":" + password));
			params.put("User-Agent", "Oray");

			String result = HttpCommon.sendGetURL(urlStr.toString(), params);

			// good 更新成功，域名的IP地址已经更新，同时会返回本次更新成功的IP，用空格隔开，如：good 1.2.3.4
			// nochg 更新成功，但没有改变IP。一般这种情况为本次提交的IP跟上一次的一样
			// notfqdn 未有激活花生壳的域名
			// nohost 域名不存在或未激活花生壳
			// abuse 请求失败，频繁请求或验证失败时会出现
			// !donator 表示此功能需要付费用户才能使用，如https
			// 911 系统错误
			if (result.contains("good") || result.contains("nochg")) {
				orayRefreshCache.put(new Element(orayCacheKey, checkIp));
			} else {
				orayRefreshCache.put(new Element(orayCacheKey, null));
			}
		}


	}

	/**
	 * 获取外网 IP
	 * @return IP 地址
	 */
	public static String checkIP() {
		String ip = null;
		try {
			String result = HttpCommon.sendGetURL(checkUrl, null);
			if (StringUtils.isNotBlank(result) && result.contains("Current IP Address: ")) {
				ip = result.substring(result.indexOf("Current IP Address: ") + "Current IP Address: ".length(), result.indexOf("</body>")).trim();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ip;
	}

	public static void main (String[] args) {
		refreshIP();
//		System.out.println(checkIP());
	}
}

{% endhighlight %}

综上，配置好缓存、定时器之后，就可以愉快的玩耍了。  
HTTP 请求包含两种：  
1. 花生壳更新请求  
2. 获取外网 IP 请求  

## 结束语

一直折腾，简直停不下来。

[oray-http]: http://hsk.oray.com/download/#type=http  
[oray-http-wiki]: http://open.oray.com/wiki/doku.php?id=%E6%96%87%E6%A1%A3:%E8%8A%B1%E7%94%9F%E5%A3%B3:http%E5%8D%8F%E8%AE%AE%E8%AF%B4%E6%98%8E  
