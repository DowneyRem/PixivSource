---
layout: doc
title: 更新日志 - Pixiv 书源版本历史
description: PixivSource 书源更新记录：搜索作者、重写排行榜、高并发优化、新增互动功能等……历次版本的功能变更与问题修复说明。

head:
  - - meta
    - name: keywords
      content: PixivSource 更新日志, Pixiv 书源更新记录, PixivSource 版本历史, Pixiv 书源更新记录, Linpx 书源更新记录
  - - meta
    - property: og:title
      content: 更新日志 - Pixiv 书源版本历史
  - - meta
    - property: og:description
      content: PixivSource 书源更新记录：搜索作者、重写排行榜、高并发优化、新增互动功能等……历次版本的功能变更与问题修复说明。
---

<div align="center">
<img width="150" height="150" src="./pic/BookSourcePixiv.png" alt="Pixiv BookSource"/>
<br>

# 📜 更新日志 📜
### 🅿️ [开源阅读](https://github.com/Luoyacheng/legado) Pixiv 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
#### ☕ [书源项目打赏名单](./Sponsor.md)
</div>


## ⏱️ 近期更新 {#Recent}
### 📚 更新 265 {#265}
- 🅿️ Pixiv、Pixiv 备用书源：
  - ✈️ 直连：互动功能支持直连
    - **❤️ 收藏本章 📃 追更系列 ❤️ 收藏系列**
    - **🖤 取消收藏 ⭐️ 关注作者 🚫 屏蔽作者**
    - **✅ 发送评论 🗑 删除评论 🔄 刷新本章**
  - 🐞 **受P站站方影响，部分账号无法使用直连功能**


### 📚 更新 264 {#264}
- 🅿️ Pixiv、🦊 Linpx & FN 书源：
  - ⤴️ 回调：自定义按钮打开登陆界面
    - ⏺️ 阅读界面打开互动功能
    - ⚙️ 详情界面打开书源设置


### 📚 更新 263 {#263}
- 🅿️ Pixiv 小说、小说备用：
  - 👤 模糊搜索作者
    - 方法1️⃣：`$作者名称`
    - 方法2️⃣：书源设置，开启搜索作者，搜索`作者名称`
  - 👤 (精确)搜索作者
    - 方法▶️：`@作者名称`
    - 无缓存数据时，使用模糊搜索
      - 单个作者，使用精确搜索，展示所有小说
      - 多个作者，使用模糊搜索，展示部分小说
    - 有缓存数据时，使用精确搜索
  - 👑 重写排行榜
    - 1️⃣ 减少请求，快速获取数据
    - 2️⃣ 翻页，获取全部100篇小说
  - 🐞 修复一些已知问题
    - 优化 过滤标签
    - 优化 屏蔽作者
    - 修复 getHeaders
- 🅿️ Pixiv 小说、小说备用、漫画：
  - 🅿️ 优化登录检测
    - 移动 isLogin 登录检测代码至登录检测
    - 优化 getCsrfToken
    - 优化 getPixivUid


### 📚 更新 262 {#262}
- 🅿️ Pixiv、🦊 Linpx & FN 书源：
  - ⚡️ 大幅提高并发率，加快搜索速度：
    - ✅ **阅读 Plus、阅读 Beta 新包名**，可正常使用
      - 📌建议关闭自动刷新书架
      - 📌（默认开启）事件监听
    - ❎ **阅读 MD3、源阅**，谨慎使用
      - 🚫 关闭自动刷新书架
      - 🚫 避免手动刷新书架
    - ❌ **阅读 Beta 旧包名、阅读官方版(3.25)**，不建议使用
  - 🐞 修复一些已知问题(JSLib)
    - 优化 urlIP 和 urlCoverUrl
    - 更改参数 forceUpdate 为 requestUpdate
    - 优化 isJsonString
    - 修复 urlNotification
    - 修复 sleep 时间为毫秒
    - 修复 cacheGetAndSet 逻辑 bug
    - 优化 urlSearchUser
    - 修复 cacheGetAndSet 获取 v[0].timestamp 的问题
    - 新增 getAjaxParseJson
    
