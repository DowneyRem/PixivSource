var util = objParse(String(java.get("util")))

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (isFunctionString(v)) {
            return eval(`(${v})`)
        }
        return v;
    })
}

var first = true;
// 存储seriesID
var seriesSet = {
    keywords: "Pixiv:Search",
    has: (value) => {
        let page = Number(java.get("page"))
        if (page === 1 && first) {
            first = false
            cache.deleteMemory(this.keywords)
            return false
        }

        let v = cache.getFromMemory(this.keywords)
        if (v === undefined || v === null) {
            return false
        }
        let set = new Set(JSON.parse(v))
        return set.has(value)
    },

    add: (value) => {
        let v = cache.getFromMemory(this.keywords)
        if (v === undefined || v === null) {
            cache.putMemory(this.keywords, JSON.stringify([value]))

        } else {
            let arr = JSON.parse(v)
            if (typeof arr === "string") {
                arr = Array(arr)
            }
            arr.push(value)
            cache.putMemory(this.keywords, JSON.stringify(arr))
        }
    },
};

function getUserIdCache() {
    let userIds = [], userId
    let userName = String(java.get("keyword")).trim()
    //cache.delete("pixivAuthors")
    let pixivAuthors = getFromCacheObject("pixivAuthors")
    // java.log(JSON.stringify(pixivAuthors))
    if (pixivAuthors) userId = pixivAuthors[userName]
    if (userId) {
        java.log(`👤 缓存作者ID：${userId}`)
        userIds.push(userId)
    }
    return userIds
}

// 搜索作者：只保留当页小说（发布过小说的作者的小说）
// 搜索作者：若当页没有小说，则添加【测试页面】的数据以便继续向后翻页
function getUserNovelsByName(full = false) {
    let userName = String(java.get("keyword")).trim()
    let page = Number(java.get("page")) || 1

    java.log(urlSearchUser(userName, page, full))
    let resp = getAjaxJson(urlSearchUser(userName, page, full))
    if (resp.error === true || !resp.body) return []

    let novels = resp.body.thumbnails.novel || []
    let userIdsOriginal = resp.body.page.userIds
    let userIdsNovels = Array.from(new Set(novels.map(item => item.userId)))
    java.log(`👤 获取作者ID：${JSON.stringify(userIdsNovels)}`)

    if (page === 1 && userIdsNovels.length === 1) {
        let pixivAuthors = getFromCacheObject("pixivAuthors") || {}
        pixivAuthors[userName] = userIdsNovels[0]
        putInCacheObject("pixivAuthors", pixivAuthors)
    }

    if (userIdsNovels.length === 0 && userIdsOriginal.length >= 1) {
        novels = novels.concat(getAjaxJson(urlSearchNovel("测试页面", 1)).body.novel.data)
        sleepToast(`👤 搜索作者\n\n点击按钮或向上滑动后，可向后翻页\n每次可获取10个作者`)
    }
    if (userIdsOriginal.length === 0) {
        sleepToast(`👤 搜索作者\n\n暂无名为【${userName}】的作者\n请更换其他关键词`)
    }
    return novels
}

function getUserNovelsById(uid) {
    let resp = getAjaxJson(urlUserAllWorks(uid), true)
    if (resp.error === true || !resp.body) return []
    return util.getUserNovelsById(resp.body)
}

// 精确搜索：命中作者缓存则直接返回该作者全部小说
// 精确搜索：否则精确搜索作者名称
function getUserNovels() {
    let uidList = getUserIdCache()
    if (uidList.length === 1 ) return getUserNovelsById(uidList[0])
    else return getUserNovelsByName(true)
}

function search(name, type, page) {
    let resp = {}
    if (type.includes("novel")) {
        resp = getAjaxJson(urlSearchNovel(name, page))
        java.log(urlSearchNovel(name, page))
    }
    if (type.includes("series")) {
        resp = getAjaxJson(urlSearchSeries(name, page))
        java.log(urlSearchSeries(name, page))
    }
    if (resp.error === true || resp.total === 0) {
        return {"data": [], "total":0, "lastPage": 0}
    }
    return resp.body.novel
}

function getSeries() {
    let resp = JSON.parse(result)
    if (resp.error === true) {
        return []
    }
    let name = String(java.get("keyword"))
    let page = Number(java.get("page"))
    java.log(urlSearchSeries(name, page))
    putInCacheObject(urlSearchSeries(name, page), resp, cacheSaveSeconds)  // 加入缓存
    return resp.body.novel.data
}

function getNovels() {
    let name = String(java.get("keyword"))
    let page = Number(java.get("page"))
    let resp = search(name, "novel", page)
    return util.combineNovels(resp.data)
}

