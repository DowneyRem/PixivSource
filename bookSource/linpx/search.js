var util = objParse(String(java.get("util")))

function isFunctionString(v) {
    return typeof v == "string" && (
        v.trim().startsWith("function") ||
        RegExp(/^\s*(\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/).test(v)
    )
}

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (isFunctionString(v)) {
            return eval(`(${v})`)
        }
        return v;
    })
}

// 存储seriesID
var first = true;
var seriesSet = {
    keywords: "Linpx:Search",
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

function getUser(username, exactMatch) {
    let resp = getAjaxJson(urlSearchUsers(String(username)))
    java.log(urlSearchUsers(String(username)))
    // java.log(JSON.stringify(resp))
    if (resp.error || resp.total === 0) {
        return []
    }

    // 去除无小说作者
    resp.users = resp.users.filter(user => user.novels.length >= 1)
    // java.log(JSON.stringify(resp))
    if (resp.total > resp.users.length) {
        java.log(`已经去除 ${resp.total - resp.users.length} 位无小说的作者`)
    }
    if (resp.users.length === 0) {
        return []
    }

    if (!exactMatch) {
        return resp.users
    }
    // 只返回用户名完全一样的用户
    return resp.users.filter(user => {
        return user.name === username
    })
}

function getUserNovels(nidList) {
    let page = Number(java.get("page"))
    // 分页
    let list = nidList.slice((page - 1) * 20, page * 20)
    if (list.length === 0) {
        return []
    }
    // java.log(`NIDURL:${urlNovelsDetailed(list)}`)
    return getWebviewJson(urlNovelsDetailed(list))
}

function findUserNovels() {
    let novelList = []
    let username = String(java.get("key"))
    let userArr = getUser(username, false)
    // 获取用户所有小说
    let uidList = userArr.filter(user => {
        return user.novels.length > 0
    }).map(user => user.id)
    // java.log(JSON.stringify(uidList))

    if (uidList.length > 0) {
        let list = getWebviewJson(urlUsersDetailed(uidList))  // 包含所有小说数据
        // java.log(JSON.stringify(list))
        let nidList = []
        // 从两层数组中提取novelsId
        list.forEach(user => {
            // 按id降序排序-相当于按时间降序排序
            user.novels.reverse().forEach(nid => nidList.push(nid))
            // 优化 未缓存系列目录的情况：series 数据写入缓存
            user.series.forEach(series => {
                series.novels = []
                putInCacheObject(`LSeries${series.id}`, series)
            })
        })
        // java.log(JSON.stringify(nidList))
        getUserNovels(nidList).forEach(novel => {
            novelList.push(novel)
        })
    }

    // 优化 未缓存系列目录的情况：series 数据写入缓存
    novelList.forEach(novel =>{
        if (novel.seriesId) {
            let series = getFromCacheObject(`LSeries${novel.seriesId}`)
            series.novels.push(novel)
            putInCacheObject(`LSeries${novel.seriesId}`, series)
        }
    })
    return novelList.reverse()  // 新小说前置
}

function search(name, page=1) {
    let resp = getAjaxJson(urlSearchNovel(name, page))
    java.log(urlSearchNovel(name, page))
    if (resp.error || resp.total === 0) return []
    return resp.novels
}

function getNovels() {
    let name= String(java.get("key"))
    let page= String(java.get("page"))
    return search(name, page)
}

function getConvertNovels() {
    let novels = []
    let novelName = String(java.get("key"))
    let name1 = String(java.s2t(novelName))
    let name2 = String(java.t2s(novelName))
    if (name1 !== novelName) novels = novels.concat(search(name1))
    if (name2 !== novelName) novels = novels.concat(search(name2))
    return novels
}

(() => {
    let novels = []
    let key = String(java.get("key"))
    if (key.startsWith("@")) {
        java.put("key", key.slice(1))
        novels = novels.concat(findUserNovels())
    } else if (key.startsWith("#")) {
        java.put("key", key.slice(1))
        novels = novels.concat(getNovels())
        // if (util.settings.CONVERT_CHINESE) novels = novels.concat(getConvertNovels())
    } else {
        novels = novels.concat(getNovels())
        if (util.settings.SEARCH_AUTHOR) novels = novels.concat(findUserNovels())
        if (util.settings.CONVERT_CHINESE) novels = novels.concat(getConvertNovels())
    }
    // java.log(JSON.stringify(novels))
    // 返回空列表中止流程
    if (novels.length === 0) {
        return []
    }
    return util.formatNovels(util.handNovels(util.combineNovels(novels)))
})()