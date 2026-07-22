---
layout: doc
#title: ✨ 臻享阅读 - 开源阅读 + Pixiv 书源 新手使用指南
#description: 彻底解决 Pixiv 官方软件的痛点！从认识开源阅读，到导入书源、登录账号、开始使用，彻底告别 Pixiv 官方软件的阅读功能缺陷，找回阅读的纯粹乐趣。

#sidebar: false
#aside: false
#editLink: false
#lastUpdated: false
#prev: false
#next: false
#comment: false
#friendLink: false

#head:
#  - - meta
#    - name: keywords
#      content: 臻享阅读, Pixiv 书源新手教程, 开源阅读 Legado 入门, Pixiv 小说书架, Legado Pixiv 配置, Pixiv 小说阅读器, Legado Pixiv 书源, 开源阅读配置
#  - - meta
#    - property: og:title
#      content: ✨ 臻享阅读 - 开源阅读 + Pixiv 书源 新手使用指南
#  - - meta
#    - property: og:description
#      content: 彻底解决 Pixiv 官方软件的痛点！从认识开源阅读，到导入书源、登录账号、开始使用，彻底告别 Pixiv 官方软件的阅读功能缺陷，找回阅读的纯粹乐趣。
#  - - meta
#    - property: og:image
#      content: /pic/BookSourcePixiv.png

---

<script setup>
import { computed } from "vue";
import { useData } from "vitepress";

const { page } = useData();
const pagePath = computed(() => page.value.relativePath.replace(/\.md$/, ""));
</script>


<div align="center">
<img width="256" src="./pic/BookSourcePixiv.png" alt="Pixiv BookSource"/>

# 书源设置
#### 🅿️ 开源阅读 Pixiv 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
</div>



> [!TIP]
>
> **Pixiv 书源的设置介绍**


### 1️⃣ 常规设置
⚙️ 常规设置：我的 - 书源管理 - Pixiv 小说 - 登录
	
| 书源设置　　 | 默认状态 | 常量名称　　            | 作用 |
| ---------- | ------ | --------------------- | --- |
| 繁简通搜　　 | ✅ 开启 | `CONVERT_CHINESE`     | 搜索 |
| 搜索作者　　 | ⭕ 关闭 | `SEARCH_AUTHOR`       | 搜索 |
| 隐藏收藏小说 | ⭕ 关闭 | `SHOW_LIKE_NOVELS`    | 全局 |
| 隐藏追更系列 | ⭕ 关闭 | `SHOW_WATCHED_SERIES` | 全局 |
| 　　　　　　 |  |  |   |
| 更多简介　　 | ⭕ 关闭 | `MORE_INFORMATION`    | 详情 |
| 更新时间　　 | ✅ 开启 | `SHOW_UPDATE_TIME`    | 目录 |
| 原始链接　　 | ✅ 开启 | `SHOW_ORIGINAL_LINK`  | 目录 |
| 恢复书名号　 | ✅ 开启 | `REPLACE_TITLE_MARKS` | 正文 |
| 显示描述　　 | ✅ 开启 | `SHOW_CAPTIONS`       | 正文 |
| 显示评论　　 | ✅ 开启 | `SHOW_COMMENTS`       | 正文 | 
| 　　　　　　 |  |  |   |
| 直连模式　　 | ⭕ 关闭 | `IPDirect`            | 全局 |
| 快速模式　　 | ⭕ 关闭 | `FAST`                | 全局 |
| 调试模式　　 | ⭕ 关闭 | `DEBUG`               | 全局 |

- 搜索作者：
	- 默认搜索 切换 搜索标签、模糊搜索作者

- 隐藏收藏、隐藏追更：
	- 显示/隐藏 收藏小说：搜索、发现 中 显示/隐藏 已收藏单篇小说
	- 显示/隐藏 追更小说：搜索、发现 中 显示/隐藏 已追更系列小说

- 直连模式：
	- 原始链接 开启之后，无法直连
	- 开启直连模式时，默认关闭上述功能

- 快速模式：
	- 繁简通搜、更新时间、原始链接、显示评论，对搜索速度稍有影响
	- 开启快速模式时，默认关闭上述功能


###  2️⃣ 发现设置 
发现设置为 显示/隐藏 XX项目

| 书源发现设置　　　  | 默认状态 | 对应常量名称           | 作用 | 
| --------------- | ------ | -------------------- | --- |
| 常规发现　成人　　　| ✅ 开启 | `SHOW_ADULT`         | 发现 |
| 常规发现　常规　　　| ✅ 开启 | `SHOW_GENERAL`       | 发现 |
| 最新企划约稿　成人　| ✅ 开启 | `SHOW_NEW_ADULT`     | 发现 |
| 最新企划约稿　常规　| ⭕ 关闭 | `SHOW_NEW_GENERAL`   | 发现 |
| 排行榜单　成人　　　| ✅ 开启 | `SHOW_RANK_ADULT`    | 发现 |
| 排行榜单　常规　　　| ⭕ 关闭 | `SHOW_RANK_GENERAL`  | 发现 |
| 原创热门　成人　　　| ⭕ 关闭 | `SHOW_GENRE_ADULT`   | 发现 |
| 原创热门　常规　　　| ⭕ 关闭 | `SHOW_GENRE_GENERAL` | 发现 |
| 兽人小说推荐作者　　| ⭕ 关闭 | `SHOW_FURRY`         | 发现 |


### 3️⃣ 菜单设置
菜单设置为 显示/隐藏 XX项目
| 书源设置　　　　　　　 | 默认状态 | 常量名称　　       | 作用 |
| ------------------- | ------- | ---------------- | --- |
| 书源设置(书籍编辑界面) | ✅ 开启 | `SHOW_SETTINGS`  | 全局 |
| 发现设置(书籍编辑界面) | ✅ 开启 | `SHOW_DISCOVER`  | 全局 |
| 书源设置(小说阅读界面) | ⭕ 关闭 | `SHOW_SETTINGS2` | 全局 |
| 发现设置(小说阅读界面) | ⭕ 关闭 | `SHOW_DISCOVER2` | 全局 |

