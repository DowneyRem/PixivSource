## [Linpx 书源的导入与使用](https://telegra.ph/FurryNovelsReading-05-04-07)
> Linpx 书源的导入与使用
> https://telegra.ph/FurryNovelsReading-05-04-07




### [Linpx](http://www.furrynovel.xyz/) 是第三方 免代理 Pixiv 小说镜像站，主要内容为**兽人小说**。

![img](https://telegra.ph/file/b42876352720a6f4b7515.png)


### 本书源使用前提
1. 使用阅读 3.0 版本
2. 导入 Linpx 的书源
3. 导入 Linpx 订阅源 【推荐】

## 一、导入 Linpx 书源订阅源
### 0.下载阅读 3.0 版本
点击链接，下载安装包并安装，**推荐使用共存版**

https://miaogongzi.lanzout.com/b01rgkhhe

### 1.了解阅读功能与用法
请查看[阅读是什么软件？阅读简介](./Legado.md)


### 2.导入 Linpx 的书源&订阅源
#### 2.1导入 Linpx 的书源
请查看[如何获取书源？导入书源？](./Import.md)
> https://raw.githubusercontent.com/windyhusky/PixivSource/main/linpx.json
> https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/linpx.json


#### 2.2导入 Linpx 的订阅源
请查看[如何网络导入订阅源](./Import2.md)

> https://raw.githubusercontent.com/windyhusky/PixivSource/main/btsrk.json
> https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/btsrk.json

**Linpx 无需登录，无需代理，即可访问 R18 小说，因此你不必做过多的操作**

## 二、添加小说，尽情使用
### 1.阅读内部搜索
支持搜索小说名称、作者名称、小说标签（【曾经支持】现暂未修复）
![img](./pic/SearchViaLegado.png)

### 2.发现更多小说
发现：推荐作者、最新小说

![img](./pic/DiscoverLinpx.png)
![img](./pic/DiscoverLinpxNewNovels.png)

### 3.添加网址
首页打开【添加网址】，粘贴小说链接
![img](./pic/AddBookViaUrl1.png)
![img](./pic/AddBookViaUrl2.png)
![img](./pic/AddBookViaUrl3.png)
此处使用正则匹配网址，支持 Linpx 多个域名多个格式的网址链接

正则规则：
`(https?://)?(api.|www.)?(furrynovel.(ink|xyz)|pixiv.net)/(!).*`
```
原 Linpx 小说链接
https://www.furrynovel.xyz/pixiv/novel/20063566

原 Linpx 分享链接
http://furrynovel.xyz/pn/20063566

新 Linpx 小说链接
https://furrynovel.ink/pixiv/novel/20063566

新 Linpx 分享链接
https://furrynovel.ink/pn/20063566

新 Linpx 小说 Api 链接
https://api.furrynovel.ink/pixiv/novel/20063566/cache

Pixiv 小说链接【需要代理】
https://www.pixiv.net/novel/show.php?id=20063566
```


### 4.订阅源添加小说
导入 Linpx 订阅源，配合书源使用体验更好
#### 4.1 替代阅读搜索
受阅读设计的限制，阅读内部搜索不可能完全支持 Linpx 或 Pixiv 的功能。网站的搜索功能更加全面。

![img](./pic/SearchViaLinpx.png)


#### 4.2 Pixiv 链接转换
阅读内部浏览器内打开 Linpx，搜索栏中粘贴 Pixiv 小说链接，进入对应页面，即可添加小说到书架
![img](./pic/LinpxConvertPixivUrl1.png)
![img](./pic/LinpxConvertPixivUrl2.png)


#### 4.3 添加小说至书架
在阅读内部浏览器内打开 Linpx 小说页面，即可添加小说到书架
![img](./pic/AddBookViaLinpx.png)


## 三、故障排查

### 1.确认书源可以正常使用

回到第一页，点击【放大镜】，搜索【龙胶危机】，测试书源能否正常使用

#### A.如果搜索结果不唯一，那么大功告成！

![img](https://telegra.ph/file/7a33b98d43b378f0ab59f.png)

#### B.如果没有搜索结果，请自行检查一下内容：

**⓪检查 Linpx 书源是否导入**

**①检查 Linpx 书源是否启用**

**②检查网络是否可用**

**如果上述均无问题，但依然没有搜索结果，那就是书源需要更新了**


### 2.图片无法正常显示

#### 解决措施：关闭替换净化
![img](./pic/ReplaceTurnOff.png)


## 本教程由兽人阅读频道 [@FurryReading](https://t.me/FurryReading) 提供
