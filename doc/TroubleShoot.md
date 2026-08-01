---
layout: doc
title: 故障排查与处理
description: 故障排查与处理

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
       content: 开源阅读 故障排查, 开源阅读 故障处理, 开源阅读 调试书源, 开源阅读 图片显示为链接, legado 故障排查, legado 故障处理, legado 调试书源, legado 图片显示为链接,
   - - meta
     - property: og:title
       content: 开源阅读 Legado 故障排查与处理
   - - meta
     - property: og:description
       content: 开源阅读 Legado 故障排查与处理：调试书源、图片显示为链接、故障排查、反馈开发

---

<div align="center">
<img width="256" src="./pic/BookSourcePixiv.png" alt="Pixiv BookSource"/>

# 故障排查与处理
#### 🅿️ 开源阅读 Pixiv 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
</div>


> [!WARNING]
> ⚠️ **你正在 GitHub 上浏览此文档， Github 文档可能不完整
> [网页版](https://pixivsource.pages.dev/TroubleShoot)
> 内容更全面，排版更精美**


> [!TIP]
> **开源阅读 Legado 的【简易】故障排查与处理**

> [!IMPORTANT]
> **反馈前请确认以下事项：**
>  - **阅读分支版本（如：Sigma、MD3 等）**
>  - **阅读软件版本（如：3.26.0101）**
>  - **使用书源版本（如：251）**
>  - **阅读是否兼容当前书源版本，详见 [书源兼容性](UpdateLog.md#Pixiv)**
>  - **如果是软件问题，请去 阅读对应 GitHub 仓库 反馈，详见：[下载阅读](Download.md)**
>  - **如果是书源问题，请去 [书源 GitHub 仓库](https://github.com/DowneyRem/PixivSource/issues) 提交问题，并附加调试结果，调试方法见下方 调试书源**


## 故障处理 {#TroubleShooting}
### 🖼 图片显示为链接 {#ImageShownAsLink}
> [!TIP]
>
> **关闭替换净化；关闭替换净化中，有关网址的净化规则**

<details><summary><strong> 🖼 图片显示为链接 </strong></summary>

1️⃣ **关闭替换净化**
![img](./pic/DisableReplacement.png)
2️⃣ 刷新正文
</details>


### 🗑️ 清除 WebView 数据 {#ClearWebViewData}
> [!WARNING]
> **清除 WebView 数据，会重置当前登录状态，但是能解决大部分由于缓存数据错误导致的问题**
>

> [!IMPORTANT]
> **🗑️ 清除 WebView 数据 => 我的 - 其他设置 - 清除 WebView 数据**


<details><summary><strong> 🗑️ 清除 WebView 数据 </strong></summary>

1️⃣ **打开其他设置，滑动到最后：**

![img](./pic/LegadoSettingsClearWebViewData.png)

2️⃣ **点击【清理 WebView 数据】，进行清理数据：**
</details>


## 调试书源 {#SourceDebug}
### 🐞 调试模式 {#DebugMode}
> [!TIP]
> **开启书源的调试模式，可以跳过强制登录，也有助于分析错误，打开方式如下：**

> [!IMPORTANT]
> **⏺️ 互动功能 => 书架 - 阅读界面 - Pixiv 小说 - 登录 => 调试模式**
>
> **⚙️ 书源设置 => 我的 - 书源管理 - Pixiv 小说 - 登录 => 调试模式**


<details><summary><strong> 从 ⏺️ 互动功能 打开</strong></summary>

**⏺️ 互动功能 => 书架 - 小说阅读界面 - Pixiv 小说 - 登录**

![img](./pic/PixivLogin0.png)

点击【🐞 调试模式】，打开调试模式

![img](./pic/PixivLoginUIHotKey.png)
</details>


<details><summary><strong> 从 ⚙️ 书源设置 打开</strong></summary>

**⚙️ 书源设置 => 我的 - 书源管理 - Pixiv 小说 - 登录 => 调试模式**

![img](./pic/PixivLogin1.png)

1️⃣ 点击【登录】，打开书源设置（简）

![img](./pic/PixivLoginUIBase.png)

2️⃣ 点击【⚙️ 书源设置】，打开详细书源设置

![img](./pic/PixivLoginUISettings.png)

3️⃣ 点击【🐞 调试模式】，打开调试模式
</details>


### 🐞 调试书源 {#DebugSource}
> [!IMPORTANT]
> **🐞 调试书源 => 我的 - 书源管理 - 调试 - 输入内容**

<details><summary><strong> 打开 🐞 调试书源 </strong></summary>

**🐞 调试书源 => 我的 - 书源管理 - Pixiv 小说 => 调试**

![img](./pic/PixivLogin1.png)

点击三点菜单，点击【调试】，进入书源调试界面

![img](./pic/PixivDebug1.png)

输入内容 `#测试页面`，即可开始调试

![img](./pic/PixivDebug2.png)

</details>


| 调试区域 | 输入内容 |
|--------|---------|
| 搜索 | 搜索相应关键词 |
| 发现 | `::https://www.pixiv.net/ajax/top/novel` |
| 详情 | `https://www.pixiv.net/novel/show.php?id=123` |
| 目录 | `++https://www.pixiv.net/novel/show.php?id=123` |
| 正文 | `--https://www.pixiv.net/novel/show.php?id=123` |

- `https://www.pixiv.net/novel/show.php?id=123` 为 Pixiv 小说链接
- 提交错误时，最好附加其调试信息




## 故障排查 {#FaultDiagnosis}
### 🈚️ 搜索、发现没有结果 {#NoResult}
- 0️⃣ [清除 WebView 数据](#ClearWebViewData)，重试
- 1️⃣ [调试书源](#SourceDebug)
  - 打开书源 [调试模式](#DebugMode)（**可以跳过强制登录**）
  - [调试书源](#DebugSource)
- 2️⃣ 检查网络
  - 检查**网络**是否可用？更换其他网络重试
  - 检查**代理**是否可用？更换其他代理重试
  - **检查阅读软件是否走了代理？** 打开 Pixiv 订阅源，看能否能打开网站
- 3️⃣ 检查书源
  - 检查书源**是否启用？**
  - 检查书源**版本是否为最新版？更新书源**
- 4️⃣ 检查软件
  - 检查软件**是否过旧？更新阅读软件至最新的稳定版**
  - 使用**其他阅读的分支版本**测试 
- 5️⃣ [通过 Github Issue 向书源开发者反馈](https://github.com/DowneyRem/PixivSource/issues) 


<!--@include: CommonDiscuss.md-->
