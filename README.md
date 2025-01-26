<div align="center">
<img width="125" height="125" src="https://github.com/windyhusky/PixivSource/raw/main/doc/pic/Legado-Pixiv.png" alt="Legado x Pixiv"/>

## 开源阅读 Pixiv 书源
</div>


### Pixiv 等网站的 [阅读 3.0 ](https://github.com/gedoor/legado) 书源
- [Pixiv](https://www.pixiv.net/) 是一个以插画、漫画、小说为中心的艺术网站
- [Linpx](https://www.furrynovel.ink) 收录了 Pixiv 的大部分兽人小说与部分非兽人小说
- [兽人控小说站](https://www.furrynovel.com) 收录了 Pixiv, Bilibili 的大部分兽人小说


## 快速导入
| 名称          | 免代理导入网址                                                         |
| -------------| ------------------------------------------------------------------- |
| import 订阅源 | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/import.json |


<details>
<summary>  Github 导入地址 </summary>

| 名称          | Github 导入网址                                                            |
| ------------ | ------------------------------------------------------------------------- |
| Pixiv 书源　  | https://raw.githubusercontent.com/windyhusky/PixivSource/main/pixiv.json  |
| Linpx 书源　  | https://raw.githubusercontent.com/windyhusky/PixivSource/main/linpx.json  |
| btsrk 订阅源  | https://raw.githubusercontent.com/windyhusky/PixivSource/main/btsrk.json  |
| books 订阅源  | https://raw.githubusercontent.com/windyhusky/PixivSource/main/books.json  |
</details>


## 源状态 & 功能
| 书源       | 状态 | 获取小说 | 支持P站特性 | 实现阅读功能 |
| --------- | --- | ------ | ---------- | ------------ |
| Pixiv     | ✅ | ✅ 全站 | ✅ 单篇 ✅ 系列 ✅ 小说插画 | ✅ 搜索 ✅ 发现 ✅ 添加网址 ✅ 订阅源 |
| Linpx     | ✅ | ✅ 全站 | ✅ 单篇 ✅ 系列 ✅ 小说插画 | ✅ 搜索 ✅ 发现 ✅ 添加网址 ✅ 订阅源 |


<details><summary> 书源功能 </summary>

#### Pixiv 特性：
- 单篇小说：Pixiv 小说投稿时的【单篇完结作品】，即短篇小说
- 系列小说：Pixiv 小说投稿时的【连载系列作品】，即长篇小说
- <details><summary> ✅ 小说功能 </summary>
  
  - ✅ 关注作者（最新小说）
  - ✅ 追更列表
  - ✅ 推荐小说（电脑网页）
  - ✅ 发现小说（手机网页）
  - ✅ 收藏小说
  - ✅ 章节评论
  </details>

- <details><summary> ✅ 小说排行榜 </summary>
  
  - ✅ R18 小说排行榜
  - ✅ 一般小说排行榜 
    >（默认隐藏，可在`书源-发现-发现地址规则`修改`SHOW_GENERAL_NOVELS_RANK`）
  </details>
  
- <details><summary> ✅ Pixiv 小说工具（标记符号） </summary>

  - ✅ 完美支持的标记符
    - ✅ `[uploadedimage:自动生成ID]` 通过上传图片添加插画
    - ✅ `[pixivimage:作品ID-序号]` 通过作品ID添加插画
  - ☑️ 受阅读功能限制，无法完美支持的标记符
    - ☑️ `[newpage]` 分页
    - ☑️ `[chapter:章节名称]` 添加本章标题
    - ☑️ `[jump:链接目标的页面编号]` 页面跳转
    - ☑️ `[[jumpuri:标题 > 链接目标的URL]]` 添加超链接
    - ☑️ `[[rb:汉字 > 注音]]` 添加注音
      > 使用括号注音：`[[rb:汉字 > 注音]]` => `汉字（注音）`
    - ☑️ `汉字《注音》`选择`置き換える`后，Pixiv 会转换成`[[rb:汉字 > 注音]]`
      > 当`注音`位置是汉字时，恢复被替换的书名号：`[[rb:汉字 > 注音]]` => `汉字《注音》`
      > 
      > 默认开启，可在书源设置中修改 `REPLACE_BOOK_TITLE_MARKS`
  - 🈚️ 不支持的标记符
  </details>


#### 阅读功能：
- ✅ 搜索：书架页面，搜索小说，添加小说到书架
- ✅ 发现：发现页面，查看小说，添加小说到书架
- ✅ 添加网址：书架页面，通过 **【添加网址】** 添加小说到书架
- ✅ 订阅源：订阅页面，通过 **【订阅源】** 添加小说到书架
</details>

<details><summary> 书源设置 </summary>

| 书源设置         | 默认状态 | 常量名称                    |
| -------------- | ------ | -------------------------- |
| 显示小说源链接　　 | ✅ 开启 | `SHOW_ORIGINAL_NOVEL_LINK` |
| 恢复被替换的书名号 | ✅ 开启 | `REPLACE_BOOK_TITLE_MARKS` |
| 简介显示更多信息　 | ⭕ 关闭 | `MORE_INFO_IN_DESCRIPTION` |
| 显示一般小说排行榜 | ⭕ 关闭 | `SHOW_GENERAL_NOVELS_RANK` |
| 调试模式　　　　　 | ⭕ 关闭 | `DEBUG`                    |
- 自定义设置：编辑书源 - 基本 - 变量说明 - 修改并保存
- 修改时，请修改`true` 为 `false`，或相反
```
{
    "SHOW_ORIGINAL_NOVEL_LINK": true,
    "REPLACE_BOOK_TITLE_MARKS": true,
    "MORE_INFO_IN_DESCRIPTION": false,
    "SHOW_GENERAL_NOVELS_RANK": false,
    "DEBUG": false
}
```
</details>


| 订阅源 | 状态 | 包含内容 | 订阅源 | 状态 | 包含内容 |
| ----- | ---- | -------|----- | ---- | ------- |
| btsrk | ✅ | 1️⃣ [Pixiv 小说](https://www.pixiv.net/novel) <br /> 2️⃣ [Linpx 林匹克斯](https://www.furrynovel.ink) <br /> 3️⃣ [兽人控小说站](https://www.furrynovel.com) <br /> 4️⃣ [兽人控游戏索引](https://furrygames.top/zh-cn/list.html) <br /> 5️⃣ [兽人控游戏库](https://kemono.games/zh-Hans) <br /> 6️⃣ [兽展日历](https://www.furryeventchina.com) <br /> 7️⃣ [兽聚汇总](https://www.furryfusion.net/) | books | ✅ | 1️⃣ [Yiove 书源仓库](https://shuyuan.yiove.com) <br/> 2️⃣ [喵公子书源管理](http://yuedu.miaogongzi.net/gx.html) <br/> 3️⃣ [阅读 APP 源](https://legado.aoaostar.com) <br/> 4️⃣ [阅读合集](https://flowus.cn/share/923f5a35-6dcf-47d1-b8eb-b9c5ef3ed39b) <br/> 5️⃣ [源仓库](https://www.yckceo.com/yuedu/index/index.html) <br/> 6️⃣ [聚合搜索](https://legado.cn/thread-3723-1-1.html) <br/> 7️⃣ [阅读使用手册](https://www.yuque.com/legado/wiki) |

- import 订阅源：一键导入本项目所整理提供的书源、订阅源


### 非本项目的其他资源
<details> <summary> 其他资源 </summary>

| 名称          | Github 导入网址                                                            |
| ------------ | ------------------------------------------------------------------------- |
| 通用书源(normal 书源)  | https://raw.githubusercontent.com/windyhusky/PixivSource/main/normal.json |
| 聚合搜索(books 订阅源)  | https://raw.githubusercontent.com/windyhusky/PixivSource/main/books.json  |
| 书源订阅(import 订阅源) | https://raw.githubusercontent.com/windyhusky/PixivSource/main/import.json |

- **[通用书源](https://github.com/bushixuanqi/book-source)** ：是不世玄奇 为网文网站编写的通用书源，旨在用搜索引擎获取全网小说，建议配合【**聚合搜索**】使用
- **[聚合搜索](https://legado.cn/thread-3723-1-1.html)** ：是不世玄奇 制作的聚合多个搜索引擎的订阅源，需要配合 **[通用书源](http://yuedu.miaogongzi.net/gx.html)** 使用。(集入 books 订阅源)
- **[书源订阅](https://gitee.com/feiniao6/yd)** ：是Thomas喲 制作的第三方规则订阅，旨在快速导入书源/订阅源。(部分修改)
</details>


## 使用教程
<details>
<summary> 使用教程 </summary>

> #### 0. [阅读是什么软件？阅读简介](./doc/ReadMe.md)
> #### 1. [Pixiv 书源的导入与使用](./doc/Pixiv.md)
> #### 2. [Linpx 书源的导入与使用](./doc/Linpx.md)
#### 此处教程由 [@FurryReading](https://t.me/FurryReading) 提供
</details>


## 免责声明
<details><summary> 免责声明 </summary>

1. 开源阅读 Legado 是一个做了很多阅读功能的浏览器
2. 书源(及订阅源)是浏览器向网站请求数据、处理数据的一套方法
3. 使用开源阅读 Legado 阅读小说，相当于访问相关网页阅读小说
4. 开源阅读 Legado 内的作品数据均来自书源内的网站，作品版权归原作者或站方所有
5. 如有版权问题，请找到书源内的网站，向站方投诉
</details>

# 鸣谢
- 感谢 [阅读 3.0 ](https://github.com/gedoor/legado) 提供的软件平台
- 感谢 [Linpx](https://github.com/libudu/linpx-web) 提供的 [网站服务](https://www.furrynovel.ink)
- 感谢 [兽人小说站](https://github.com/FurryNovel/Reader) 提供的 [网站服务](https://www.furrynovel.com)
- 感谢 [Pixiv.cat](https://github.com/pixiv-cat/pixivcat-backend) 提供的 [Pixiv 图片代理功能](https://pixiv.cat)
- 感谢 [通用书源](https://github.com/bushixuanqi/book-source) 及 [聚合搜索](https://legado.cn/thread-3723-1-1.html) 提供的添加书架的方法
- 感谢 [书源订阅(非官方仓库)](https://gitee.com/feiniao6/yd) 提供的导入书源、订阅源的方法
- 感谢 [Pixiv-utils](https://github.com/AgMonk/pixiv-utils) 及 [Pixiv go 客户端](https://github.com/NateScarlet/pixiv) 整理的 Pixiv Web API
- 感谢 [@DowneyRem](https://github.com/DowneyRem) 提供的教程，这是他的兽人小说分享频道 [@FurryReading](https://t.me/FurryReading)


# TODO
- ~~Linpx 系列小说书源~~
- ~~兽人控小说站：书源（搜索，发现）~~

<details>
<summary> 已完成 </summary>

- ✅ Linpx 订阅源
- ✅ Pixiv 订阅源（使用JS注入，代码来自【聚合搜索】）
- ✅ 兽人控小说站订阅源
- ✅ Pixiv 书源：关注作者的最新小说 https://github.com/windyhusky/PixivSource/issues/11
- ✅ Linpx 书源：推荐作者的近期小说
- ✅ Pixiv 书源：通过作品ID添加插画
- ✅ Linpx 书源：通过作品ID添加插画（使用 pixiv.cat ）
- ✅ Pixiv 书源：添加网址加入书架；订阅源添加到书架
- ✅ Pixiv 书源：追更列表 https://github.com/windyhusky/PixivSource/issues/14
- ✅ Pixiv 书源：排行榜 https://github.com/windyhusky/PixivSource/issues/13
- ✅ Pixiv 系列小说书源 
- ✅ Pixiv 书源：完善字数统计 https://github.com/windyhusky/PixivSource/issues/18
- ✅ Pixiv 书源：显示更多信息 https://github.com/windyhusky/PixivSource/issues/17
- ✅ Pixiv & Linpx 书源：添加小说更新时间
- ✅ Pixiv 书源：搜索作者
- ✅ Linpx 书源：搜索作者
- ✅ import 订阅源：导入其他书源、订阅源
- ✅ Pixiv & Linpx 书源：添加小说章节字数
- ✅ Pixiv 书源：正文尾部加入小说评论
- ✅ Pixiv & Linpx 书源：搜索链接
- ✅ Pixiv & Linpx 书源：添加分享链接
</details>