function getConvertNovels() {
    let novels = []
    let name = String(java.get("keyword"))
    let page = Number(java.get("page"))
    let name1 = String(java.s2t(name))
    let name2 = String(java.t2s(name))
    if (name1 !== name) novels = novels.concat(search(name1, "novel", page).data)
    if (name2 !== name) novels = novels.concat(search(name2, "novel", page).data)
    novels = util.combineNovels(novels)
    if (util.settings.COMBINE_NOVELS) return novels

    if (name1 !== name ) novels = novels.concat(search(name1, "series", page).data)
    if (name2 !== name) novels = novels.concat(search(name2, "series", page).data)
    return novels
}

function novelFilter(novels) {
    let textCount = 0, tags = []
    let limitedTextCount = String(java.get("limitedTextCount")).replace("字数", "").replace("字數", "")
    // limitedTextCount = `3w 3k 3w5 3k5`.[0]
    if (limitedTextCount.includes("w") || limitedTextCount.includes("W")) {
        let num = limitedTextCount.toLowerCase().split("w")
        textCount = 10000 * num[0] + 1000 * num[1]
    } else if (limitedTextCount.includes("k") || limitedTextCount.includes("K")) {
        let num = limitedTextCount.toLowerCase().split("k")
        textCount = 1000 * num[0] + 100 * num[1]
    }

    let novels0 = novels.map(novel => novel.id)
    if (textCount >= 1) {
        novels = novels.filter(novel => novel.textCount >= textCount)
        let novels1 = novels.map(novel => novel.id)
        java.log(`🔢 字数限制：${limitedTextCount}`)
        java.log(`⏬ 字数限制：过滤前${novels0.length}；过滤后${novels1.length}`)
    }

    let inputTags = String(java.get("inputTags")).split(" ")
    for (let i in inputTags) {
        let tag = inputTags[i].trim()
        if (tag !== "") tags.push(`${tag}`)
    }

    if (tags.length >= 1) {
        // 仅保留含有所有标签的小说
        // novels = novels.filter(novel => {
        //     // java.log(`${JSON.stringify(novel.tags)}\n${tags.every(item => novel.tags.includes(item))}`)
        //     return tags.every(item => novel.tags.includes(item))
        // })
        novels = novels.filter(novel => tags.every(item => novel.tags.includes(item)))
        let novels2 = novels.map(novel => novel.id)
        java.log(`#️⃣ 过滤标签：${tags.join("、")}`)
        java.log(`#️⃣ 过滤标签：过滤前${novels0.length}；过滤后${novels2.length}`)
    }

    let inputAuthor = String(java.get("inputAuthor")).trim()
    if (inputAuthor) {
        // novels = novels.filter(novel => {
        //     java.log(`${novel.userName}-${novel.userName.includes(inputAuthor)}`)
        //     return novel.userName.includes(inputAuthor)
        // })
        novels = novels.filter(novel => novel.userName.includes(inputAuthor))
        let novels2 = novels.map(novel => novel.id)
        java.log(`👤 过滤作者：${inputAuthor.join("、")}`)
        java.log(`👤 过滤作者：过滤前${novels0.length}；过滤后${novels2.length}`)
    }
    return novels
}

function handlerFactory() {
    let novels = []
    let keyword = String(java.get("keyword"))
    if (keyword.startsWith("#")) {
        java.put("keyword", keyword.slice(1))
        novels = novels.concat(getNovels())
        if (util.settings.COMBINE_NOVELS) novels = novels.concat(getSeries())
    }

    // 登录检测
    else if (!isLogin() && !util.settings.DEBUG) {
        sleepToast("🔍 搜索小说\n\n⚠️ 当前未登录账号\n请登录 Pixiv 账号", 1.5)
        util.removeCookie(); util.login()
        sleepToast("🔍 搜索小说\n\n登录成功后，请重新搜索", 2)
        return novels
    }

    else if (keyword.startsWith("@")) {
        java.put("keyword", keyword.slice(1))
        novels = novels.concat(getUserNovels())

    } else if (keyword.startsWith("$")) {
        keyword = keyword.slice(1)
        java.put("keyword", keyword)
        novels = novels.concat(getUserNovelsByName())

    } else {
        novels = novels.concat(getNovels())
        if (util.settings.COMBINE_NOVELS) novels = novels.concat(getSeries())
        if (util.settings.CONVERT_CHINESE) novels = novels.concat(getConvertNovels())
        if (util.settings.SEARCH_AUTHOR) novels = novels.concat(getUserNovels())
    }
    // java.log(JSON.stringify(novels))
    return novelFilter(util.formatNovels(util.handNovels(novels)))
}

(() => {
    return handlerFactory()
})()