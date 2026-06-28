---
layout: post
title: Java 源码（一）：为什么 ThreadLocal 可以保证线程安全？
description: “Java 源码”系列是一个新的想法，希望以系列的方式，查漏补缺的把 Java 底层源码好好的阅读、思考一遍。
---

------

## 阅读

**Thread.Class 代码片段**

```
ThreadLocal.ThreadLocalMap threadLocals = null;

private void exit() {
  ...
  threadLocals = null;
  ...
}
```
每个线程被初始化之后，都会存在一个默认为 null 的 ThreadLocalMap 属性。这个属性会在线程结束前，被系统清除释放占用的内存。

**ThreadLocal 代码片段**

```
public T get() {
  Thread t = Thread.currentThread();
  ThreadLocalMap map = getMap(t);
  if (map != null) {
      ThreadLocalMap.Entry e = map.getEntry(this);
      if (e != null) {
          @SuppressWarnings("unchecked")
          T result = (T)e.value;
          return result;
      }
  }
  return setInitialValue();
}
private T setInitialValue() {
    T value = initialValue();
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null)
        map.set(this, value);
    else
        createMap(t, value);
    return value;
}
public void set(T value) {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null)
        map.set(this, value);
    else
        createMap(t, value);
}
ThreadLocalMap getMap(Thread t) {
    return t.threadLocals;
}

```
ThreadLocal<T> 存取的数据，存数据是依赖当前线程引用将数据 T 存放入 ThreadLocalMap 中。取数据也是依赖当前线程引用从 ThreadLocalMap 中读取数据 T。

也就是，数据 T 的存取是依赖当前线程引用进行的。

**ThreadLocal.ThreadLocalMap 代码片段**

```
static class ThreadLocalMap {

  static class Entry extends WeakReference<ThreadLocal<?>> {
      Object value;
      Entry(ThreadLocal<?> k, Object v) {
          super(k);
          value = v;
      }
  }

  private Entry[] table;

  ThreadLocalMap(ThreadLocal<?> firstKey, Object firstValue) {
      table = new Entry[INITIAL_CAPACITY];
      int i = firstKey.threadLocalHashCode & (INITIAL_CAPACITY - 1);
      table[i] = new Entry(firstKey, firstValue);
      size = 1;
      setThreshold(INITIAL_CAPACITY);
  }

  private void set(ThreadLocal<?> key, Object value) {
      Entry[] tab = table;
      int len = tab.length;
      int i = key.threadLocalHashCode & (len-1);
      for (Entry e = tab[i];
           e != null;
           e = tab[i = nextIndex(i, len)]) {
          ThreadLocal<?> k = e.get();
          if (k == key) {
              e.value = value;
              return;
          }
          if (k == null) {
              replaceStaleEntry(key, value, i);
              return;
          }
      }
      tab[i] = new Entry(key, value);
      int sz = ++size;
      if (!cleanSomeSlots(i, sz) && sz >= threshold)
          rehash();
  }

  private Entry getEntry(ThreadLocal<?> key) {
      int i = key.threadLocalHashCode & (table.length - 1);
      Entry e = table[i];
      if (e != null && e.get() == key)
          return e;
      else
          return getEntryAfterMiss(key, i, e);
  }

  private Entry getEntryAfterMiss(ThreadLocal<?> key, int i, Entry e) {
      Entry[] tab = table;
      int len = tab.length;
      while (e != null) {
          ThreadLocal<?> k = e.get();
          if (k == key)
              return e;
          if (k == null)
              expungeStaleEntry(i);
          else
              i = nextIndex(i, len);
          e = tab[i];
      }
      return null;
  }
```
ThreadLocalMap 虽然命名为 Map，但实际数据存储在 Entry 数组之中。Entry 又是一个特殊的静态内部类，继承了 ***弱引用*** 的 ThreadLocal<?> 类。

到这里 ThreadLocal.Class 的基本逻辑就差不多了。剩下的就是 ThreadLocalMap 中 Entry[] 的数据存取移除以及发生碰撞后如何寻找位置。因为多个线程计算得出的数组下标 i 存在碰撞的情况，所以多个线程存取数据效率并不是很高。

## 思考

**完整场景**

1. 初始化 ThreadLocal<T> threadLocal = new ThreadLocal<T>()
2. 存数据：threadLocal.set()
3. 取数据：threadLocal.get()
4. 线程运行时，GC 回收 T 占用内存
5. 线程结束时，GC 回收 T 占用内存

**内存泄漏案例**
```
ThreadLocal<My50MB> threadLocal = new ThreadLocal<>();

threadLocal.set(new My50MB());
System.gc();
// 正常回收

threadLocal.set(new My50MB());
threadLocal = null;
System.gc();
// 无法正常回收
```
**解决方式**

1. 主动调用 remove 方法
2. 调用 replaceStaleEntry 方法回收键为 null 的 Entry 对象的值

## 总结

1. ThreadLocal 并不能线程间共享数据
2. ThreadLocalMap 每个线程的单独数据实例
3. ThreadLocalMap 只能被持有它的线程访问
