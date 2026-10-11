---
layout: post
title: 大文件续传与断点上传——分片、秒传、断点续传全解析
tags:
  - 文件上传
  - 断点续传
  - 分片上传
  - Java
categories: 后端开发
description: 从原理到代码，完整拆解大文件分片上传、秒传、断点续传的实现方案，附 Java 后端代码。
cover_image: /assets/images/posts/upload/resumable-upload-cover.jpg
---

## 先说问题：大文件上传难在哪

用户上传一个 100MB 的视频，如果整个文件一次 POST 出去，会遇到几个问题：

- **超时**：网络波动导致连接中断，100MB 要重头再来
- **内存爆炸**：服务端把整个文件读进内存，几个并发就 OOM
- **体验差**：用户看不到进度，只能干等

解决思路就四个字：**化整为零**。

## 核心概念：分片上传

把一个大文件切成多个小块（比如每块 5MB），每个小块独立上传。所有小块上传完成后，服务端再合并成一个完整文件。

```
100MB 文件 → 切成 20 片（每片 5MB）
片 1 → 上传 → 成功
片 2 → 上传 → 失败 → 重试片 2
片 3 ~ 20 → 继续上传
全部完成 → 服务端合并 → 得到完整文件
```

## 三个关键技术

### 1. 分片（Chunk）

前端用 `File.slice()` 把文件切成固定大小的块。每片有编号（0, 1, 2...），服务端按编号顺序合并。

### 2. 秒传（Quick Upload）

上传前先算整个文件的 MD5（或 SHA-256）。服务端收到 MD5 后查一下：这个文件已经存在了？直接返回"上传成功"，一片都不用传。

这就是网盘"秒传"的原理——你的文件别人已经上传过了。

### 3. 断点续传（Resumable Upload）

上传到一半断了，重新打开页面继续传。前端问服务端："我之前传了哪些片？"服务端返回已完成的片号列表，前端只传剩下的。

## 整体流程

![断点续传流程图](/assets/images/posts/upload/resumable-upload-flow.svg)

```
前端                          服务端
 │                              │
 │── 1. 计算文件 MD5 ──────────→│
 │←── 2. 检查是否秒传 ──────────│  秒传？直接返回成功
 │                              │
 │── 3. 查询已上传分片 ─────────→│  返回 [0, 1, 3, 5]
 │←── 4. 已上传分片列表 ────────│
 │                              │
 │── 5. 上传剩余分片 ──────────→│  只传 2, 4, 6, 7...
 │←── 6. 分片上传成功 ──────────│
 │                              │
 │── 7. 所有分片上传完成 ───────→│
 │←── 8. 合并分片，返回文件URL ──│
```

## Java 后端实现

### 第一步：分片上传接口

```java
@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Value("${upload.chunk-dir:/tmp/upload/chunks}")
    private String chunkDir;

    @Value("${upload.file-dir:/tmp/upload/files}")
    private String fileDir;

    /**
     * 上传单个分片
     * @param fileMd5  整个文件的 MD5（用于标识唯一文件）
     * @param chunkIndex 分片序号（从 0 开始）
     * @param totalChunks 总分片数
     * @param chunk    分片文件
     */
    @PostMapping("/chunk")
    public Result uploadChunk(
            @RequestParam String fileMd5,
            @RequestParam int chunkIndex,
            @RequestParam int totalChunks,
            @RequestParam MultipartFile chunk) throws IOException {

        // 分片存储路径：按 MD5 分目录，避免文件冲突
        String chunkPath = chunkDir + "/" + fileMd5 + "/" + chunkIndex;
        File chunkFile = new File(chunkPath);
        chunkFile.getParentFile().mkdirs();

        // 写入分片
        chunk.transferTo(chunkFile);

        return Result.success("分片 " + chunkIndex + " 上传成功");
    }
}
```

### 第二步：查询已上传分片（断点续传核心）

```java
    /**
     * 查询某个文件已上传的分片
     * 前端拿到结果后，只上传缺失的分片
     */
    @GetMapping("/chunks")
    public Result getUploadedChunks(@RequestParam String fileMd5,
                                    @RequestParam int totalChunks) {
        File dir = new File(chunkDir + "/" + fileMd5);
        Set<Integer> uploaded = new HashSet<>();

        if (dir.exists()) {
            File[] files = dir.listFiles();
            if (files != null) {
                for (File f : files) {
                    uploaded.add(Integer.parseInt(f.getName()));
                }
            }
        }

        // 返回缺失的分片序号
        List<Integer> missing = new ArrayList<>();
        for (int i = 0; i < totalChunks; i++) {
            if (!uploaded.contains(i)) {
                missing.add(i);
            }
        }

        return Result.success(missing);
    }
```

