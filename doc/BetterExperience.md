---
layout: doc
title: ✨ 臻享阅读 - 开源阅读 + Pixiv 书源 新手使用指南
description: 彻底解决 Pixiv 官方软件的痛点！从认识开源阅读，到导入书源、登录账号、开始使用，彻底告别 Pixiv 官方软件的阅读功能缺陷，找回阅读的纯粹乐趣。

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
      content: 臻享阅读, Pixiv 书源新手教程, 开源阅读 Legado 入门, Pixiv 小说书架, Legado Pixiv 配置, Pixiv 小说阅读器, Legado Pixiv 书源, 开源阅读配置
  - - meta
    - property: og:title
      content: ✨ 臻享阅读 - 开源阅读 + Pixiv 书源 新手使用指南
  - - meta
    - property: og:description
      content: 彻底解决 Pixiv 官方软件的痛点！从认识开源阅读，到导入书源、登录账号、开始使用，彻底告别 Pixiv 官方软件的阅读功能缺陷，找回阅读的纯粹乐趣。
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

# ✨ 臻享阅读 ✨
# 最好的 Pixiv 第三方小说阅读器
#### 🅿️ 开源阅读 Pixiv 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
</div>


> [!WARNING]
>
> ⚠️ **你正在 GitHub 上浏览此文档， Github 文档可能不完整
> [网页版](https://pixivsource.pages.dev/BetterExperience)
> 内容更全面，排版更精美**


### ⚡️ 快速跳转 {#QuickJump}
> [!TIP]
> **面向新手的完整配置指南，彻底解决 Pixiv 的痛点！**
> 
> [⚡️ 点我立即开始](#StartNow)；
> **另有：极简配置指南：**
> [⚡️ 快速开始](QuickStart.md)
> 
> **Pixiv 书源 全部功能 详见：**
> [🅿️ Pixiv 书源 功能手册](Pixiv.md)


## 为什么需要 Pixiv 书源？ {#WhyPixivSource}
### 👎 Pixiv App 更适合看图片，而不是看小说 {#Unsuitable}
<details><summary><strong>查看详细说明</strong></summary>

- 小说功能缺陷
  - **没有小说书架**
  - **没有首行缩进**
  - **不能保存阅读进度**
  - **拉黑功能并非屏蔽**
- 搜索功能缺陷
  - **默认搜索标签，而非小说名称**
  - **不能直接搜索作者名称，获取其小说**
- 基础功能却需要付费
  - **浏览记录是 Vip 功能**
  - **屏蔽标签是 Vip 功能**
  - **屏蔽作者是 Vip 功能**
</details>


### 😞 第三方 App 小说功能不够全面 {#Unsuitable2}
<details><summary><strong>调研软件列表</strong></summary>

> [!NOTE]
> **调研时间：2025.12**
> 
> 软件列表：https://linux.do/t/topic/657910

#### 🈚️ 无小说功能
- [PixEz Viewer](https://github.com/ultranity/Pix-EzViewer)
- [Pi Pixiv](https://github.com/darriousliu/PiPixiv)

#### 👎 阅读体验明显不如 Pixiv
- [Pixiv Shaft](https://github.com/CeuiLiSA/Pixiv-Shaft)
- [Pixiv Artvier](https://github.com/kerrinz/pixiv-artvier)
- [Pixes](https://github.com/wgh136/pixes)

#### 😞 阅读体验略逊色于 Pixiv
- [PixEz Flutter](https://github.com/Notsfsssf/pixez-flutter)
- [Pixiv Multi Platform](https://github.com/magic-cucumber/Pixiv-MultiPlatform)
- [Pixiv Viewer](https://github.com/asadahimeka/pixiv-viewer)
</details>


#### 有没有更好的选择？ {#BetterChoice}
### 📖 开源阅读 + 🅿️ Pixiv 书源 {#Legado&PixivSource}
> [!NOTE]
> **我们的目标：做最好的 Pixiv 小说阅读器**
>
> **经过充分调研与持续迭代，此目标已于 2025.12 实现**

#### 你将获得：堪比网络小说的阅读体验


<!--@include: CommonComparison.md-->


## 立即开始 {#StartNow}
> [!TIP]
> **只需4个步骤，即可拥有上述功能：**
> 1. ▶️ **[安装阅读软件](#Download)** 
> 2. ➕ **[导入 Pixiv 书源](#ImportSources)** 
> 3. 🅿️ **[登录 Pixiv 账号](#BookSourceSet)** 
> 4. ⚙️ **[阅读软件设置](#LegadoSettings)**
> 5. 📖 **[添加小说，畅享阅读](#AddNovels)**
> 
> **另有：极简配置指南：**
> [⚡️ 快速开始](QuickStart.md)

<!--@include: CommonDownload.md-->

<!--@include: CommonImport.md-->

<!--@include: CommonIntroduction.md-->

<!--@include: CommonPixiv.md-->

<!--@include: CommonLegado.md-->

<!--@include: CommonAddNovels.md-->

<!--@include: CommonSuffix.md-->