- 🅿️ Pixiv 小说、小说备用：
  - 👤 重写搜索作者
    - 缓存搜索过的作者
    - 优化获取系列小说
    - 返回结果更全、搜索速度更快
  - 🐺 兽人作者搜索优化
    - ⚙️ 书源设置-兽人作者，点击按钮，手动导入
  - 🐞 修复一些已知问题(搜索)
    - getNovels 添加 page 参数
    - 修复 IS_SOURCEREAD 分支判断
    - 修复 novelFilter 过滤作者时，输出信息错误


### 📚 更新 261 {#261}
- 🅿️ Pixiv 小说
  - ⚙️ 发现设置：
    - 🆗 常规小说：发现 显示/隐藏 常规小说
    - 🔞 最新企划、🆗 最新企划：发现 显示/隐藏 最新企划约稿
    - 🔞 排行榜单、🆗 排行榜单：发现 显示/隐藏 排行榜单
    - 🔞 原创热门、🆗 原创热门：发现 显示/隐藏 原创热门
  - 👀 显示设置：
    - 👀 书源设置：登陆界面 显示/隐藏 书源设置
    - 👀 发现设置：登陆界面 显示/隐藏 发现设置
    - 小说阅读界面、书源编辑界面的【书源设置】、【发现设置】互相独立

- 🅿️ Pixiv 小说备用、🦊 Linpx & FN 书源：
  - 🐞 修复错误：
    - 🖼 忽略小说正文引用的 **不存在的插画**
  - 🔤 同步代码：
    - 💾 优化缓存逻辑
    - ⬆️ 延长缓存保存时间
    - 🚫 缓存有效期内不发起请求
    - 🚫 缓存 10min 内不发起强制请求


### 📚 更新 260 {#260}
- 🅿️ Pixiv 小说、小说备用
  - ⚡️ 减少请求次数，加快搜索速度
    - 👤 默认不再搜索作者
    - 📃 优化目录获取
    - 💬 正文评论优先使用 getAjaxAllJson 请求
  - 💾 优化缓存逻辑
    - ⬆️ 延长缓存保存时间
    - 🚫 缓存有效期内不发起请求
    - 🚫 缓存 10min 内不发起强制请求
  - ⚙️ 设置更改
    - 👤 默认不再搜索作者
    - 🔄 直连模式自动刷新发现
    - 👁 显示收藏、显示追更 改为：隐藏收藏、隐藏追更
    - ⚙️ 减少 urlIP urlCoverUrl 直接读取设置缓存
  - ⤴️ 回调
    - 🧹 全面清理缓存
    - 💾 复制目录链接


### ⬆️ 更新 260
- 🅿️ Pixiv 小说、小说备用
  - JSLib
    - putInCacheObject 不再循环调用
    - 优化 getAjaxJson　getAjaxAllJson　getWebviewJson
    - 优化 cacheGetAndSet
    - getAjaxAllJson 整体加入缓存
    - getAjaxAllJson 每条链接加入请求时间
    - cacheGetAndSet 处理 getAjaxAllJson 请求时间时，使用 v[0].timestamp
    - 优化 cacheGetAndSet 获取时间戳
    - 延长 cacheSaveSeconds 缓存保存时间
    - putInCacheObject getFromCacheObject 读写缓存前，使用 normalizeUrl 规范化 key
    - 减少 urlIP urlCoverUrl 直接读取设置缓存
  - 常规
    - 登录检测：
      - 环境信息仅输出一次
      - 将 LegadoLYC 改为 LegadoSigma
      - 优化 getHeaders
    - 搜索：搜索作者时，去除关键字中的@
    - 目录：优化目录获取
    - 正文：获取评论优先使用 getAjaxAllJson
    - 回调：全面清理缓存；复制目录链接
    - 设置：
      - 优化设置逻辑
      - 优化 checkSettings
      - 默认关闭搜索作者
      - 显示收藏、显示追更 改为：隐藏收藏、隐藏追更
      - 使用 globalThis 获取环境信息
      - 直连模式自动刷新发现
  - 制作工具
    - 删除 正文标题规则
    - 优化 版本发布


### 📚 更新 259 {#259}
- ✅ 修复无法获取小说 ID 的 bug
- 🅿️ Pixiv 小说、小说备用
  - ⏺️ 互动功能：修复无法获取小说 ID 的 bug
  - 📖 小说正文：显示 emoji 与 stamp
  - 📖 小说正文：优化 getComment 


