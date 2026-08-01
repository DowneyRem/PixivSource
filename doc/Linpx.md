---
layout: doc
title: Linpx 书源指南 - 在开源阅读中阅读 Pixiv 兽人小说
description: 用开源阅读 Legado + Linpx 书源，无需登录即可搜索、发现、阅读 Linpx 的兽人小说，支持搜索小说名称、作者、标签以及导入链接。

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
      content: Linpx, Linpx 书源, Linpx 阅读, Pixiv 兽人小说, 兽人小说 阅读, 兽人小说 书源, 开源阅读 Linpx, 兽人小说, Pixiv 链接转换, 兽人小说 书源
  - - meta
    - property: og:title
      content: Linpx 书源指南 - 在开源阅读中阅读 Pixiv 兽人小说
  - - meta
    - property: og:description
      content: 用开源阅读 Legado + Linpx 书源，无需登录即可搜索、发现、阅读 Linpx 的兽人小说，支持搜索小说名称、作者、标签以及导入链接。

repos:
  - name: Linpx 书源
    icon: /img/BookSourceLinpx.png
    desc: 最好的 兽人小说 小说阅读器
    link: https://github.com/DowneyRem/PixivSource
    prerelease: false
    recommend: linpx
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
<img width="150" height="150" src="./pic/BookSourceLinpx.png" alt="Linpx BookSource"/>
<br>

# [Linpx](http://www.linpx.ink) 书源 功能手册
#### 🦊 开源阅读 Linpx 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
</div>


