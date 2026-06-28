---
layout: post
title: 二分搜索算法整理（Java）
keywords: java 算法
description: 内容整理自互联网。
tags: java 算法
author: 陈鑫杰
---

## 二分搜索 Binary Search

在**有序数组**中查找某一特定元素的搜索算法。

![binarySearch](algorithm-study/Binary_search_into_array.png)

搜索过程从数组的中间元素开始，如果中间元素正好是要查找的元素，则搜索过程结束；

如果某一特定元素大于或者小于中间元素，则在数组大于或小于中间元素的那一半中查找，而且跟开始一样从中间元素开始比较。

如果在某一步骤数组为空，则代表找不到。

这种搜索算法每一次比较都使搜索范围缩小一半。

**复杂度**

最坏时间复杂度：O(log n)

最优时间复杂度：O(1)

平均时间复杂度：O(log n)

空间复杂度	迭代：O(1)

空间复杂度	递归：O(log n)

**代码实现**

```
public class BinarySearch {

	// 递归
	public static int binarySearch(int arr[], int start, int end, int khey) {
		if (start > end)
			return -1;

		int mid = start + (end - start) / 2;
		if (arr[mid] > khey)
			return binarySearch(arr, start, mid - 1, khey);
		if (arr[mid] < khey)
			return binarySearch(arr, mid + 1, end, khey);
		return mid;
	}

	// 迭代
	public static int binarySearchWhile(int arr[], int start, int end, int khey) {
		int mid;
		while (start <= end) {
			mid = start + (end - start) / 2;
			if (arr[mid] < khey)
				start = mid + 1;
			else if (arr[mid] > khey)
				end = mid - 1;
			else
				return mid;
		}
		return -1;
	}

	public static void main(String[] args) {
		int[] arr = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
		System.out.println("下标：" + binarySearch(arr, 0, arr.length - 1, 5));
		System.out.println("下标：" + binarySearch(arr, 0, arr.length - 1, 1));
		System.out.println("下标：" + binarySearchWhile(arr, 0, arr.length - 1, 5));
		System.out.println("下标：" + binarySearchWhile(arr, 0, arr.length - 1, 10));

	}
}
```
