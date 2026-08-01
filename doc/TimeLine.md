---
layout: doc
title: 项目进展 - Pixiv 书源项目 & 开源阅读时间线
description: Pixiv 书源项目进展 & 开源阅读时间线

#sidebar: false
#aside: false
#editLink: false
#lastUpdated: false
#prev: false
#next: false
#comment: false
#friendLink: false

---

<script setup>
import { computed } from "vue";
import { useData } from "vitepress";

const { page } = useData();
const pagePath = computed(() => page.value.relativePath.replace(/\.md$/, ""));
</script>

<div align="center">
<img width="256" src="./pic/BookSourcePixiv.png" alt="Pixiv BookSource"/>

# 🚀 项目进展 🚀
#### 🅿️ 开源阅读 Pixiv 书源
</div>

> [!WARNING]
> ⚠️ **你正在 GitHub 上浏览此文档， Github 文档可能不完整
> [网页版](https://pixivsource.pages.dev/TimeLine)
> 内容更全面，排版更精美**


## ⚡️ 快速跳转 {#QuickJump}
> [!TIP]
> 项目进展：
> [2026](#2026)；
> [2025](#2025)；
> [2024](#2024)；
> [2023](#2023)；
> [2021](#2021)；
> [起源](#Beginning)；
> 📜 [更新日志](UpdateLog.md)；
> 🌱 [项目起源](Beginning.md)


## 🚀 项目进展
### 📆 2026 {#2026}
<br>

::: timeline 2026-07-03
> [!INFO]
> **喵公子 阅读 Beta 恢复更新**
:::

::: timeline 2026-07-10 
> [!IMPORTANT]
> **Linpx 网站更新，书源、订阅源同步更新**
>
> 优化订阅源JS注入代码
:::

::: timeline 2026-07-03
> [!INFO]
> **洛娅橙 阅读 Sigma 恢复更新**
:::

::: timeline 2026-06-15
添加书架自动收藏小说、追更系列小说
:::

::: timeline 2026-06-04
> [!IMPORTANT]
> **兼容：轻悦时光**；显示投票，进行投票
:::

::: timeline 2026-05-28
> [!WARNING]
> **喵公子删库跑路**，删除了 Beta 版本旧包名的仓库 `mgz0227/legado`、 移除了 Tauri 的仓库 `LegadoTeam/Legado-Tauri`， `LegadoTeam/Legado-Tauri-Release` 的所有代码
:::

::: timeline 2026-05-27
> [!WARNING]
>  **坤飞删库跑路**，移除了 `gedoor/legado` 的所有代码

> [!INFO]
> **坤飞 微信公众号【开源阅读】照常更新吃瓜新闻**
:::

::: timeline 2026-05-14
备份数据、恢复数据
:::

::: timeline 2026-04-02
互动模式，支持直连
:::

::: timeline 2026-03-25
> [!CAUTION]
> **阅文知识产权保护** 发布了 [维权行动｜近4000部网络小说遭侵权！检察机关亮剑“深度链接”侵权陷阱](https://telegra.ph/%E7%BB%B4%E6%9D%83%E8%A1%8C%E5%8A%A8%E8%BF%914000%E9%83%A8%E7%BD%91%E7%BB%9C%E5%B0%8F%E8%AF%B4%E9%81%AD%E4%BE%B5%E6%9D%83%E6%A3%80%E5%AF%9F%E6%9C%BA%E5%85%B3%E4%BA%AE%E5%89%91%E6%B7%B1%E5%BA%A6%E9%93%BE%E6%8E%A5%E4%BE%B5%E6%9D%83%E9%99%B7%E9%98%B1-03-25)

> [!WARNING]
> **受上述文章的影响，多个源作者群已解散**

> [!INFO]
> **坤飞 微信公众号【开源阅读】照常更新新闻（张雪峰逝世）**
:::

::: timeline 2026-03-10
> [!NOTE]
> Legado Tauri 横空出世，力争成为下一代的阅读
:::

::: timeline 2026-02-23
模糊搜索作者
:::

::: timeline 2026-02-16
> [!INFO]
> **坤飞 微信公众号【开源阅读】恢复更新（拜年）**
:::

::: timeline 2026-02-01
自动拆分超长评论
:::


---
### 📆 2025 {#2025}
<br>

::: timeline 2025-12-25
> [!IMPORTANT]
> **主用书源仅支持 [阅读 sigma](Download.md) 及其分支软件**
:::

::: timeline 2025-12-02
> [!WARNING]
> **项目首次归档。**
:::

::: timeline 2025-11-24
> [!NOTE]
> **书源网站创立，** 就是你目前看到的这个
> 
> 前期域名：https://downeyrem.github.io/PixivSource
:::


::: timeline 2025-11-11
> [!IMPORTANT]
> **书源仓库移交。从事实上的 maintainer 变成了实际的 maintainer**
:::

::: timeline 2025-11-01
> [!IMPORTANT]
> **喵公子的 Beta 版本合并了 阅读 Sigma 的代码，阅读 Sigma 正式成为主流**
:::

::: timeline 2025-09-07
> [!INFO]
> **洛娅橙开始开发 阅读 Sigma，后续成为了诸多书源的首选版**
:::

::: timeline 2025-06-04
进入书源作者交流群
:::

::: timeline 2025-02-24
内置更新功能
:::

::: timeline 2025-01-30
制作FN的书源
:::

::: timeline 2025-01-27
查看他人收藏
:::


---
### 📆 2024 {#2024}
<br>

::: timeline 2024-11-18
目录处显示小说原文链接/非API链接；尝试提供一站式导入书源、尝试直接提供自带书源（实际上是自带订阅）的阅读
:::

::: timeline 2024-09-10
恢复更新，基本上每月2个版本，在此期间有问题还会请教狗子
:::

::: timeline 2024-08-16
> [!NOTE]
> **坤飞发布了 3.25 正式版**，仅更新了版本号。这个版本后续成为了书源社群一大困扰
:::

::: timeline 2024-07-07
书源项目的收藏超过了 [FurryGamesIndex](https://github.com/FurryGamesIndex/games)，我首次参与的开源项目
:::

::: timeline 2024-06-18
> [!IMPORTANT]
> **在阅读官方群毛遂自荐，荣登 [阅读官方频道](https://t.me/Legado_Channels/1322) ，使得项目收藏大幅增加。**
:::

::: timeline 2024-06-17
发布了第5个版本。支持：添加网址、订阅源
:::

::: timeline 2024-06-04
> [!NOTE]
> 简单粗暴P了个项目Logo，引发了一个很不愉快的事情。很多人说这 Logo 不好看，我承认的确如此
:::

::: timeline 2024-06-02
发布了 [第5个版本](UpdateLog/2024.md#13)
:::

::: timeline 2024-05-31
使用正则替换正文标记符号，可以算是首次原创代码
:::

::: timeline 2024-04-03
**发布了 [第4个版本](UpdateLog/2024.md#12) ，也是我亲自发布的第一个版本。新功能：关注作者、推荐作者。**
:::

::: timeline 2024-04-01
> [!WARNING]
> **Linpx 要关站了，不是愚人节玩笑。所幸随后有人接盘。**
:::

::: timeline 2024-03-28
关注作者：第一次抄了书源的代码，并且成功运行了
:::

::: timeline 2024-03-25
> [!NOTE]
> **与兽人控小说站站长沟通，站长允许我们开发书源，并同意为我们提供帮助。**
:::

::: timeline 2024-03-24
添加书架：抄了第一段订阅源的代码，使用JS注入，通过添加网址添加到书架
:::

::: timeline 2024-03-24
**在毫无JS基础，只有英语基础的前提下，开始阅读书源源码。我该庆幸狗子用的都是英语了，英语可真是个国际通用语言……**
:::

::: timeline 2024-02-21
> [!NOTE]
> **喵公子正式发布 Beta 版本，并创建了 [Beta 版频道](https://t.me/Legado_Beta)**
:::


---
### 📆 2023 {#2023}
<br>

::: timeline 2023-11-01
> [!IMPORTANT]
> **阅读正式版 发布最后一个有实质更新的apk（正式版3.25没有实质更新）。**
:::

::: timeline 2023-10-04
> [!WARNING]
> **阅读正式版 预告停更，坤飞疑似跑路**，撤销原来的蓝奏云链接
> [!NOTE]
> **喵公子发布了 [新的蓝奏云链接](https://miaogongzi.lanzout.com/b01rgkhhe)，开始发布 Beta 版本**
> 
> 谷歌 Play 上的 Pro 版功能已合入 Beta 版本
:::

::: timeline 2023-08-02
> [!INFO]
> **坤飞 微信公众号【开源阅读】发布了在23年最后一份吃瓜新闻**
:::

::: timeline 2023-04-03
> [!IMPORTANT]
> **因前期多次写文档多此合并PR比较麻烦，成了 collaborator**
:::

::: timeline 2023-03-20
阅读恢复 Rhino 引擎，书源再次可用
:::

::: timeline 2023-03-09
阅读回退 Rhino 引擎，短期内不支持ES6，故书源无法使用
:::

::: timeline 2023-02-16
狗子发布了 [第3个版本](UpdateLog/2024.md#11) 。同时发布了：P站、Linpx 书源、以及两站的订阅源
:::

::: timeline 2023-02-14
**首次赞助 Linpx**
:::

::: timeline 2023-01-07
> [!IMPORTANT]
> **与 Linpx 站长沟通N次后，站长终于允许我们开发书源，并同意为我们提供帮助。**
:::

::: timeline 2023-01-07
**适逢狗子时间充足，他兴致再起，再度回归开发。**
:::


---
### 📆 2021 {#2021}
<br>

::: timeline 2021-08-01
> [!NOTE]
> 狗子发布了 [第2个版本](UpdateLog/2024.md#2)。搜索时合并同一系列的小说、支持单篇小说、目录处翻页
> 
> 此时的书源，有关看小说的部分，已经可以正常使用了
:::

::: timeline 2021-04-10
> [!IMPORTANT]
> 狗子发布了 [第1个版本](UpdateLog/2024.md#1) 。只支持系列小说
:::

::: timeline 2021-03-28
> [!NOTE]
> 狗子在 Github 上 [创建仓库](https://github.com/windyhusky/PixivSource)，上传代码 
:::

::: timeline 2021-03-02
> [!INFO]
> **与狗子协商，狗子同意开发 Pixiv 书源**
:::


### 🌱 [起源](Beginning.md) {#Beginning}
> [!TIP]
> **一个想法：如果能在【开源阅读】里，直接看到P站作品的话，那阅读体验岂不是要暴增？**