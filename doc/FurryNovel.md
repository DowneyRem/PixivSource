---
layout: doc
title: FurryNovel 书源指南 - 在开源阅读中阅读兽人小说
description: 用开源阅读 Legado + FurryNovel 书源，搜索、发现、阅读兽人控小说站收录的 Pixiv、Bilibili 兽人小说，无需登录，无需代理。

head:
  - - meta
    - name: keywords
      content: FurryNovel 书源, 兽人控小说站, 兽人小说阅读, 兽人小说书源
  - - meta
    - property: og:title
      content: FurryNovel 书源指南 - 在开源阅读中阅读兽人小说
  - - meta
    - property: og:description
      content: 用开源阅读 Legado + FurryNovel 书源，搜索、发现、阅读兽人控小说站收录的 Pixiv、Bilibili 兽人小说，无需登录，无需代理。
---

<div align="center">
<img width="150" height="150" src="./pic/BookSourceFurryNovel.png" alt="FurryNovel BookSource"/>
<br>

# FurryNovel 书源指南
### 🐯 [开源阅读](https://github.com/Luoyacheng/legado) FurryNovel 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
#### ☕ [书源项目打赏名单](./Sponsor.md)
</div>


> [!TIP]
>
> **从未使用过【开源阅读】的读者可以看这篇指南：**
> [✨臻享阅读](BetterExperience.md)


## [兽人控小说站](https://www.furrynovel.com) 收录了 Pixiv, Bilibili 的大部分兽人小说
### ⬇️ 下载阅读 {#DownloadLegado}
> [!IMPORTANT] 重要
>
> 点击链接，下载 **【阅读 Plus】** 安装包并安装软件
>
> https://gitee.com/lyc486/legado/releases/download/3.26.030717/legado_%E6%AD%A3%E5%BC%8F%E7%89%88_3.26.03071721_releaseS.apk
> 
> **苹果设备及更多兼容软件详见：** [下载阅读](./Download.md)


