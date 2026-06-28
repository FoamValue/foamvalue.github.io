---
layout: post
title: Java MongoDB driver
author: 陈鑫杰
published: false
---
<div id="overview">
 <h2>API 包介绍<a class="headerlink" href="#overview" title="API 包介绍"> ¶ </a></h2>
<ul>
 <li><em> com.mongodb </em>核心文件包
 </li>
 <li><em> com.mongodb.gridfs </em>GridFS 工具>
 </li>
 <li><em> com.mongodb.tools </em>工具包
 </li>
 <li><em> com.mongodb.util </em>其他工具包
 </li>
 <li><em> org.bson </em>基础的 BSON 类和编码器/解码器
 </li>
 <li><em> org.bson.io </em>使用 BSON 对象实现 I/O 操作
 </li>
 <li><em> org.bson.types </em>各种 BSON 类型的实现类
 </li>
 <li><em> org.bson.util </em>使用 BSON 的其他工具
 </li>
</ul>
</div>
<div id="com-mongodb">
<h2>com.mongodb<a class="headerlink" href="#com-mongodb" title="com.mongodb"> ¶ </a></h2>
 <!-- 接口摘要 -->
 <div id="com-mongodb-interface">
  <h3>接口摘要<a class="headerlink" href="#com-mongodb-interface" title="接口摘要"> ¶ </a></h3>
  <ul>
   <li><em> ConnectionPoolStatisticsMBean </em>mongo 连接池的一个标准 MXBean 接口，用于 Java 6 及以上虚拟机。
   </li>
   <li><em> Cursor </em>
   </li>
   <li><em> DBCallback </em>DB 的回调接口
   </li>
   <li><em> DBCallbackFactory </em>DBCallback 工厂接口
   </li>
   <li><em class="deprecated"> DBConnector </em>这个类不是公共 API 的一部分。
   </li>
   <li><em> DBDecoder </em>解码器
   </li>
   <li><em> DBDecoderFactory </em>解码器工厂
   </li>
   <li><em> DBEncoder </em>编码器
   </li>
   <li><em> DBEncodeFactory </em>编码器工厂
   </li>
   <li><em> DBObject </em>可以保存到数据库的一个键值对映射
   </li>
   <li><em class="deprecated"> Java5MongoConnectionPoolMBean </em>这个类会在驱动的 3.x 版本被删除。
   </li>
   <li><em class="deprecated"> MongoConnectionPoolMXBean </em>这个类会在驱动的 3.x 版本被删除
   </li>
 </div>

 <!-- 类摘要 -->
 <div id="com-mongodb-class">
  <h3>类摘要<a class="headerlink" href="#com-mongodb-class" title="类摘要"> ¶ </a></h3>
  <ul>
   <li><em> AggregationOptions </em>应用于一个总操作的选项
   </li>
   <li><em> AggregationOptions.Builder </em>选项类
   </li>
   <li><em> AggregationOutput </em>
   </li>
   <li><em> BasicDBList </em>mongo 特定的一个 BSON 列表的基本实现
   </li>
   <li><em> BasicDBObject </em>mongo 特定的一个 BSON 对象的基本实现
   </li>
   <li><em> BasicDBObjectBuilder </em>构建复杂对象的使用工具，例如：BasicDBObjectBuilder.start().add( "name" , "eliot" ).add( "number" , 17 ).get()
   </li>
   <li><em> BulkUpdateRequestBuilder </em>一个简单更新请求构建器
   </li>
   <li><em> BulkWriteError </em>表示一项被包含在一批量写操作中的错误
   </li>
   <li><em> BulkWriteOperation </em>批量写操作
   </li>
   <li><em> BulkWriteRequestBuilder </em>一个简单写请求构造器
   </li>
   <li><em> BulkWriteResult </em>一个成功的批量写操作的结果
   </li>
   <li><em> BulkWriteUpsert </em>表示一个插入导致的批量写操作的更新请求
   </li>
   <li><em> Bytes </em>保存线协议的定义
   </li>
   <li><em> CommandResult </em>一个 getLastError() 调用和其他命令结果的简单包装
   </li>
   <li><em> DB </em>一个 MongoDB 集群的逻辑数据库的线程安全的客户端视图
   </li>
   <li><em> DBAddress </em>表示一个数据库地址
   </li>
   <li><em class="deprecated"> DBApiLayer </em>
   </li>
   <li><em> DBCollection </em>提供了一个数据库集合的框架实现
   </li>
   <li><em> DBCursor </em>一个在数据库结果之上的迭代器
   </li>
   <li><em class="deprecated"> DBPointer </em>
   </li>
   <li><em class="deprecated"> DBPortPool </em>
   </li>
   <li><em> DBRef </em>扩展 DBRefBase
   </li>
   <li><em> DBRefBase </em>表示一个数据库引用，指向被存储在数据库中的一个对象
   </li>
   <li><em class="deprecated> DBTCPConnector </em>
   </li>
   <li><em> DefaultDBCallback </em>这个类覆盖 BasicBSONCallback 去实现具体到数据库的一些额外的功能
   </li>
   <li><em> DefaultDBDecoder </em>
   </li>
   <li><em> DefaultDBEncoder </em>
   </li>
   <li><em> GroupCommand </em>这个类聚合了一组操作参数，来建立底层的命令对象
   </li>
   <li><em class="deprecated"> InUseConnectionBean </em>
   </li>
   <li><em> LazyDBCallback </em>
   </li>
   <li><em> LazyDBDecoder </em>
   </li>
   <li><em> LazyDBEncoder </em>只能对类型为 LazyDBObject 的 BSONObject 实例编码的编码器
   </li>
   <li><em> LazyDBList </em>
   </li>
   <li><em> LazyDBObject </em>
   </li>
   <li><em> LazyWriteableDBCallback </em>
   </li>
   <li><em> LazyWriteableDBDecoder </em>
   </li>
   <li><em> LazyWriteableDBObject </em>
   </li>
   <li><em> MapReduceCommand </em>这个类聚合了一组 map/reduce 操作参数，来构建底层命令对象
   </li>
   <li><em> MapReduceOutput </em>代表一个 map/reducef 操作的结果
   </li>
   <li><em> Mongo </em>一个以内部连接池连接的数据库
   </li>
   <li><em> Mongo.Holder </em>
   </li>
   <li><em> MongoClient </em>一个内部连接池的 MongoDB 客户端
   </li>
   <li><em> MongoClientOptions </em>控制一个 MongoClient 行为的各种设置
   </li>
   <li><em> MongoClientOptions.Builder </em>构造器
   </li>
   <li><em> MongoClientURI </em>代表一个可以被用来创建 MongoClient 实例的 URL
   </li>
   <li><em> MongoCredential </em>
   </li>
   <li><em class="deprecated"> MongoOptions </em>
   </li>
   <li><em> MongoURI </em>代表一个可以用来创建 Mongo 实例的 URL
   </li>
   <li><em> ParallelScanOptions </em>用于并行采集扫描的选项
   </li>
   <li><em> ParallelScanOptions.Builder </em>选项的构造器
   </li>
   <li><em> QueryBuilder </em>创建 DBObject 查询的实用工具
   </li>
   <li><em> QueryOperators </em>各种查询操作的 MongoDB 关键字
   </li>
   <li><em class="deprecated"> RawDBObject </em>
   </li>
   <li><em> ReadPreference </em>
   </li>
   <li><em class="deprecated"> ReadPreference.TaggedReadPreference </em>
   </li>
   <li><em> ReflectionDBObject </em>
   </li>
   <li><em> ReflectionDBObject.JavaWrapper </em>
   </li>
   <li><em> ReplicaSetStatus </em>保留副本集的状态
   </li>
   <li><em> ServerAddress </em>服务器地址
   </li>
   <li><em> TaggableReadPreference </em>
   </li>
   <li><em> WriteConcern </em>
   </li>
   <li><em> WriteConcern.Majority </em>
   </li>
   <li><em> WriteConcernError </em>
   </li>
   <li><em> WriteResult </em>
   </li>
  </ul>
 </div>

 <!-- 枚举摘要 -->
 <div id="com-mongodb-enum">
  <h3>枚举摘要<a class="headerlink" href="#com-mongodb-enum" title="枚举摘要"> ¶ </a></h3>
 <ul>
  <li><em> AggretionOptions.OutputMode </em>
  </li>
  <li><em> MapReduceCommand.OutputType </em>
 </div>

 <!-- 异常摘要 -->
 <div id="com-mongodb-exception">
  <h3>异常摘要<a class="headerlink" href="#com-mongodb-exception" title="异常摘要"> ¶ </a></h3>
 <ul>
  <li><em> BulkWriteException </em>一个表示所有关于批量写操作的例外
  </li>
  <li><em> CommandFailureException </em>一个表示失败命令的例外
  </li>
  <li><em class="deprecated"> DBPortPool.ConnectionWaitTimeOut </em>
  </li>
  <li><em class="deprecated"> DBPortPool.NoMoreConnection </em>
  </li>
  <li><em class="deprecated"> DBPortPool.SemaphoresOut </em>
  </li>
  <li><em> DuplicateKeyException </em>WriteConcernException 的子类代表一个重复键异常
  </li>
  <li><em> MongoClientException </em>
  </li>
  <li><em> MongoCursorNotFoundException </em>
  </li>
  <li><em> MongoException.DuplicateKey </em>
  </li>
  <li><em> MongoException.Network </em>
  </li>
  <li><em> MongoExecutionTimeoutException </em>
  </li>
  <li><em> MongoIncompatibleDriverException </em>
  </li>
  <li><em> MongoInternalException </em>
  </li>
  <li><em> MongoInterruptedException </em>
  </li>
  <li><em> MongoServerSelectionException </em>
  </li>
  <li><em> MongoSocketException </em>
  </li>
  <li><em> MongoTimeoutException </em>
  </li>
  <li><em> MongoWaitQueueFullException </em>
  </li>
  <li><em> UnacknowledgedWriteException </em>
  </li>
  <li><em> WriteConcernException </em>
  </li>
 </ul>
 </div>
