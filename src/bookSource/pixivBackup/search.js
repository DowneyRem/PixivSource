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
    let userId
    let userName = String(java.get("keyword"))
    //cache.delete("pixivAuthors")
    let pixivAuthors = getFromCacheObject("pixivAuthors")
    // java.log(JSON.stringify(pixivAuthors))
    if (pixivAuthors) userId = pixivAuthors[userName]
    if (userId) {
        java.log(`👤 缓存作者ID：${userId}`)
        return [userId]
    }
}

// 模糊搜索作者
function getUserNovelsByName() {
    let userName = String(java.get("keyword"))
    let page = Number(java.get("page"))

    // cache.delete(urlIP(urlSearchUser(userName, page, full)))
    let resp = getAjaxJson(urlIP(urlSearchUser(userName, page))).body
    let novels = resp.thumbnails.novel
    let userIds = resp.page.userIds

    java.log(`👤 获取作者ID：${JSON.stringify(userIds)}`)
    if (userIds.length === 1) {
        let pixivAuthors = getFromCacheObject("pixivAuthors")
        pixivAuthors[userName] = userIds[0]
        putInCacheObject("pixivAuthors", pixivAuthors)
    }
    if (userIds.length === 0) sleepToast(`\n暂无名为【${userName}】的作者发布过小说\n请尝试其他关键词`)
    return [userIds, novels]
}

function getUserNovelsById(uid) {
    return util.getUserNovelsById(getAjaxJson(urlIP(urlUserAllWorks(uid)), true))
}

function getUserNovels() {
    let novels = []
    let uidList = getUserIdCache()
    if (!uidList) [uidList, novels] = getUserNovelsByName()
    if (uidList.length === 1 ) novels = getUserNovelsById(uidList[0])
    return novels
}

function search(name, type, page) {
    let resp = {}
    if (type.includes("novel")) {
        resp = getAjaxJson(urlIP(urlSearchNovel(name, page)))
        java.log(urlIP(urlSearchNovel(name, page)))
    }
    if (type.includes("series")) {
        resp = getAjaxJson(urlIP(urlSearchSeries(name, page)))
        java.log(urlIP(urlSearchSeries(name, page)))
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
    java.log(urlIP(urlSearchSeries(name, page)))
    putInCacheObject(urlIP(urlSearchSeries(name, page)), resp, cacheSaveSeconds)  // 加入缓存
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

    else if (keyword.startsWith("@") ) {
        java.put("keyword", keyword.slice(1))
        novels = novels.concat(getUserNovels())

    } else if (keyword.startsWith("$") || util.settings.SEARCH_AUTHOR) {
        if (keyword.startsWith("$")) {
            keyword = keyword.slice(1)
            java.put("keyword", keyword)
        }
        sleepToast(`\n\n👤 模糊搜索作者：${keyword}`)
        novels = novels.concat(getUserIdOnline()[1])

    } else {
        novels = novels.concat(getNovels())
        if (util.settings.COMBINE_NOVELS) novels = novels.concat(getSeries())
        if (util.settings.CONVERT_CHINESE) novels = novels.concat(getConvertNovels())
    }
    // java.log(JSON.stringify(novels))
    return novelFilter(util.formatNovels(util.handNovels(novels)))
}

(() => {
    return handlerFactory()
})()