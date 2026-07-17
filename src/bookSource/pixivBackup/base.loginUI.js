let pixivSettings = getFromCacheObject("pixivSettings")
if (!pixivSettings) pixivSettings = setDefaultSettings()
let pixivEnvironment = getFromCacheObject("pixivEnvironment")
let number = { 1:"1️⃣", 2:"2️⃣", 3:"3️⃣", 4:"4️⃣", 5:"5️⃣" }
const BOOK = typeof book !== 'undefined' && !!book

let source = [
    {"🅿️ 登录账号": "login()" },
    {"⚙️ 账号设置": "startPixivSettings()" },
    {"🔙 退出账号": "logout()" },

    {"🆙 更新书源": "updateSource()" },
    {"🔰 功能手册": "startGithubReadme()" },
    {"🐞 反馈问题": "startGithubIssue()" },
]
let settingsBase = []
if (BOOK) {
    settingsBase = [
        {"👀 书源设置": `editSettings('SHOW_SETTINGS2')` },
        {"🔰 功能手册": "startGithubReadme()" },
        {"✈️ 直连模式": "editSettings('IPDirect')" },
        {"🔢 章节编号": "editSettings('ADD_CHAPTER_INDEX')" },
        {"❤️ 自动收藏": "editSettings('AUTO_LIKE_NOVELS')" },
        {"🐞 调试模式": "editSettings('DEBUG')" },
    ]
} else {
    settingsBase = [
        {"👀 书源设置": `editSettings('SHOW_SETTINGS')` },
        {"👀 发现设置": `editSettings('SHOW_DISCOVER')` },
        {"🚫 ✈️ 直连模式": "editSettings('IPDirect')" },
    ]
}

let novel = [
    {"章节名称": "text" },
    {"❤️ ㊙️ 收藏本章": "novelBookmarkAdd()" },
    {"📃 🚫 追更系列": "seriesWatchFactory()" },
    {"❤️ 收藏系列": "novelsBookmarkAdd()" },

    {"🖤 取消收藏": "novelsBookmarkDelete()" },
    {"⭐️ ⚫️ 关注作者": "userFollowFactory()"},
    {"🚫 ⭕️ 屏蔽作者": "userBlock()"},
]

if (pixivSettings.SHOW_QUESTION && BOOK) {
    let getNovelId = () => {
        try { return chapter.url.match(/novel\/(\d+)/)[1] } catch(e) {}
        try { return chapter.url.match(/\d+/)[0] } catch(e) {}
        return 0
    }
    let getNovelData = (novelId) => {
        try { return getFromCacheObject(urlNovelDetailed(novelId)).body } catch(e) {}
        try { return getAjaxJson(urlNovelDetailed(novelId)).body } catch(e) {}
        return {}
    }

    let pixivUid = String(getFromCache("pixivUid"))
    let novelData = getNovelData(getNovelId())
    let showChoices = novelData.pollData && pixivUid !== novelData.userId && !novelData.pollData.selectedValue
    if (pixivSettings.DEBUG) showChoices = !!novelData.pollData
    if (showChoices) {
        let choices = [{"问卷调查": "text"}]

        novelData.pollData.choices.forEach((choice, i) => {
            let emoji = number[i + 1]
            let key = `${emoji} 投票选项`
            let value = `novelPollAnswer(${i + 1})`
            choices.push({ [key] : value })
        })
        novel = novel.concat(choices)
    }
}

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
    {"💾 备份恢复": "backupRestore()" },
    {"⚙️ 当前设置": "showSettings()" },
    {"🔧 默认设置": "setDefaultSettingsLoginUrl()" },

    {"🚫 👤 搜索作者": "editSettings('SEARCH_AUTHOR')" },
    {"🀄 🚫 繁简通搜": "editSettings('CONVERT_CHINESE')" },
    {"🚫 📖 更多简介": "editSettings('MORE_INFORMATION')" },

    {"🚫 🔢 章节编号": "editSettings('ADD_CHAPTER_INDEX')" },
    {"📅 🚫 更新时间": "editSettings('SHOW_UPDATE_TIME')" },
    {"🔗 🚫 原始链接": "editSettings('SHOW_ORIGINAL_LINK')" },

    {"📄 🚫 显示描述": "editSettings('SHOW_CAPTIONS')" },
    {"🖼️ 🚫 显示插图": "editSettings('SHOW_PICTURES')" },
    {"✅ 🚫 显示投票": "editSettings('SHOW_QUESTION')" },

    {"💬 🚫 显示评论": "editSettings('SHOW_COMMENTS')" },
    {"📚 🚫 恢复《》": "editSettings('REPLACE_TITLE_MARKS')" },
    {"❤️ 🚫 自动收藏": "editSettings('AUTO_LIKE_NOVELS')" },

    {"🚫 🖤 自动取消": "editSettings('AUTO_DISLIKE_NOVELS')" },
    {"🚫 ❤️ 隐藏收藏": "editSettings('HIDE_LIKE_NOVELS')" },
    {"🚫 📃 隐藏追更": "editSettings('HIDE_WATCHED_SERIES')" },

    {"📚 🚫 整合系列": "editSettings('COMBINE_NOVELS')" },
    {"🚫 ⏩ 快速模式": "editSettings('FAST')" },
    {"🚫 🐞 调试模式": "editSettings('DEBUG')" },
    // {"🚫 ✈️ 直连模式": "editSettings('IPDirect')" },

    // {"⏳ 图片解析": "editSettings('PIC_SOURCE')" },
    // {"🔗 图片链接": "editSettings('PIC_LINK')" },
    // {"↔️ 图片大小": "editSettings('PIC_SIZE')" },
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
    {"🐺 兽人作者": "updatePixivAuthors()" },
]

let li = []
if (BOOK) {
    li = settingsBase.concat(novel).concat(comment)
    if (pixivSettings.SHOW_SETTINGS2) li = li.concat(settings)
    if (pixivSettings.SHOW_DISCOVER2) li = li.concat(discoverSettings)
} else {
    li = source.concat(settingsBase)
    if (pixivSettings.SHOW_SETTINGS) li = li.concat(settings)
    if (pixivSettings.SHOW_DISCOVER) li = li.concat(discoverSettings)
}

// 处理按钮
li.forEach(item => {
    item.name = Object.keys(item)[0]
    if (!pixivEnvironment?.IS_LEGADO_SIGMA) {
        item.name = item.name.replace(/🚫 |⚫️ |㊙️ /g, "")
    }
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