<div>

<div id="com-mongodb-gridfs">
 <h2>com.mongodb.gridfs<a class="headerlink" href="#com-mongodb-gridfs" title="com.mongodb.gridfs"> ¶ </a></h2>
 <h>GridFS 工具。用于在 MongoDB 中存储文件。
 </h>
 <div id="com-mongodb-gridfs-class">
  <h3>类摘要<a class="headerlink" href="#com-mongodb-gridfs-class" title="类摘要"> ¶ </a></h3>
 </div>
 <ul>
  <li><em> CLI </em>Gridfs 的一个简单的 CLI
  </li>
  <li><em> GridFS </em>GridFS v1.0 的实现
  </li>
  <li><em> GridFSDBFile </em>检索一个 GridFS 文件的元数据和内容
  </li>
  <li><em> GridFSFile </em>抽象类代表一个 GridFS 文件
  </li>
  <li><em> GridFSInputFile </em>表示一个 GridFS 被写入到数据库的操作
  </li>
 </ul>
 </div>
</div>

<div id="com-mongodb-tools">
 <h2>com.mongodb.tools<a class="headerlink" href="#com-mongodb-tools" title="com.mongodb.tools"> ¶ </a></h2>
 <div id="com-mongodb-tools-class">
  <h3>类摘要<a class="headerlink" href="#com-mongodb-tools-class" title="类摘要"> ¶ </a></h3>
 <ul>
  <li><em class="deprecated"> ConnectionPoolStat </em>
  </li>
 </ul>
 </div>