> [!WARNING]
> ⚠️ **你正在 GitHub 上浏览此文档， Github 文档可能不完整
> [网页版](https://pixivsource.pages.dev/Linpx)
> 内容更全面，排版更精美**


### ⚡️ 快速跳转 {#QuickJump}
> [!TIP]
> **新手配置指南：**
> [✨臻享阅读](BetterExperience.md)；
> **极简配置指南：**
> [⚡️ 快速开始](QuickStart.md)，
> **重复内容不再赘述**
>
> **快速跳转：
> 🔍 [搜索小说](#)；
> ⭐️ [发现小说](#DiscoverNovel)；
> 🔗 [添加网址](#AddUrl)；
> 🌐 [订阅源](#RssSource)；
> ⚙️ [️设置功能](#Settings)；
> ⏺️ [互动功能](#Interact)**
>
> **另有：**
> 🅿️ [Pixiv 书源 功能手册](Pixiv.md)；
> 🦊 [Linpx 书源 功能手册](Linpx.md)


<!--@include: CommonDownload.md-->

<!--@include: CommonImport.md-->


<div v-if="false">

## 书源配置 {#BookSourceSet}
<!--@include: CommonLoginLinpx.md-->

<!--@include: CommonLegado.md-->
</div>


## 搜索小说 {#SearchNovel}
> [!NOTE]
> **书架页面 - 放大镜 - 输入关键词 - 搜索小说**


### 🔎 搜索小说 {#SearchNovels}
> [!TIP]
> **✅ 支持搜索：小说名称、作者名称、小说标签、小说链接**
> 
> **⚠️ 暂不支持：系列小说名称（受 Linpx 站方限制）**

![img](./pic/SearchViaLegado.png)


### 🀄️ 繁简通搜 {#ConvertChinese}
> [!TIP]
> **【默认搜索】进行繁简转换，同时返回繁体简体小说内容，可在书源设置中关闭**
>
> 【搜索作者 `@作者名称`】时，不转换
>
> 【搜索标签 `#标签名称`】时，不转换
>
> 返回小说内容不转换

![img](./pic/SearchViaLegadoConvert.jpg)


### 👤 搜索作者 {#SearchAuthor}
> [!TIP]
> **搜索作者（格式：`@作者名称`）** 
> 
> **使用 `@` 标记符，例如：`@pixiv事務局`，仅搜索作者；不进行繁简转换**

![img](./pic/SearchViaLegadoAuthor.jpg)


### #️⃣ 标签专搜 {#SearchTag}
> [!TIP]
> **标签专搜（格式：`#标签1` 或 `#标签1 标签2`）**
>
> **仅搜索标签、小说名称；多个标签空格间隔，不进行繁简转换**
>
> **`#` 为标记符，打出1个即可，例如：`#校园` `#校园 纯爱` `#校园 纯爱 BG`**

![img](./pic/SearchViaLegadoHashtag.jpg)


## 发现小说 {#DiscoverNovel}
> [!NOTE]
> **发现页面 - 点击“Linpx” - 点击按钮**


### ⭐️ 常规小说 {#DiscoverNormal}
![img](./pic/DiscoverLinpx.png)


### 🆙 更新书源 {#UpdateSource}
> [!NOTE]
> **点击按钮【🆙 更新】进入书源更新界面**

![img](./pic/UpdateSource.png)

> [!TIP]
>  - Jsdelivr CDN 更新有延迟
>  - Github 更新需代理
>  - Codeberg 更新免代理


<!--@include: CommonAddViaLink.md-->


## 订阅源 {#RssSource}
> [!NOTE]
> 订阅界面，打开 Linpx 订阅源


### ⬇️ 导入书源 {#ImportSource}
![img](./pic/InportBookSourceLinpxWeb.png)

- 点击按钮，导入书源；再次点击，则可更新书源
- 此处使用的是 Jsdelivr CDN ，更新有延迟

![img](./pic/InportBookSourceLinpx.png)


### 🔍 站内搜索 {#SearchViaSite}
受阅读设计的限制，阅读内部搜索不可能完全支持 Linpx 的功能。网站的搜索功能更加全面。

![img](./pic/SearchViaLinpx.png)


### 🔜 链接转换 {#ConvertLinks}
阅读内部浏览器内打开 Linpx，搜索栏中粘贴 Pixiv 小说链接，即可进入对应页面
  
![img](./pic/LinpxConvertPixivUrl1.png)

![img](./pic/LinpxConvertPixivUrl2.png)


### ➕ 添加小说 {#AddViaSite}
打开 Linpx 小说页面，点击【添加到书架】按钮，即可添加小说到书架
  
![img](./pic/AddBookViaLinpx.png)


## 设置功能 {#Settings}
> [!NOTE]
> **⚙️ 书源设置 => 我的 - 书源管理 - Linpx - 登录**

![img](./pic/LinpxLogin.png)


### ▶️ 基础功能 {#SettingsBase}
> [!NOTE]
> **⚙️ 书源设置 => 我的 - 书源管理 - Linpx - 登录**

![img](./pic/LinpxLoginUIBase.png)
- **🆙 更新书源：更新书源/更新订阅**
- 🔰 使用指南：打开 Github 文档(本页)
- 🐞 反馈问题：打开 Github Issues


### ⚙️ 书源设置 {#SettingsSource}
> [!NOTE]
> **⚙️ 书源设置 => 我的 - 书源管理 - Linpx - 登录**

![img](./pic/LinpxLoginUISettings.png)
- ⚙️ 当前设置：显示当前设置
- 🔧 默认设置：恢复默认设置
- 👤 搜索作者：默认搜索，开启\关闭 搜索作者
-
- 🀄 繁简通搜：搜索进行繁简转换（搜索作者、标签不转换）
- 📖 更多简介：详情显示更多简介
- 🔗 原始链接：显示原始链接
- 
- 📚 恢复《》：恢复正文内被替换的书名号《》
- 🖼️ 显示描述：章首显示描述
- 🐞 调试模式：开启调试模式
- 
- **⏳ 图片解析：选择解析图片网站，获取 Pixiv 图片直链**
- **🔗 图片链接：选择下载图片网站，Pixiv 图片直链 => 站方图片链接**
- ↔️ 图片大小：切换图片大小，加快加载速度


## 互动功能 {#Interact}
### ⏺️ 互动功能 {#InteractFunction}
> [!NOTE]
> **⏺️ 互动功能 => 书架 - 小说阅读界面 - Linpx - 登录**

![img](./pic/LinpxLoginUINovels.png)

- ⤴️ 分享章节：复制当前小说 Linpx 链接
- ⤴️ 分享作者：复制当前作者 Linpx 链接
- 🅿️ 分享小说：复制当前小说 Pixiv 链接


<!--@include: CommonSuffix.md-->

