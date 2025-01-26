@js:
try {
    settings = JSON.parse(String(source.variableComment).split("//")[0])
    SHOW_GENERAL_NOVELS_RANK = settings.SHOW_GENERAL_NOVELS_RANK  // 发现：排行榜显示一般小说
} catch (e) {
    SHOW_GENERAL_NOVELS_RANK = false
}

li = [
    {
        "title": "关注",
        "url": "https://www.pixiv.net/ajax/follow_latest/novel?p={{page}}&mode=all&lang=zh"
    },
    {
        "title": "追更",
        "url": "https://www.pixiv.net/ajax/watch_list/novel?p={{page}}&new=1&lang=zh"
    },
    {
        "title": "推荐",
        "url": "https://www.pixiv.net/ajax/top/novel?mode=all&lang=zh"
    },
    {
        "title": "发现",
        "url": "https://www.pixiv.net/ajax/novel/discovery?mode=all"
    },
    {
        "title": "收藏",
        "url": "https://www.pixiv.net/ajax/user/{{cache.get(\"pixiv:uid\")}}/novels/bookmarks?tag=&offset={{(page-1)*24}}&limit=24&rest=show&lang=zh"
    }
]

r18 = [
    {
        "title": "\uD83D\uDD1E 排行榜",
        "url": ""
    },
    {
        "title": "今日",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=daily_r18"
    },
    {
        "title": "本周",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=weekly_r18"
    },
    {
        "title": "R18G",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=r18g"
    },
    {
        "title": "男性",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=male_r18"
    },
    {
        "title": "女性",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=female_r18"
    }
]

general = [
    {
        "title": "\uD83C\uDD97 排行榜",
        "url": ""
    },
    {
        "title": "今日",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=daily"
    },
    {
        "title": "本周",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=weekly"
    },
    {
        "title": "本月",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=monthly"
    },
    {
        "title": "男性",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=male"
    },
    {
        "title": "女性",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=female"
    }
]


li = li.concat(r18)
if (SHOW_GENERAL_NOVELS_RANK === true) {
    li = li.concat(general)
}

li.forEach(item => {
    item.style = {}
    item.style.layout_flexGrow = 1
    if (item.url === "") {
        item.style.layout_flexBasisPercent = 1
    } else {
        item.style.layout_flexBasisPercent = 0.15
    }
})

JSON.stringify(li)