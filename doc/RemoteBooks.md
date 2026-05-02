---
layout: doc
title: 远程书籍 - 在开源阅读中阅读 WebDAV 网盘中的书籍
description: 在开源阅读 Legado 中配置 WebDAV 远程书籍：设置本地保存目录、添加坚果云等网盘服务器、浏览并导入网盘中的小说到书架。

head:
  - - meta
    - name: keywords
      content: 开源阅读 远程书籍, Legado WebDAV, 开源阅读 WebDAV 配置, Legado 远程书籍, Yandex WebDAV, 兽人小说共享书库
  - - meta
    - property: og:title
      content: 远程书籍 - 在开源阅读中阅读 WebDAV 网盘中的书籍
  - - meta
    - property: og:description
      content: 在开源阅读 Legado 中配置 WebDAV 远程书籍：设置本地保存目录、添加坚果云等网盘服务器、浏览并导入网盘中的小说到书架。
---

<div align="center">
<img width="150" height="150" src="./pic/BookSourcePixiv.png" alt="Pixiv BookSource"/>
<br>

# 远程书籍
### 🅿️ [开源阅读](https://github.com/Luoyacheng/legado) Pixiv 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
#### ☕ [书源项目打赏名单](./Sponsor.md)
</div>


> [!TIP]
>
> **从未使用过【开源阅读】的读者可以看这篇指南：**
> [✨臻享阅读](BetterExperience.md)


## 远程书籍
### 📂 设置保存目录
**打开软件，点击书架右上角菜单，点击远程书籍**

![img](./pic/RemoteBooksSettings0.png)

**此时则会弹出下面的弹窗**

![img](./pic/SaveFileSettings0.png)

**点击确定，这里可以任选其中一个**

![img](./pic/SaveFileSettings1.png)

**来到你想保存书籍的文件夹时，点击确认**

![img](./pic/SaveFileSettings2.png)


### ☁️ 远程书籍配置
**书架菜单 - 远程书籍 - 右上角三点菜单 - 服务器配置 - 加号 - 添加服务器配置信息**

![img](./pic/RemoteBooksSettings0.png)

![img](./pic/RemoteBooksSettings1.png)

![img](./pic/RemoteBooksSettings2.png)

**点击加号，添加服务器配置**

![img](./pic/RemoteBooksSettings3.png)

**填入 Webdav 服务器配置信息**

![img](./pic/RemoteBooksSettings4.png)

> 地址 `url` 填入 Webdav 服务器地址
>
> 账户 `username` 填入注册邮箱
>
> 密码 `password` 填入 **应用密码（非账户密码）**

**保存，选择添加的服务器**

![img](./pic/RemoteBooksSettings5.png)


### 🐺 兽人小说分享

> [!TIP]
> 
> **如果你喜欢兽人小说，可以填入以下内容**
>
> 分享信息来自：[@FurryNovels](https://t.me/FurryReading/2145)

<details><summary><strong> 🐺 兽人小说分享 </strong></summary>

| 配置 | 内容                                   |
| --- | -------------------------------------- | 
| 地址 | https://webdav.yandex.ru/兽人小说/小说/ |
| 账户 | danielsmith12138@yandex.com           |
| 密码 | mbatorsztocorhay                     |

**填入 Webdav 服务器配置信息，保存**

> [!CAUTION] 危险！
>
> **请不要将此配置，填入【备份与恢复】！不然会导致数据泄露（并且还是你亲手造成的）**
</details>


### 👀 查看远程书籍

刷新，查看文件

![img](./pic/RemoteBooksSettings6.png)

选择书籍，放入书架

![img](./pic/RemoteBooksSettings7.png)
