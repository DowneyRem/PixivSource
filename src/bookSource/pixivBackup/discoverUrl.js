let settings = getFromCacheObject("pixivSettings")
if (!settings) settings = setDefaultSettings()
let li =[]

let adultDefault = [
    {"⭐️ 关注": "https://www.pixiv.net/ajax/follow_latest/novel?p={{page}}&mode=r18&lang=zh"},
    {"📃 追更": "https://www.pixiv.net/ajax/watch_list/novel?p={{page}}&new=1&lang=zh"},
    {"💯 推荐": "https://www.pixiv.net/ajax/top/novel?mode=r18&lang=zh"},
    {"🔍 发现": "https://www.pixiv.net/ajax/novel/discovery?mode=r18&lang=zh"},
    {"❤️ 收藏": "https://www.pixiv.net/ajax/user/{{cache.get(\"pixivUid\")}}/novels/bookmarks?tag=&offset={{(page-1)*24}}&limit=24&rest=show&lang=zh"},
    {"㊙️ 收藏": "https://www.pixiv.net/ajax/user/{{cache.get(\"pixivUid\")}}/novels/bookmarks?tag=&offset={{(page-1)*24}}&limit=24&rest=hide&lang=zh"},
    {"🏷️ 书签": "https://www.pixiv.net/novel/marker_all.php"},
    {"🏠 首页": "https://www.pixiv.net/ajax/street/for_you?lang=zh"},
]

let normalDefault = [
    {"✅ 常规 小说 推荐 ✅": ""},
    {"⭐️ 关注": "https://www.pixiv.net/ajax/follow_latest/novel?p={{page}}&mode=all&lang=zh"},
    {"💯 推荐": "https://www.pixiv.net/ajax/top/novel?mode=all&lang=zh"},
    {"🔍 发现": "https://www.pixiv.net/ajax/novel/discovery?mode=safe&lang=zh"},
    {"🆙 更新": "https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/pixiv.json"},
]

let adultNew = [
    {"🆕 最新 企划 约稿 💰": ""},
    {"🆕 最新": "https://www.pixiv.net/ajax/novel/new?lastId=0&limit=20&r18=true&lang=zh"},
    {"📑 企划": "https://www.pixiv.net/ajax/user_event/portal/novels?mode=r18&p={{page}}&lang=zh"},
    {"💰 约稿": "https://www.pixiv.net/ajax/commission/page/request/complete/novels?mode=r18&p={{page}}&lang=zh"},
    {"🔍 发现": "https://www.pixiv.net/ajax/novel/discovery?mode=all&lang=zh"},
]

let generalNew = [
    {"✅ 最新 企划 约稿 ✅": ""},
    {"最新": "https://www.pixiv.net/ajax/novel/new?lastId=0&limit=20&r18=false&lang=zh"},
    {"企划": "https://www.pixiv.net/ajax/user_event/portal/novels?mode=all&p={{page}}&lang=zh"},
    {"约稿": "https://www.pixiv.net/ajax/commission/page/request/complete/novels?mode=all&p={{page}}&lang=zh"},
    {"编辑": "https://www.pixiv.net/ajax/novel/editors_picks?limit=30&lang=zh"},
]

let adultRank = [
    {"👑 排行榜单 👑": ""},
    {"今日": "https://www.pixiv.net/ajax/ranking/novel?mode=daily_r18&content=novel&p={{page}}"},
    {"本周": "https://www.pixiv.net/ajax/ranking/novel?mode=weekly_r18&content=novel&p={{page}}"},
    {"R18G": "https://www.pixiv.net/ajax/ranking/novel?mode=r18g&content=novel&p={{page}}"},
    {"男性": "https://www.pixiv.net/ajax/ranking/novel?mode=male_r18&content=novel&p={{page}}"},
    {"女性": "https://www.pixiv.net/ajax/ranking/novel?mode=female_r18&content=novel&p={{page}}"}
]

