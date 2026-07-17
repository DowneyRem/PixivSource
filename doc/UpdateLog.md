---
layout: doc
title: 更新日志 - Pixiv 书源版本历史
description: PixivSource 书源更新记录：直连互动功能、搜索作者、重写排行榜、高并发优化、收藏追更评论等互动功能……历次版本的功能变更与问题修复说明。

#sidebar: false
#aside: false
#editLink: false
#lastUpdated: false
#prev: false
#next: false
#comment: false
#friendLink: false

head:
  - - meta
    - name: keywords
      content: PixivSource 更新日志, Pixiv 书源更新记录, PixivSource 版本历史, Linpx 书源更新记录, FurryNovel 书源更新记录, Pixiv 书源版本, PixivSource changelog
  - - meta
    - property: og:title
      content: 更新日志 - Pixiv 书源版本历史
  - - meta
    - property: og:description
      content: PixivSource 书源更新记录：直连互动功能、搜索作者、重写排行榜、高并发优化、收藏追更评论等互动功能……历次版本的功能变更与问题修复说明。

repos:
  - name: PixivSource
    icon: /img/BookSourcePixiv.png
    desc: 最好的 Pixiv 小说阅读器
    link: https://github.com/DowneyRem/PixivSource
    prerelease: false
    recommend: pixiv
    show_assets: 1

---

<script setup>
import { computed } from "vue";
import { useData } from "vitepress";

const { page } = useData();
const pagePath = computed(() => page.value.relativePath.replace(/\.md$/, ""));
</script>


<div align="center">
<img width="256" src="./pic/BookSourcePixiv.png" alt="Pixiv BookSource"/>

# 📜 更新日志 📜
#### 🅿️ 开源阅读 Pixiv 书源
</div>


> [!WARNING]
>
> ⚠️ **你正在 GitHub 上浏览此文档， Github 文档可能不完整
> [网页版](https://pixivsource.pages.dev/UpdateLog)
> 内容更全面，排版更精美**


## ⚡️ 快速跳转 {#QuickJump}
<!--@include: UpdateLog/CommonJump.md-->


## ⏱️ 近期更新 {#Latest}
<DownloadCard/>


<div v-if="!pagePath.includes('zh-TW')">

## 📚 书源兼容性 {#Compatibility}
### 🅿️ Pixiv 书源 {#Pixiv}
| 导入链接 | 更新时间 | 阅读 Beta | 
| ------ | ------- | -------- | 
| [最新版本](https://raw.githubusercontent.com/DowneyRem/PixivSource/main/pixiv.json) |            | 新包名 3.26.0216 |
| [272 版本](https://raw.githubusercontent.com/DowneyRem/PixivSource/260/pixiv.json) | 2026.02.08 | 3.26.0129 - 3.26.0216 |
| [260 版本](https://raw.githubusercontent.com/DowneyRem/PixivSource/260/pixiv.json) | 2026.02.08 | 3.25.1107 - 3.26.0129 |
| [254 版本](https://raw.githubusercontent.com/DowneyRem/PixivSource/254/pixiv.json) | 2025.12.16 | 3.23.0503 - 3.25.1107 |
| [194 版本](https://raw.githubusercontent.com/DowneyRem/PixivSource/194/pixiv.json) | 2025.05.28 | 3.23.0503 - 3.25.1107 |
| [174 版本](https://raw.githubusercontent.com/DowneyRem/PixivSource/174/pixiv.json) | 2025.02.20 | 3.22.0103 - 3.23.0404 |


<details><summary><strong> 🦊 Linpx 书源 </strong></summary>

### 🦊 Linpx 书源 {#Linpx}
| 导入链接 |更新时间 | 阅读 Beta | 
| ------ | ------ | --------- |
| [最新版本](https://raw.githubusercontent.com/DowneyRem/PixivSource/main/linpx.json)|           | 新包名 3.25.1224 |
| [254 版本](https://raw.githubusercontent.com/DowneyRem/PixivSource/254/linpx.json) | 2025.12.16 | 3.25.1107 - 3.25.1224 |
| [253 版本](https://raw.githubusercontent.com/DowneyRem/PixivSource/253/linpx.json) | 2025.12.16 | 3.23.0503 - 3.25.1107 |
| [174 版本](https://raw.githubusercontent.com/DowneyRem/PixivSource/174/linpx.json) | 2025.02.20 | 3.22.0103 - 3.23.0404 |
</details>
</div>


## 📆 2026下半年 {#2026H2}
### 📚 更新 280 {#280}
- 🅿️ Pixiv 书源：
  - ⚙️ **设置：📚 整合系列（默认开启）**
    - 关闭 📚 整合系列 时
      - 搜索：不搜索系列小说
      - 详情：不显示系列信息
      - 目录：不显示系列篇目
  - ⤴️ 回调：优化代码
- 🅿️ Pixiv 订阅：
  - ⚙️ 书源设置
    - 🔢 章节编号、️❤️ 自动收藏、📚 整合系列


### 📚 更新 279 {#279}
- 🅿️ Pixiv 书源：
  - ⭐️ 发现：使用新 API 获取小说
    - 👑 排行榜单
    - 📝 编辑部推荐
    - 🏠 首页推荐
  - 🐞 修复部分小说没有标签的错误


### 📚 更新 278 {#278}
- 🦊 **Linpx 书源：**
  - 📃 目录：优化获取系列目录
- 🌐 Pixiv 、Linpx 、FN 订阅源：
  - ➕ 添加书架：优化代码


### 📚 更新 277 {#277}
- 🦊 **Linpx 书源：**
  - **更新至新域名：linpx.ink** 
    - **更新 API 链接**
    - **更新正则规则**
- 🦊 Linpx & FN 书源：
  - 优化代码：
    - 登录检测：输出环境信息
- 🅿️ Pixiv、🦊 Linpx & FN 书源：
  - 详情页标签添加 `#` 号
  - 优化代码：
    - isHtmlString
    - 更新软件下载链接


### 📚 更新 276 {#276}
- 🅿️ Pixiv 小说：
  - ⚙️ 设置
    - ⚙️ 默认关闭：书源编辑的登录界面的书源设置、发现设置
    - 🖤 自动取消：AUTO_DISLIKE_NOVELS 改为 自动取消
  - ⭐️ 发现：按钮名称：使用指南 => 功能手册
- 📂 项目
  - 📂 优化项目文件路径
  - 🛠 修复构建工具的 bug
- 🌐 Pixiv 书源 网站国际化


## ⚡️ 快速跳转 {#QuickJump2}
<!--@include: UpdateLog/CommonJump.md-->