### 📚 更新 258 {#258}
- **自 256 版本起，仅支持 阅读 Plus、阅读 Beta 新包名**
- ⚠️ 引入了无法获取小说 ID 的 bug
- 🅿️ Pixiv 小说、小说备用
  - ✅ 发送评论：自动拆分超长评论
  - 🗑 删除评论：支持批量删除评论
  - 📌 喜欢标签：添加/删除后自动刷新发现
  - ❤️ 他人收藏：添加/删除后自动刷新发现
  - ⏺️ 互动功能：兼容直连模式添加的书籍
  - ⏺️ 互动功能：优化互动功能显示内容
  - ↩️ 回调功能：函数式重写回调代码
- 🦊 Linpx & FN 书源：
  - 分享小说：仅复制链接，不打开浏览器


### 📚 更新 257 {#257}
- **自 256 版本起，仅支持 阅读 Plus、阅读 Beta 新包名**
- ⚠️ 引入了无法获取小说 ID 的 bug
- 🅿️ Pixiv 小说、小说备用
  - ❤️ 收藏本章：添加收藏，切换公开/私密收藏
  - 🖤 取消收藏：短按取消收藏当前章节，长按取消收藏整个系列
  - ⭐️ 关注作者：云端获取关注状态；关注失败时，打开浏览器手动关注
  - 🔄 刷新本章：清除本章缓存，刷新本章正文（和评论）

- 🅿️ Pixiv 小说、小说备用、漫画、🦊 Linpx、FN
  - JSLIb：使用 Java 原生 Sleep，优化性能
  - JSLib：修复 搜索作者时 urlCoverUrl 引起的错误


### ⬆️ 更新 257
- Pixiv 小说、小说备用：
  - 登录URL：
    - 使用在线方法判断关注作者状态
    - 关注作者失败时，打开浏览器关注
    - 收藏小说，改为切换公开收藏与私密收藏
    - 取消收藏：短按长按取消系列收藏

- Pixiv 小说、小说备用、漫画、Linpx、FN 书源：
  - JSLib：
    - 使用 Java Sleep
    - 修复 搜索作者时 urlCoverUrl 引起的错误


## 📆 2025 {#2025}
<details><summary><strong> 📆 2025  </strong></summary>

### 📚 更新 256 {#256}
🅿️ Pixiv、🦊 Linpx & FN 书源：
- **此版本起仅支持 阅读 Plus、阅读 Beta 新包名**
  - 登录检测：检测版本，添加弹窗
  - 检测阅读版本，跳转阅读 Plus 下载界面


### ⬆️ 更新 255
- Pixiv 小说、小说备用、漫画：
  - JSLib：
    - 使用 getFromCacheObject putInCacheObject 统一读写缓存 object
      - getAjaxJson 使用 getFromCacheObject 读写缓存
      - getAjaxAllJson 使用 getFromCacheObject putInCacheObject 读写缓存
      - cacheGetAndSet 使用 getFromCacheObject putInCacheObject 读写缓存
    - putInCacheObject 直连时，同时缓存常规 url
    - 使用 putInCacheObject 替换 cache.put("name", JSON.stringify(obj), second)
      - 搜索: 优化 getSeries，搜索结果写入缓存
      - 详情: 使用 putInCacheObject
      - 正文: 使用 putInCacheObject
      - 登录界面：使用 putInCacheObject
    - 优化 getAjaxJson
    - 使用 getFromCache putInCache 统一读写缓存 object
    - 使用 getFromCache 替换 cache.get("name")
    - 使用 putInCache 替换 cache.put("name", obj, second)
      - 登录检测: 使用 putInCache 与 getFromCache
      - 登录检测：优化 saveNovels
      - JSLib: getWebViewUA 加入缓存
      - JSLib: 使用 getFromCache
      - 发现: 使用 getFromCache
  - 登录检测：
    - 优化 startBrowser
    - 简化 isSourceRead
    - 简化 isLegadoOfficial
  - 搜索发现 
    - 发现：优化 handlerRegexIllusts
    - 小说搜索：优化 getSeries 
    - 漫画搜索：优化 getArtwork


