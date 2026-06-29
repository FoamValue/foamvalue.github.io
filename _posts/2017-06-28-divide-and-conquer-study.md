---
layout: post
title: 分治法整理（Java）
keywords: java 算法
description: 内容整理自互联网。
tags: java 算法
author: 陈鑫杰
---

分而治之，就是把一个复杂的问题分成两个或更多的相同或相似的子问题，直到最后子问题可以简单的直接求解，原问题的解即子问题的解的合并。

**循环递归**

在每一层递归上都有三个步骤：

分解：将原问题分解为若干个规模较小，相对独立，与原问题形式相同的子问题。

解决：若子问题规模较小且易于解决时，则直接解。否则，递归地解决各子问题。

合并：将各子问题的解合并为原问题的解。

------

### 快速排序 Quicksort

**算法**

![Sorting_quicksort_anim](/assets/images/posts/algorithm-study/Sorting_quicksort_anim.gif)

快速排序使用分治法（Divide and conquer）策略来把一个序列（list）分为两个子序列（sub-lists）。

步骤为：

从数列中挑出一个元素，称为"基准"（pivot）。

重新排序数列，所有比基准值小的元素摆放在基准前面，所有比基准值大的元素摆在基准后面（相同的数可以到任一边）。在这个分区结束之后，该基准就处于数列的中间位置。这个称为分区（partition）操作。

递归地（recursively）把小于基准值元素的子数列和大于基准值元素的子数列排序。

递归到最底部时，数列的大小是零或一，也就是已经排序好了。这个算法一定会结束，因为在每次的迭代（iteration）中，它至少会把一个元素摆到它最后的位置去。

**Java**

```
class quick_sort {
	int[] arr;

	private void swap(int x, int y) {
		int temp = arr[x];
		arr[x] = arr[y];
		arr[y] = temp;
	}

	private void quick_sort_recursive(int start, int end) {
		if (start >= end)
			return;
		int mid = arr[end];
		int left = start, right = end - 1;
		while (left < right) {
			while (arr[left] <= mid && left < right)
				left++;
			while (arr[right] >= mid && left < right)
				right--;
			swap(left, right);
		}
		if (arr[left] >= arr[end])
			swap(left, end);
		else
			left++;
		quick_sort_recursive(start, left - 1);
		quick_sort_recursive(left, end);
	}

	public void sort(int[] arrin) {
		arr = arrin;
		quick_sort_recursive(0, arr.length - 1);
	}
}
```

**理解**

- 初始化数组下标 quick_sort_recursive(0, arr.length - 1);
- 每次取最后一个元素为基准 int mid = arr[end];
- 循环判断起始下标之间的元素。
	- 循环起点元素小于基准时，起点下标右移一位。
	- 循环终点元素大于基准时，终点下标左移一位。
	- 交换起点、终点元素
- 当起点元素大于终点元素时，交换起点、终点元素；否则，起点下标右移一位。
- 将数组下标二分，进行递归。

------

### 归并排序

![Merge_sort_animation](/assets/images/posts/algorithm-study/Merge_sort_animation.gif)

归并操作（merge），也叫归并算法，指的是将两个已经排序的序列合并成一个序列的操作。归并排序算法依赖归并操作。

**迭代法**

申请空间，使其大小为两个已经排序序列之和，该空间用来存放合并后的序列。

设定两个指针，最初位置分别为两个已经排序序列的起始位置。

比较两个指针所指向的元素，选择相对小的元素放入到合并空间，并移动指针到下一位置。

重复步骤3直到某一指针到达序列尾。

将另一序列剩下的所有元素直接复制到合并序列尾。

**Java**

```
public static void merge_sort(int[] arr) {
    int len = arr.length;
    int[] result = new int[len];
    int block, start;

    // 原版代码的迭代次数少了一次，没有考虑到奇数列数组的情况
    for(block = 1; block < len*2; block *= 2) {
        for(start = 0; start <len; start += 2 * block) {
            int low = start;
            int mid = (start + block) < len ? (start + block) : len;
            int high = (start + 2 * block) < len ? (start + 2 * block) : len;
            //两个块的起始下标及结束下标
            int start1 = low, end1 = mid;
            int start2 = mid, end2 = high;
            //开始对两个block进行归并排序
            while (start1 < end1 && start2 < end2) {
	        result[low++] = arr[start1] < arr[start2] ? arr[start1++] : arr[start2++];
            }
            while(start1 < end1) {
	        result[low++] = arr[start1++];
            }
            while(start2 < end2) {
	        result[low++] = arr[start2++];
            }
        }
	int[] temp = arr;
	arr = result;
	result = temp;
    }
    result = arr;
}
```

**递归法**

原理如下（假设序列共有n个元素）：

将序列每相邻两个数字进行归并操作，形成 **floor(n/2)** 个序列，排序后每个序列包含两个元素。

将上述序列再次归并，形成 **floor(n/4)** 个序列，每个序列包含四个元素。

重复步骤2，直到所有元素排序完毕。

**Java**

```
static void merge_sort_recursive(int[] arr, int[] result, int start, int end) {
	if (start >= end)
		return;
	int len = end - start, mid = (len >> 1) + start;
	int start1 = start, end1 = mid;
	int start2 = mid + 1, end2 = end;
	merge_sort_recursive(arr, result, start1, end1);
	merge_sort_recursive(arr, result, start2, end2);
	int k = start;
	while (start1 <= end1 && start2 <= end2)
		result[k++] = arr[start1] < arr[start2] ? arr[start1++] : arr[start2++];
	while (start1 <= end1)
		result[k++] = arr[start1++];
	while (start2 <= end2)
		result[k++] = arr[start2++];
	for (k = start; k <= end; k++)
		arr[k] = result[k];
}
public static void merge_sort(int[] arr) {
	int len = arr.length;
	int[] result = new int[len];
	merge_sort_recursive(arr, result, 0, len - 1);
}
```