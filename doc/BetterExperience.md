---
layout: doc
title: 臻享阅读 - 开源阅读 Legado + Pixiv 书源完整配置指南
description: 告别 Pixiv 官方 App 的阅读缺陷，用开源阅读 Legado + Pixiv 书源实现书架、搜索、收藏、追更、评论、直连等完整阅读体验。

head:
  - - meta
    - name: keywords
      content: 臻享阅读, 开源阅读 Pixiv, Legado Pixiv 书源配置, Pixiv 直连, Pixiv 小说书架, Legado 登录 Pixiv
  - - meta
    - property: og:title
      content: 臻享阅读 - 开源阅读 Legado + Pixiv 书源完整配置指南
  - - meta
    - property: og:description
      content: 告别 Pixiv 官方 App 的阅读缺陷，用开源阅读 Legado + Pixiv 书源实现书架、搜索、收藏、追更、评论、直连等完整阅读体验。
---

<div align="center">
<img width="150" height="150" src="./pic/BookSourcePixiv.png" alt="Pixiv BookSource"/>
<br>

# ✨ 臻享阅读 ✨
## 最好的 Pixiv 第三方小说阅读器
### 🅿️ [开源阅读](https://github.com/Luoyacheng/legado) Pixiv 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
#### ☕ [书源项目打赏名单](Sponsor.md)
</div>


> [!TIP]
>
> **熟练使用【开源阅读】的读者可以看这篇指南：**
> [⚡️ 快速开始](QuickStart.md)


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


### ⬇️ 下载阅读 {#DownloadLegado}
> [!IMPORTANT] 重要
>
> 点击链接，下载 **【阅读 Plus】** 安装包并安装软件
>
> https://loyc.xyz/c/legado.html#download

> [!TIP]
>
> **Android 设备：阅读 + Pixiv 书源**
>
> **苹果设备可用：源阅 + Pixiv 书源**
> **，详见：[下载阅读](Download.md)**


## 软件介绍 {#LegadoIntroduction}
像常规阅读软件一样，也有：书架、搜索、发现、我的 等页面
### 📚 书架页面 {#Shelf}
添加小说后如图：
![img](./pic/LegadoBookShelf.png)

### 🔎 搜索页面 {#Search}
添加书源后如图：
![img](./pic/SearchViaLegado.png)

### ⭐️ 发现页面 {#discover}
添加书源后如图：

![img](./pic/LegadoDiscover.png)

### 👤 我的页面 {#Mine}
多数阅读软件的我的页面都有登录账号

与常规阅读软件不同，【开源阅读】的我的页面，最上面却是【书源管理】

![img.png](./pic/LegadoProfile.png)

