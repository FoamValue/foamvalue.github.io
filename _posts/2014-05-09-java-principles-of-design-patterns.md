---
layout: post
title: 浅谈：Java 的设计模式原则
author: 陈鑫杰
---

## 七大设计原则
* 开闭原则（Open Close Principle）
* 里氏代换原则（Liskov Substitution Principle）
* 依赖倒转原则（Dependence Inversion Principle）
* 接口隔离原则（Interface Segregation Principle）
* 组合/聚合复用原则（Composition/Aggregation Reuse Principle）
* 迪米特法则（Law Of Demeter）
* 单一职责原则（Single Responsibility Principle）

## 开闭原则（Open Close Principle）
Software entities should be open for extension, but closed for modification.  
软件实体应该对扩展开放，对修改关闭。

### Why
在软件生命周期中，随着时间的推移，软件原来的功能需求会发生一些变化，因此需要在不改动软件设计架构的基础上替换旧功能，实现新的功能需求。减少通过直接修改设计架构，所导致的系统不稳定因素，以及大范围测试等软件维护成本。

### How
关键在于抽象。
定义一个或多个抽象类或接口做为系统设计的抽象层。这样所有具体实现类都直接/间接的扩展了抽象层中的方法，系统可以不修改抽象层而实现所需的功能，从而满足了对修改关闭的要求。
由于抽象层可以扩展出一个或多个不同的具体实现类，满足不同的系统需求，从而满足了对扩展开放的要求。
综上所述，开闭原则实际上就是对可变性的封装原则。

* 一种可变性不应当散落在代码的很多角落，而应该被封装在一个类中。
* 一种可变性不应该与另一种可变性混在一起。

## 里氏代换原则（Liskov Substitution Principle）
If for each object o1 of type S there is an object o2 of type T such that for all programs P defined in terms of T, the behavior of P is unchanged when o1 is substituted for o2 then S is a subtype of T.  
如果每一个类型为 S 的对象 o1，都有类型为 T 的对象o2，使得 T 定义的所有程序 P，当 o1 被代换成 o2 时，程序 P 的行为没有发生变化，那么 S 是 T 的子类型。

### Why
有一个功能 P1，由类 A 完成。现需要将功能 P1 进行扩展，扩展后的功能为 P，其中 P 由原有功能 P1 与新功能 P2 组成，新功能 P2 由类 A 的子类 B 来完成，则子类 B 在完成新功能 P2 的同时，有可能会导致原有功能 P1 发生故障。

### How
子类可以扩展父类的功能，但不能改变父类原有的功能。

* 子类可以实现父类的抽象方法，但不能覆盖父类的非抽象方法。
* 子类可以增加自己特有的方法。
* 当子类的方法重载父类的方法时，方法的前置条件（即方法的形参）要比父类方法更为宽松。
* 当子类的方法实现父类的抽象方法时，方法的后置条件（即方法的返回值）要比父类更严格

## 依赖倒转原则（Dependence Inversion Principle）
High level modules should not depend upon low level modules. Both should depend upon abstractions. Abstractions should not depend upon details. Details should depend upon abstractions.  
高层模块不应该依赖于低层模块。两者都应该依赖于抽象。抽象不应该依赖于细节。细节应该依赖于抽象。

### Why
高层模块或细节层次，都是系统具体的实现和算法，经常会有变动。如果高层模块依赖于低层模块，那么高层模块的变动，势必会修改低层代码，低层代码的变动直接影响到系统整体架构的稳定性。同理，如果抽象依赖于细节，那么细节上的变动，势必会修改抽象层代码，抽象层代码的变动直接影响到整个系统的抽象逻辑。

### How
在面向对象的系统里，两个类之间可以发生三种不同的耦合关系：

* 零耦合（Nil Coupling）关系：两个类没有耦合关系。
* 具体耦合（Concrete Coupling）关系：具体性耦合发生在两个具体的（可实例化的）类之间，经由一个类对另一个具体类的直接引用造成。
* 抽象耦合（Abstract Coupling）关系：抽象耦合关系发生在一个具体类和一个抽象类（或接口）之间，使两个必须发生关系的类之间存在最大的灵活性。

依赖倒转原则，要求客户端依赖抽象耦合。

## 接口隔离原则（Interface Segregation Principle）
Clients should not be forced to depend upon interfaces that they don't use.  
客户端不应该被强迫依赖它们不需要的接口。  
The dependency of one class to another one should depend on the smallest possible interface.  
一个类到另一个的依赖应取决于尽可能小的接口上。

### Why
接口中添加了不必要的方法，会造成对接口的污染（Interface Contamination）。在节省接口数量的有好处下，却带来了接口维护的困难。为了重用被污染的接口，不得不实现并维护不必要的方法。

### How
Java 中存在两种接口的定义：

* Java 语言中有严格定义的 Interface 接口，例如：java.lang.Runnable。
* 逻辑上的抽象，即一个类型所具有的方法特征的集合，例如：Phone phone = new Phone()。

对应于这两种不同的接口，接口隔离原则的实现都需要保证接口尽可能的小（即只为一个字模块或业务逻辑提供服务），并且接口对内高度依赖，对外尽可能隔离。

## 组合/聚合复用原则（Composition/Aggregation Reuse Principle）
在面向对象设计中，有两种办法可以在不同环境中复用已有的设计和实现，即通过组合/聚合（has a）或通过继承（is a）。


### Why
与组合/聚合复用不同的是，继承有多个缺点：

* 继承复用破坏包装，因为继承将超类的实现细节暴露给子类。由于超类的内部细节常常是对子类透明，因此这种复用是透明的复用。
* 如果超类的实现发生改变，那么子类的实现也不得不发生改变。
* 从超类继承而来的实现是静态的，不可能在运行时间内发生改变，因此没有足够的灵活性。

### How
在一个新的对象里面使用一些已有的对象，使之成为新对象的一部分；新的对象通过向这些对象的委派达到复用已有功能的目的。简而言之，就是要尽量使用组合/聚合复用，尽量不要使用继承。  

## 迪米特法则（Law Of Demeter）
一个对象应该对其他对象保持最少的了解。  

### Why
类与类之间关系越密切，耦合度越大；当一个类发生改变时，对另一个类影响也很大。

### How
* 只与你直接的朋友们通信（Only talk to your immediate friends）。
* 不要跟“陌生人“说话（Don't talk to strangers）。
* 每一个软件单位对其他单位都只有最少的知识，而且局限于那些与本单位密切相关的软件单位。

## 单一职责原则（Single Responsibility Principle）
There should never be more than one reason for a class to change.  
不应该有一个以上导致类改变的原因。


### Why
当一个类负责两个不同的职责时，当其中一个职责发生改变时，对另一个职责会产生很大的影响。

### How
单一职责原则有一个问题，”职责“并没有一个明确的划分标准，如果把职责划分的太细，会导致接口和实现类的数量增加，反而提高了复杂的，降低了代码的可维护性。所以使用时，还需要具体情况具体分析。
