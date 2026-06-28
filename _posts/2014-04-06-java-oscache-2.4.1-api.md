---
layout: post
title: Java OSCache 2.4.1
author: 陈鑫杰
published: false
---
<!-- API 包整体介绍 -->
<div id="overview">
 <h2>API 包介绍<a class="headerlink" href="#overview" title="API 包介绍"> ¶ </a></h2>
 <ul>
  <li><em> com.opensymphony.oscache.base </em>提供构成 OSCache 核心的基类和接口。
  </li>
  <li><em> com.opensymphony.oscache.base.algorithm </em>提供基于 Doug Lea 的 ConcurrentReaderHashMap 衍生的类，使用 OSCache 实现缓存算法。
  </li>
  <li><em> com.opensymphony.oscache.base.events </em>提供允许可插拔的时间处理程序纳入 OSCache 的基类和接口。
  </li>
  <li><em> com.opensymphony.oscache.base.persistence </em>提供持久化存储缓存对象的接口。
  </li>
  <li><em> com.opensymphony.oscache.extra </em>提供了一些在 OSCache 核心代码中不是必需的基本事件处理程序的实现，但形成了一个有用的基本日志记录或进一发步展的出发点。
  </li>
  <li><em> com.opensymphony.oscache.general </em>提供一个缓存的通用管理员类。
  </li>
  <li><em> com.opensymphony.oscache.hibernate </em>为 OSCache 提供 Hibernate 3.2 类。
  </li>
  <li><em> com.opensymphony.oscache.plugins.clustersupport </em>提供广播刷新事件，以便于 OSCache 能够支持在一个集群上的功能。
  </li>
  <li><em> com.opensymphony.oscache.plugins.diskpersistence </em>提供坚持化缓存对象到磁盘的支持。
  </li>
  <li><em> com.opensymphony.oscache.util </em>提供执行相当通用的功能和被 OSCache 所要求的实用工具类。
  </li>
  <li><em> com.opensymphony.oscache.web </em>提供构成基本的 OSCache Web 应用程序支持的类和接口。
  </li>
  <li><em> com.opensymphony.oscache.web.filter </em>提供允许 HTTP 响应被 OSCache 缓存的缓存过滤器（及其支持类）。
  </li>
  <li><em> com.opensymphony.oscache.web.tag </em>提供允许 OSCache 通过 JSP 自定义标记访问 JSP 页面缓存部分的标签库。
  </li>
 </ul>
<div>
<!-- com.opensymphony.oscache.base -->
<div id="com-opensymphony-oscache-base">
 <h2>com.opensymphony.oscache.base<a class="headerlink" href="#com-opensymphony-oscache-base" title="com.opensymphony.oscache.base"> ¶ </a></h2>
 <p>提供构成 OSCache 核心的基类和接口</p>
 <div id="com-opensymphony-oscache-base-interface">
  <h3>接口摘要<a class="headerlink" href="#com-opensymphony-oscache-base-interface" title="接口摘要">¶</a></h3>
  <ul>
   <li><em> EntryRefreshPolicy </em>当检查查看一个缓存条目已经过期时，接口允许自定义代码被调用。
   </li>
   <li><em> LifecycleAware </em>事件处理程序实现这使他们被通知，当一个缓存创建并且当它被销毁时。
   </li>
  </ul>
 </div>
 <div id="com-opensymphony-oscache-base-class">
 <h3>类摘要<a class="headerlink" href="#com-opensymphony-oscache-base-class" title="类摘要"> ¶ </a></h3>
  <ul>
   <li><em> AbstractCacheAdministrator </em>一个 AbstractCacheAdministrator 定义一个抽象的缓存管理员，实现相关于所有缓存配置的基本操作，包括分配任何配置的事件处理程序给缓存对象。
   </li>
   <li><em> Cache </em>提供一个缓存本身的接口。
   </li>
   <li><em> CacheEntry </em>一个 CacheEntry 实例代表缓存中的一个对象。
   </li>
   <li><em> Config </em>负责保存缓存配置属性。
   </li>
   <li><em> EntryUpdateState </em>持有一个缓存实体在正在生成（重新）的过程的状态。
   </li>
  </ul>
 </div>
 <div id="com-opensymphony-oscache-base-exception">
 <h3>异常摘要<a class="headerlink" href="#com-opensymphony-oscache-base-exception" title="异常摘要"> ¶ </a></h3>
  <ul>
   <li><em> FinalizationException </em>抛出 LifecycleAware 监听器不能够自己完成的。
   </li>
   <li><em> InitializationException </em>抛出 LifecycleAware 监听器不能够自己完成的。
   </li>
   <li><em> NeedsRefreshException </em>当从缓存中检索到一项已经过期时，此异常被抛出。
   </li>
  </ul>
 </div>
