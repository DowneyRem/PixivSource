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
#friendLink: false

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

repos:
  - name: Pixiv 书源 / PixivSource
    icon: /img/BookSourcePixiv.png
    desc: 最好的 Pixiv 小说阅读器
    link: https://github.com/DowneyRem/PixivSource
    prerelease: false
    recommend: pixiv
    show_assets: 1

  - name: 阅读 Sigma
    icon: /img/LegadoSigma.png
    desc: 极致阅读体验 免费开源电子书阅读器
    link: https://gitee.com/lyc486/legado
    prerelease: false
    recommend: releaseS.apk
    show_assets: 1

  - name: 轻悦时光
    icon: /img/QYSG.png
    desc: 纯本地的多端兼容阅读器
    link: https://github.com/autobcb/qysg
    prerelease: false
    recommend: ios 64 win mac
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

# ⚡️ 快速开始 ⚡️
#### 🅿️ 开源阅读 Pixiv 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
</div>


> [!WARNING]
> ⚠️ **你正在 GitHub 上浏览此文档， Github 文档可能不完整
> [网页版](https://pixivsource.pages.dev/QuickStart)
> 内容更全面，排版更精美**


### ⚡️ 快速开始 {#QuickJump}
> [!TIP]
> **只需4个步骤，5分钟完成配置。即刻开始，享受极致阅读体验**
> 
> ▶️ **[下载阅读](#Download) =>**
> ➕ **[导入书源](#ImportSources) =>**
> 🅿️ **[书源配置](#BookSourceSet) =>**
> ⚙️ **[阅读设置](#LegadoSettings) =>**
> 📖 **[添加小说](#AddNovels)**
> <br><br>
> **另有：面向新手，从零开始的完整配置指南：**
> [✨臻享阅读](BetterExperience.md)
> 
> **Pixiv 书源 全部功能 详见：**
> [🅿️ Pixiv 书源 功能手册](Pixiv.md)


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

<!--@include: CommonPixiv.md-->


<div v-if="!pagePath.includes('zh-TW')">
<details><summary><strong> 🦊 Linpx 与 兽人控小说站 </strong></summary>

<!--@include: CommonLoginLinpx.md-->
</details>
</div>

<!--@include: CommonLegado.md-->

<!--@include: CommonAddNovels.md-->

<!--@include: CommonSuffix.md-->