let generalRank = [
    {"🏆 排行榜单 🏆": ""},
    {"今日": "https://www.pixiv.net/ajax/ranking/novel?mode=daily&content=novel&p={{page}}"},
    {"本周": "https://www.pixiv.net/ajax/ranking/novel?mode=weekly&content=novel&p={{page}}"},
    {"本月": "https://www.pixiv.net/ajax/ranking/novel?mode=monthly&content=novel&p={{page}}"},
    {"男性": "https://www.pixiv.net/ajax/ranking/novel?mode=male&content=novel&p={{page}}"},
    {"女性": "https://www.pixiv.net/ajax/ranking/novel?mode=female&content=novel&p={{page}}"},
    {"新人": "https://www.pixiv.net/ajax/ranking/novel?mode=rookie&content=novel&p={{page}}"},
    {"原创": "https://www.pixiv.net/ajax/ranking/novel?mode=weekly_original&content=novel&p={{page}}"},
    {"AI生成": "https://www.pixiv.net/ajax/ranking/novel?mode=weekly_ai&content=novel&p={{page}}"}
]

let adultGenre = [
    {"🔥 原创热门 🔥": ""},
    {"男性": "https://www.pixiv.net/ajax/genre/novel/male?mode=r18&lang=zh"},
    {"女性": "https://www.pixiv.net/ajax/genre/novel/female?mode=r18&lang=zh"},
    {"恋爱": "https://www.pixiv.net/ajax/genre/novel/romance?mode=r18&lang=zh"},
    {"异世界奇幻": "https://www.pixiv.net/ajax/genre/novel/isekai_fantasy?mode=r18&lang=zh"},
    {"现代奇幻": "https://www.pixiv.net/ajax/genre/novel/contemporary_fantasy?mode=r18&lang=zh"},
    {"悬疑": "https://www.pixiv.net/ajax/genre/novel/mystery?mode=r18&lang=zh"},
    {"恐怖": "https://www.pixiv.net/ajax/genre/novel/horror?mode=r18&lang=zh"},
    {"科幻": "https://www.pixiv.net/ajax/genre/novel/sci-fi?mode=r18&lang=zh"},
    {"文学": "https://www.pixiv.net/ajax/genre/novel/literature?mode=r18&lang=zh"},
    {"情感": "https://www.pixiv.net/ajax/genre/novel/drama?mode=r18&lang=zh"},
    {"历史": "https://www.pixiv.net/ajax/genre/novel/historical_pieces?mode=r18&lang=zh"},
    {"耽美": "https://www.pixiv.net/ajax/genre/novel/bl?mode=r18&lang=zh"},
    {"百合": "https://www.pixiv.net/ajax/genre/novel/yuri?mode=r18&lang=zh"},
    {"散文·诗歌": "https://www.pixiv.net/ajax/genre/novel/poetry?mode=r18&lang=zh"},
    {"随笔·纪实": "https://www.pixiv.net/ajax/genre/novel/non-fiction??mode=r18&lang=zh"},
    {"剧本": "https://www.pixiv.net/ajax/genre/novel/screenplays?mode=r18&lang=zh"},
    {"评论": "https://www.pixiv.net/ajax/genre/novel/reviews?mode=r18&lang=zh"},
    {"其他": "https://www.pixiv.net/ajax/genre/novel/other?mode=r18&lang=zh"}
]

let generalGenre = [
    {"❤️‍🔥 原创热门 ❤️‍🔥": ""},
    {"综合": "https://www.pixiv.net/ajax/genre/novel/all?mode=safe&lang=zh"},
    {"恋爱": "https://www.pixiv.net/ajax/genre/novel/romance?mode=safe&lang=zh"},
    {"异世界奇幻": "https://www.pixiv.net/ajax/genre/novel/isekai_fantasy?mode=safe&lang=zh"},
    {"现代奇幻": "https://www.pixiv.net/ajax/genre/novel/contemporary_fantasy?mode=safe&lang=zh"},
    {"悬疑": "https://www.pixiv.net/ajax/genre/novel/mystery?mode=safe&lang=zh"},
    {"恐怖": "https://www.pixiv.net/ajax/genre/novel/horror?mode=safe&lang=zh"},
    {"科幻": "https://www.pixiv.net/ajax/genre/novel/sci-fi?mode=safe&lang=zh"},
    {"文学": "https://www.pixiv.net/ajax/genre/novel/literature?mode=safe&lang=zh"},
    {"情感": "https://www.pixiv.net/ajax/genre/novel/drama?mode=safe&lang=zh"},
    {"历史": "https://www.pixiv.net/ajax/genre/novel/historical_pieces?mode=safe&lang=zh"},
    {"耽美": "https://www.pixiv.net/ajax/genre/novel/bl?mode=safe&lang=zh"},
    {"百合": "https://www.pixiv.net/ajax/genre/novel/yuri?mode=safe&lang=zh"},
    {"散文·诗歌": "https://www.pixiv.net/ajax/genre/novel/poetry?mode=safe&lang=zh"},
    {"随笔·纪实": "https://www.pixiv.net/ajax/genre/novel/non-fiction??mode=safe&lang=zh"},
    {"剧本": "https://www.pixiv.net/ajax/genre/novel/screenplays?mode=safe&lang=zh"},
    {"评论": "https://www.pixiv.net/ajax/genre/novel/reviews?mode=safe&lang=zh"},
    {"其他": "https://www.pixiv.net/ajax/genre/novel/other?mode=safe&lang=zh"}
]

