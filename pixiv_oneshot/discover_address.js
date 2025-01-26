@js:
try {
    settings = String(source.variableComment).match(RegExp(/{([\s\S]*?)}/gm))
    SHOW_GENERAL_NOVELS_RANK = settings.SHOW_GENERAL_NOVELS_RANK  // 发现：排行榜显示一般小说
} catch (e) {
    SHOW_GENERAL_NOVELS_RANK = false
}

li = [
    {"关注": "https://www.pixiv.net/ajax/follow_latest/novel?p={{page}}&mode=all&lang=zh"},
    {"追更": "https://www.pixiv.net/ajax/watch_list/novel?p={{page}}&new=1&lang=zh"},
    {"推荐": "https://www.pixiv.net/ajax/top/novel?mode=all&lang=zh"},
    {"发现": "https://www.pixiv.net/ajax/novel/discovery?mode=all"},
    {"收藏": "https://www.pixiv.net/ajax/user/{{cache.get(\"pixiv:uid\")}}/novels/bookmarks?tag=&offset={{(page-1)*24}}&limit=24&rest=show&lang=zh"}
]

r18 = [
    {"\uD83D\uDD1E 排行榜": ""},
    {"今日": "https://www.pixiv.net/novel/ranking.php?mode=daily_r18"},
    {"本周": "https://www.pixiv.net/novel/ranking.php?mode=weekly_r18"},
    {"R18G": "https://www.pixiv.net/novel/ranking.php?mode=r18g"},
    {"男性": "https://www.pixiv.net/novel/ranking.php?mode=male_r18"},
    {"女性": "https://www.pixiv.net/novel/ranking.php?mode=female_r18"}
]

general = [
    {"\uD83C\uDD97 排行榜": ""},
    {"今日": "https://www.pixiv.net/novel/ranking.php?mode=daily"},
    {"本周": "https://www.pixiv.net/novel/ranking.php?mode=weekly"},
    {"本月": "https://www.pixiv.net/novel/ranking.php?mode=monthly"},
    {"男性": "https://www.pixiv.net/novel/ranking.php?mode=male"},
    {"女性": "https://www.pixiv.net/novel/ranking.php?mode=female"}
]

bookmarks = [{"❤️ 收藏": ""}]

li = li.concat(r18)
if (SHOW_GENERAL_NOVELS_RANK === true) {
    li = li.concat(general)
}
try {
    authors = String(source.getVariable()).split("\n")
    if (authors[0].trim() !== "" && authors.length >= 1) {
        for (let i in authors) {
            if (authors[i] !== "") {
                let authorId = authors[i].match(RegExp(/\d+/))[0]
                let resp = JSON.parse(java.ajax(`https://www.pixiv.net/ajax/user/${authorId}`))
                if (resp.error !== true) {
                    let bookmark = {}
                    bookmark[resp.body.name] = `https://www.pixiv.net/ajax/user/${authorId}/novels/bookmarks?tag=&offset={{(page-1)*24}}&limit=24&rest=show&lang=zh`
                    bookmarks.push(bookmark)
                }
            }
        }
        li = li.concat(bookmarks)
    }
} catch (e) {
    java.longToast("源变量设置有误")
}

li.forEach(item => {
    item.title = Object.keys(item)[0]
    item.url = Object.values(item)[0]
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