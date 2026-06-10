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
#friendlink: false

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

# ✨ 臻享阅读 ✨
## 最好的 Pixiv 第三方小说阅读器
### 🅿️ [开源阅读](https://github.com/Luoyacheng/legado) + Pixiv 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
#### ☕ [书源项目打赏名单](Sponsor.md)
</div>


> [!WARNING]
>
> ⚠️ **你正在 GitHub 上浏览此文档， Github 文档可能不完整
> [网页版](https://pixivsource.pages.dev/BetterExperience)
> 内容更全面，排版更精美**


> [!TIP]
> 
> **面向新手的完整配置指南，彻底解决 Pixiv 官方软件的痛点！**
> 
> **另有：极简配置指南：**
> [⚡️ 快速开始](QuickStart.md)
> 
> **Pixiv 书源 全部功能 详见：**
> [🅿️ Pixiv 书源 功能手册](Pixiv.md)


## 你是否被下面的问题所困扰？ {#Trouble}
### 官方 APP 的小说阅读体验堪忧 {#OfficialAPPTrouble}
<details><summary><strong> 👎 阅读体验堪忧 </strong></summary>

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


### 第三方 APP 的小说阅读体验不佳 {#UnOfficialAPPTrouble}
<details><summary><strong> 😞 阅读体验不佳 </strong></summary>

- <details><summary> 🈚️ 无小说功能 </summary>

  - [PixEz Viewer](https://github.com/ultranity/Pix-EzViewer)
  - [Pi Pixiv](https://github.com/darriousliu/PiPixiv)
  </details>

- <details><summary> 👎 阅读体验明显不如 Pixiv </summary>

  - [Pixiv Shaft](https://github.com/CeuiLiSA/Pixiv-Shaft) 
  - [Pixiv Artvier](https://github.com/kerrinz/pixiv-artvier) 
  - [Pixes](https://github.com/wgh136/pixes)
  </details>

- <details><summary> 😞 阅读体验略逊色于 Pixiv </summary>

  - [PixEz Flutter](https://github.com/Notsfsssf/pixez-flutter)
  - [Pixiv Multi Platform](https://github.com/magic-cucumber/Pixiv-MultiPlatform)
  - [Pixiv Viewer](https://github.com/asadahimeka/pixiv-viewer)
  </details>
</details>

> 软件整理自 https://linux.do/t/topic/657910

**迄今为止（2025.12），上述软件的小说阅读体验，依然没有一个超过了 Pixiv**


## 你是否想改善阅读体验呢？<br>如果你的回答是“是的”<br>那么你可能需要：{#Question}
## 开源阅读 + Pixiv 书源 {#RepoIntroduction}
> [!NOTE]
>
> **我们的目标：做最好的 Pixiv 的小说阅读器**
> 
> **经过充分的调研，此目标已在 2025.12 实现**


<!--@include: CommonDownload.md-->

<!--@include: CommonIntroduction.md-->

<!--@include: CommonPixiv.md-->

<!--@include: CommonLegado.md-->

<!--@include: CommonPixivFunction.md-->

<!--@include: CommonSuffix.md-->

