let pixivSettings = getFromCacheObject("pixivSettings")
if (!pixivSettings) pixivSettings = setDefaultSettings()

let source = [
    {"🅿️ 登录账号": "login()" },
    {"⚙️ 账号设置": "startPixivSettings()" },
    {"🔙 退出账号": "logout()" },

    {"🆙 更新书源": "updateSource()" },
    {"🔰 使用指南": "startGithubReadme()" },
    {"🐞 反馈问题": "startGithubIssue()" },
]

let methord = ""
if (book) methord = 2
let settingsBase = [
    {"👀 书源设置": `editSettings('SHOW_SETTINGS${methord}')` },
    {"👀 发现设置": `editSettings('SHOW_DISCOVER${methord}')` },
    {"🚫 ✈️ 直连模式": "editSettings('IPDirect')" },
]

let novel = [
    {"章节名称": "text" },
    {"❤️ ㊙️ 收藏本章": "novelBookmarkAdd()" },
    {"📃 🚫 追更系列": "seriesWatchFactory()" },
    {"❤️ 收藏系列": "novelsBookmarkAdd()" },

    {"🖤 取消收藏": "novelsBookmarkDelete()" },
    {"⭐️ ⚫️ 关注作者": "userFollowFactory()"},
    {"🚫 ⭕️ 屏蔽作者": "userBlock()"},
]

let comment = [
    {"文本框": "text" },
    {"✅ 发送评论": "novelCommentAdd()" },
    {"🗑️ 删除评论": "novelCommentDelete()" },
    {"🔄 刷新本章": "cleanCache()" },

    {"🚫 添加屏蔽": "blockAddFactory()" },
    {"⭕️ 删除屏蔽": "blockDeleteFactory()" },
    {"👀 查看屏蔽": "blockShowFactory()" },

    {"📌 喜欢标签": "likeTagsAdd()" },
    {"🗑️ 删除标签": "likeTagsDelete()" },
    {"👀 查看标签": "likeTagsShow()" },

    {"❤️ 他人收藏": "likeAuthorsAdd()" },
    {"🖤 取消收藏": "likeAuthorsDelete()" },
    {"👀 查看收藏": "likeAuthorsShow()" },
]

let settings = [
    {"书源设置": "text" },
    {"⚙️ 当前设置": "showSettings()" },
    {"🔧 默认设置": "setDefaultSettingsLoginUrl()" },
    {"🚫 👤 搜索作者": "editSettings('SEARCH_AUTHOR')" },

    {"🀄 🚫 繁简通搜": "editSettings('CONVERT_CHINESE')" },
    {"🚫 📖 更多简介": "editSettings('MORE_INFORMATION')" },
    {"📅 🚫 更新时间": "editSettings('SHOW_UPDATE_TIME')" },

    {"🔗 🚫 原始链接": "editSettings('SHOW_ORIGINAL_LINK')" },
    {"📚 🚫 恢复《》": "editSettings('REPLACE_TITLE_MARKS')" },
    {"🖼️ 🚫 显示描述": "editSettings('SHOW_CAPTIONS')" },

    {"💬 🚫 显示评论": "editSettings('SHOW_COMMENTS')" },
    {"🚫 ❤️ 隐藏收藏": "editSettings('HIDE_LIKE_NOVELS')" },
    {"🚫 📃 隐藏追更": "editSettings('HIDE_WATCHED_SERIES')" },

    {"🚫 ⏩ 快速模式": "editSettings('FAST')" },
    {"🚫 🐞 调试模式": "editSettings('DEBUG')" },
    // {"🔍 搜索说明": "readMeSearch()" },
    {"🐺 兽人作者": "updatePixivAuthors()" },
]

let discoverSettings = [
    {"发现设置": "text" },
    {"🔍 当前发现": "showSettingsDiscover()" },
    {"🆗 常规小说": "editSettings('SHOW_GENERAL')" },
    {"🔞 最新企划": "editSettings('SHOW_NEW_ADULT')" },

    {"🆗 最新企划": "editSettings('SHOW_NEW_GENERAL')" },
    {"🔞 排行榜单": "editSettings('SHOW_RANK_ADULT')" },
    {"🆗 排行榜单": "editSettings('SHOW_RANK_GENERAL')" },

    {"🔞 原创热门": "editSettings('SHOW_GENRE_ADULT')" },
    {"🆗 原创热门": "editSettings('SHOW_GENRE_GENERAL')" },
    {"🐺 兽人小说": "editSettings('SHOW_FURRY')" },
]

let li = []
try {
    if (book) {
        li = settingsBase.concat(novel).concat(comment)
        if (pixivSettings.SHOW_SETTINGS2) li = li.concat(settings)
        if (pixivSettings.SHOW_DISCOVER2) li = li.concat(discoverSettings)
    } else {
        li = source.concat(settingsBase)
        if (pixivSettings.SHOW_SETTINGS) li = li.concat(settings)
        if (pixivSettings.SHOW_DISCOVER) li = li.concat(discoverSettings)
    }
} catch (e) {}

// 处理按钮
li.forEach(item => {
    item.name = Object.keys(item)[0]
    let list = item.name.split(" ")
    if (list.length === 1 ) {
        item.type = "text"
    } else if (list.length === 2) {
        item.type = "button"
        item.action = Object.values(item)[0]
    } else {
        item.name = list[list.length - 1]
        item.type = "toggle"
        item.default = `${list[0]} `
        list.length = list.length - 1
        item.chars = list.map(char => `${char} `)
        item.action = Object.values(item)[0]
    }
    delete item[Object.keys(item)[0]]
    // 添加格式
    if (item.type === "button" || item.type === "toggle") {
        item.style = {}
        item.style.layout_flexGrow = 1
        item.style.layout_flexBasisPercent = -1
    }
})

JSON.stringify(li)