let about = [
    {"📘 书源相关 📘": ""},
    {"🏠 主页": "https://pixivsource.pages.dev"},
    {"🔰 功能": "https://pixivsource.pages.dev/Pixiv"},
    {"🐞 反馈": "https://github.com/DowneyRem/PixivSource/issues"},
    {"💰 打赏": "https://pixivsource.pages.dev/Sponsor"},
]

// 收藏标签
let likeTagLinks = [{"📌 喜欢标签 📌":""}]
let likeTags = getFromCacheObject("likeTags")
if (likeTags && likeTags.length >= 1) {
    likeTags.forEach(tag => {
        let tagLink = {}
        tagLink[tag] = `${urlSearchNovel(tag, "{{page}}")}`
        likeTagLinks.push(tagLink)
    })
}

// 他人收藏
let othersBookmarks = [{"❤️ 他人收藏 ❤️": ""}]
let likeAuthors = getFromCacheMap("likeAuthorsMap")
if (!likeAuthors) likeAuthors = getFromCacheMap("likeAuthors")
if (likeAuthors.size > 0) {
    likeAuthors.forEach((authorName, authorId) => {
        let bookmark = {}
        bookmark[authorName] = urlUserBookmarks(authorId)
        othersBookmarks.push(bookmark)
    })
}

// 兽人小说
let furrynovels = [{"🦊 兽人小说 🦊": ""}]
if (settings.SHOW_FURRY) {
    let authorsListLinpx = getAjaxJson(urlLinpxAuthors())
    const randomAuthors = authorsListLinpx
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
    const randomObjects = randomAuthors.map(author => ({
        [author.name]: urlUserAllWorks(author.id)
    }))
    furrynovels = furrynovels.concat(randomObjects)
}


// 添加发现
if (settings.SHOW_ADULT) li = li.concat(adultDefault)
if (settings.SHOW_GENERAL) li = li.concat(normalDefault)
if (settings.SHOW_NEW_ADULT) li = li.concat(adultNew)
if (settings.SHOW_NEW_GENERAL) li = li.concat(generalNew)

if (settings.SHOW_RANK_ADULT)li = li.concat(adultRank)
if (settings.SHOW_RANK_GENERAL) li = li.concat(generalRank)
if (settings.SHOW_GENRE_ADULT) li = li.concat(adultGenre)
if (settings.SHOW_GENRE_GENERAL) li = li.concat(generalGenre)

if (likeTags && likeTags.length >= 1) li = li.concat(likeTagLinks)
if (likeAuthors && likeAuthors.size > 0) li = li.concat(othersBookmarks)
if (settings.SHOW_FURRY) li = li.concat(furrynovels)
if (settings.SHOW_ABOUT) li = li.concat(about)
sleepToast('功能手册\n\n发现 - 书源相关 - "🔰 功能" ')

// 添加格式
li.forEach(item => {
    item.title = Object.keys(item)[0]
    item.url = Object.values(item)[0]
    if (item.url.includes("https://www.pixiv.net")) item.url = urlIP(item.url)
    delete item[Object.keys(item)[0]]
    item.style = {}
    item.style.layout_flexGrow = 1
    item.style.layout_flexShrink = 1
    item.style.layout_alignSelf = "auto"
    item.style.layout_wrapBefore = "false"
    if (item.url === "") {
        item.style.layout_flexBasisPercent = 1
    } else {
        item.style.layout_flexBasisPercent = -1
    }
})

JSON.stringify(li)