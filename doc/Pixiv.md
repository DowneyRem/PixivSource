---
layout: doc
title: Pixiv 书源全功能使用手册
description: 深度解析 Pixiv 书源用法：高级搜索、发现设置、收藏、追更、评论、屏蔽作者、屏蔽标签、自定义发现，直连模式等。

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
      content: Pixiv 高级搜索, Pixiv 书源封号预防, Pixiv 直连模式, Pixiv 屏蔽标签, Pixiv 屏蔽作者, Pixiv 书源搜索语法, Pixiv 直连模式, Pixiv 收藏追更, Pixiv 屏蔽标签, Pixiv 书源发现设置
  - - meta
    - property: og:title
      content: Pixiv 书源全功能使用手册
  - - meta
    - property: og:description
      content: 深度解析 Pixiv 书源用法：高级搜索、发现设置、收藏、追更、评论、屏蔽作者、屏蔽标签、自定义发现，直连模式等。
  - - meta
    - property: og:image
      content: /pic/BookSourcePixiv.png

repos:
  - name: Pixiv 书源
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


# [Pixiv](https://www.pixiv.net) 书源 功能手册
#### 🅿️ 开源阅读 Pixiv 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
</div>


> [!WARNING]
> ⚠️ **你正在 GitHub 上浏览此文档， Github 文档可能不完整
> [网页版](https://pixivsource.pages.dev/Pixiv)
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
> 🔍 [搜索小说](#SearchNovel)；
> ⭐️ [发现小说](#DiscoverNovel)；
> 🔗 [添加网址](#AddUrl)；
> 🌐 [订阅源](#RssSource)；
> ⚙️ [️设置功能](#Settings)；
> ⏺️ [互动功能](#Interact)**


### ⚠️ 使用须知 {#Notice}
> [!CAUTION]
> #### ⚠️ 使用本书源造成的一切损失均由【使用者】自行承担

> [!WARNING]
> #### ⚠️ 请勿在 Pixiv 平台宣传本项目（书源）
> <details><summary><strong> 📄 包括但不限于以下内容 </strong></summary>
>
>  - 项目名称：
>    - **Pixiv 书源**
>    - **PixivSource**
>  - 项目链接：
>    - https://github.com/DowneyRem/PixivSource
>    - https://github.com/windyhusky/PixivSource
>    - https://github.com/eigeen/PixivSourceProject
>  - 书源主页：
>    - https://downeyrem.github.io/PixivSource
>    - https://pixivsource.pages.dev
>  - 项目参与者链接：
>    - https://github.com/DowneyRem
>    - https://github.com/windyhusky
>    - https://github.com/eigeen
> </details>


> [!IMPORTANT]
> ##### ⚠️ 使用本书源时，请务必在阅读设置里 [关闭【自动刷新】](BetterExperience.md#TurnOffAutoRefresh)


> [!WARNING]
> ##### ⚠️ 不建议在书架上添加过多小说（超过100篇）


> [!NOTE]
> ##### 📌 最新版【阅读 Sigma + 书源】已支持降低刷新书架时的并发率，但依然不建议在书架上添加过多小说


<!--@include: CommonDownload.md-->

<!--@include: CommonImport.md-->


<div v-if="false">
<!--@include: CommonPixiv.md-->

<!--@include: CommonLegado.md-->
</div>


## 搜索小说 {#SearchNovel}
> [!NOTE]
> **书架页面 - 放大镜 - 输入关键词 - 搜索小说 - 添加小说到书架**
>
> 同时搜索：**Pixiv 网站上小说、本地书架上的小说**


### 🔎 搜索小说 {#SearchNovels}
> [!TIP]
> ✅ 默认搜索：同时搜索**小说名称、系列小说名称、标签**

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


### ➖ 排除标签 {#ExcludeTags}
> [!TIP]
> **格式：`标签1 -标签2` `标签1 -标签2 -标签3`**
> 
> **使用减号 `-` 在搜索结果中，排除不想看的的标签**
> 
> **每个排除的标签前都需要添加减号`-`，减号前需加空格，减号后无需空格**
> 
> **由 Pixiv 官方提供支持**，
> 仅适用于单次搜索

![img](./pic/SearchViaLegadoExclude.jpg)


###  ➕ 多选标签 {#MultipleTags}
> [!TIP]
> **多选标签（格式：`标签1 or 标签2` `标签1 or 标签2 or 标签3`）**
> 
> 使用 `or` 同时搜索多个标签（满足其一即可，也就是取并集）
> 
> **可相互替换的标签间添加` or `，前后需要空格间隔**
> 
> **由 Pixiv 官方提供支持**，
> 仅适用于单次搜索

![img](./pic/SearchViaLegadoUnion.jpg)


###  👤 搜索作者(模糊) {#SearchAuthorFuzzy}
> [!TIP]
> **模糊搜索作者（格式：`$作者名称`）**
> 
> **仅搜索作者；不进行繁简转换**，使用方法：
> 
> **1️⃣ 使用 `$` 标记符，例如：`$pixiv事務局`**
> 
> 2️⃣ 设置中，开启【👤 搜索作者】时，无需添加标记符，例如：`pixiv事務局`

![img](./pic/SearchViaLegadoAuthor.png)


###  👤 搜索作者(精确) {#SearchAuthorExact}
> [!TIP]
> **精确搜索作者（格式：`@作者名称`）**
> 
> **使用 `@` 标记符，例如：`@pixiv事務局`，仅搜索作者；不进行繁简转换**
> 
> 可与【字数过滤】同时使用，格式：`@作者名称 字数3k`
> 
> 可与【标签专搜】同时使用，格式：`@作者名称 #标签`，筛选 `@作者` 的具有 `#标签` 的小说

![img](./pic/SearchViaLegadoAuthor.jpg)


### #️⃣ 标签专搜 {#SearchTag}
> [!TIP]
> **标签专搜（格式：`#标签1` 或 `#标签1 标签2`）**
> 
> **仅搜索标签、小说名称；多个标签空格间隔，不进行繁简转换**
> 
> **`#` 为标记符，打出1个即可，例如：`#校园` `#校园 纯爱` `#校园 纯爱 BG`**
> 
> 可与【排除标签】【字数过滤】同时使用

![img](./pic/SearchViaLegadoHashtag.jpg)


###  ⏬ 字数过滤 {#LengthFilter}
> [!TIP]
> **字数过滤（格式：`关键词 字数3k`）** 
> 
> **字数限制规则：`3k 3k5 3w 3w5`【注意`k`与`w`均为小写】** 
> 
> 例如：`校园 字数3k` `校园 纯爱 字数3k`
> 
> 可与【标签专搜】【排除标签】同时使用

![img](./pic/SearchViaLegadoWordCountFilter1.jpg)
- 可与【搜索作者】同时使用

![img](./pic/SearchViaLegadoWordCountFilter2.jpg)


###  🔝 高级搜索 {#AdvancedSearch}
> [!TIP]
> **上述搜索规则基本可以共同使用**，~~发挥你的想象力，自由组合吧~~
> 
> 搜索`@作者`指定`#标签1`或`标签2`，排除`标签3`，筛选字数 `3k` 及以上的小说：
> 
> **格式：`@作者 #标签1 or 标签2 -标签3 字数3k`**
> 
> 搜索 `#标签1`或`标签2`，排除`标签3`，筛选字数 `3k` 及以上的小说： 
> 
> **格式：`#标签1 or 标签2 -标签3 字数3k`**


## 发现小说 {#DiscoverNovel}
> [!NOTE]
>
> **发现页面 - 点击“Pixiv 小说” - 点击按钮 - 添加小说到书架**

> [!TIP]
>
> Pixiv 有诸多推荐小说的功能，这些功能均在**发现页面**


### 📌️ 默认发现 {#DiscoverDefault}
![img](./pic/DiscoverPixiv.png)
> [!TIP]
>
> 🔞 默认发现 => **✅ 默认显示，不可隐藏**

- ⭐️ 关注：[关注作者，最新小说](https://www.pixiv.net/novel/bookmark_new_r18.php)
- 📃 追更：[追更列表](https://www.pixiv.net/following/watchlist/novels)
- 💯 推荐：[推荐作品](https://www.pixiv.net/novel)
- 🔍 发现：[发现小说](https://www.pixiv.net/novel/discovery?mode=r18)
- 
- ❤️ 收藏：[公开收藏](https://www.pixiv.net/users/1234/bookmarks/novels?rest=show&mode=all)
- ㊙️ 收藏：[匿名收藏](https://www.pixiv.net/users/1234/bookmarks/novels?rest=hide&mode=all)
- 🏷️ 书签：[书签](https://www.pixiv.net/novel/marker_all.php)
- 🏠 首页：[首页](https://www.pixiv.net)


### ⭐️ 常规小说 {#DiscoverNormal}
![img](./pic/DiscoverPixiv.png)
> [!TIP]
>
> 💼 常规小说推荐 => **✅ 默认显示，可以隐藏**，
> 可在 **发现设置** 中修改【💼 常规小说】

- ⭐️ 关注：[关注作者，最新小说](https://www.pixiv.net/novel/bookmark_new.php)
- 💯 推荐：[推荐作品](https://www.pixiv.net/novel)
- 🔍 发现：[发现小说](https://www.pixiv.net/novel/discovery?mode=safe)


### 🆙 更新书源 {#UpdateSource}
> [!NOTE]
>
> **💼 常规小说 的发现按钮中，点击按钮【🆙 更新】进入书源更新界面**

![img](./pic/UpdateSource.png)

> [!TIP]
>  - Jsdelivr CDN 更新有延迟
>  - Github 更新需代理
>  - Codeberg 更新免代理


### 🆕 最新企划 {#NewProgect}
![img](./pic/DiscoverPixivNew.png)
> [!TIP]
> 
> 🔞 最新企划约稿 => **✅ 默认显示**
> 
> 💼 最新企划约稿 => ❌ 默认隐藏
> 
> 可在 **发现设置** 中修改【🔞 最新企划】【💼 最新企划】

- 🔞 最新企划约稿 => **✅ 默认显示**
  - 🆕 最新：[大家的新作](https://www.pixiv.net/novel/new_r18.php)
  - 📑 企划：[用户企划](https://www.pixiv.net/user_event.php?type=novels&mode=r18)
  - 💰 约稿：[小说约稿](https://www.pixiv.net/request/complete/novels?mode=r18)
  - 🔍 发现：[发现小说](https://www.pixiv.net/novel/discovery)

- 💼 最新企划约稿
  - 最新：[大家的新作](https://www.pixiv.net/novel/new.php)
  - 企划：[用户企划](https://www.pixiv.net/user_event.php?type=novels)
  - 约稿：[小说约稿](https://www.pixiv.net/request/complete/novels)
  - 编辑：[编辑部推荐作品](https://www.pixiv.net/novel/editors_picks)


### 👑 小说排行 {#Ranking}
![img](./pic/DiscoverPixivRanking.png)
> [!TIP]
>
> 🔞 排行榜单：
> [排行榜](https://www.pixiv.net/novel/ranking.php?mode=daily_r18)
> => **✅ 默认显示**
> 
> 💼 排行榜单：
> [排行榜](https://www.pixiv.net/novel/ranking.php)
> => ❌ 默认隐藏
>
> 可在 **发现设置** 中修改【🔞 排行榜单】【💼 排行榜单】


### 🔥 原创热门 {#Trending}
![img](./pic/DiscoverPixivHot.png)
> [!TIP]
>
> 🔞 原创热门：
> [原创热门](https://www.pixiv.net/genre/novel/male?mode=r18)
> => ❌ 默认隐藏
> 
> 💼 原创热门：
> [原创热门](https://www.pixiv.net/genre/novel)
> => ❌ 默认隐藏
>
>  可在 **发现设置** 中修改【🔞 原创热门】【💼 原创热门】


### 📌 [喜欢标签](#LikeTags) {#LikeTagsDiscover}
![img](./pic/DiscoverPixivLikeTags.png)
> [!TIP]
> 
> **可在登录界面中，通过【📌 喜欢标签】添加**
> 
> **⏺️ 互动功能 => 书架 - 小说阅读界面 - Pixiv 小说 - 登录**


### ❤️ [他人收藏](#LikeAuthors) {#LikeAuthorsDiscover}
![img](./pic/DiscoverPixivLikeAuthors.jpg)
> [!TIP]
>
> **可在登录界面中，通过【❤️ 他人收藏】添加，详见：**
>
> **⏺️ 互动功能 => 书架 - 小说阅读界面 - Pixiv 小说 - 登录**


<!--@include: CommonAddViaLink.md-->


## 订阅源 {#RssSource}
> [!NOTE]
>
> **订阅 - Pixiv - 打开小说正文/系列小说目录 - 添加小说到书架**

> [!TIP]
>
> 如果你不习惯使用阅读软件，可以**在这里打开 Pixiv 网页版**
>
> **并通过【加入书架】按钮，添加小说到书架**

![img](./pic/SubscribeMainPage.png)


### ⬇️ 导入书源 {#ImportSource}
![img](./pic/InportBookSourcePixivWeb.png)

- 点击按钮，导入书源；再次点击，则可更新书源
- 此处使用的是 Jsdelivr CDN ，更新有延迟

![img](./pic/InportBookSourcePixiv.png)


### 🔍 站内搜索 {#SearchViaSite}
Pixiv 网站的搜索功能更加全面，可以替代阅读搜索

![img](./pic/SearchViaPixiv.png)


### ➕ 添加小说 {#AddViaSite}
在阅读内部浏览器内打开 Pixiv 小说/系列小说页面，【刷新】，点击【加入书架】按钮添加小说到书架

- 小说正文页，添加小说到书架
![img](./pic/AddBookViaPixiv1.png)

- 系列目录页，添加系列到书架
![img](./pic/AddBookViaPixiv2.png)


<!--@include: CommonPixivFunction.md-->


<!--@include: CommonSuffix.md-->