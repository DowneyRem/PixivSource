## Linpx 书源的导入与使用

### [Linpx](http://www.furrynovel.ink) 是第三方 免代理 Pixiv 小说镜像站，主要内容为**兽人小说**
![img](./pic/LinpxWebpage.png)


### 本书源使用前提
1. 使用阅读 3.0 版本
2. 导入 Linpx 的书源、订阅源


## 一、导入书源 & 订阅源
### 0.下载阅读 3.0 版本
点击链接，下载安装包并安装，**推荐使用共存版**

> https://miaogongzi.lanzout.com/b01rgkhhe
>
> 最新下载链接请查看 [阅读是什么软件？3.下载阅读](./ReadMe.md#3.下载阅读)


### 1.了解阅读功能与用法
> 请查看 [阅读是什么软件？阅读简介](./ReadMe.md)


### 2.导入 Linpx 书源
复制下方【免代理】书源链接
```
https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/linpx.json
```
#### 2.1 打开【订阅】页面，点击【规则订阅】
![img](./pic/SubscribeEntry.jpg)


#### 2.2 点击加号，粘贴链接，保存订阅
![img](./pic/SubscribeBoookSourceLinpx.jpg)


#### 2.3 点击相应订阅规则，导入并启用/更新书源
![img](./pic/SubscribeHomePage.jpg)

**首次点击【订阅规则】 即可导入**
![img](./pic/InportBookSourceLinpx.jpg)
**导入之后，再次点击则会检查更新**

> 更多导入方法请查看[如何获取书源？导入书源？](./ImportBookSource.md)


### 3.导入 Linpx 订阅源
复制下方【免代理】订阅源链接
```
https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/btsrk.json
```
#### 3.1 打开【订阅】页面，点击【规则订阅】
![img](./pic/SubscribeEntry.jpg)


#### 3.2 点击加号，更改规则类型，粘贴链接，保存订阅
**注意这里要把【书源】改成【订阅源】**

![img](./pic/SubscribeRssSourceBtsrk.jpg)


#### 3.3 点击相应订阅规则，导入并启用/更新书源
![img](./pic/SubscribeHomePage.jpg)

**首次点击【订阅规则】 即可导入**
![img](./pic/InportRssSourceBtsrk.jpg)
**导入之后，再次点击则会检查更新**

> 更多导入方法请查看[如何导入订阅源](./ImportRssSource.md)


**Linpx 无需登录，无需代理，即可访问 R18 小说，因此你不必做过多的操作**


## 二、添加小说，尽情使用
### 1.阅读内部搜索
支持搜索小说名称、作者名称、小说标签
![img](./pic/SearchViaLegado.png)


### 2.发现更多小说
发现：推荐作者、最新小说

![img](./pic/DiscoverLinpx.jpg)
![img](./pic/DiscoverLinpxNewNovels.png)


### 3.添加网址
首页打开【添加网址】，粘贴小说链接，可以同时添加多个小说的链接
![img](./pic/AddBookViaUrl1.png)
![img](./pic/AddBookViaUrl2.png)
![img](./pic/AddBookViaUrl3.png)
此处使用正则匹配网址，支持 Linpx 多个格式的网址链接：

```
Linpx 小说长链接
https://www.furrynovel.xyz/pixiv/novel/20063566
https://furrynovel.ink/pixiv/novel/20063566

Linpx 分享链接
http://furrynovel.xyz/pn/20063566
https://furrynovel.ink/pn/20063566

Linpx 分享信息
我正在看唐尼瑞姆创作的《测试页面》一起来看吧！
https://furrynovel.ink/pn/20063566
```


### 4.订阅源添加小说
导入 Linpx 订阅源，配合书源使用体验更好

#### 4.1 替代阅读搜索
受阅读设计的限制，阅读内部搜索不可能完全支持 Linpx的功能。网站的搜索功能更加全面。

![img](./pic/SearchViaLinpx.png)


#### 4.2 Pixiv 链接转换
阅读内部浏览器内打开 Linpx，搜索栏中粘贴 Pixiv 小说链接，进入对应页面，即可添加小说到书架
![img](./pic/LinpxConvertPixivUrl1.png)
![img](./pic/LinpxConvertPixivUrl2.png)


#### 4.3 添加小说至书架
在阅读内部浏览器内打开 Linpx 小说页面，即可添加小说到书架
![img](./pic/AddBookViaLinpx.png)


## 三、故障排查
> 详见：[故障排查与处理](./TroubleShoot.md)
> 
### 1.没有搜索结果，请自行检查一下内容：

**⓪检查 Linpx 书源是否导入**

**①检查 Linpx 书源是否启用**

**②检查网络是否可用**

**如果上述均无问题，但依然没有搜索结果，那就是书源需要更新了**


### 2.图片无法正常显示

#### 解决措施：关闭替换净化
![img](./pic/ReplaceTurnOff.png)


## 本教程由兽人阅读频道 [@FurryReading](https://t.me/FurryReading) 提供