</div>
<!-- com.opensymphony.oscache.base.algorithm -->
<div id="com-opensymphony-oscache-base-algorithm">
 <h2>com.opensymphony.oscache.base.algorithm<a class="headerlink" href="#com-opensymphony-oscache-base-algorithm" title="com.opensymphony.oscache.base.algorithm"> ¶ </a></h2>
 <p>提供基于 Doug Lea 的 ConcurrentReaderHashMap 衍生的类，使用 OSCache 实现缓存算法。</p>

 <div id="com-opensymphony-oscache-base-algorithm-class">
  <h3>类摘要<a class="headerlink" href="#com-opensymphony-oscache-base-algorithm-class" title="类摘要"> ¶ </a></h3>
  <ul>
   <li><em> AbstractConcurrentReadCache </em>一个支持多并发读，但不包括写的哈希表版本。
   </li>
   <li><em> AbstractConcurrentReadCache.Entry </em>一个 AbstractConcurrentReadCache 碰撞列表实体。
   </li>
   <li><em> FIFOCache </em>FIFO（先入先出）基于队列算法的缓存。
   </li>
   <li><em> LRUCache </em>LRU（最近最少使用）算法的缓存。
   </li>
   <li><em> UnlimitedCache </em>一个可以包含没有缓存项数量上限的简单无限缓存。
   </li>
  </ul>
 </div>
</div>
<!-- com.opensymphony.oscache.base.events -->
<div id="com-opensymphony-oscache-base-events">
 <h2>com.opensymphony.oscache.base.events<a class="headerlink" href="#com-opensymphony-oscache-base-events" title="com.opensymphony.oscache.base.events"> ¶ </a></h2>
 <p>提供允许可插拔的时间处理程序纳入 OSCache 的基类和接口。</p>

 <div id="com-opensymphony-oscache-base-events-interface">
  <h3>接口摘要<a class="headerlink" href="#com-opensymphony-oscache-base-events-interface" title="接口摘要"> ¶ </a></h3>
  <ul>
   <li><em> CacheEntryEventListener </em>这是一个监听缓存实体事件的接口。
   </li>
   <li><em> CacheEventListener </em>这是一个缓存事件的基本接口。
   </li>
   <li><em> CacheMapAccessEventListener </em>这是一个监听缓存地图访问事件的接口。
   </li>
   <li><em> ScopeEventListener </em>这是一个监听范围事件的接口。
  </ul>
 </div>
 <div id="com-opensymphony-oscache-base-events-class">
  <h3>类摘要<a class="headerlink" href="#com-opensymphony-oscache-base-events-class" title="类摘要"> ¶ </a></h3>
  <ul>
   <li><em> CacheEntryEvent </em>CacheEntryEvent 是当一个事件发生在一个缓存实体（添加、更新、删除、刷新）时，一个对象被创建。
   </li>
   <li><em> CacheEntryEventType </em>这是所有可能发生在一个缓存实体或缓存实体集合的可能事件。
   </li>
   <li><em> CacheEvent </em>所有缓存事件的根事件类。
   </li>
   <li><em> CacheGroupEvent </em>CacheGroupEvent 是一个发生在缓存组级别（添加、更新、删除、刷新）的事件。
   </li>
   <li><em> CacheMapAccessEvent </em>这是一个代表缓存访问不同结果的枚举。
   </li>
   <li><em> CachePatternEvent </em>当一个模式已经应用于一个缓存时，CachePatternEvent 被触发。
   </li>
   <li><em> CachewideEvent </em>一个 CachewideEvent 代表，发生整个缓存，例如 一个缓存刷新或清除的事件。
   </li>
   <li><em> CachewideEventType </em>这是一个发生在缓存范围级别上的所有时间的枚举保持。
   </li>
   <li><em> ScopeEvent </em>当一个事件访问一个或所有范围时，一个 ScopeEvent 被创建。
   </li>
   <li><em> CacheMapAccessEvent </em>缓存地图访问事件。
   </li>
   <li><em> ScopeEventType </em>这是发生在作用域级别的所有可能事件的一个枚举。
   </li>
  </ul>
 </div>