</div>

<div id="com-mongodb-util">
 <h2>com.mongodb.util<a class="headerlink" href="#com-mongodb-util" title="com.mongodb.util"> ¶ </a></h2>
 <div id="com-mongodb-util-interface">
  <h3>接口摘要<a class="headerlink" href="#com-mongodb-util-interface" title="接口摘要"> ¶ </a></h3>
  <ul>
   <li><em> ObjectSerializer </em>描述序列化一个对象为字符串的方法
   </li>
  </ul>
 </div>
 <div id="com-mongodb-util-class">
  <h3>类摘要<a class="headerlink" href="#com-mongodb-util-class" title="类摘要"> ¶ </a></h3>
  <ul>
   <li><em class="deprecated"> Args </em>
   </li>
   <li><em class="deprecated"> Base64Codec </em>
   </li>
   <li><em class="deprecated"> ConnectionPoolStatisticsBean </em>
   </li>
   <li><em class="deprecated"> FastStack&lt;T&gt; </em>
   </li>
   <li><em class="deprecated"> Hash </em>
   </li>
   <li><em class="deprecated"> IdentitySet&lt;T&gt; </em>
   </li>
   <li><em> JSON </em>JSON 序列化和反序列化
   </li>
   <li><em> JSONCallback </em>
   </li>
   <li><em> JSONSerializers </em>定义静态方法获取 ObjectSerializer 产生各种不同的 JSON 实例
   </li>
   <li><em class="deprecated"> OptionMap </em>
   </li>
   <li><em class="deprecated"> SimplePool&lt;T&gt; </em>
   </li>
   <li><em class="deprecated"> StringBuilderPool </em>
   </li>
   <li><em class="deprecated"> StringParseUtil </em>
   </li>
   <li><em class="deprecated"> ThreadPool&lt;T&gt; </em>
   </li>
   <li><em class="deprecated"> ThreadUtil </em>
   </li>
   <li><em class="deprecated"> TimeConstants </em>
   </li>
   <li><em class="deprecated"> UniqueList&lt;T&gt; </em>
   </li>
   <li><em> Util </em>
   </li>   
   <li><em class="deprecated"> WeakBag&lt;T&gt; </em>
   </li>
  </ul>
 </div>
 <div id="com-mongodb-util-exception">
  <h3>异常摘要<a class="headerlink" href="#com-mongodb-util-exception" title="异常摘要"> ¶ </a></h3>
  <ul>
   <li><em> JSONParseException </em>无效 JSON 被解析器解析时抛出
   </li>
  </ul>
 <div>
