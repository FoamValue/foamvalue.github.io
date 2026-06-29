---
layout: post
title: 树形/图形搜索（Java）
keywords: java 算法
description: 内容整理自互联网。
tags: java 算法
author: 陈鑫杰
---

## 广度优先搜索算法

广度优先搜索算法（英语：Breadth-First-Search，缩写为BFS）

BFS是从根节点开始，沿着树的宽度遍历树的节点。如果所有节点均被访问，则算法中止。

**open-closed**

从算法的观点，所有因为展开节点而得到的子节点都会被加进一个先进先出的队列中。一般的实现里，其邻居节点尚未被检验过的节点会被放置在一个被称为 open 的容器中（例如链表），而被检验过的节点则被放置在被称为 closed 的容器中。（open-closed表）


![Animated_BFS](/assets/images/posts/algorithm-study/Animated_BFS.gif)

**算法**

1. 首先将根节点放入队列中。

2. 从队列中取出第一个节点，并检验它是否为目标。

	如果找到目标，则结束搜寻并回传结果。

	否则将它所有尚未检验过的直接子节点加入队列中。

3. 重复步骤2。

4. 若队列为空，表示整张图都检查过了——亦即图中没有欲搜寻的目标。结束搜寻并回传“找不到目标”。

**复杂度**

时间复杂度： O(|V|+|E|) = O(b^d)
空间复杂度： O(|V|+|E|) = O(b^d)

**算法应用**

寻找图中所有连接元件（Connected Component）。一个连接元件是图中的最大相连子图。

寻找连接元件中的所有节点。

寻找非加权图中任两点的最短路径。

测试一图是否为二分图。

------

## 深度优先搜索算法

深度优先搜索算法（英语：Depth-First-Search，简称DFS）

沿着树的深度遍历树的节点，尽可能深的搜索树的分支。当节点v的所在边都己被探寻过，搜索将回溯到发现节点v的那条边的起始节点。这一过程一直进行到已发现从源节点可达的所有节点为止。如果还存在未被发现的节点，则选择其中一个作为源节点并重复以上过程，整个进程反复进行直到所有节点都被访问为止。

![Depth-first-tree.svg](/assets/images/posts/algorithm-study/Depth-first-tree.svg.png)

**算法**

1. 首先将根节点放入队列中。

2. 从队列中取出第一个节点，并检验它是否为目标。

	如果找到目标，则结束搜寻并回传结果。

	否则将它某一个尚未检验过的直接子节点加入队列中。

3. 重复步骤2。

5. 如果不存在未检测过的直接子节点。

	将上一级节点加入队列中。

	重复步骤2。

6. 若队列为空，表示整张图都检查过了——亦即图中没有欲搜寻的目标。结束搜寻并回传“找不到目标”。

**复杂度**

时间复杂度： O(b^m)
空间复杂度： O(bm)

------

**Java**

节点对象

```
public class GraphEdge {
	private GraphNode nodeLeft;

	private GraphNode nodeRight;

	/**
	 * @param nodeLeft
	 *            边的左端
	 * @param nodeRight
	 *            边的右端
	 */
	public GraphEdge(GraphNode nodeLeft, GraphNode nodeRight) {
		this.nodeLeft = nodeLeft;
		this.nodeRight = nodeRight;
	}

	public GraphNode getNodeLeft() {
		return nodeLeft;
	}

	public GraphNode getNodeRight() {
		return nodeRight;
	}
}
```

树/图对象

```
public class GraphNode {
	public List<GraphEdge> edgeList = null;

	private String label = "";

	public GraphNode(String label) {
		this.label = label;
		if (edgeList == null) {
			edgeList = new ArrayList<GraphEdge>();
		}
	}

	/**
	 * 给当前节点添加一条边 GraphNode
	 *
	 * @param edge
	 *            添加的边
	 */
	public void addEdgeList(GraphEdge edge) {
		edgeList.add(edge);
	}

	public String getLabel() {
		return label;
	}

```

广度优先搜索

```
public class BFS {
	public void searchTraversing(GraphNode node) {
		List<GraphNode> visited = new ArrayList<GraphNode>(); // 已经被访问过的元素
		Queue<GraphNode> q = new LinkedList<GraphNode>(); // 用队列存放依次要遍历的元素
		q.offer(node);

		while (!q.isEmpty()) {
			GraphNode currNode = q.poll();
			if (!visited.contains(currNode)) {
				visited.add(currNode);
				System.out.println("节点：" + currNode.getLabel());
				for (int i = 0; i < currNode.edgeList.size(); i++) {
					q.offer(currNode.edgeList.get(i).getNodeRight());
				}
			}
		}
	}
}
```

深度优先搜索

```
public class DFS {
	public void searchTraversing(GraphNode node, List<GraphNode> visited) {
		// 判断是否遍历过
		if (visited.contains(node)) {
			return;
		}

		visited.add(node);
		System.out.println("节点：" + node.getLabel());
		for (int i = 0; i < node.edgeList.size(); i++) {
			searchTraversing(node.edgeList.get(i).getNodeRight(), visited);
		}
	}
}
```

Main 测试类

```
public class MyGraph {
	private static List<GraphNode> nodes = null;

	public static void initGraph(int n) {
		if (nodes == null) {
			nodes = new ArrayList<GraphNode>();
		}

		GraphNode node = null;
		for (int i = 0; i < n; i++) {
			node = new GraphNode(String.valueOf(i));
			nodes.add(node);
		}
	}

	public static void initGraph(int n, boolean b) {
		initGraph(n);
		GraphEdge edge01 = new GraphEdge(nodes.get(0), nodes.get(1));
		GraphEdge edge02 = new GraphEdge(nodes.get(0), nodes.get(2));
		GraphEdge edge13 = new GraphEdge(nodes.get(1), nodes.get(3));
		GraphEdge edge14 = new GraphEdge(nodes.get(1), nodes.get(4));
		GraphEdge edge25 = new GraphEdge(nodes.get(2), nodes.get(5));
		GraphEdge edge26 = new GraphEdge(nodes.get(2), nodes.get(6));
		GraphEdge edge37 = new GraphEdge(nodes.get(3), nodes.get(7));
		GraphEdge edge47 = new GraphEdge(nodes.get(4), nodes.get(7));
		GraphEdge edge56 = new GraphEdge(nodes.get(5), nodes.get(6));

		nodes.get(0).addEdgeList(edge01);
		nodes.get(0).addEdgeList(edge02);
		nodes.get(1).addEdgeList(edge13);
		nodes.get(1).addEdgeList(edge14);
		nodes.get(2).addEdgeList(edge25);
		nodes.get(2).addEdgeList(edge26);
		nodes.get(3).addEdgeList(edge37);
		nodes.get(4).addEdgeList(edge47);
		nodes.get(5).addEdgeList(edge56);
	}

	public static void initGraph() {
		initGraph(8, false);
	}

	public List<GraphNode> getGraphNodes() {
		return nodes;
	}

	public static void main(String[] args) {

		initGraph();

		System.out.println("BFS");
		BFS bfs = new BFS();
		bfs.searchTraversing(new MyGraph().getGraphNodes().get(0));

		List<GraphNode> visited = new ArrayList<GraphNode>();
		System.out.println("DFS");
		DFS dfs = new DFS();
		dfs.searchTraversing(new MyGraph().getGraphNodes().get(0), visited);
	}
}
```

执行结果

```
BFS
节点：0
节点：1
节点：2
节点：3
节点：4
节点：5
节点：6
节点：7
DFS
节点：0
节点：1
节点：3
节点：7
节点：4
节点：2
节点：5
节点：6
```