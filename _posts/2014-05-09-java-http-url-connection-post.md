---
layout: post
title: Java 使用 HttpURLConnection 获取页面参数 - post 篇
author: 陈鑫杰
---

## 概述
Java 使用 HttpURLConnetion 类获取指定网页内容。

## 关键
* 明确目标 URL 地址，并确认该目标的请求方式（仅提供了 POST 方式）。
* 通过查看页面源代码，明确页面参数（即 name 值）。
* 拼接 URL? 后面的参数部分字符串，如有必要，请使用 Encode 对特殊字符进行编码。
* 使用 POST 请求方式，需要将参数部分字符串写到输出流。

最后，只需获取返回值，并按相关规则（自定义正则表达式）反序列化成对象即可。

## 代码
{% highlight java %}
package javaHttpURLConnection;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

/**
 * @ClassName: JavaHttpURLConnectionTest
 * @Description: TODO 苏州公交实时查询信息 http://www.szjt.gov.cn/apts/APTSLine.aspx
 * @author FOAMVALUE FOAMVALUE@LIVE.CN
 * @date 2014年5月9日 下午9:54:57
 *
 */
public class JavaHttpURLConnectionTest {

	// 线路状态 URL
	private static String APTSLine = "http://www.szjt.gov.cn/apts/APTSLine.aspx";
	// ASPX 视图指定参数
	private static final String __VIEWSTATE = "/wEPDwUJNDk3MjU2MjgyD2QWAmYPZBYCAgMPZBYCAgEPZBYCAgYPDxYCHgdWaXNpYmxlaGRkZLSbkOWJhbw7r9tBdPn33bPCSlJcKXww5ounfGoyhKl3";
	// ASPX 视图指定参数
	private static final String __EVENTVALIDATION = "/wEWAwLeub7XBwL88Oh8AqX89aoK1GKT3VlKUTd/xyQgZexCetMuo/i/LRDnisAyha1YxN0=";
	// 请求方法类型
	private static final String MOTHOD = "POST";
	// 初始化
	private static HttpURLConnection httpConn = null;

	/**
	 * @Title: getInfo
	 * @Description: TODO 根据公交车线路番号查询数据
	 * @param busNo 线路番号
	 * @return void
	 * @throws
	 */
	@SuppressWarnings("deprecation")
	public static void getInfo(int busNo) {
		// 拼接参数
		StringBuilder requestParameter = new StringBuilder();
		requestParameter.append("__VIEWSTATE=");
		requestParameter.append(URLEncoder.encode(__VIEWSTATE));
		requestParameter.append("&__EVENTVALIDATION=");
		requestParameter.append(URLEncoder.encode(__EVENTVALIDATION));
		requestParameter.append("&");
		requestParameter.append(URLEncoder.encode("ctl00$MainContent$LineName"));
		requestParameter.append("=");
		requestParameter.append(busNo);
		requestParameter.append("&");
		requestParameter.append(URLEncoder.encode("ctl00$MainContent$SearchLine"));
		requestParameter.append("=");
		requestParameter.append(URLEncoder.encode("搜索"));

		// 初始化字符缓冲输入流
		BufferedReader br = null;
		try {
			httpConn = (HttpURLConnection) new URL(APTSLine).openConnection();
			httpConn.setDoInput(true);
			httpConn.setDoOutput(true);
			httpConn.setUseCaches(false);
			//设置请求方法
			httpConn.setRequestMethod(MOTHOD);
			// 写出参数到输出流
			httpConn.getOutputStream().write(requestParameter.toString().getBytes());
			httpConn.getOutputStream().flush();
			httpConn.getOutputStream().close();

			br = new BufferedReader(new InputStreamReader(httpConn.getInputStream(), "utf-8"));
			String lineStr = null;
			/**
			 * 按行循环打印返回的 HTML 代码
			 * 可以使用正则表达式抽取需要的数据，并反序列化成相关对象
			 * */
			while ((lineStr = br.readLine()) != null) {
				System.out.println(lineStr.toString());
			}

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (br != null)
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
		}
	}

	/**
	 * @Title: main
	 * @Description: TODO 调用方法测试
	 * @param args
	 * @return void
	 * @throws
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		getInfo(2);
	}

}
{% endhighlight %}