> [!IMPORTANT] 重要
> **设置中的这两项非常重要**，稍后讲解：
>  - **【书源管理】** 查看 [书源管理](#BookSourceSet)
>  - **【备份与恢复】** 查看 [备份与恢复](#WebdavBackup)


## 概念介绍 {#SourceIntroduction}
### 📖 书源 {#BookSource}
> [!NOTE]
> **【开源阅读】没有账号体系，软件本身并不提供小说资源**
> 
> **提供小说资源的是【书源】，准确来说是书源内部的网站**
> 
> **书源是指导阅读浏览器，向书源内部网站请求数据的一套方法**

**有什么网站的书源，就可以看什么网站的小说**
- 有【起点】书源，就可以看 起点网文
- 有【番茄】书源，就可以看 番茄小说
- 有【Pixiv】书源，就可以看 Pixiv 小说

### 🌐 订阅源 {#RssSource}
> [!NOTE]
> 
> 「订阅源类似于RSS，甚至可以听音乐看视频」
> 
> **这里提供的订阅源类似于浏览器书签，可以在阅读软件（订阅界面）内快速访问相关网站**


### 🚀 导入书源 & 订阅源 {#ImportSources}
- **书源、订阅源的内部数据不同，添加源（网络导入、规则订阅）的时候需要区分**
- 这里使用的是**一键导入，不需要区分二者**

> [!IMPORTANT] 重要
> 
> **点击下方链接，一键导入书源、订阅源**
> 
> 🅿️ [一键导入 Pixiv 书源](https://loyc.xyz/b/cdx.html?src=legado://import/importonline?src=https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/pixiv.json)
>
> 🐲 [一键导入 Pixiv 订阅源](https://loyc.xyz/b/cdx.html?src=legado://import/importonline?src=https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/btsrk.json)
- 一般来说，书源开发者**同时提供书源和订阅源的话，最好都要导入**
- **这样才能保证最佳的使用体验**


## 书源配置 {#BookSourceSet}
### 📡 开启代理 {#SetProxy}
> [!TIP]
>
>  - 此处略过，**最好开启【全局代理】，确保阅读可用访问代理**
>  - 如果你可以直接访问 Pixiv ，可以略过这一步


### 🅿️ 登录账号 {#LoginAccount}
> [!NOTE]
> 
> **有账号的网站，在书源里登录账号才能阅读相关小说**
> 
> **🅿️ 登录账号 => 我的 - 书源管理 - Pixiv 小说 - 登录**

打开书源管理，有书源的话，点击书源菜单后，应该是这样的：

![img](./pic/PixivLogin1.png)

**点击【登录】，打开书源登录界面**

![img](./pic/PixivLoginUIBase.png)

**点击【🅿️ 登录账号】，跳转 Pixiv 登录界面，输入账号密码**

![img](./pic/PixivLogin2.jpg)

> [!TIP]
>
> **如果需要验证码，请更换代理，或过段时间再次尝试**
- **登录成功后，点击右上角的对勾返回，即可使用 Pixiv 书源查看小说了**
- 但还请注意，**此时阅读的配置还没有全部完成**


### ✈️ 直连模式（可选） {#IPDirect}
> [!TIP]
> 
> **完成【登录账号】后，可在登录界面开启【直连模式】**
> 
> **开启【直连模式】后，无需代理，即可阅读小说**

![img](./pic/PixivLoginUIBase.png)

> [!TIP]
> 
> **切换直连模式后，搜索、发现会自动启用直连链接**

![img](./pic/PixivIPDirect.png)
> [!IMPORTANT] 重要
> **🚫 直连模式下，以下功能不可用：**
>  - **搜索：搜索作者**
>  - **发现：书签、首页、排行榜**
>  - **目录：显示原始链接**

> [!NOTE]
>
> **直连功能参考自 [洛娅橙的阅读仓库](https://github.com/Luoyacheng/yuedu)**
>
> **其直连功能参考自 [PixEz Flutter](https://github.com/Notsfsssf/pixez-flutter)**


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


## 书源功能 {#BookSourceFunction}
> [!NOTE]
>
> **书源众多功能均在登陆页面内，进入登录页面有以下两种方式：**
>
> **⏺ 互动功能 => 书架 - 阅读界面 - Pixiv 小说 - 登录**
>
> **⚙️ 书源设置 => 我的 - 书源管理 - Pixiv 小说 - 登录**


### ⏺ 互动功能 {#InteractiveFunction}
> [!TIP]
>
> **⏺ 互动功能 => 书架 - 阅读界面 - Pixiv 小说 - 登录**

![img.png](./pic/PixivLogin0.png)

此处打开登录界面，可以显示 **互动功能**

![img](./pic/PixivLoginUINovels.png)

- **❤️ 收藏本章：添加公开收藏、切换私密收藏**
- **📃 追更系列：追更系列、取消追更**
- **❤️ 收藏系列：公开收藏系列内的每篇小说（可追加）**
-
- **🖤 取消收藏：短按取消收藏本章、长按取消收藏系列**
- **⭐️ 关注作者：关注作者（按钮 & 浏览器）、取消关注**
- **🚫 屏蔽作者：屏蔽作者、取消屏蔽（本地）**
-
- **✅ 发送评论：当前章节下发送评论（自动拆分超长评论）**
- **🗑 删除评论：当前章节下删除评论（支持批量删除评论）**
- **🔄 刷新本章：刷新章节正文（以及评论）**


### ▶️ 自定功能 {#Customization}
> [!TIP]
>
> **▶️ 自定功能 => 书架 - 阅读界面 - Pixiv 小说 - 登录**

![img](./pic/PixivLoginUIFunctions.png)

**屏蔽功能（本地）：**
- **🚫 屏蔽关键词**
  - 🚫 添加屏蔽、⭕️ 取消屏蔽
  - 👀 查看屏蔽（切换：屏蔽标签、屏蔽描述、屏蔽作者）
  - 详见：[屏蔽功能](Pixiv.md#CustomizationBan)
- **🚫 屏蔽作者（互动功能，见上方）**
  - 🚫 添加屏蔽、⭕️ 取消屏蔽
- **🚫 隐藏小说（书源设置，见下方）**
  - ❤️ 隐藏收藏、📃 隐藏追更

**自定义发现（本地）：**
- **📌 添加喜欢标签**
  - 📌 添加标签、🗑️ 删除标签、👀 查看标签
- **❤️ 关注他人收藏**
  - ❤️ 添加关注、🖤 取消关注、👀 查看关注
- 详见：[发现功能](Pixiv.md#CustomizationDiscover)


### 👀 显示设置按钮 {#ShowSettings}
> [!TIP]
>
> **👀 显示设置按钮 => 我的 - 书源管理 - Pixiv 小说 - 登录**
>
> **️👀 显示设置按钮 => 书架 - 阅读界面 - Pixiv 小说 - 登录**

![img.png](./pic/PixivLogin1.png)

此处打开登录界面，可以 **显示/隐藏 书源设置按钮、发现设置按钮**

![img](./pic/PixivLoginUIBase.png)
点击【👀 书源设置】【👀 发现设置】即可 **显示/隐藏 相关设置按钮**
- **书源管理** 的两设置按钮 **默认显示**  
- **阅读界面** 的两设置按钮 **默认隐藏**


### ⚙️ 书源设置 {#BookSourceSettings}
> [!TIP]
>
> **⚙️ 书源设置 => 我的 - 书源管理 - Pixiv 小说 - 登录**

![img](./pic/PixivLoginUISettings.png)

此处的**按钮图标，基本上会和实际的设置同步**

- ⚙️ 当前设置：显示当前设置
- 🔧 默认设置：恢复默认设置
- 👤 搜索作者：切换搜索关键词、模糊搜索作者
-
- 🀄 繁简通搜：搜索进行繁简转换（搜索标签、搜索作者不转换）
- 📖 更多简介：详情显示更多简介
- 📅 更新时间：目录显示更新时间
-
- 🔗 原始链接：显示原始链接
- 📚 恢复《》：恢复正文内被替换的书名号《》
- 🖼️ 显示描述：章首显示描述
-
- 💬 显示评论：章尾显示评论
- ❤️ 隐藏收藏：搜索发现 显示/隐藏 收藏单篇小说
- 📃 隐藏追更：搜索发现 显示/隐藏 追更系列小说
-
- ⏩ 快速模式：开启快速模式（关闭影响搜索速度的功能）
- 🐞 调试模式：开启调试模式
- 🔍 搜索说明：显示搜索说明


### 🔍 发现设置 {#DiscoverSettings}
> [!TIP]
>
> **🔍 发现设置 => 我的 - 书源管理 - Pixiv 小说 - 登录**

![img](./pic/PixivLoginUIDiscover.png)

- 🔍 当前发现：显示当前发现设置
- ⏺️ 其他按钮：发现 显示/隐藏 对应功能
- 🐺 兽人小说：发现 显示/隐藏 兽人小说；优化兽人小说搜索作者


## 📖 [畅享阅读](Pixiv.md#All) {#All}
- 🔍 搜索小说：书架页面，搜索小说，添加小说到书架
- ⭐️ 发现小说：发现页面，查看小说，添加小说到书架
- 🔗 添加网址：书架页面，通过 **【添加网址】** 添加小说到书架
- 🌐 订阅源：订阅页面，通过 **【订阅源】** 添加小说到书架
- 🖼️ 全部功能：详见 [全部功能](Pixiv.md#All)


## ☕️ [支持开发](Sponsor.md) {#Sponsor}
> [!NOTE]
>
> **如果书源帮到了你，欢迎请开发者喝杯咖啡**
> 
> **你的鼓励是持续更新的动力～**