- Pixiv 小说、小说备用、漫画、Linpx、FN：
  - 适配阅读 Plus 新特性：
    - 登陆界面
      - 使用 JS 生成登录界面
    - 正文
      - 使用三级标题替换 [chapter:]
      - 不再替换 [newpage]
      - 超链接
    - 回调:
      - 使用 book 对象获取数据
      - 删除小说，清理缓存
  - 其他变动：
    - 发现地址: 重命名为 discoverUrl.js
    - 正文：图片规则改为 FULL
    

### 📚 更新 254 
- 🦊 Linpx、FN
  - 可用软件：
    - ✅ Sigma、Beta（新包名）
    - 🚫 正式版、MD3、源阅（均不推荐）
  - ▶️ 添加动态登录界面
    - 📖 书源功能
    - ⤴️ 分享功能
    - ⚙️ 设置按钮

- 🦊 Linpx
  - 💾 搜索详情：添加缓存小说
  - 👤 添加作者：作者链接添加其最新小说

- 🅿️ Pixiv 小说、小说备用、漫画
  - ⚙️ 优化设置输出内容
  - ▶️ 添加动态登录界面（未启用）


### ⬆️ 更新 254
- 🦊 Linpx、FN
  - ⚙️ 设置：
    - 登录检测：设置规范化
    - JSLib： 添加 默认设置
    - 登录界面：添加 设置界面
    - 设置描述：更新描述
    - 登录检测：检测软件平台
  - ▶️ 登录界面：
    - 回调：添加 小说名称
    - 登录界面：添加 分享小说
    - JSLib：添加 UA，优化分享小说
    - 登录界面：优化 分享 Pixiv 链接
    - 登录界面：使用 JS 生成登录界面
    - 登录 URL：简化 getNovel

- 🦊 Linpx
  - 📚 优化 未缓存系列目录的情况
    - 登录检测：优化 handNovels
    - 登录检测: 重写 getNovelRes，删除无用代码
    - 目录：优化目录链接
    - 详情：优化目录解析
  - 🔗 添加链接：
    - 登录检测：使用 getNovelRes 添加作者
    - 登录检测: 更新 getNovelRes 正则
    - 添加链接：更新正则，允许添加作者

- 🅿️ Pixiv 小说、小说备用、漫画
  - ⚙️ 优化设置输出内容
  - ▶️ 添加动态登录界面（未启用）


### ⬆️ 更新 253
调整书源定位：
- 小说书源：
  - ✅ Sigma、Beta（新包名）
  - 🚫 正式版、MD3、源阅
- 小说备用：
  - ✅ Sigma、Beta（新包名）
  - ✅ MD3、正式版、源阅


- 🅿️ Pixiv 小说、小说备用
  - 🔍 搜索：删除 搜索标签后过滤作者 `#标签1 @作者名`
  - ⭐️ 发现：允许登录账号前打开书源主页
  - 登录 URL：删除无用代码
  - 📄 正文：抽离诸多 replace 函数
  - 📄 正文：优化 newpage
  - 📄 正文：优化 超链接（未启用)
  - ↩️ 回调：刷新书架时，降低并发率

- 🅿️ Pixiv 小说备用
  - 下放所有 Pixiv 小说书源功能
    - ▶️ 登录界面：登录时，不检测重复登录
    - ⚙️ 设置按钮
  - 同步小说书源更新

- 🅿️ Pixiv 漫画
  - ⭐️ 发现：添加强制登录
  - ⭐️ 发现：允许登录账号前打开书源主页
  - ⚙️ 设置：使用 独立设置
    - 优化 ✈ 直连模式
    - 优化 🖼 图片质量
  - ▶️ 登录界面：新增 ▶️ 登录界面
  - ▶️ 登录界面：新增 ⚙️ 设置按钮
  - ▶️ 登录检测：修复 登录状态检测的错误
  - ↩️ 回调：刷新书架时，降低并发率

- 🦊 Linpx、FN
  - 📄 正文：抽离诸多 replace 函数
  - 📄 正文：优化 newpage
  - 📄 正文：优化 超链接（未启用)
  - 🖼 正文：直连 Pixiv 获取图片（Linpx）
  - 🖼 正文：使用 Linpx 获取图片（FN）
  - ↩️ 回调：刷新书架时，降低并发率


