---
layout: doc
title: Pixiv Web Api
description: 

#sidebar: false
#aside: false
#editLink: false
#lastUpdated: false
prev: false
next: false
#comment: false
#friendLink: false

head:
  - - meta
    - name: keywords
      content: Pixiv Web Api
  - - meta
    - property: og:title
      content: Pixiv Web Api
  - - meta
    - property: og:description
      content: Pixiv Web Api
  - - meta
    - property: og:image
      content: /pic/BookSourcePixiv.png
---

<script setup>
import { computed } from "vue";
import { useData } from "vitepress";

const { page } = useData();
const pagePath = computed(() => page.value.relativePath.replace(/\.md$/, ""));
</script>


<div align="center">
<img width="256" src="./pic/BookSourcePixiv.png" alt="Pixiv BookSource"/>


# Pixiv Web Api
#### 🅿️ 开源阅读 Pixiv 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
</div>


> [!WARNING]
> ⚠️ **你正在 GitHub 上浏览此文档， Github 文档可能不完整
> [网页版](https://pixivsource.pages.dev/PixivWebApi)
> 内容更全面，排版更精美**


> [!Caution]
> #### 免责声明
> 1. 本文档记录的是 Pixiv 官方网站使用的 Web API，**并非官方公开文档**。
> 2. 本文档**不保证**任何接口的**准确性、完整性、时效性、可用性、稳定性**，Pixiv 可随时变更或关闭。
> 3. 本文档仅供学习与研究使用。本文档作者与维护者不对因使用本文档提及的接口导致的任何直接或间接损失承担责任。
> 4. 本文档与 Pixiv Inc. 无任何关联。
>
> **使用本文档即表示：您已阅读并同意以上全部内容。**


## 搜索 {#Search}
### 🔎 搜索 {#SearchAll}
- **URL**：`https://www.pixiv.net/ajax/search/{type}/{name}`
- **请求方法**: `GET`
- **传参方式**: `PATH` & `QUERY`
#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `type` | Path | String | 作品类型：`artwork` 插画漫画动图、`illust_ugoira` 插画动图、`illust` 插画、`ugoira` 动图、`manga` 漫画、`novel` 小说 |
| `name` | Path | String | 关键词 |
| `word` | Query | String | 关键词 (同 name) |
| `order` | Query | String | 排序方式：`date_d` 最新、`date` 最旧 |
| `mode` | Query | String | 年龄限制：`all`、`safe`、`r18`|
| `p` | Query | Integer | 页码 |
| `ai_type` | Query | Integer | [可选]AI作品：`0`非AI、`1`AI |
| `s_mode` | Query | String | 检索范围：`s_tag` 标签部分一致、`s_tag_full` 标签完全一致、`tag_tc` 标签标题说明文字、`tc` 标签说明文字 |


### 📖 搜索小说 {#SearchNovels}
- **URL**：`https://www.pixiv.net/ajax/search/{type}/{name}`
- **请求方法**: `GET`
- **传参方式**: `PATH` & `QUERY`
#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `type` | Path | String | 作品类型：`novel` 小说 |
| `name` | Path | String | 关键词 |
| `word` | Query | String | 关键词 (同 name) |
| `order` | Query | String | 排序方式：`date_d` 最新、`date` 最旧 |
| `mode` | Query | String | 年龄限制：`all`、`safe`、`r18`|
| `p` | Query | Integer | 页码 |
| `s_mode` | Query | String | 检索范围：`s_tag` 标签部分一致、`s_tag_full` 标签完全一致、`tag_tc` 标签标题说明文字、`tc` 标签说明文字 |
| `gs` | Query | Integer | [可选]整合系列：`0` 否、`1` 是 |
| `lang` | Query | String | 语言：`zh` 中文 |

#### 调用示例
```
https://www.pixiv.net/ajax/search/novels/中文?word=中文&order=date_d&mode=all&p=1&s_mode=s_tag&lang=zh
```
#### 对应网页
```
https://www.pixiv.net/search?q=中文&s_mode=s_tag&type=novel&work_lang=zh-cn
```


### 📖 搜索小说(全) {#SearchNovelsAll}
- **URL**：`https://www.pixiv.net/ajax/search/{type}/{name}`
- **请求方法**: `GET`
- **传参方式**: `PATH` & `QUERY`
#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `type` | Path | String | 作品类型：`novel` 小说 |
| `name` | Path | String | 关键词 |
| `word` | Query | String | 关键词 (同 name) |
| `order` | Query | String | 排序方式：`date_d` 最新、`date` 最旧 |
| `mode` | Query | String | 年龄限制：`all`、`safe`、`r18`|
| `scd` | Query | String | [可选]开始时间：`0` 否、`2026-01-01`|
| `ecd` | Query | String | [可选]结束时间：`0` 否、`2026-07-01`|
| `p` | Query | Integer | 页码 |
| `ai_type` | Query | Integer | [可选]AI作品：`0` 否、`1` 是 |
| `csw` | Query | Integer | [可选]整合作者：`0` 否、`1` 是 |
| `s_mode` | Query | String | 检索范围：`s_tag` 标签部分一致、`s_tag_full` 标签完全一致、`tag_tc` 标签标题说明文字、`tc` 标签说明文字 |
| `tlt` | Query | Integer | [可选]正文字数下限：`0` 否、`5000` |
| `tgt` | Query | Integer | [可选]正文字数上限：`0` 否、`5000` |
| `wlt` | Query | Integer | [可选]正文单词下限：`0` 否、`5000` |
| `wgt` | Query | Integer | [可选]正文单词上限：`0` 否、`5000` |
| `original_only` | Query | Integer | [可选]仅限原创：`0` 否、`1` 是 |
| `genre` | Query | Integer | [可选]分类：详见 `https://www.pixiv.net/genre/novel` |
| `gs` | Query | Integer | [可选]整合系列：`0` 否、`1` 是 |
| `lang` | Query | String | 语言：`zh` 中文 |

#### 调用示例
```
https://www.pixiv.net/ajax/search/novels/中文?word=中文&order=date_d&mode=all&p=1&s_mode=s_tag&lang=zh
```
#### 对应网页
```
https://www.pixiv.net/search?q=中文&s_mode=s_tag&type=novel&work_lang=zh-cn
```


### 👤 搜索作者 {#SearchUser}
> [!TIP]
> **搜索用户**

- **URL**：`https://www.pixiv.net/ajax/search/users`
- **请求方法**: `GET`
- **传参方式**: `QUERY`
#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `nick` | Query | String | 昵称 |
| `s_mode` | Query | String | 模式：`s_usr` 部分一致、`s_usr_full` 完全一致 |
| `i` | Query | Integer | [可选]有无投稿：`1` 是（默认）、`0` 否 |
| `comment` | Query | Integer | 不明：空或数字：`comment=`、`comment=1` |
| `p` | Query | Integer | 页码 |
| `lang` | Query | String | 语言：`zh` 中文 |

#### 调用示例
```
https://www.pixiv.net/ajax/search/users?nick=null&s_mode=s_usr&i=1&p=1&lang=zh
```
#### 对应网页
```
https://www.pixiv.net/search/users?nick=null&s_mode=s_usr&i=1&p=1
```


## 首页推荐 {#Home}
### 推荐标签 {#HomeRecommendedTags}
> [!TIP]
> 首页推荐标签

- **URL**：`https://www.pixiv.net/ajax/street/recommend_tags`
- **请求方法**: `GET`
- **传参方式**: `QUERY`
#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `lang` | Query | String | 语言：`zh` 中文 |

#### 调用示例
```
https://www.pixiv.net/ajax/street/recommend_tags
```
#### 对应网页
```
https://www.pixiv.net
```


### 🆕 精选新作 {#HomeNew}
> [!TIP]
> 首页精选新作（插画）

- **URL**：`https://www.pixiv.net/ajax/street/latest`
- **请求方法**: `GET`
- **传参方式**: `QUERY`
#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `lang` | Query | String | 语言：`zh` 中文 |

#### 调用示例
```
https://www.pixiv.net/ajax/street/latest?lang=zh
```
#### 对应网页
```
https://www.pixiv.net
```


### 👤 推荐用户 {#HomeRecommendedUsers}
> [!TIP]
> 首页推荐用户、正在举办的比赛

- **URL**：`https://www.pixiv.net/ajax/street/sub`
- **请求方法**: `GET`
- **传参方式**: `QUERY`
#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `lang` | Query | String | 语言：`zh` 中文 |

#### 调用示例
```
https://www.pixiv.net/ajax/street/sub?lang=zh
```
#### 对应网页
```
https://www.pixiv.net
```

### 👍 推荐作品 {#HomeRecommendedWorks}
> [!TIP]
> 推荐作品

- **URL**：`https://www.pixiv.net/ajax/street/for_you`
- **请求方法**: `GET`
- **传参方式**: `QUERY`
#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `lang` | Query | String | 语言：`zh` 中文 |

#### 调用示例
```
https://www.pixiv.net/ajax/street/for_you?lang=zh
```
#### 对应网页
```
https://www.pixiv.net
```


## 小说首页 {#Novel}
> [!NOTE]
> **按照 [Pixiv 小说首页](https://www.pixiv.net/novel) 顺序排序排序：**
>
> ⭐️ [已关注用户的作品](#FollowLatest)；
> 📃 [追更列表中的作品](#WatchList)；
> 👍 [编辑部的推荐作品](#EditorsPicks)；
> 🔥 [原创热门作品](#Genre)；
> 💯 [推荐作品](#Top)；
> 👑 [每日排行榜](#Ranking)；
> 📑 [瞩目的企划目录](#UserEvent)；
> 💰 [小说约稿作品](#Commission)


### ⭐️ 关注用户 {#FollowLatest}
> [!TIP]
> 已关注用户的（最新）作品 / **关注作者，最新小说**

- **URL**：`https://www.pixiv.net/ajax/follow_latest/novel`
- **请求方法**: `GET`
- **传参方式**: `QUERY`
#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `p` | Query | Integer | 页码 |
| `mode` | Query | String | 年龄限制：`all`、`safe`、`r18`|
| `lang` | Query | String | 语言：`zh` 中文 |

#### 调用示例
```
https://www.pixiv.net/ajax/follow_latest/novel?p=1&mode=r18&lang=zh
```
#### 对应网页
```
https://www.pixiv.net/novel/bookmark_new_r18.php
```


### 📃 追更列表 {#WatchList}
> [!TIP]
> 追更列表中的作品

- **URL**：`https://www.pixiv.net/ajax/watch_list/novel`
- **请求方法**: `GET`
- **传参方式**: `QUERY`
#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `page` | Query | Integer | 页码 |
| `new` | Query | Integer | `1` |
| `lang` | Query | String | 语言：`zh` 中文 |

#### 调用示例
```
https://www.pixiv.net/ajax/watch_list/novel?p=1&new=1&lang=zh
```
#### 对应网页
```
https://www.pixiv.net/following/watchlist/novels
```


### 👍 编辑部推荐 {#EditorsPicks}
> [!TIP]
> 编辑部的推荐作品 **（仅日语）**

- **URL**：`https://www.pixiv.net/ajax/novel/editors_picks`
- **请求方法**: `GET`
- **传参方式**: `QUERY`
#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `limit` | Query | Integer | `30` |
| `lang` | Query | String | 语言：`zh` 中文 |

#### 调用示例
```
https://www.pixiv.net/ajax/novel/editors_picks?limit=30&lang=zh
```
#### 对应网页
```
https://www.pixiv.net/novel/editors_picks
```


### 🔥 原创热门 {#Genre}
> [!TIP]
> 原创热门作品 (分类)

- **URL**：`https://www.pixiv.net/ajax/genre/novel/{genre}`
- **请求方法**: `GET`
- **传参方式**: `PATH` & `QUERY`
#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `genre` | Path | String | 仅 `safe`：`all` 综合<br/>仅 `r18`：`male` 男性、`female` 女性<br/>全部：`romance` 恋爱、`isekai_fantasy` 异世界奇幻、`contemporary_fantasy` 现代奇幻、`mystery` 悬疑、`horror` 恐怖、`sci-fi` 科幻、`literature` 文学、`drama` 情感、`historical_pieces` 历史、`bl` 耽美、`yuri` 百合、`poetry` 散文·诗歌、`non-fiction` 随笔·纪实、`screenplays` 剧本、`reviews` 评论、`other` 其他 |
| `mode` | Query | String | 年龄限制：`safe`、`r18`|
| `lang` | Query | String | 语言：`zh` 中文 |

#### 调用示例
```
https://www.pixiv.net/ajax/genre/novel/male?mode=r18&lang=zh
```
#### 对应网页
```
https://www.pixiv.net/genre/novel/male?mode=r18
```


### 💯 推荐作品 {#Top}
- **URL**: `https://www.pixiv.net/ajax/top/novel`
- **请求方法**: `GET`
- **传参方式**: `QUERY`
#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `mode` | Query | String | 年龄限制：`all`、`r18`|
| `lang` | Query | String | 语言：`zh` 中文 |

#### 调用示例
```
https://www.pixiv.net/ajax/top/novel?mode=all&lang=zh
```
#### 对应网页
```
https://www.pixiv.net/novel
```


### 👑 小说排行榜 {#Ranking}
- **URL**: `https://www.pixiv.net/ajax/ranking/novel`
- **请求方法**: `GET`
- **传参方式**: `QUERY`
- 推出时间：2026-07
#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `mode` | Query | String | 模式：<br/>`daily` 今日、`weekly` 本周、`monthly` 本月、`rookie` 新人 、`weekly_original` 原创、`weekly_ai` AI生成、`male` 受男性欢迎、`female` 受女性欢迎<br/>`daily_r18` 今日、`weekly_r18` 本周、`weekly_r18_ai` AI生成、`male_r18` 受男性欢迎、`female_r18` 受女性欢迎、`r18g` R18G |
| `content` | Query | String | 内容：`novel` 小说 |
| `p` | Query | Integer | 页码：`1` 或 `2` |
| `lang` | Query | String | 语言：`zh` 中文、`ja` 日语 |

#### 调用示例
```
https://www.pixiv.net/ajax/ranking/novel?mode=daily_r18&content=novel&p=1
```
#### 对应网页
```
https://www.pixiv.net/novel/ranking.php?mode=daily_r18
```

### 📑 小说企划 {#UserEvent}
> [!TIP]
> 用户企划 - 小说

- **URL**: `https://www.pixiv.net/ajax/user_event/portal/novels`
- **请求方法**: `GET`
- **传参方式**: `QUERY`
#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `mode` | Query | String | 年龄限制：`all`、`r18`|
| `p` | Query | Integer | 页码 |
| `lang` | Query | String | 语言：`zh` 中文 |

#### 调用示例
```
https://www.pixiv.net/ajax/user_event/portal/novels?mode=r18&p=1&lang=zh
```
#### 对应网页
```
https://www.pixiv.net/user_event.php?type=novels&mode=r18
```


### 💰 小说约稿 {#Commission}
> [!TIP]
> 已完成的约稿 - 小说

- **URL**: `https://www.pixiv.net/ajax/commission/page/request/complete/novels`
- **请求方法**: `GET`
- **传参方式**: `QUERY`
#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `mode` | Query | String | 年龄限制：`all`、`safe`、`r18`|
| `p` | Query | Integer | 页码 |
| `lang` | Query | String | 语言：`zh` 中文 |

#### 调用示例
```
https://www.pixiv.net/ajax/commission/page/request/complete/novels?mode=r18&p=1&lang=zh
```
#### 对应网页
```
https://www.pixiv.net/request/complete/novels?mode=r18
```


## 侧边栏 {#Sidebar}
> [!NOTE]
> **按照 [Pixiv 小说首页](https://www.pixiv.net/novel) 侧边栏顺序排序：**
>
> ⭐️ [已关注用户的最新作品](#FollowLatest)；
> 🔍 [发现](#Discovery)；
> 👑 [排行榜](#Ranking)；
> 🆕 [本站的最新作品](#New)；
> 💰 [约稿](#Commission)；
> 📑 [用户企划](#UserEvent)


### 🔍 发现小说 {#Discovery}
> [!TIP]
> 发现 - 推荐作品 - 小说 

- **URL**: `https://www.pixiv.net/ajax/novel/discovery`
- **请求方法**: `GET`
- **传参方式**: `QUERY`
#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `mode` | Query | String | 年龄限制：`all`、`safe`、`r18`|
| `lang` | Query | String | 语言：`zh` 中文 |

#### 调用示例
```
https://www.pixiv.net/ajax/novel/discovery?mode=r18&lang=zh
```
#### 对应网页
```
https://www.pixiv.net/novel/discovery?mode=r18
```


### 🆕 最新作品 {#New}
> [!TIP]
> 本站的最新作品 / 大家的新作

- **URL**: `https://www.pixiv.net/ajax/novel/new`
- **请求方法**: `GET`
- **传参方式**: `QUERY`
#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `lastId` | Query | Integer | `0` |
| `limit` | Query | Integer | `20` |
| `r18` | Query | Boolean | `true`、`false` |
| `lang` | Query | String | 语言：`zh` 中文 |

#### 调用示例
```
https://www.pixiv.net/ajax/novel/new?lastId=0&limit=20&r18=true&lang=zh
```
#### 对应网页
```
https://www.pixiv.net/novel/new_r18.php
```


## 小说信息 {#Detail}
### 📄 小说详情 {#NovelDetail}
```
https://www.pixiv.net/ajax/novel/{novelId}
```
- 请求方法：`GET`
- 传参方式：`PATH`
#### 参数说明

| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| novelId | PATH | Integer | 小说 ID |

#### 调用示例
```
https://www.pixiv.net/ajax/novel/123455
```
#### 对应网页
```
https://www.pixiv.net/novel/show.php?id=123455
```

## 小说互动
### ❤️ 收藏单篇小说 {#NovelBookmarkAdd}
- **URL**：`https://www.pixiv.net/ajax/novels/bookmarks/add`
- **请求方法**: `POST`
- **Content-Type**: `application/json`

#### 参数说明
| 参数 | 位置 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| `novel_id` | Body | String  | **是** | 目标小说 ID |
| `restrict` | Body | Integer | **是** | 收藏权限：`0` 公开收藏、`1` 私密收藏(仅自己可见) |
| `comment` | Body | String | 否 | 收藏备注，默认为空字符串 |
| `tags` | Body | Array | 否 | 收藏标签，默认为空数组 |

#### 请求体示例
```json
{
  "novel_id": "12345678",
  "restrict": 0,
  "comment": "",
  "tags": []
}
```


### 📖 小说收藏数据 {#NovelBookmarkData}
- **URL**：`https://www.pixiv.net/ajax/novel/{novelId}/bookmarkData`
- **请求方法**: `GET`
- **传参方式**: `PATH`

#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `novelId` | Path | Integer | 目标小说 ID |

#### 调用示例
```
https://www.pixiv.net/ajax/novel/12345678/bookmarkData
```

#### 响应示例
```json
{
	"error": false,
	"message": "",
	"body": {
		"id": 12345678,
		"isBookmarkable": true,
		"bookmarkData": {
			"id": "912321341",
			"private": false
		}
	}
}
```


### 🖤 取消收藏小说 {#NovelBookmarkDelete}
- **URL**：`https://www.pixiv.net/ajax/novels/bookmarks/delete`
- **请求方法**: `POST`
- **Content-Type**: `application/x-www-form-urlencoded`

#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `del` | Body | Integer | 操作标识，固定 `1` |
| `book_id` | Body | Integer | 收藏夹记录 ID |

#### 请求体示例
```
del=1&book_id=987654321
```


### 🖤 取消收藏小说批量 {#NovelsBookmarkDelete}
- **URL**：`https://www.pixiv.net/ajax/novels/bookmarks/remove`
- **请求方法**: `POST`
- **Content-Type**: `application/json`

#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| bookmarkIds | Body | Array | 收藏夹记录 ID 列表 |

#### 请求体示例
```json
{
  "bookmarkIds": [
    "987654321",
    "987654322"
  ]
}
```


### 🏷️ 添加书签 {#NovelMarker}
- **URL**：`https://www.pixiv.net/novel/rpc_marker.php`
- **请求方法**: `POST`
- **Content-Type**: `application/x-www-form-urlencoded`

#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `mode` | Body | String | 操作模式，固定传 `save` |
| `i_id` | Body | Integer | 小说 ID |
| `u_id` | Body | Integer | 用户 ID |
| `page` | Body | Integer | 小说页码：`0` 删除书签，其他添加书签 |

#### 请求体示例
```
mode=save&i_id=12345678&u_id=87654321&page=1
```


### 📃 追更系列小说 {#SeriesWatch}
> [!TIP]
> 仅限系列小说

- **URL**：`https://www.pixiv.net/ajax/novel/series/{seriesId}/watch`
- **请求方法**: `POST`
- **Content-Type**: `application/json`

#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `seriesId` | Path | Integer | 系列小说 ID |

#### 请求体示例
```json
{}
```


### 📃 取消追更系列 {#SeriesUnWatch}
> [!TIP]
> 仅限系列小说

- **URL**：`https://www.pixiv.net/ajax/novel/series/{seriesId}/unwatch`
- **请求方法**: `POST`
- **Content-Type**: `application/json`

#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `seriesId` | Path | String / Integer | 系列小说 ID |

#### 请求体示例
```json
{}
```


### 💬 发送小说评论 {#NovelCommentAdd}
> [!TIP]
> 发送小说评论、回复小说评论

- **URL**：`https://www.pixiv.net/novel/rpc/post_comment.php`
- **请求方法**: `POST`
- **Content-Type**: `application/x-www-form-urlencoded`

#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `type` | Body | String | 评论类型，固定传 `comment` |
| `novel_id` | Body | Integer | 目标小说 ID |
| `author_user_id` | Body | Integer | 当前用户 ID |
| `comment` | Body | String | 评论的具体内容（需经过 URL 编码） |
| `parent_id` | Body | Integer | [可选] 回复的目标评论 ID（若为根评论则不传） |

#### 请求体示例
```
type=comment&novel_id=12345678&author_user_id=87654321&comment=testComment
```



## 用户互动
### ⭐️ 关注作者 {#UserFollow}
- **URL**：`https://www.pixiv.net/bookmark_add.php`
- **请求方法**: `POST`
- **Content-Type**: `application/x-www-form-urlencoded`

#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `mode` | Body | String | 操作模式，固定传 `add` |
| `type` | Body | String | 关注类型，固定传 `user` |
| `user_id` | Body | Integer | 目标作者的用户 ID |
| `tag` | Body | String | 关注标签，默认为空 `""` |
| `restrict` | Body | Integer | 关注权限：`0` 公开关注、`1` 私密关注 |
| `format` | Body | String | 响应数据格式，固定传 `json` |

#### 请求体示例
```
mode=add&type=user&user_id=12345678&tag=""&restrict=0&format=json
```


### ⭐️ 取消关注作者 {#UserUnFollow}
- **URL**：`https://www.pixiv.net/rpc_group_setting.php`
- **请求方法**: `POST`
- **Content-Type**: `application/x-www-form-urlencoded`

#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `mode` | Body | String | 操作模式，固定传 `del` |
| `type` | Body | String | 取消关注的类型，固定传 `bookuser` |
| `id` | Body | Integer | 目标作者的用户 ID |

#### 请求体示例
```
mode=del&type=bookuser&id=12345678
```



---
## 插画 {#Illust}
### 👑 插画排行榜 {#IllustRanking}
- **URL**: `https://www.pixiv.net/ranking.php`
- **请求方法**: `GET`
- **传参方式**: `QUERY`

#### 参数说明
| 参数 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `mode` | Query | String | 模式：<br/>`daily` 今日、`weekly` 本周、`monthly` 本月、`rookie` 新人 、`original` 原创、`daily_ai` AI生成、`male` 受男性欢迎、`female` 受女性欢迎<br/>`daily_r18` 今日、`weekly_r18` 本周、`daily_r18_ai` AI生成、`male_r18` 受男性欢迎、`female_r18` 受女性欢迎、`r18g` R18G |
| `content` | Query | String | 内容：`all` 综合、`illust` 插画、`manga` 漫画、`ugoira` 动图 |
| `format` | Query | String | 数据格式：固定为 `json` |
| `p` | Query | Integer | 页码 |

#### 调用示例
```
https://www.pixiv.net/ranking.php?mode=daily&content=all
```
#### 对应网页
```
https://www.pixiv.net/ranking.php?mode=daily&content=all&format=json&p=1
```

