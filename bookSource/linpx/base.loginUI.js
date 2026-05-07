let source = [
    {"🆙 更新书源": "updateSource()" },
    {"🔰 使用指南": "startGithubReadme()" },
    {"🐞 反馈问题": "startGithubIssue()" },
]

let novel = [
    {"章节名称": "text" },
    {"⤴️ 分享章节": "shareFactory('novel')" },
    {"⤴️ 分享作者": "shareFactory('author')" },
    {"🅿️ 分享小说": "shareFactory('pixiv')" },
]

let settings = [
    {"书源设置": "text" },
    {"⚙️ 当前设置": "showSettings()" },
    {"🔧 默认设置": "setDefaultSettingsLoginUrl()" },
    {"👤 🚫 搜索作者": "editSettings('SEARCH_AUTHOR')" },

    {"🀄 🚫 繁简通搜": "editSettings('CONVERT_CHINESE')" },
    {"🚫 📖 更多简介": "editSettings('MORE_INFORMATION')" },
    {"🔗 🚫 原始链接": "editSettings('SHOW_ORIGINAL_LINK')" },

    {"📚 🚫 恢复《》": "editSettings('REPLACE_TITLE_MARKS')" },
    {"🖼️ 🚫 显示描述": "editSettings('SHOW_CAPTIONS')" },
    {"🐞 🚫 调试模式": "editSettings('DEBUG')" },

    {"🖼️ 图片解析": "editSettings('PIC_SOURCE')" },
    {"🔗 图片链接": "editSettings('PIC_LINK')" },
]

// 添加按钮
let li = source
try {
    if (book) li = li.concat(novel)
} catch (e) {}
li = li.concat(settings)

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