</div>
<!-- com.opensymphony.oscache.base.persistence -->
<div id="com-opensymphony-oscache-base-persistence">
 <h2>com.opensymphony.oscache.base.persistence<a class="headerlink" href="#com-opensymphony-oscache-base-persistence" title="com.opensymphony.oscache.base.persistence"> ¶ </a></h2>
 <p>提供持久化存储缓存对象的接口。</p>
 <div id="com-opensymphony-oscache-base-persistence-interface">
  <h3>接口摘要<a class="headerlink" href="#com-opensymphony-oscache-base-persistence-interface" title="接口摘要"> ¶ </a></h3>
  <ul>
   <li><em> PersistenceListener </em>定义所需要的持久缓存数据的方法。
   </li>
  </ul>
 </div>
 <div id="com-opensymphony-oscache-base-persistence-class">
  <h3>类摘要<a class="headerlink" href="#com-opensymphony-oscache-base-persistence-class" title="类摘要"> ¶ </a></h3>
  <ul>
   <li><em> CachePersistenceException </em>当一个错误发生在 PersistenceListener 执行时，抛出异常。
   </li>
  </ul>
 </div>
</div>
<!-- com.opensymphony.oscache.extra -->
<div id="com-opensymphony-oscache-extra">
 <h2>com.opensymphony.oscache.extra<a class="headerlink" href="#com-opensymphony-oscache-extra" title="com.opensymphony.oscache.extra"> ¶ </a></h2>
 <p>Cache extra 包，提供了一些在 OSCache 核心代码中不是必需的基本事件处理程序的实现，形成了一个有用的基本日志记录或进一步发展的出发点。</p>
 <div id="com-opensymphony-oscache-extra-class">
  <h3>类摘要<a class="headerlink" href="#com-opensymphony-oscache-extra-class" title="类摘要"> ¶ </a></h3>
  <ul>
   <li><em> CacheEntryEventListenerImpl </em>实现了一个 CacheEntryListener。它使用事件去计算缓存中的执行的操作。
   </li>
   <li><em> CacheMapAccessEventListenerImpl </em>实现了一个 CacheMapAccessEventListenter。它使用事件去计算缓存 hit 和 miss。
   </li>
   <li><em> ScopeEventListenerImpl </em>实现了一个跟踪范围刷新事件的 ScopeEventListener。
   </li>
   <li><em> StatisticListenerImpl</em>一个使用了事件监听器的简单的统计报表的实现。
   </li>
  </ul>
 </div>
<div>
<!-- com.opensymphony.oscache.general -->
<div id="com-opensymphony-oscache-general">
 <h2>com.opensymphony.oscache.general<a class="headerlink" href="#com-opensymphony-oscache-general" title="com.opensymphony.oscache.general"> ¶ </a></h2>
 <p>提供一个缓存的通用管理员类。</p>
  <div id="com-opensymphony-oscache-general-class">
  <h3>类摘要<a class="headerlink" href="#com-opensymphony-oscache-general-class" title="类摘要"> ¶ </a></h3>
  <ul>
   <li></em> GeneralCacheAdministrator </em>一个 GeneralCacheAdministrator 创造，刷新和管理缓存。
   </li>
  </ul>
 </div>
</div>
<!-- com.opensymphony.oscache.hibernate -->
<div id="com-opensymphony-oscache-hibernate">
 <h2>com.opensymphony.oscache.hibernate<a class="headerlink" href="#com-opensymphony-oscache-hibernate" title="com.opensymphony.oscache.hibernate"> ¶ </a></h2>
 <p>为 OSCache 提供 Hibernate 3.2 类。</p>
 <div id="com-opensymphony-oscache-hibernate-class">
  <h3>类摘要<a class="headerlink" href="#com-opensymphony-oscache-hibernate-class" title="类摘要"> ¶ </a></h3>
  <ul>
   <li><em> OSCache </em>Hibernate 3.2 和 OpenSymphony OSCache 2.4 的缓存插件。
   </li>
   <li><em> OSCacheProvider </em>Hibernate 3.2 和 OpenSymphony OSCache 2.4 的缓存插件的提供者。
   </li>
  </ul>
 </div>
 </div>
