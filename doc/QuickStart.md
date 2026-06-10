---
layout: doc
title: ⚡️ 快速开始：5分钟配置开源阅读 Pixiv 书源
description: 五分钟完成配置：下载阅读、一键导入 Pixiv/Linpx/BTSRK 书源与订阅源、登录账号，立即开始阅读 Pixiv 小说。

#sidebar: false
#aside: false
#editLink: false
#lastUpdated: false
#prev: false
#next: false
#comment: false
#friendlink: false

head:
  - - meta
    - name: keywords
      content: Legado 书源导入, Pixiv 书源链接, Linpx 书源一键导入, 阅读 Plus 下载, BTSRK 订阅源, 规则订阅教程, 一键导入 Pixiv 书源, 开源阅读下载, 阅读 Plus 下载, Legado 导入书源, Pixiv 书源安装, BTSRK 订阅源
  - - meta
    - property: og:title
      content: ⚡️ 快速开始：5分钟配置开源阅读 Pixiv 书源
  - - meta
    - property: og:description
      content: 五分钟完成配置：下载阅读、一键导入 Pixiv/Linpx/BTSRK 书源与订阅源、登录账号，立即开始阅读 Pixiv 小说。
  - - meta
    - property: og:image
      content: /pic/BookSourcePixiv.png
---

<script setup>
import { computed } from "vue";
import { useData } from "vitepress";

const { page } = useData();
const pagePath = computed(() => page.value.relativePath.replace(/\.md$/, ""));
</script>


<div align="center">
<img width="150" height="150" src="./pic/BookSourcePixiv.png" alt="Pixiv BookSource"/>
<br>

# ⚡️ 快速开始 ⚡️
### 🅿️ [开源阅读](https://github.com/Luoyacheng/legado) Pixiv 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
#### ☕ [书源项目打赏名单](Sponsor.md)
</div>


> [!WARNING]
>
> ⚠️ **你正在 GitHub 上浏览此文档， Github 文档可能不完整
> [网页版](https://pixivsource.pages.dev/QuickStart)
> 内容更全面，排版更精美**


> [!TIP]
> **没有复杂的概念，五分钟即可完成配置。即刻开始，享受极致阅读体验**
> 
> **另有：面向新手，从零开始的完整配置指南：**
> [✨臻享阅读](BetterExperience.md)
> 
> **Pixiv 书源 全部功能 详见：**
> [🅿️ Pixiv 书源 功能手册](Pixiv.md)


## ⚡️ 快速开始：[下载阅读](QuickStart#DownloadLegado) => [导入书源](QuickStart#ImportSources) => [书源配置](QuickStart#LoginAccount) => [阅读设置](QuickStart#LegadoSettings) {#QuickStart}
## 下载软件 {#DownloadAPP}
<!--@include: CommonDownload.md-->


## 导入书源 {#ImportSources}
> [!TIP]
> **使用 Pixiv 书源阅读小说，建议导入：**
> - **🅿️ Pixiv 书源**
> - **🐲 BTSRK 订阅源**
> 
> **使用 Linpx 书源阅读小说，建议导入：**
> - **🦊 Linpx 书源**
> - **🐲 BTSRK 订阅源**
>
> **以下两种导入方式任选：**

<!--@include: CommonImportMethod.md-->


## 书源配置 {#BookSourceSet}
> [!NOTE]
>
> **有账号的网站，在书源里登录账号才能阅读相关小说**

<details><summary><strong> 🅿️ Pixiv 书源 </strong></summary>
<!--@include: CommonLoginPixiv.md-->
</details>

<details><summary><strong> 🦊 Linpx 与 兽人控小说站 </strong></summary>
<!--@include: CommonLoginLinpx.md-->
</details>

<!--@include: CommonLegado.md-->

<!--@include: CommonSuffix.md-->