</div>

<div id="org-bson">
 <h2>org.bson<a class="headerlink" href="#org-bson" title="org.bson"> ¶ </a></h2>
 <div id="org-bson-interface">
  <h3>接口摘要<a class="headerlink" href="#org-bson-interface" title="接口摘要"> ¶ </a></h3>
  <ul>
   <li><em> BSONCallback </em>
   </li>
   <li><em> BSONDecoder </em>
   </li>
   <li><em> BSONEncoder </em>
   </li>
   <li><em> BSONObject </em>一个能被保存到数据库中的键值映射
   </li>
   <li><em> Transformer </em>
   </li>
  </ul>
 </div>
 <div id="org-bson-class">
  <h3>类摘要<a class="headerlink" href="#org-bson-class" title="类摘要"> ¶ </a></h3>
  <ul>
   <li><em> BasicBSONCallback </em>
   </li>
   <li><em> BasicBSONDecoder </em>
   </li>
   <li><em> BasicBSONEncoder </em>
   </li>
   <li><em> BasicBSONObject </em>
   </li>
   <li><em> BSON </em>
   </li>
   <li><em class="deprecated"> BSONLazyDecoder </em>
   </li>
   <li><em> EmptyBSONCallback </em>
   </li>
   <li><em class="deprecated"> KeyCachingLazyBSONObject </em>
   </li>
   <li><em> LazyBSONCallback </em>
   </li>
   <li><em> LazyBSONDecoder </em>
   </li>
   <li><em> LazyBSONList </em>
   </li>
   <li><em> LazyBSONObject </em>
   </li>
   <li><em class="deprecated"> LazyDBList </em>
   </li>
   <li><em class="deprecated"> NewBSONDecoder </em>
   </li>
  </ul>
 </div>
 <div id="org-bson-exception">
  <h3>异常摘要<a class="headerlink" href="#org-bson-exception" title="异常摘要"> ¶ </a></h3>
  <ul>
   <li><em> BSONException </em>
   </li>
  </ul>
 </div>
</div>

<div id="org-bson-io">
 <h2>org.bson.io<a class="headerlink" href="#org-bson-io" title="org.bson.io"> ¶ </a></h2>
 实现使用 BSON 对象的 I/O 操作
 <div id="org-bson-io-class">
  <h3>类摘要<a class="headerlink" href="#org-bson-io-class" title="类摘要"> ¶ </a></h2>
  <ul>
   <li><em> BasicOutputBuffer </em>
   </li>
   <li><em> Bits </em>
   </li>
   <li><em> BSONByteBuffer </em>伪字节缓冲区
   </li>
   <li><em> OutputBuffer </em>
   </li>
   <li><em class="deprecated"> PoolOutputBuffer </em>
   </li>
  </ul>
 </div>

</div>
<div id="org-bson-types">
 <h2>org.bson.types<a class="headerlink" href="#org-bson-types" title="org.bson.types"> ¶ </a></h2>
 实现各种 BSON 类型
 <div id="org-bson-types-class">
  <h3>类摘要<a class="headerlink" href="#org-bson-types-class" title="类摘要"> ¶ </a></h2>
  <ul>
   <li><em> BasicBSONList </em>工具类允许创建 DBObject 数组
   </li>
   <li><em> Binary </em>
   </li>
   <li><em> BSONTimestamp </em>
   </li>
   <li><em> Code </em>
   </li>
   <li><em> CodeWScope </em>
   </li>
   <li><em> MaxKey </em>
   </li>
   <li><em> MinKey </em>
   </li>
   <li><em> ObjectId </em>
   </li>
   <li><em> Symbol </em>
   </li>
  </ul>
 </div>
</div>

<div id="org-bson-util">
 <h2>org.bson.util<a class="headerlink" href="#org-bson-util" title="org.bson.util"> ¶ </a></h2>
 <div id="org-bson-util-class">
  <h3>类摘要<a class="headerlink" href="#org-bson-util-class" title="类摘要"> ¶ </a></h2>
  <ul>
   <li><em class="deprecated"> Assertions </em>
   </li>
   <li><em> ClassMap&lt;T$gt; </em>
   </li>
   <li><em class="deprecated"> SimplePool&lt;T&gt; </em>
   </li>
   <li><em> StringRangeSet </em>
   </li>
  </ul>
 </div>
</div>