### ⬆️ 更新 252
- 🖼 正文：优化 pixivimage 图片替换
  - Pixiv 小说、Linpx、FN

- 🔍 搜索：搜索作者、搜索标签
  - Pixiv 漫画、Linpx、FN

- Linpx、FN
  - 书源：手动管理请求头
  - 登录检测：优化小说名称
  - JSLib：添加 Pixiv 直连方法获取图片链接
  - JSLib：拼接图片链接
  - 🖼 正文：优化 pixivimage 图片链接替换
  - 🖼 正文：uploadedimage 图片使用 Pixiv 直连
  
- Linpx
  - 搜索：优化搜索作者
  - 搜索：关闭搜索链接
  - 登录检测：优化缓存系列小说
  - 目录：获取缓存小说
  - 目录：修复系列小说无目录
  

### ⬆️ 更新 251
- ⚙️ Pixiv 小说设置
  - 优化 设置初始化
  - 修复 设置显示错误
  - 优化 相关代码
- 🏠 站点教程新增
  - ✨ [臻享阅读](BetterExperience.md)


### ⬆️ 更新 250
- 🔗 优化：分享链接：
  - Pixiv 小说、Linpx、FN
    - ✅ Plus、Beta 版可用
    - 🚫 正式版、MD3、源阅 不可用
- ▶️ 登录界面：显示章节名称（新）、小说互动（新）
  - Pixiv 小说：准确获取当前章节的 单篇、系列、作者 ID
    - ✅ Plus、Beta 可用
    - 🚫 正式版、MD3、源阅 不可用
- ▶️ 登录界面：显示章节名称（旧）
  - Pixiv 小说：【刷新正文】以获取当前章节的 单篇、系列、作者 ID
    - ✅ 正式版、MD3、源阅 可用
    - ☑️ 暂时保留旧方法


### ⬆️ 更新 249
- ⚙️ 优化：设置初始化、默认设置、设置逻辑：
  - Pixiv 小说、小说备用、漫画
- ✈ 优化：直连模式提示：
  - Pixiv 小说
- 🔗 设置分享链接：
  - Pixiv、Linnx、FurryNovel
    - ✅ Plus、Beta 版可用
    - 🚫 正式版、MD3、源阅 不可用


### ⬆️ 更新 248
- 添加 书源主页
- 兼容正式版 325


### ⬆️ 更新 247
- ⚙️修复设置未初始化时，直连模式开关引起的 bug
  - Pixiv 书源
- 🌐 新增书源发布页 
  - https://downeyrem.github.io/PixivSource
  - https://pixivsource.pages.dev
- 🔗 替换指南、赞助链接：
  - Pixiv 书源
  - Linpx 书源
  - FurryNovel 书源
  - BTSRK 订阅源


### ⬆️ 更新 246
- Pixiv、Linpx、FurryNovel、BTSRK 订阅源
  - 添加赞助入口


### ⬆️ 更新 245
- Pixiv 小说、备用小说
  - 添加网址：添加 首篇有权限限制的系列
  - 优化正文：替换 不存在插图的链接 为空
  - 修正拼写错误


### ⬆️ 更新 223
- 📙 小说书源
  - ✅ **兼容阅读：3.25.0527 - 至最新版本**
  - ✅ **兼容源阅：当前最新版本1.0 (112)**
  - ✅ 设置：修复默认设置需要点两次的bug (07.12)
  - ✅ 设置：允许源阅使用登录界面调整设置 (07.12)

- 📒 备用书源（不会新增【登录界面】相关功能）
  - ✅ **兼容阅读：3.23.0503? - 至最新版本**
  - ✅ **兼容源阅：当前最新版本1.0 (112)**
  - ⚠️ 不建议同时使用两书源
  - ✅ 同步上述改动
  - 🚫 不可用功能（目前禁用）：
    - ❤️ 他人收藏

- 📖 兼容源阅：
  - 🚫 不可用功能（目前禁用）：
    - ❤️ 他人收藏
  - ✅ 可用功能（当前解禁）：
    - ⚙️ 自定义设置
    - 🚫 屏蔽作者
    - ⏬ 过滤收藏小说
    - ⏬ 过滤追更系列

</details>