<!-- com.opensymphony.oscache.plugins.clustersupport -->
<div id="com-opensymphony-oscache-plugins-clustersupport">
 <h2>com.opensymphony.oscache.plugins.clustersupport<a class="headerlink" href="#com-opensymphony-oscache-plugins-clustersupport" title="com.opensymphony.oscache.plugins.clustersupport"> ¶ </a></h2>
 <p>提供广播刷新事件，以便于 OSCache 能够支持在一个集群上的功能。</p>
 <div id="com-opensymphony-oscache-plugins-clustersupport-class">
  <h3>类摘要<a class="headerlink" href="#com-opensymphony-oscache-plugins-clustersupport-class" title="类摘要"> ¶ </a></h3>
  <ul>
   <li><em> AbstractBroadcastingListener </em>一个 CacheEntryEventListener 的实现。它在一个集群上广播刷新事件到其他缓存监听。注意这个监听器不能使用在连接缓存会话上。
   </li>
   <li><em> ClusterNotification </em>一个持有缓存事件相关信息的通知消息。这个类是可序列化的，允许通过网络发送到其他运行在一个集群上的机器。
   </li>
   <li><em> JavaGroupsBroadcastingListener </em>一个基于 JavaGroups 库的 AbstractBroadcastingListener 具体实现。这个类使用 JavaGroups 在一个集群上广播缓存刷新消息。
   </li>
   <li><em> JMS10BroadcastingListener </em>一个基于集群实现的 JMS 1.0.x。这是实现是独立的 JMS 提供者，一个使用非持久化信息的发布订阅协议。
   </li>
   <li><em> JMSBroadcastingListener </em>一个基于集群实现的 JMS。这是实现是独立的 JMS 提供者，一个使用非持久化信息的发布订阅协议。
   </li>
  </ul>
 </div>
 </div>
<!-- com.opensymphony.oscache.plugins.diskpersistence -->
<div id="com-opensymphony-oscache-plugins-diskpersistence">
 <h2>com.opensymphony.oscache.plugins.diskpersistence<a class="headerlink" href="#com-opensymphony-oscache-plugins-diskpersistence" title="com.opensymphony.oscache.plugins.diskpersistence"> ¶ </a></h2>
 <p>提供持久化缓存对象到磁盘的支持。</p>
 <div id="com-opensymphony-oscache-plugins-diskpersistence-class">
  <h3>类摘要<a class="headerlink" href="#com-opensymphony-oscache-plugins-diskpersistence-class" title="类摘要"> ¶ </a></h3>
  <ul>
   <li><em> AbstractDiskPersistenceListener </em>持久化缓存数据到磁盘。这个类的代码是完全非线程安全的，他的责任是使用这种持久化监听器来处理并发的缓存。
   </li>
   <li><em> DiskPersistenceListener </em>持久化缓存数据到磁盘。这个类的代码是完全非线程安全的，他的责任是使用这种持久化监听器来处理并发的缓存。
   </li>
   <li><em> HashDiskPersistenceListener </em>持久化缓存数据到磁盘。提供一个标准的键名的哈希值作为文件名。一个可配置的哈希算法被用来创建磁盘文件的缓存键摘要。这是允许更多明智的文件名而不是不友好的缓存键对象。
   </li>
  </ul>
 </div>
</div>
<!-- com.opensymphony.oscache.util -->
<div id="com-opensymphony-oscache-util">
 <h2>com.opensymphony.oscache.util<a class="headerlink" href="#com-opensymphony-oscache-util" title="com.opensymphony.oscache.util"> ¶ </a></h2>
 <p>提供执行相当通用的功能和被 OSCache 所要求的实用工具类。</p>
 <div id="com-opensymphony-oscache-util-class">
  <h3>类摘要<a class="headerlink" href="#com-opensymphony-oscache-util-class" title="类摘要">¶</a></h3>
  <ul>
   <li><em> ClassLoaderUtil </em>该代码直接从 OSCore 借来，但是这里是重复的，以避免必须添加一个依赖于整个 OSCore 库。
   </li>
   <li><em> FastCronParser </em>解析 cron 表达式并且确定在什么时间为表达式提供最新的匹配。
   </li>
   <li><em> StringUtil </em>提供用于处理字符串的常见实用方法。
   </li>
   <li><em> ValueSet
   </li>
  </ul>
 </div>
 </div>
 <!-- com.opensymphony.oscache.web -->
