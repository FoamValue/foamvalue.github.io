---
layout: post
title: Bootstrap Table 重复加载 Bug
author: 陈鑫杰
---

Bootstrap 用于开发响应式布局、移动设备优先的 WEB 项目。在实际使用中，依然适用于企业级系统，可以减少很多前端框架搭建的时间。Bootstrap 除了自带的 CSS 和 JS 之外，还需要引入 JQuery。由此可以看出 Bootstrap 主要功能都是基于 JQuery 来实现的，这样我们在实际开发过程中，可以很简单的实现或者优化某些功能。
本文主要讲述了一个 Bootstrap bug 的处理，因为 Google 之后没有相关的解决方案，所以就把自己的解决方法贴上去。

## 概述
前面省略一大把文字……
在使用 Bootsrap 标签页和 JQuery.load() 来实现多页签的时候，遇到这个 bug。
Bootstrap Table 突然出现混乱，如下图：
![](bootstrap-table-reloading-bug/error.png)

### 代码
{% highlight html %}
<table id="User-Management-Table" data-url="<c:url value='/account/data'/>" data-height="520" data-toggle="table" data-pagination="true" data-side-pagination="server" data-search="true">
<thead>
  <tr>
    <th data-field="state" data-checkbox="true"></th>
    <th data-field="id" data-align="right" data-visible="false">ID</th>
    <th data-field="loginName" data-align="center">登录名称</th>
    <th data-field="salt" data-visible="false">盐值</th>
    <th data-field="createDate" data-align="center" data-formatter="dateFormatter">创建时间</th>
    <th data-field="enabled" data-align="center" data-formatter="enabledFormatter">是否启用</th>
  </tr>
</thead>
</table>
{% endhighlight %}

### 分析
Bootstrap Table 出现换乱的情况在触发 JQuery.load() 给页面标签的时候，也就是多个 Bootstrap Table 页面的引入造成的。
于是，假设是同 ID 引发的重复调用所造成的。但是经过修改测试，问题依旧存在。
最终经过各种测试，发现问题是引用 Bootstrap Table 脚本造成的。

## 解决方式
面对 Bootstrap Table 脚本引入之后，发生这种问题，只能是自己的打开方式不对。。。
于是换了一种实现方式，不使用 table 属性来调用 Bootstrap Table 功能，改成通过脚本来实现。这样就能绕过这个问题。

### 代码
{% highlight html %}
<table id="table"></table>
<script type="text/javascript">
// table
$(function () {
	$('#table').bootstrapTable({
	    method: 'get',
	    url: "<c:url value='/account/data'/>",
	    cache: false,
	    height: 520,
	    striped: true,
	    pagination: true,
	    sidePagination: 'server',
	    pageSize: 10,
	    pageList: [10, 25, 50, 100, 200],
	    search: true,
	    showColumns: true,
	    showRefresh: true,
	    minimumCountColumns: 2,
	    clickToSelect: true,
	    columns: [{
	        field: 'state',
	        checkbox: true
	    }, {
	        field: 'id',
	        title: 'id',
	        align: 'right',
	        valign: 'bottom',
	        visible: false,
	        sortable: false
	    }, {
	        field: 'loginName',
	        title: '登录名称',
	        align: 'center',
	        valign: 'middle',
	        sortable: false
	    }, {
	        field: 'salt',
	        title: '盐值',
	        align: 'left',
	        valign: 'top',
	        sortable: false
	    }, {
	        field: 'createDate',
	        title: '创建时间',
	        align: 'center',
	        valign: 'middle',
	        formatter: dateFormatter,
	    }, {
	        field: 'enabled',
	        title: '是否启用',
	        align: 'center',
	        valign: 'middle'
	    }]
	});
});
</script>
{% endhighlight %}

### 效果图
![](bootstrap-table-reloading-bug/success.png)

## 结束语
如果那天能兼容 JavaScript 脚本无压力的话，这种问题应该分分钟就能解决了吧（直改源码）。
最后，吐槽下 GitHub 的网络断断续续问题。

## 附录
英文网站： [Bootstrap][Bootstrap] [Bootstrap Table][Bootstrap Table]
中文网站： [Bootstrap][Bootcss]

[Bootstrap]: http://getbootstrap.com
[Bootstrap Table]: http://wenzhixin.net.cn/p/bootstrap-table/docs/examples.html
[Bootcss]: http://www.bootcss.com