### 🚀 导入书源 & 订阅源 {#ImportSources}
> [!IMPORTANT] 重要
>
> **点击下方链接，一键导入书源、订阅源**
>
> 🦊 [一键导入 兽人控小说站 书源](https://loyc.xyz/b/cdx.html?src=legado://import/importonline?src=https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/linpx.json)
>
> 🐲 [一键导入 兽人控小说站 订阅源](https://loyc.xyz/b/cdx.html?src=legado://import/importonline?src=https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/btsrk.json)
>
> **更多导入方法详见：** [如何导入书源](./ImportBookSource.md)


## 书源配置 {#BookSourceSet}
### ✅ 确保网站可以访问 {#CheckAccess}
> [!NOTE]
>
> **有账号的网站，在书源里登录账号才能阅读相关小说**
>
> **Linpx & 兽人控小说站 暂无账号体系，无需登录即可使用**

**订阅 - 点击 Linpx / 兽人控小说站 - 打开网站**

- 如果可以直接打开，那么一切大功告成！
  - **多数网络下，Linpx & 兽人控小说站 无需代理即可访问**
  - Linpx & 兽人控小说站 没有账号体系，**无需登录即可使用**，不必做过多的操作

- 如果 **无法直接打开** 则可以：
  - 切换至其他网络（**更换网络运营商、使用流量或 WIFI**）后再尝试
  - 开启代理后再尝试


## 阅读设置 {#LegadoSettings}
### 💾 [备份恢复](WebdavBackup.md) {#WebdavBackup}
> [!IMPORTANT] 重要
>
> **【开源阅读】没有账号体系，不能在登录书源网站的同时恢复数据**
>
> **需要配置 Webdav 服务，才能从云端恢复数据**
>
> **详见：[备份与恢复](WebdavBackup.md)**


### 🔄 关闭刷新 {#TurnOffAutoRefresh}
> [!IMPORTANT] 重要
>
> **使用时，请在设置里，关闭自动刷新**
>
> **否则很容易触发触发请求限制，甚至封号**

**我的 - 其他设置 - 自动刷新**

![img](./pic/LegadoSettingsAutoRefreash.png)

> [!NOTE]
>
> **截止到这里，你基本上就拥有了完整的阅读体验了**
>
> **可以像是使用常规阅读软件一样，使用开源阅读了**


### ☁️ [远程书籍](RemoteBooks.md)（可选） {#RemoteBooks}
> [!TIP]
>
> **使用支持 Webdav 的网盘，阅读网盘上的书籍**
>
> **详见：[远程书籍](RemoteBooks.md)**


## 高级功能 {#All}
### 🔍 搜索小说 {#SearchNovel}
<details><summary> 🔎 搜索小说 </summary>

✅ 支持搜索：小说名称、系列小说名称、作者名称、小说标签

![img](./pic/SearchViaLegado.png)
</details>


### ⭐️ 发现小说 {#DiscoverNovel}
<details><summary> ⭐️ 发现小说 </summary>

发现：热门小说、最新小说、随便来点

- <details><summary> ⭐️ 发现小说 </summary>
  
  ![img](./pic/DiscoverFurryNovel.png)
  </details>

- <details><summary> ⏬ 筛选发现 </summary>

  发现 - 长按 **"兽人小说站"** - 编辑 - 右上角菜单 - 设置源变量
  
  ![img](./pic/SetSourceVariable0.png)
  
  ![img](./pic/SetSourceVariable1.png)
  
  ![img](./pic/SetSourceVariable.png)
  
  设置源变量：输入标签，保存
  ```
  龙
  ```
  发现 - 长按 **"兽人小说站"** - 刷新 - 查看筛选后的小说
  
  ![img](./pic/DiscoverFurryNovelSort.png)
  </details>
</details>


### 🔗 添加网址 {#AddUrl}
<details><summary> 🔗 添加网址 </summary>

- 书架 - 菜单 - 添加网址 - 粘贴小说链接
- 可以同时添加多个小说的链接

- <details><summary> 🔗 操作流程 </summary>

  #### 3.1 操作流程
  ![img](./pic/AddBookViaUrl1.png)
  ![img](./pic/AddBookViaUrl2.png)
  ![img](./pic/AddBookViaUrl3.png)
  </details>

- <details><summary> 🔗 支持链接 </summary>

  #### 3.2 支持链接
  - 兽人控小说站 目录链接
  ```
  https://furrynovel.com/zh/novel/8312
  ```
  - 兽人控小说站 章节链接
  ```
  https://furrynovel.com/zh/novel/8312/chapter/33116
  ```
  </details>
</details>


### 🌐 订阅源 {#RssSource}
<details><summary> 🌐 订阅源 </summary>

- <details><summary> ⬇️ 导入书源 </summary>

  ![img](./pic/InportBookSourceFurryNovelWeb.png)

  - 点击按钮，导入书源；再次点击，则可更新书源
  - 此处使用的是 Jsdelivr CDN ，更新有延迟

  ![img](./pic/InportBookSourceLinpx.png)
  </details>

- <details><summary> 🔍 站内搜索 </summary>

  #### 4.1 替代阅读搜索
  受阅读设计的限制，阅读内部搜索不可能完全支持 Linpx 的功能。网站的搜索功能更加全面。

  ![img](./pic/SearchViaFurryNovel.png)
  </details>

- <details><summary> ⭐️ 站内发现 </summary>

  #### 4.2 替代阅读发现
  阅读内部浏览器打开 Pixiv，即可使用 Pixiv 书源未完成的功能，如排行榜等功能
  
  ![img](./pic/FurryNovelRaces.png)
  </details>

- <details><summary> ➕ 添加小说 </summary>

  #### 4.3 添加小说至书架
  在阅读内部浏览器内打开 兽人控小说站 小说页面，点击【添加到书架】按钮即可添加小说到书架
  
  ![img](./pic/AddBookViaFurryNovel1.png)
  ![img](./pic/AddBookViaFurryNovel2.png)
  </details>
</details>


## 🐞 [故障处理](./TroubleShoot.md) {#TroubleShoot}


## ☕️ [支持开发](./Sponsor.md) {#Sponsor}
> [!NOTE]
>
> **如果书源帮到了你，欢迎请开发者喝杯咖啡**
>
> **你的鼓励是持续更新的动力～**

## 🐲 本教程由兽人阅读频道 [@FurryReading](https://t.me/FurryReading) 提供
