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
>
> ⚠️ **你正在 GitHub 上浏览此文档， Github 文档可能不完整
> [网页版](https://pixivsource.pages.dev/PixivWebApi)
> 内容更全面，排版更精美**


## 搜索
### 🔎 搜索
- **URL**：`https://www.pixiv.net/ajax/search/{type}/{name}`
- **请求方法**: `GET`
- **传参方式**: `PATH` & `QUERY`
#### 参数说明
| 参数名 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `type` | Path | String | 作品类型：`artwork` 插画漫画动图、`illust_ugoira` 插画动图、`illust` 插画、`ugoira` 动图、`manga` 漫画、`novel` 小说 |
| `name` | Path | String | 关键词 |
| `word` | Query | String | 关键词 (同 name) |
| `order` | Query | String | 排序方式：`date_d` 最新、`date` 最旧 |
| `mode` | Query | String | 年龄限制：`all`、`safe`、`r18`|
| `p` | Query | Integer | 页码 |
| `ai_type` | Query | Integer | [可选]AI作品：`0`非AI、`1`AI |
| `s_mode` | Query | String | 检索范围：`s_tag` 标签部分一致、`s_tag_full` 标签完全一致、`tag_tc` 标签标题说明文字、`tc` 标签说明文字 |


### 🔎 搜索小说
- **URL**：`https://www.pixiv.net/ajax/search/{type}/{name}`
- **请求方法**: `GET`
- **传参方式**: `PATH` & `QUERY`
#### 参数说明
| 参数名 | 位置 | 类型 | 说明 |
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


## 首页推荐
### 精选新作/关注用户的作品,插画
`https://www.pixiv.net/ajax/street/latest?lang=zh`


### 推荐作品,插画
`https://www.pixiv.net/ajax/street/sub?lang=zh`


### 首页推荐,插画,小说
`https://www.pixiv.net/ajax/street/for_you?lang=zh`


### 首页推荐等
`https://www.pixiv.net/ajax/street/v2/main`


## 小说首页
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
| 参数名 | 位置 | 类型 | 说明 |
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
| 参数名 | 位置 | 类型 | 说明 |
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
| 参数名 | 位置 | 类型 | 说明 |
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
| 参数名 | 位置 | 类型 | 说明 |
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
| 参数名 | 位置 | 类型 | 说明 |
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
| 参数名 | 位置 | 类型 | 说明 |
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
| 参数名 | 位置 | 类型 | 说明 |
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

- **URL**: `https://www.pixiv.net/ajax/commission/page/request/complete/novels?mode=r18&p=1&lang=zh`
- **请求方法**: `GET`
- **传参方式**: `QUERY`
#### 参数说明
| 参数名 | 位置 | 类型 | 说明 |
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


## 侧边栏
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
- **URL**: `https://www.pixiv.net/ajax/novel/discovery`
- **请求方法**: `GET`
- **传参方式**: `QUERY`
#### 参数说明
| 参数名 | 位置 | 类型 | 说明 |
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
| 参数名 | 位置 | 类型 | 说明 |
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


## 小说信息
### 📄 小说详情
```
https://www.pixiv.net/ajax/novel/${novelId}
```
- 请求方法：`GET`
- 传参方式：`PATH`
#### 参数说明

| 参数名 | 位置 | 类型 | 说明 |
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
### ▶️ 互动

---
## 插画
### 👑 插画排行榜
- **URL**: `https://www.pixiv.net/ranking.php`
- **请求方法**: `GET`
- **传参方式**: `QUERY`

#### 参数说明
| 参数名 | 位置 | 类型 | 说明 |
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

