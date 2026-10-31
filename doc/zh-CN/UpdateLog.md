---
layout: doc
title: 更新日志 - Pixiv 书源版本历史
description: PixivSource 书源更新记录：互动功能、搜索作者、重写排行榜、高并发优化、收藏追更评论等互动功能……历次版本的功能变更与问题修复说明。

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
      content: PixivSource 更新日志, Pixiv 书源更新记录, PixivSource 版本历史, Linpx 书源更新记录, FurryNovel 书源更新记录, Pixiv 书源版本, PixivSource changelog
  - - meta
    - property: og:title
      content: 更新日志 - Pixiv 书源版本历史
  - - meta
    - property: og:description
      content: PixivSource 书源更新记录：互动功能、搜索作者、重写排行榜、高并发优化、收藏追更评论等互动功能……历次版本的功能变更与问题修复说明。

repos:
  - name: PixivSource
    icon: /img/BookSourcePixiv.png
    desc: 最好的 Pixiv 小说阅读器
    link: https://github.com/DowneyRem/PixivSource
    prerelease: false
    recommend: pixiv
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

# 📜 更新日志 📜
#### 🅿️ 开源阅读 Pixiv 书源
</div>


> [!WARNING]
> ⚠️ **你正在 GitHub 上浏览此文档， Github 文档可能不完整
> [网页版](https://pixivsource.pages.dev/UpdateLog)
> 内容更全面，排版更精美**


## ⚡️ 快速跳转 {#QuickJump}
<!--@include: UpdateLog/CommonJump.md-->


## ⏱️ 近期更新 {#Latest}
<DownloadCard/>


## 📚 书源兼容性 {#Compatibility}
`.JSON` / `.JS` 书源同步更新，**请优先使用最新版软件**
- **JSON 书源**：阅读及其分支、[轻悦时光](https://www.qread.xyz)
- **JS 书源**：[阅读 T](https://github.com/skybbk1001/legadoT/releases)、[阅读 Beta](https://github.com/legadoteam/legado/releases)、[阅读 NG](https://github.com/joestar817/legado_NG/releases)


## 📆 2026下半年 {#2026H2}


### 📚 更新 290 {#290}
- 🐯 FN 书源：
  - 🔀 移植为新版 `.JS` 书源
    - ✅ 搜索、✅ 发现、✅ 添加网址
    - 🐞 修复简介时间错误
    - ❌ 登录界面、设置（暂未移植）
  - ⌛️ 旧版 `.JSON` 书源
    - 🐞 修复简介时间错误
- 🐯 FN 订阅源：
  - 显示【加入书架】的按钮


## 📃 更新 280+ {#280+}
### 📚 更新 289 {#289}
- 🅿️ Pixiv 书源、备用、漫画：
  - ✈️ 移除直连模式
- 🦊 Linpx & FN 书源：
  - ⏳ 图片解析：移除 Pixiv 直连
- 🌐 Pixiv 书源网站：
  - ✈️ 移除直连模式介绍


### 📚 更新 288 {#288}
- 🦊 **Linpx & FN 书源：**
  - ⚙️ 设置：备份恢复书源设置
  - ⭐️ 发现地址：兼容不支持 toggle 的软件
  - ⚙️ 发现设置：显示/隐藏发现按钮
  - ⚙️ 书源设置：显示/隐藏书源菜单
  - ⚙️ 设置按钮：对齐 emoji 与对应设置当前状态
  - 🔄 设置按钮：**实时刷新设置页面、所控制页面**
  - ✅ 登录检测：优化检测阅读软件分支版本

- 🅿️ Pixiv 书源、备用、漫画：
  - ✅ 登录检测：优化检测阅读软件分支版本
  - 📈 优化代码


### 📚 更新 287 {#287}
- 🅿️ Pixiv 书源、备用：
  - 🐞 修复下述 Bug
    - ⚙️ 设置：对齐 emoji 与对应设置当前状态
    - ⚙️ 设置：切换表情（emoji 显示为设置当前状态、切换后状态）
    - 🔍 搜索：修复模糊搜索作者
    - ✅ 登录检测：优化 getPixivUid，从 Cookie 获取 Pixiv Uid
    - ✅ 登录检测：优化 checkPixiv，检测登录信息是否齐全
    - ⤴️ 回调：无网络时、报错时，不再弹窗提示

- 🅿️ Pixiv 漫画：
  - ⭐️ 发现：添加发现地址
  - ⚙️ 发现设置：控制发现地址显示与否
  - ⚙️ 设置：对齐 emoji 与对应设置当前状态
  - ✅ 登录检测：优化 getPixivUid，从 Cookie 获取 Pixiv Uid
  - ✅ 登录检测：优化 checkPixiv，检测登录信息是否齐全
  - 💾 备份恢复：登录信息、书源设置


### 📚 更新 286 {#286}
- 🦊 **Linpx 书源：**
  - 🔀 新版 `.JS` 书源
    - ✅ 搜索：搜索标签、搜索作者、繁简通搜
    - ✅ 登录界面、✅ 书源设置、✅ 更新书源
    - 🐞 修复正文章节内容为首章的 Bug
    - 🔍 搜索标签时，允许繁简转换
  - ⌛️ 旧版 `.JSON` 书源
    - 🔍 搜索标签时，允许繁简转换
    - 同步优化代码


### 📚 更新 285 {#285}
- 🦊 **Linpx 书源：**
  - 🔀 移植为新版 `.JS` 书源
    - ✅ 搜索、✅ 发现、✅ 添加网址
    - 🐞 修复封面、正文插图无法显示
    - ❌ 登录界面、设置（暂未移植）
    - ⚠️ **存在正文章节内容为首章的 Bug**
  - ⌛️ 旧版 `.JSON` 书源
    - 🐞 修复封面、正文插图无法显示


### ⬆️ 更新 284 {#284}
- 🅿️ Pixiv 书源、备用：
  - ✅ 登录检测
    - 检测并区分【轻悦时光】与【源阅】，**可能无法准确检测【源阅】**
    - getPixivUid 从 Cookie 获取 UID，兼容【轻悦时光】
    - 拆分 u.log，u.environment 只检测1次当前软件（环境信息）
    - u.checkPixiv 检测有无 Pixiv CsrfToken 与 Cookie
  - 🔗 登录 URL
    - 账号设置：避免打开浏览器后清除登录信息
    - 备份恢复：精简内容
  - ▶️ 登录页面
    - 调整【备份恢复】按钮位置
  - JSLib
    - 删除硬编码的 WebView UA 
    - checkLogin 在线检测登录状态
  - ⚠️ **可能会引入 bug，无法准确检测【源阅】**

- 🅿️ Pixiv 漫画：
  - getPixivUid 从 Cookie 获取 UID，兼容【轻悦时光】


### 📚 更新 283 {#283}
- 🅿️ Pixiv 书源：
  - 🔍 搜索作者，支持直连
    - 👤 **模糊搜索：使用 API 搜索，支持直连**
    - 👤 **精确搜索：减少请求次数**
  - ⭐️ 发现小说
    - 🏷️ **书签：允许翻页，减少请求次数**
    - 🦊 兽人小说作者：减少请求次数
  - ✅ 登录检测
    - **恢复 getPixivUid 旧方法，引入了【轻悦时光】不兼容的函数**
  - ⬇️ 精简代码：
    - 搜索、发现、JSLib
  - ⚠️ **引入 bug，轻悦时光 不可用**


### 📚 更新 282 {#282}
- 🅿️ Pixiv 书源：
  - ⭐️ 发现小说
    - 🐞 **修复点击按钮打开链接的问题**
  - ▶️ 登录页面
    - 🔄 **实时刷新设置页面**
    - 优化 按钮位置
  - ✅ 登录检测
    - 优化 初始化设置、获取环境信息
    - 停用 globalThis 获取环境信息
  - 📄 正文
    - 停用 globalThis 获取环境信息


### 📚 更新 281 {#281}
- 🅿️ Pixiv 书源：
  - ⭐️ 发现小说
    - 🦊 兽人小说：**随机作者，长按刷新**
    - 🅿️ 优化登录检测，**允许未登录时 更新书源 或 打开网页**
  - ⚙️ 发现设置
    - 🔞 默认发现，默认开启
    - 📚 书源相关，默认开启
    - 🦊 兽人小说，默认关闭
  - 🔍 搜索小说
    - 🅿️ 优化登录检测，**允许未登录时搜索 `#测试页面`**
  - ▶️ 登录页面
    - 🚫 **屏蔽作者：修复无法添加/删除的问题**


### 📚 更新 280 {#280}
- 🅿️ Pixiv 书源：
  - ⚙️ **设置：📚 整合系列（默认开启）**
    - 关闭 📚 整合系列 时
      - 搜索：不搜索系列小说
      - 详情：不显示系列信息
      - 目录：不显示系列篇目
  - ⤴️ 回调：优化代码
- 🅿️ Pixiv 订阅：
  - ⚙️ 书源设置
    - 🔢 章节编号、️❤️ 自动收藏、📚 整合系列


## 📃 更新 270+ {#270+}
### 📚 更新 279 {#279}
- 🅿️ Pixiv 书源：
  - ⭐️ 发现：使用新 API 获取小说
    - 👑 排行榜单
    - 📝 编辑部推荐
    - 🏠 首页推荐
  - 🐞 修复部分小说没有标签的错误


### 📚 更新 278 {#278}
- 🦊 **Linpx 书源：**
  - 📃 目录：优化获取系列目录
- 🌐 Pixiv 、Linpx 、FN 订阅源：
  - ➕ 添加书架：优化代码


### 📚 更新 277 {#277}
- 🦊 **Linpx 书源：**
  - **更新至新域名：linpx.ink** 
    - **更新 API 链接**
    - **更新正则规则**
- 🦊 Linpx & FN 书源：
  - 优化代码：
    - 登录检测：输出环境信息
- 🅿️ Pixiv、🦊 Linpx & FN 书源：
  - 详情页标签添加 `#` 号
  - 优化代码：
    - isHtmlString
    - 更新软件下载链接


### 📚 更新 276 {#276}
- 🅿️ Pixiv 小说：
  - ⚙️ 设置
    - ⚙️ 默认关闭：书源编辑的登录界面的书源设置、发现设置
    - 🖤 自动取消：AUTO_DISLIKE_NOVELS 改为 自动取消
  - ⭐️ 发现：按钮名称：使用指南 => 功能手册
- 📂 项目
  - 📂 优化项目文件路径
  - 🛠 修复构建工具的 bug
- 🌐 Pixiv 书源 网站国际化


## ⚡️ 快速跳转 {#QuickJump2}
<!--@include: UpdateLog/CommonJump.md-->