### 第三步：合并分片

```java
    /**
     * 所有分片上传完成后，调用此接口合并
     */
    @PostMapping("/merge")
    public Result mergeChunks(@RequestParam String fileMd5,
                              @RequestParam String fileName,
                              @RequestParam int totalChunks) throws IOException {

        File sourceDir = new File(chunkDir + "/" + fileMd5);
        File targetFile = new File(fileDir + "/" + fileName);
        targetFile.getParentFile().mkdirs();

        // 按序号顺序合并
        try (FileOutputStream fos = new FileOutputStream(targetFile)) {
            for (int i = 0; i < totalChunks; i++) {
                File chunk = new File(sourceDir, String.valueOf(i));
                if (!chunk.exists()) {
                    return Result.error("分片 " + i + " 缺失");
                }
                Files.copy(chunk.toPath(), fos);
                fos.flush();
            }
        }

        // 合并完成，清理分片目录
        deleteDir(sourceDir);

        String fileUrl = "/files/" + fileName;
        return Result.success(fileUrl);
    }

    private void deleteDir(File dir) {
        File[] files = dir.listFiles();
        if (files != null) {
            for (File f : files) f.delete();
        }
        dir.delete();
    }
```

### 第四步：秒传检查

```java
    /**
     * 秒传检查：文件是否已经存在
     */
    @GetMapping("/check")
    public Result checkFile(@RequestParam String fileMd5) {
        // 实际项目中查数据库，这里简化为检查文件是否存在
        File dir = new File(fileDir);
        File[] files = dir.listFiles((d, name) -> name.startsWith(fileMd5));

        if (files != null && files.length > 0) {
            return Result.success(true, "文件已存在，秒传成功");
        }
        return Result.success(false, "文件不存在，需要上传");
    }
```

### 第五步：统一返回结构

```java
public class Result {
    private int code;
    private String message;
    private Object data;

    public static Result success(Object data) {
        Result r = new Result();
        r.code = 0;
        r.data = data;
        return r;
    }

    public static Result success(Object data, String message) {
        Result r = success(data);
        r.message = message;
        return r;
    }

    public static Result error(String message) {
        Result r = new Result();
        r.code = -1;
        r.message = message;
        return r;
    }
    // getter/setter 省略
}
```

## 前端核心逻辑（伪代码）

```javascript
// 1. 计算文件 MD5（用 spark-md5 库）
const fileMd5 = await calculateMD5(file);

// 2. 检查秒传
const checkRes = await fetch(`/api/upload/check?fileMd5=${fileMd5}`);
if (checkRes.data) {
    alert('秒传成功！');
    return;
}

// 3. 查询已上传分片
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
const missingRes = await fetch(
    `/api/upload/chunks?fileMd5=${fileMd5}&totalChunks=${totalChunks}`
);
const missingChunks = missingRes.data; // [2, 4, 6, ...]

// 4. 只上传缺失的分片
const uploadPromises = missingChunks.map(index => {
    const start = index * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append('fileMd5', fileMd5);
    formData.append('chunkIndex', index);
    formData.append('totalChunks', totalChunks);
    formData.append('chunk', chunk);

    return fetch('/api/upload/chunk', { method: 'POST', body: formData });
});

await Promise.all(uploadPromises);

// 5. 合并
await fetch('/api/upload/merge', {
    method: 'POST',
    body: JSON.stringify({ fileMd5, fileName: file.name, totalChunks })
});
```

## 生产环境还要考虑什么

| 问题 | 解决方案 |
|------|---------|
| 分片乱序到达 | 合并时按序号顺序读取，不依赖上传顺序 |
| 分片上传失败 | 前端重试机制，只重试失败的分片 |
| 大文件 MD5 计算慢 | Web Worker 后台计算，不阻塞 UI |
| 分片占用磁盘 | 合并后及时清理；定时清理过期分片目录 |
| 并发上传限流 | 控制同时上传的分片数（如 3-5 个并发） |
| 文件完整性校验 | 合并后校验完整文件的 MD5，与前端传入的对比 |
| 分布式部署 | 分片存储用 OSS/MinIO，不用本地磁盘 |

## 一句话总结

大文件上传的核心就三步：**分片上传、断点续传、合并文件**。秒传是加分项——文件 MD5 已存在就跳过上传。前端负责切片和重试，后端负责存储和合并。搞懂这个流程，任何大文件上传场景都能应对。