<div id="com-opensymphony-oscache-web">
 <h2>com.opensymphony.oscache.web<a class="headerlink" href="#com-opensymphony-oscache-web" title="com.opensymphony.oscache.web"> ¶ </a></h2>
 <p>提供构成基本的 OSCache Web 应用程序支持的类和接口。</p>
 <div id="com-opensymphony-oscache-web-interface">
  <h3>接口摘要<a class="headerlink" href="#com-opensymphony-oscache-web-interface" title="接口摘要"> ¶ </a></h3>
  <ul>
   <li><em> WebEntryRefreshPolicy </em>接口实现一个实体的刷新策略。
   </li>
  </ul>
 </div>
 <div id="com-opensymphony-oscache-web-class">
  <h3>类摘要<a class="headerlink" href="#com-opensymphony-oscache-web-class" title="类摘要">¶</a></h3>
  <ul>
   <li><em> CacheContextListener </em>一个 ServletCacheAdministrator 干净的启动和关闭以及其应用范围的缓存类。
   </li>
   <li><em> ServletCache </em>Cache 的一个简单的扩展，实现了一个会话绑定监听器，并且在解绑时删除该实体。
   </li>
   <li><em> ServletCacheAdministrator </em>一个 ServletCacheAdministrator 创建，刷新并管理缓存。
   </li>
  </ul>
 </div>
</div>
<!-- com.opensymphony.oscache.web.filter -->
<div id="com-opensymphony-oscache-web-filter">
 <h2>com.opensymphony.oscache.web.filter<a class="headerlink" href="#com-opensymphony-oscache-web-filter" title="com.opensymphony.oscache.web.filter"> ¶ </a></h2>
 <p>提供允许 HTTP 响应被 OSCache 缓存的缓存过滤器（及其支持类）。</p>
 <div id="com-opensymphony-oscache-web-filter-interface">
  <h3>接口摘要<a class="headerlink" href="#com-opensymphony-oscache-web-filter-interface" title="接口摘要"> ¶ </a></h3>
  <ul>
   <li><em> ICacheGroupsProvider </em>提供接口用于缓存组创建。
   </li>
   <li><em> ICacheKeyProvider</em>提供接口用于缓存键创建。
   </li>
  </ul>
 </div>
 <div id="com-opensymphony-oscache-web-filter-class">
  <h3>类摘要<a class="headerlink" href="#com-opensymphony-oscache-web-filter-class" title="类摘要"> ¶ </a></h3>
  <ul>
   <li><em> CacheFilter </em>CacheFilter 是一个过滤器，允许对后处理 servlet内容在服务器端进行缓存。
   </li>
   <li><em> CacheHttpServletResponseWrapper </em>CacheServletResponse 是一个响应的序列化表示。
   </li>
   <li><em> ExpiresRefreshPolicy </em>检查一个缓存过滤实体已经过期。
   </li>
   <li><em> ResponseContent </em>持有一个字节数组servlet响应，以便它可以在缓存中被持久化（并且因为这个类是可序列化的，可选择保留到磁盘）。
   </li>
   <li><em> SplitServletOutputStream </em>扩展基础ServletOutputStream类，以便于流在写入时，可以被捕获。
   </li>
  </ul>
 </div>
</div>
 <!-- com.opensymphony.oscache.web.tag -->
<div id="com-opensymphony-oscache-web-tag">
 <h2>com.opensymphony.oscache.web.tag<a class="headerlink" href="#com-opensymphony-oscache-web-tag" title="com.opensymphony.oscache.web.tag"> ¶ </a></h2>
 <p>提供允许 OSCache 通过 JSP 自定义标记访问 JSP 页面缓存部分的标签库。</p>
  <div id="com-opensymphony-oscache-web-tag-class">
  <h3>类摘要<a class="headerlink" href="#com-opensymphony-oscache-web-tag-class" title="类摘要"> ¶ </a></h3>
  <ul>
   <li><em> CacheTag </em>CacheTag 是一个标记，它允许对后处理 JSP 内容在服务器端进行缓存。
   </li>
   <li><em> FlushTag </em>FlushTag 使用 &lt;cache&gt; 创建来刷新缓存。
   </li>
   <li><em> GroupsTag </em>GroupsTag 是一个增加到一个 GroupTag 组中的一个逗号分隔的组列表。
   </li>
   <li><em> GroupTag </em>GroupTag 是一个可以增加到一个 CacheTag 中的一组标签。
   </li>
   <li><em> UseCachedTag </em>UseCacheTag 是一个告诉 &lt;cache&gt; 标签重复使用缓存体的标签。
   </li>
  </ul>
 </div>

</div>
</div>
