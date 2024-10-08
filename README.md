<div align="center">
<img width="125" height="125" src="https://github.com/windyhusky/PixivSource/raw/main/doc/pic/Legado-Pixiv.png" alt="Legado x Pixiv"/>

## 开源阅读 Pixiv 书源
</div>

### 类 Pixiv 网站的 [阅读 3.0 ](https://github.com/gedoor/legado) 的书源
- [Pixiv](https://www.pixiv.net/) 是一个以插画、漫画、小说为中心的艺术网站
- [新 Linpx](https://www.furrynovel.ink) 收录了 Pixiv 的大部分兽人小说与部分非兽人小说
- [兽人控小说站](https://www.furrynovel.com) 收录了 Pixiv, Bilibili 的大部分兽人小说

# 快速导入

<details>
<summary> 免代理导入地址 </summary>

| 名称         | 免代理导入网址                                                      |
| -------------| ------------------------------------------------------------------ |
| 所有书源　    | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/allbook.json |
| 所有订阅源　 | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/allrss.json |
| Pixiv 书源 　 | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/pixiv.json |
| Linpx 书源　 | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/linpx.json |
| 通用书源　   | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/normal.json |
| btsrk 订阅源 | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/btsrk.json |
| books 订阅源 | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/books.json |
- 免代理导入可能会有1天左右的更新延迟
</details>


<details>
<summary>  Github 导入地址 </summary>

| 名称          | Github 导入网址                                                        |   
| ------------ | ------------------------------------------------------------------ |
| 所有书源　    |  https://raw.githubusercontent.com/windyhusky/PixivSource/main/allbook.json |
| 所有订阅源　 | https://raw.githubusercontent.com/windyhusky/PixivSource/main/allrss.json |
| Pixiv 书源　 | https://raw.githubusercontent.com/windyhusky/PixivSource/main/pixiv.json | 
| Linpx 书源　 | https://raw.githubusercontent.com/windyhusky/PixivSource/main/linpx.json |       
| 通用书源　   | https://raw.githubusercontent.com/windyhusky/PixivSource/main/normal.json |     
| btsrk 订阅源 | https://raw.githubusercontent.com/windyhusky/PixivSource/main/btsrk.json |   
| books 订阅源 | https://raw.githubusercontent.com/windyhusky/PixivSource/main/books.json |    
- Github 导入无延迟
</details>


## 源状态、功能
### 书源
| 书源      | 状态 | 获取小说 | 支持P站特性 | 实现阅读功能 |
| --------- | --- | ------ | ---------- | ------------ |
| Pixiv     | ✅ | ✅ 全站 | ✅ 单篇 ✅ 系列 ✅ 小说插画 | ✅ 搜索 ✅ 发现 ✅ 添加网址 ✅ 订阅源 |
| Linpx     | ✅ | ✅ 全站 | ✅ 单篇 ✅ 系列 ✅ 小说插画 | ✅ 搜索 ✅ 发现 ✅ 添加网址 ✅ 订阅源 |
| 兽人小说站 | ❌ | ⭕️ 部分 | ✅ 单篇 ✅ 系列 ❌ 小说插画 | ❌ 搜索 ❌ 发现 ✅ 添加网址 ✅ 订阅源 |
| 通用书源   | ✅ | ✅ 全网 |  | ✅ 搜索 🈚️ 发现 ✅ 添加网址 ✅ 订阅源 |


Pixiv 特性：
- 单篇小说：Pixiv 小说投稿时的【单篇完结作品】，即短篇小说
- 系列小说：Pixiv 小说投稿时的【连载系列作品】，即长篇小说
- Pixiv 小说工具（标记符号）
  <details>
  <summary> 已经支持全部 Pixiv 小说标记符号 </summary>
  
  - ✅ 完美支持的标记符
    - ✅ `[uploadedimage:自动生成ID]` 通过上传图片添加插画
    - ✅ `[pixivimage:作品ID]` 通过作品ID添加插画
  - ☑️ 受阅读功能限制，无法完美支持的标记符
    - ☑️ `[newpage]` 分页
    - ☑️ `[chapter:章节名称]` 添加本章标题
    - ☑️ `[jump:链接目标的页面编号]` 页面跳转
    - ☑️ `[[jumpuri:标题 > 链接目标的URL]]` 添加超链接
    - ☑️ `[[rb:汉字 > 注音]]` 添加注音
      - 当`注音`位置不是汉字时，使用括号注音：`[[rb:汉字 > 注音]]` => `汉字（注音）`
    - ☑️ `汉字《注音》`（选择`置き換える`后 Pixiv 会进行这样的替换）`汉字《注音》` => `[[rb:汉字 > 注音]]`
      - 当`注音`位置是汉字时，恢复被替换的书名号：`[[rb:汉字 > 注音]]` => `汉字《注音》`
  - 🈚️ 不支持的标记符
</details>


阅读功能：
- 搜索：书架页面，搜索小说，添加小说到书架
- 发现：发现页面，发现小说，添加小说到书架
- 添加网址：书架页面，通过 **【添加网址】** 添加小说到书架
- 订阅源：订阅页面，通过 **【订阅源】** 添加小说到书架


### 订阅源
| 订阅源 | 状态 | 包含内容 | 订阅源 | 状态 | 包含内容 |
| ----- | ---- | -------|----- | ---- | ------- |
| btsrk | ✅ | 1️⃣ [Pixiv 小说页](https://www.pixiv.net/novel) <br /> 2️⃣ [Linpx 林匹克斯](https://www.furrynovel.ink) <br /> 3️⃣ [兽人控小说站](https://www.furrynovel.com) <br /> 4️⃣ [兽人控游戏索引](https://furrygames.top/zh-cn/list.html) <br /> 5️⃣ [兽人控游戏库](https://kemono.games/zh-Hans) <br /> 6️⃣ [兽展日历](https://www.furryeventchina.com) <br /> 7️⃣ [兽聚汇总](https://www.furryfusion.net/) | books | ✅ | 1️⃣ [三千书源](https://shuyuan.yiove.com) <br/> 2️⃣ [喵公子书源管理](http://yuedu.miaogongzi.net/gx.html) <br/> 3️⃣ [阅读 APP 源](https://legado.aoaostar.com) <br/> 4️⃣ [阅读合集](https://flowus.cn/share/923f5a35-6dcf-47d1-b8eb-b9c5ef3ed39b) <br/> 5️⃣ [源仓库](https://www.yckceo.com/yuedu/index/index.html) <br/> 6️⃣ [聚合搜索](https://legado.cn/thread-3723-1-1.html) <br/> 7️⃣ [阅读使用手册](https://www.yuque.com/legado/wiki) |

- btsrk 订阅源：整合了 Pixiv、Linpx、兽人小说站、兽人控游戏索引、兽人控游戏库等网站，旨在快速访问兽人文化网站
- books 订阅源：整合了多个分享阅读书源、订阅源等的订阅源，旨在快速导入阅读相关资源
- **[通用书源](https://github.com/bushixuanqi/book-source)** ：（非本项目）是不世玄奇为众多网文网站编写的通用书源，旨在使用搜索引擎获取全网小说资源
- **[聚合搜索](https://legado.cn/thread-3723-1-1.html)** ：（非本项目）是多个搜索引擎的聚合入口，需要配合 **[搜索引擎书源/通用书源](http://yuedu.miaogongzi.net/gx.html)** 使用


## 下载阅读
<details>
<summary> Android 版 </summary>

**点击链接，下载安装包并安装，推荐使用共存版**
https://miaogongzi.lanzout.com/b01rgkhhe

| 下载站点                                                      | 版本          | 备注            |
| ------------------------------------------------------------ | ------------ | -------------- |
| [喵公子阅读资源 (蓝奏云)](http://yuedu.miaogongzi.net/gx.html)  | 　　　　稳定版 | 无需代理，无需登录 |
| [阅读Beta版 蓝奏云](https://miaogongzi.lanzout.com/b01rgkhhe)  | 　　　　开发版 | 无需代理，无需登录 |
| [Github Release](https://github.com/gedoor/legado/releases)  | 有限制，稳定版 | 需要代理，无需登录 |
| [Github Action](https://github.com/gedoor/legado/actions)    | 无限制，开发版 | 需要代理，需要登录 |
| [Telegram 频道](https://t.me/Legado_Channels)                | 　　　　稳定版 | 需要代理，需要登录 |
| [Telegram 频道(Beta版)](https://t.me/Legado_Beta)            | 　　　　开发版 | 需要代理，需要登录 |
</details>


<details>
<summary> 苹果 iOS 版 </summary>

官方正在进行 [iOS版](https://github.com/gedoor/YueDuFlutter) 的开发，[近期在TF测试](https://gedoor.github.io/download) ，最新消息请见：[Telegram 频道(iOS版)](https://t.me/legado_ios)

| 下载站点                                              | 版本           | 备注             |
| ---------------------------------------------------- | ------------- | --------------- |
| ~~[GitHub](https://github.com/gedoor/YueDuFlutter)~~ |               | 开发中，暂不可下载 |
| ~~[Telegram 频道(iOS版)](https://t.me/legado_ios)~~   |               | 开发中，暂不可下载 |

可能支持相同书源的软件：

| 软件名称 | 备注                       |
| ------- | -------------------------- |
| ~~[读不舍手](https://apps.apple.com/us/app/%E8%AF%BB%E4%B8%8D%E8%88%8D%E6%89%8B/id1662413517)~~ | 不完全兼容阅读书源，广告较多 |
| ~~[青果阅读](https://apps.apple.com/us/app/qing-guo-du-shu/id1142490639)~~ | 不完全兼容阅读书源，现已下架 |
| ~~[源阅读](https://github.com/kaich/Yuedu)~~ | 停止维护，AppStore 已下架 |
</details>


## 相关教程
<details>
<summary>  通用教程 </summary>

### 1. [阅读是什么软件？阅读简介](./doc/Legado.md)
### 2. [如何获取书源？导入书源？](./doc/Import.md)
### 3. [如何导入订阅源？](./doc/Import2.md)
### 4. [如何设置 Webdav 备份？](./doc/WebdavBackup.md)
更多内容请查看[官方使用说明](https://www.yuque.com/legado/wiki/xz)
</details>


<details>
<summary>  专用教程 </summary>

## 专用教程 [@FurryReading](https://t.me/FurryReading)
### 1. [Pixiv 书源的导入与使用](./doc/Pixiv.md)
### 2. [Linpx 书源的导入与使用](./doc/Linpx.md)
</details>


## 免责声明
<details>
<summary>  免责声明 </summary>

1. 阅读只是一个做了很多便于阅读的功能的浏览器
2. 书源只是一个如何让阅读浏览器向网站请求并处理数据的方法
3. 作品数据均来自书源内使用的网站
4. 版权投诉请去源网站向站方投诉
</details>

# 鸣谢
- 感谢 [阅读 3.0 ](https://github.com/gedoor/legado) 提供的软件平台
- 感谢 [Linpx](https://github.com/libudu/linpx-web) 提供的[网站服务](https://www.furrynovel.ink)
- 感谢 [兽人小说站](https://github.com/FurryNovel/Reader) 提供的[网站服务](https://www.furrynovel.com)
- 感谢 [Pixiv.cat](https://github.com/pixiv-cat/pixivcat-backend) 提供的 [Pixiv 图片代理功能](https://pixiv.cat)
- 感谢 [pixiv-utils](https://github.com/AgMonk/pixiv-utils) 及 [Pixiv go 客户端](https://github.com/NateScarlet/pixiv) 整理的 Pixiv Web API
- 感谢 [@DowneyRem](https://github.com/DowneyRem) 提供的教程，这是他的兽人小说分享频道 [@FurryReading](https://t.me/FurryReading)


# TODO
- ~~Linpx 系列小说 专用书源~~
- ~~兽人控小说站：书源（搜索，发现）~~

<details>
<summary> 已完成 To Do </summary>

- ✅ Pixiv 订阅源
- ✅ 兽人控小说站订阅源
- ✅ Pixiv 书源：关注作者最新小说（按照时间排序关注作者的小说) https://github.com/windyhusky/PixivSource/issues/11
- ✅ Linpx 书源：推荐作者的小说
- ✅ Pixiv 书源：通过作品ID添加的插画 [pixivimage:123-1] 
- ✅ Linpx 书源：通过作品ID添加的插画 [pixivimage:123-1] （使用 pixiv.cat ）
- ✅ Pixiv 书源：添加网址加入书架；订阅源添加到书架
- ✅ Pixiv 书源：追更列表 https://github.com/windyhusky/PixivSource/issues/14
- ☑️ Pixiv 书源：每日每周排行榜 https://github.com/windyhusky/PixivSource/issues/13
- ✅ Pixiv 系列小说书源 
</details>

